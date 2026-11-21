---
title: "스켈레톤 코드 모음"
permalink: /study/algorithms/code-templates/
toc: true
categories: ["알고리즘"]
tags: ["코드 템플릿"]
---

[상위 페이지 · 알고리즘](/study/algorithms/)

## 자료구조

- Link-Cut Tree
    
    ```python
    class LinkCutNode:
        def __init__(self, val=0):
            self.left = None
            self.right = None
            self.parent = None
            self.path_parent = None
            self.rev = False
            self.val = val
            self.sum = val
            self.size = 1
    
        def _is_root(self):
            return not self.parent or (self.parent.left is not self and self.parent.right is not self)
    
        def _update(self):
            self.sum = self.val
            if self.left:
                self.sum += self.left.sum
                self.size += self.left.size
            if self.right:
                self.sum += self.right.sum
                self.size += self.right.size
    
        def _push(self):
            if self.rev:
                self.left, self.right = self.right, self.left
                if self.left:
                    self.left.rev ^= True
                if self.right:
                    self.right.rev ^= True
                self.rev = False
    
        def _rotate(self):
            p = self.parent
            g = p.parent
            if not p._is_root():
                if g.left is p:
                    g.left = self
                else:
                    g.right = self
            self.parent = g
            if p.left is self:
                p.left = self.right
                if self.right:
                    self.right.parent = p
                self.right = p
            else:
                p.right = self.left
                if self.left:
                    self.left.parent = p
                self.left = p
            p.parent = self
            self.path_parent = p.path_parent
            p.path_parent = None
            p._update()
            self._update()
    
        def splay(self):
            stack = []
            node = self
            while True:
                stack.append(node)
                if node._is_root():
                    break
                node = node.parent
            for n in reversed(stack):
                n._push()
            while not self._is_root():
                p = self.parent
                g = p.parent
                if not p._is_root():
                    if (p.left is self) == (g.left is p):
                        p._rotate()
                    else:
                        self._rotate()
                self._rotate()
    
        def access(self):
            last = None
            x = self
            while x:
                x.splay()
                if x.right:
                    x.right.path_parent = x
                    x.right.parent = None
                x.right = last
                if last:
                    last.parent = x
                x._update()
                last = x
                x = x.path_parent
            self.splay()
            return last
    
        def make_root(self):
            self.access()
            self.rev ^= True
            self._push()
    
        def find_root(self):
            self.access()
            x = self
            while True:
                x._push()
                if x.left:
                    x = x.left
                else:
                    break
            x.splay()
            return x
    
        def connected(self, other):
            return self.find_root() is other.find_root()
    
        def link(self, other):
            self.make_root()
            if self.find_root() is not other.find_root():
                self.path_parent = other
    
        def cut_parent(self):
            parent = self.get_parent()
            if not parent:
                return
            self.access()
            if self.left:
                self.left.parent = None
                self.left = None
                self._update()
    
        def cut(self, other):
            self.make_root()
            other.access()
            if other.left is self and not self.right:
                other.left.parent = None
                other.left = None
                other._update()
    
        def query(self, other):
            self.make_root()
            other.access()
            return other.sum
    
        def update(self, value):
            self.access()
            self.val = value
            self._update()
    
        def get_parent(self):
            self.access()
            if not self.left:
                return None
            parent = self.left
            parent._push()
            while parent.right:
                parent = parent.right
                parent._push()
            parent.splay()
            return parent
        
        def get_depth(self):
            self.access()
            if self.left:
                return self.left.size
            return 0
    
        def get_LCA(self, other):
            if not self.connected(other):
                return None
            self.access()
            last = other.access()
            self.splay()
            if self == last:
                return self
            return last
    ```
    
- Top-Trees
    - Top-Tree(정석)
        
        ```python
        import sys
        from enum import Enum
        
        class Vertex:
            """그래프의 정점을 나타낸다."""
            def __init__(self, id_val=0):
                self.id = id_val
                self.handle = None
        
            def __repr__(self):
                return f"Vertex({self.id})"
        
        class Cluster:
            """경로나 서브트리의 집계 데이터를 나타낸다. 이 예제에서는 가중치의 합이다."""
            def __init__(self, v=0):
                self.value = v
                self.subtree_value = v
        
            def toggle(self):
                """경로의 방향을 반전시킨다. 단순 합계의 경우 아무 작업도 하지 않는다."""
                pass
        
            @staticmethod
            def compress(L, mid_vertex, R):
                """두 경로 클러스터를 하나로 결합한다. L-mid-R."""
                res = Cluster(L.value + R.value)
                res.subtree_value = L.subtree_value + R.subtree_value
                return res
        
            @staticmethod
            def rake(path_part, side_subtree):
                """경로와 측면 서브트리를 결합한다. 경로 합계의 경우 측면 서브트리는 무시된다."""
                res = Cluster(path_part.value)
                res.subtree_value = path_part.subtree_value + side_subtree.subtree_value
                return res
        
            def __repr__(self):
                return f"Cluster({self.value})"
        
        class Type(Enum):
            """TopTree의 다양한 노드 유형에 대한 열거형이다."""
            Compress = 0
            Rake = 1
            Edge = 2
        
        class Node:
            """TopTree의 내부 노드를 나타내며, 경로나 서브트리에 해당한다."""
            def __init__(self):
                self.vs = [None, None]  # 경로의 끝 정점들
                self.dat = Cluster()  # 집계된 클러스터 데이터
                self.p = None  # 부모 포인터
                self.q = None  # 레이크된 자식 포인터
                self.ch = [None, None]  # 압축 자식 포인터들
                self.rev = False  # 경로 반전을 위한 지연 플래그
                self.guard = False  # 스플레이를 위한 가드
                self.type = None  # 노드 유형 (Compress, Rake, Edge)
        
        class TopTree:
            def __init__(self):
                self.id_cluster = Cluster()  # 식별 클러스터
        
            def create(self, *args, **kwargs):
                """새로운 정점을 생성하고, 사소한 트리로 적절히 초기화한다."""
                t = Vertex(*args, **kwargs)
                dummy = Vertex()
                self.link(t, self.id_cluster, dummy)
                return t
        
            def edge(self, u, w, v):
                """새로운 Edge 노드를 생성한다."""
                t = Node()
                t.vs[0], t.vs[1] = u, v
                t.dat = w
                t.type = Type.Edge
                return self.pushup(t)
        
            def compress(self, l, r):
                """새로운 Compress 노드를 생성한다."""
                t = Node()
                t.ch[0], t.ch[1] = l, r
                t.type = Type.Compress
                return self.pushup(t)
        
            def rake(self, l, r):
                """새로운 Rake 노드를 생성한다."""
                t = Node()
                t.ch[0], t.ch[1] = l, r
                t.type = Type.Rake
                return self.pushup(t)
        
            def parent_dir(self, t):
                """부모로부터 t의 방향을 가져오며, 가드된 부모는 무시한다."""
                p = t.p
                if not p or p.guard:
                    return -1
                if p.ch[0] == t:
                    return 0
                if p.ch[1] == t:
                    return 1
                return -1
        
            def parent_dir_ignore_guard(self, t):
                """부모로부터 t의 방향을 가져오며, 가드된 부모라도 고려한다."""
                p = t.p
                if not p:
                    return -1
                if p.ch[0] == t:
                    return 0
                if p.ch[1] == t:
                    return 1
                return -1
        
            def pushup(self, t):
                """노드 t의 데이터를 자식에 기반하여 재계산한다."""
                if not t:
                    return None
                l, r = t.ch[0], t.ch[1]
                if t.type == Type.Compress:
                    assert l.vs[1] == r.vs[0]
                    t.vs[0], t.vs[1] = l.vs[0], r.vs[1]
                    lf = l.dat
                    if t.q:
                        assert l.vs[1] == t.q.vs[1]
                        lf = Cluster.rake(l.dat, t.q.dat)
                    t.dat = Cluster.compress(lf, r.vs[0], r.dat)
                    l.vs[1].handle = t
                elif t.type == Type.Rake:
                    self.propagate(t)
                    assert l.vs[1] == r.vs[1]
                    t.vs[0], t.vs[1] = l.vs[0], l.vs[1]
                    t.dat = Cluster.rake(l.dat, r.dat)
                if t.type != Type.Rake:
                    if not t.p:
                        t.vs[0].handle = t
                    t.vs[1].handle = t
                else:
                    if t.p:
                        if t.p.type == Type.Compress:
                            if self.parent_dir(t) == -1:
                                t.vs[0].handle = t
                        elif t.p.type == Type.Rake:
                            t.vs[0].handle = t
                return t
        
            def toggle(self, t):
                """노드에 경로 반전을 적용한다."""
                if t.type == Type.Edge:
                    t.vs[0], t.vs[1] = t.vs[1], t.vs[0]
                    t.dat.toggle()
                elif t.type == Type.Compress:
                    t.vs[0], t.vs[1] = t.vs[1], t.vs[0]
                    t.dat.toggle()
                    t.rev = not t.rev
                elif t.type != Type.Rake:
                    raise Exception("토글에 대한 유효하지 않은 노드 유형")
        
            def propagate(self, t):
                """지연 플래그(예: 반전)를 자식으로 푸시한다."""
                if not t:
                    return
                if t.type == Type.Compress and t.rev:
                    assert t.ch[0] and t.ch[1]
                    t.ch[0], t.ch[1] = t.ch[1], t.ch[0]
                    self.toggle(t.ch[0])
                    self.toggle(t.ch[1])
                    t.rev = False
        
            def set_toggle(self, v):
                """노드를 토글하고 즉시 전파하는 헬퍼이다."""
                self.toggle(v)
                self.propagate(v)
        
            def pushdown(self, t):
                """t의 모든 조상이 지연 플래그를 전파하도록 한다."""
                if not t:
                    return
                path = []
                curr = t
                while curr:
                    path.append(curr)
                    curr = curr.p
                for node in reversed(path):
                    self.propagate(node)
        
            def rotate(self, t, x, dir):
                """스플레이 트리 회전을 수행한다."""
                y = x.p
                par = self.parent_dir_ignore_guard(x)
                x.ch[dir ^ 1] = t.ch[dir]
                if t.ch[dir]:
                    t.ch[dir].p = x
                t.ch[dir] = x
                x.p = t
                t.p = y
                if par != -1:
                    if y:
                        y.ch[par] = t
                elif y and y.type == Type.Compress:
                    y.q = t
                self.pushup(x)
                self.pushup(t)
                if y and not y.guard:
                    self.pushup(y)
        
            def splay(self, t):
                """노드 t를 동일 유형 노드의 스플레이 트리 최상단으로 스플레이한다."""
                assert t.type != Type.Edge
                self.pushdown(t)
                while self.parent_dir(t) != -1:
                    q = t.p
                    if q.type != t.type:
                        break
                    if self.parent_dir(q) != -1 and q.p and q.p.type == q.type:
                        r = q.p
                        qt_dir = self.parent_dir(t)
                        rq_dir = self.parent_dir(q)
                        if rq_dir == qt_dir:
                            self.rotate(q, r, rq_dir ^ 1)
                            self.rotate(t, q, qt_dir ^ 1)
                        else:
                            self.rotate(t, q, qt_dir ^ 1)
                            self.rotate(t, r, rq_dir ^ 1)
                    else:
                        qt_dir = self.parent_dir(t)
                        self.rotate(t, q, qt_dir ^ 1)
        
            def expose(self, t_or_v):
                """주요 연산: 정점에서 루트까지의 경로를 선호 경로로 만든다."""
                t = t_or_v.handle if isinstance(t_or_v, Vertex) else t_or_v
                self.pushdown(t)
                while True:
                    assert t.type != Type.Rake
                    if t.type == Type.Compress:
                        self.splay(t)
                    p = t.p
                    if not p:
                        break
                    n = None
                    if p.type == Type.Rake:
                        self.propagate(p)
                        self.splay(p)
                        n = p.p
                    elif p.type == Type.Compress:
                        self.propagate(p)
                        if p.guard and self.parent_dir_ignore_guard(t) != -1:
                            break
                        n = p
                    if not n:
                        break
                    self.splay(n)
                    dir = self.parent_dir_ignore_guard(n)
                    if dir == -1 or (n.p and n.p.type == Type.Rake):
                        dir = 0
                    c = n.ch[dir]
                    if dir == 1:
                        self.set_toggle(c)
                        self.set_toggle(t)
                    n_dir = self.parent_dir(t)
                    if n_dir != -1:
                        r_node = t.p
                        self.propagate(c)
                        self.propagate(r_node)
                        r_node.ch[n_dir] = c
                        if c:
                            c.p = r_node
                        n.ch[dir] = t
                        t.p = n
                        self.pushup(c)
                        self.pushup(r_node)
                        self.pushup(t)
                        self.pushup(n)
                        self.splay(r_node)
                    else:
                        self.propagate(c)
                        n.q = c
                        if c:
                            c.p = n
                        n.ch[dir] = t
                        t.p = n
                        self.pushup(c)
                        self.pushup(t)
                        self.pushup(n)
                return t
        
            def soft_expose(self, u, v):
                """u에서 루트까지 경로를 노출한 후, v에서 루트까지 경로를 노출하여 연결한다."""
                self.pushdown(u.handle)
                self.pushdown(v.handle)
                rt = self.expose(u)
                if u.handle == v.handle:
                    if rt.vs[1] == u or rt.vs[0] == v:
                        self.set_toggle(rt)
                    return
                rt.guard = True
                soft = self.expose(v)
                rt.guard = False
                self.pushup(rt)
                if self.parent_dir(soft) == 0:
                    self.set_toggle(rt)
        
            def bring(self, rt):
                """컷 연산 후 노드를 재구조화한다."""
                rk = rt.q
                if not rk:
                    ll = rt.ch[0]
                    ll.p = None
                    self.pushup(ll)
                elif rk.type in (Type.Compress, Type.Edge):
                    nr = rk
                    self.set_toggle(nr)
                    rt.ch[1] = nr
                    nr.p = rt
                    rt.q = None
                    self.pushup(nr)
                    self.pushup(rt)
                elif rk.type == Type.Rake:
                    self.propagate(rk)
                    while rk.ch[1] and rk.ch[1].type == Type.Rake:
                        self.propagate(rk.ch[1])
                        rk = rk.ch[1]
                    self.pushdown(rk)
                    rt.guard = True
                    self.splay(rk)
                    rt.guard = False
                    ll, rr = rk.ch[0], rk.ch[1]
                    self.propagate(ll)
                    self.set_toggle(rr)
                    rt.ch[1] = rr
                    rr.p = rt
                    rt.q = ll
                    if ll:
                        ll.p = rt
                    self.pushup(ll)
                    self.pushup(rr)
                    self.pushup(rt)
        
            def link(self, u, w, v):
                """두 정점 u와 v를 새로운 가중치 w의 에지로 연결한다."""
                nnu, nnv = u.handle, v.handle
                if not nnu and not nnv:
                    return self.edge(u, w, v)
                ee = self.edge(u, w, v)
                ll = None
                if nnv:
                    vv = self.expose(nnv)
                    self.propagate(vv)
                    if vv.vs[1] == v:
                        self.set_toggle(vv)
                    if vv.vs[0] == v:
                        nv = self.compress(ee, vv)
                        ee.p = nv
                        vv.p = nv
                        self.pushup(ee)
                        self.pushup(vv)
                        self.pushup(nv)
                        ll = nv
                    else:
                        nv = vv
                        ch = nv.ch[0]
                        self.propagate(ch)
                        nv.ch[0] = ee
                        ee.p = nv
                        self.pushup(ee)
                        bt = nv.q
                        rk = self.rake(bt, ch) if bt else ch
                        if bt:
                            bt.p = rk
                            ch.p = rk
                            self.pushup(bt)
                            self.pushup(ch)
                        nv.q = rk
                        if rk:
                            rk.p = nv
                        self.pushup(rk)
                        self.pushup(nv)
                        ll = nv
                else:
                    ll = ee
                if nnu:
                    uu = self.expose(nnu)
                    self.propagate(uu)
                    if uu.vs[0] == u:
                        self.set_toggle(uu)
                    if uu.vs[1] == u:
                        tp = self.compress(uu, ll)
                        uu.p = tp
                        ll.p = tp
                        self.pushup(uu)
                        self.pushup(ll)
                        self.pushup(tp)
                    else:
                        nu = uu
                        ch = nu.ch[1]
                        if ch:
                            self.toggle(ch)
                            self.propagate(ch)
                        nu.ch[1] = ll
                        ll.p = nu
                        self.pushup(ll)
                        al = nu.q
                        rk = self.rake(al, ch) if al else ch
                        if al:
                            al.p = rk
                            ch.p = rk
                            self.pushup(al)
                            self.pushup(ch)
                        nu.q = rk
                        if rk:
                            rk.p = nu
                        self.pushup(rk)
                        self.pushup(nu)
                return ee
        
            def cut(self, u, v):
                """정점 u와 v 사이의 에지를 컷한다."""
                self.soft_expose(u, v)
                rt = u.handle
                self.propagate(rt)
                rr = rt.ch[1]
                rr.p = None
                self.set_toggle(rr)
                assert rr.ch[1].type == Type.Edge
                self.bring(rr)
                self.bring(rt)
        
            def path(self, u, v):
                """u와 v 사이 경로를 나타내는 내부 노드를 반환한다."""
                assert u != v
                self.soft_expose(u, v)
                rt = u.handle
                self.propagate(rt)
                if rt.ch[1]:
                    self.propagate(rt.ch[1])
                    if rt.ch[1].ch[0]:
                        return rt.ch[1].ch[0]
                return None
        
            def set_edge(self, u, v, w):
                """u와 v 사이 에지의 데이터를 업데이트한다."""
                t = self.path(u, v)
                assert t.type == Type.Edge
                t.dat = w
                while t:
                    self.pushup(t)
                    t = t.p
        
            def get_path(self, u, v):
                """u와 v 사이 경로의 집계된 클러스터 데이터를 가져온다."""
                p = self.path(u, v)
                return p.dat if p else Cluster()
        
            def get_subtree(self, p, v):
                """v를 루트로 하는 서브트리의 집계된 서브트리 값을 가져온다. p로의 에지는 제외한다."""
                self.soft_expose(p, v)
                rt = p.handle
                self.propagate(rt)
                q_sub = rt.q.dat.subtree_value if rt.q else 0
                edge_value = self.get_path(p, v).value
                if not rt.ch[0]:
                    return rt.dat.subtree_value - q_sub - edge_value
                left = rt.ch[0]
                self.propagate(left)
                return rt.dat.subtree_value - left.dat.subtree_value - q_sub - edge_value
        
        def test_star():
            print("--- Running star test ---")
            tp = TopTree()
            v1 = tp.create(1)
            v2 = tp.create(2)
            v3 = tp.create(3)
            tp.link(v2, Cluster(4), v1)
            tp.link(v3, Cluster(6), v1)
            path_val = tp.get_path(v2, v3).value
            print(f"Path value between v2 and v3: {path_val}")
            assert path_val == 10, f"Expected 10, got {path_val}"
            print("Star test passed\n")
        
        def test_complex():
            print("--- Running complex test ---")
            tp = TopTree()
            v1 = tp.create(1)
            v2 = tp.create(2)
            v3 = tp.create(3)
            v4 = tp.create(4)
            v5 = tp.create(5)
            tp.link(v2, Cluster(5), v1)
            tp.link(v2, Cluster(3), v3)
            tp.link(v3, Cluster(7), v4)
            tp.link(v2, Cluster(2), v5)
            assert tp.get_path(v1, v4).value == 15
            assert tp.get_path(v5, v4).value == 12
            assert tp.get_path(v5, v1).value == 7
            print("Initial path queries passed.")
            tp.cut(v3, v2)
            print("Cut edge between v3 and v2.")
            assert tp.get_path(v3, v4).value == 7
            tp.link(v2, Cluster(1), v3)
            print("Relinked edge between v2 and v3 with new weight 1.")
            assert tp.get_path(v1, v4).value == 13
            assert tp.get_path(v5, v3).value == 3
            print("Complex test passed\n")
        
        def custom():
            tp = TopTree()
            v1 = tp.create(1)
            v2 = tp.create(2)
            v3 = tp.create(3)
            v4 = tp.create(4)
            v5 = tp.create(5)
            tp.link(v2, Cluster(5), v1)
            tp.link(v2, Cluster(3), v3)
            tp.link(v2, Cluster(2), v4)
            tp.link(v4, Cluster(10), v5)
            print(tp.get_path(v2,v1).value)
            print(tp.get_path(v2, v5).value)
            print(tp.get_subtree(v1, v2))
            print(tp.get_subtree(v2, v4))
        
        if __name__ == "__main__":
            test_star()
            test_complex()
            custom()
        ```
        
    - Top-Tree(Link-Cut Base) - 정점 다룰때는 이게 더 유용
        
        ```python
        class LinkCutTree:
            __slots__ = ['MAX', 'vertices', 'free_node_ids', 'root']
            def __init__(self, n, max_nodes=150005):
                self.MAX = max_nodes
                self.vertices = [self.Node() for _ in range(max_nodes)]
                self.free_node_ids = list(range(n + 1, max_nodes))
                self.root = None
        
            class Data:
                __slots__ = ['total_sum', 'min_val', 'max_val', 'size']
                def __init__(self, value=0):
                    self.total_sum = value
                    self.min_val = value if value else math.inf
                    self.max_val = value if value else -math.inf
                    self.size = 1 if value else 0
        
                def __add__(self, other):
                    data = LinkCutTree.Data()
                    data.total_sum = self.total_sum + other.total_sum
                    data.min_val = min(self.min_val, other.min_val)
                    data.max_val = max(self.max_val, other.max_val)
                    data.size = self.size + other.size
                    return data
        
                def _apply_data(self, data):
                    temp = self + data
                    self.total_sum = temp.total_sum
                    self.min_val = temp.min_val
                    self.max_val = temp.max_val
                    self.size = temp.size
        
                def _apply_lazy(self, data):
                    if self.size:
                        self.total_sum = self.total_sum * data.is_set + self.size * data.val
                        self.min_val = self.min_val * data.is_set + data.val
                        self.max_val = self.max_val * data.is_set + data.val
        
                def apply_data(self, other):
                    if isinstance(other, LinkCutTree.Data):
                        self._apply_data(other)
                    else:
                        self._apply_lazy(other)
                    return self
        
            class Lazy:
                __slots__ = ['is_set', 'val']
                def __init__(self, is_set=False, val=0):
                    self.is_set = 0 if is_set else 1
                    self.val = val
        
                def is_lazy(self):
                    return self.is_set != 1 or self.val != 0
        
                def __iadd__(self, other):
                    self.is_set = self.is_set * other.is_set
                    self.val = self.val * other.is_set + other.val
                    return self
        
            class Node:
                __slots__ = ['p', 'ch', 'val', 'path', 'sub', 'all', 'path_lazy', 'sub_lazy', 'flipped', 'is_fake']
                def __init__(self, value=None):
                    self.p = 0
                    self.ch = [0] * 4
                    self.val = 0
                    self.path = LinkCutTree.Data()
                    self.sub = LinkCutTree.Data()
                    self.all = LinkCutTree.Data()
                    self.path_lazy = LinkCutTree.Lazy()
                    self.sub_lazy = LinkCutTree.Lazy()
                    self.flipped = False
                    self.is_fake = True
                    if value is not None:
                        self.val = value
                        self.path = LinkCutTree.Data(value)
                        self.all = LinkCutTree.Data(value)
                        self.is_fake = False
        
            def apply_lazy_to_value(self, value, lazy):
                return value * lazy.is_set + lazy.val
        
            def propagate_flip(self, u):
                if not u:
                    return
                self.vertices[u].ch[0], self.vertices[u].ch[1] = \
                    self.vertices[u].ch[1], self.vertices[u].ch[0]
                self.vertices[u].flipped = not self.vertices[u].flipped
        
            def propagate_path(self, u, lazy):
                if not u or self.vertices[u].is_fake:
                    return
                self.vertices[u].val = self.apply_lazy_to_value(self.vertices[u].val, lazy)
                self.vertices[u].path.apply_data(lazy)
                self.vertices[u].all = self.vertices[u].path + self.vertices[u].sub
                self.vertices[u].path_lazy += lazy
        
            def propagate_sub(self, u, apply_to_path, lazy):
                if not u:
                    return
                self.vertices[u].sub.apply_data(lazy)
                self.vertices[u].sub_lazy += lazy
                if not self.vertices[u].is_fake and apply_to_path:
                    self.propagate_path(u, lazy)
                else:
                    self.vertices[u].all = self.vertices[u].path + self.vertices[u].sub
        
            def propagate(self, u):
                if not u:
                    return
                if self.vertices[u].flipped:
                    self.propagate_flip(self.vertices[u].ch[0])
                    self.propagate_flip(self.vertices[u].ch[1])
                    self.vertices[u].flipped = False
                if self.vertices[u].path_lazy.is_lazy():
                    self.propagate_path(self.vertices[u].ch[0], self.vertices[u].path_lazy)
                    self.propagate_path(self.vertices[u].ch[1], self.vertices[u].path_lazy)
                    self.vertices[u].path_lazy = self.Lazy()
                if self.vertices[u].sub_lazy.is_lazy():
                    self.propagate_sub(self.vertices[u].ch[0], False, self.vertices[u].sub_lazy)
                    self.propagate_sub(self.vertices[u].ch[1], False, self.vertices[u].sub_lazy)
                    self.propagate_sub(self.vertices[u].ch[2], True, self.vertices[u].sub_lazy)
                    self.propagate_sub(self.vertices[u].ch[3], True, self.vertices[u].sub_lazy)
                    self.vertices[u].sub_lazy = self.Lazy()
        
            def update(self, u):
                if not self.vertices[u].is_fake:
                    l = self.vertices[self.vertices[u].ch[0]].path
                    value = self.Data(self.vertices[u].val)
                    r = self.vertices[self.vertices[u].ch[1]].path
                    self.vertices[u].path = l + value + r
                sub_l = self.vertices[self.vertices[u].ch[0]].sub
                sub_r = self.vertices[self.vertices[u].ch[1]].sub
                self.vertices[u].sub = (sub_l + sub_r
                                        + self.vertices[self.vertices[u].ch[2]].all
                                        + self.vertices[self.vertices[u].ch[3]].all)
                self.vertices[u].all = self.vertices[u].path + self.vertices[u].sub
        
            def attach_child(self, p, dir, ch):
                self.vertices[p].ch[dir] = ch
                if ch:
                    self.vertices[ch].p = p
                self.update(p)
        
            def get_dir(self, ch, dir):
                p = self.vertices[ch].p
                if self.vertices[p].ch[dir] == ch:
                    return dir
                elif self.vertices[p].ch[dir + 1] == ch:
                    return dir + 1
                return -1
        
            def rotate(self, ch, dir):
                p = self.vertices[ch].p
                grand_p = self.vertices[p].p
                ch_dir = self.get_dir(ch, dir)
                p_dir = self.get_dir(p, dir)
                if p_dir == -1 and dir == 0:
                    p_dir = self.get_dir(p, 2)
                self.attach_child(p, ch_dir, self.vertices[ch].ch[ch_dir ^ 1])
                self.attach_child(ch, ch_dir ^ 1, p)
                if p_dir != -1:
                    self.attach_child(grand_p, p_dir, ch)
                else:
                    self.vertices[ch].p = grand_p
        
            def splay(self, u, dir):
                self.propagate(u)
                while (self.get_dir(u, dir) != -1 and
                       (dir == 0 or self.vertices[self.vertices[u].p].is_fake)):
                    p = self.vertices[u].p
                    grand_p = self.vertices[p].p
                    self.propagate(grand_p)
                    self.propagate(p)
                    self.propagate(u)
                    child_dir = self.get_dir(u, dir)
                    parent_dir = self.get_dir(p, dir)
                    if (parent_dir != -1 and
                            (dir == 0 or self.vertices[grand_p].is_fake)):
                        if child_dir == parent_dir:
                            self.rotate(p, dir)
                        else:
                            self.rotate(u, dir)
                    self.rotate(u, dir)
        
            def add_subtree(self, p, ch):
                if not ch:
                    return
                for i in range(2, 4):
                    if not self.vertices[p].ch[i]:
                        self.attach_child(p, i, ch)
                        return
                new_node = self.free_node_ids.pop()
                self.vertices[new_node] = self.Node()  # fake node 초기화
                self.attach_child(new_node, 2, self.vertices[p].ch[2])
                self.attach_child(new_node, 3, ch)
                self.attach_child(p, 2, new_node)
        
            def push_down(self, u):
                if self.vertices[u].is_fake:
                    self.push_down(self.vertices[u].p)
                self.propagate(u)
        
            def remove_subtree(self, ch):
                p = self.vertices[ch].p
                self.push_down(p)
                if self.vertices[p].is_fake:
                    grandparent_id = self.vertices[p].p
                    self.attach_child(grandparent_id,
                                      self.get_dir(p, 2),
                                      self.vertices[p].ch[self.get_dir(ch, 2) ^ 1])
                    if self.vertices[grandparent_id].is_fake:
                        self.splay(grandparent_id, 2)
                    self.free_node_ids.append(p)
                else:
                    self.attach_child(p, self.get_dir(ch, 2), 0)
                self.vertices[ch].p = 0
        
            def get_parent(self, u):
                p = self.vertices[u].p
                if not self.vertices[p].is_fake:
                    return p
                self.splay(p, 2)
                return self.vertices[p].p
        
            def access(self, node_id):
                prev = node_id
                self.splay(node_id, 0)
                self.add_subtree(node_id, self.vertices[node_id].ch[1])
                self.attach_child(node_id, 1, 0)
                while self.vertices[node_id].p:
                    prev = self.get_parent(node_id)
                    self.splay(prev, 0)
                    self.remove_subtree(node_id)
                    self.add_subtree(prev, self.vertices[prev].ch[1])
                    self.attach_child(prev, 1, node_id)
                    self.splay(node_id, 0)
                return prev
        
            def change_root(self,node_id):
                self.root = node_id
        
            def evert(self, node_id):
                self.access(node_id)
                self.propagate_flip(node_id)
        
            def link(self, node_u, node_v):
                self.evert(node_u)
                self.access(node_v)
                self.add_subtree(node_v, node_u)
        
            def cut(self, node_u, node_v):
                self.evert(node_u)
                self.access(node_v)
                self.vertices[node_v].ch[0] = self.vertices[node_u].p = 0
                self.update(node_v)
        
            def set_vertex_weight(self, node_id, value):
                self.vertices[node_id] = self.Node(value)
        
            def subtree_query(self, target_node):
                self.evert(self.root)
                self.access(target_node)
                result = self.Data(self.vertices[target_node].val)
                for i in range(2, 4):
                    result = result + self.vertices[self.vertices[target_node].ch[i]].all
                return result
        
            def _subtree_update(self, u, value, is_set):
                self.evert(self.root)
                self.access(u)
                lazy = self.Lazy(is_set, value)
                self.vertices[u].val = self.apply_lazy_to_value(
                    self.vertices[u].val, lazy)
                for i in range(2, 4):
                    self.propagate_sub(self.vertices[u].ch[i], True, lazy)
        
            def subtree_add(self, u, value):
                self._subtree_update(u, value, False)
        
            def subtree_set(self, u, value):
                self._subtree_update(u, value, True)
        
            def path_query(self, start_node, end_node):
                self.evert(start_node)
                self.access(end_node)
                data = self.vertices[end_node].path
                return data
        
            def _path_update(self, u, v, value, is_set):
                self.evert(u)
                self.access(v)
                lazy = self.Lazy(is_set=is_set, val=value)
                self.propagate_path(v, lazy)
        
            def add_path(self, u, v, value):
                self._path_update(u, v, value, False)
        
            def set_path(self, u, v, value):
                self._path_update(u, v, value, True)
        
            def change_parent(self, node_x, node_y):
                self.evert(self.root)
                self.access(node_y)
                if self.access(node_x) != node_x:
                    self.vertices[node_x].ch[0] = self.vertices[self.vertices[node_x].ch[0]].p = 0
                    self.update(node_x)
                    self.access(node_y)
                    self.add_subtree(node_y, node_x) 
        ```
        
- Segment Trees
    - Segement Tree
        
        ```python
        import sys
        
        class SegmentTree:
            def __init__(self, n, a):
                self.n = n
                self.tree = [0] * (4 * n)
                self.build(1, 1, n, a)
        
            def build(self, node, l, r, a):
                if l == r:
                    self.tree[node] = a[l]
                    return
                mid = (l + r) // 2
                self.build(2 * node, l, mid, a)
                self.build(2 * node + 1, mid + 1, r, a)
                self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]
        
            def update(self, idx, val):
                self._update(1, 1, self.n, idx, val)
        
            def _update(self, node, l, r, idx, val):
                if l == r:
                    self.tree[node] = val
                    return
                mid = (l + r) // 2
                if idx <= mid:
                    self._update(2 * node, l, mid, idx, val)
                else:
                    self._update(2 * node + 1, mid + 1, r, idx, val)
                self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]
        
            def query(self, start, end):
                return self._query(1, 1, self.n, start, end)
        
            def _query(self, node, l, r, start, end):
                if start > r or end < l:
                    return 0
                if start <= l and r <= end:
                    return self.tree[node]
                mid = (l + r) // 2
                return self._query(2 * node, l, mid, start, end) + self._query(2 * node + 1, mid + 1, r, start, end)
        
        # 사용 예시:
        # n = 5
        # a = [0] + [10, 20, 30, 40, 50]  # 1-based 배열
        # st = SegmentTree(n, a)
        # print(st.query(1, 5))  # 초기 합: 150
        # st.update(3, 25)  # 인덱스 3을 25로 업데이트
        # print(st.query(1, 5))  # 업데이트 후 합: 145
        ```
        
    - Segement Tree with Lazy Propagation
        
        ```python
        import sys
        class SegmentTree:
            def __init__(self, n, a):
                self.n = n
                self.tree = [0] * (4 * n)
                self.lazy = [0] * (4 * n)
                self.build(1, 1, n, a)
            def build(self, node, l, r, a):
                if l == r:
                    self.tree[node] = a[l]
                    return
                mid = (l + r) // 2
                self.build(2 * node, l, mid, a)
                self.build(2 * node + 1, mid + 1, r, a)
                self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]
            def push(self, node, l, r):
                if self.lazy[node] != 0:
                    self.tree[node] += self.lazy[node] * (r - l + 1)
                    if l != r:
                        self.lazy[2 * node] += self.lazy[node]
                        self.lazy[2 * node + 1] += self.lazy[node]
                    self.lazy[node] = 0
            def update_add(self, start, end, val):  # range add update
                self._update_add(1, 1, self.n, start, end, val)
            def _update_add(self, node, l, r, start, end, val):
                self.push(node, l, r)
                if start > r or end < l:
                    return
                if start <= l and r <= end:
                    self.lazy[node] += val
                    self.push(node, l, r)
                    return
                mid = (l + r) // 2
                self._update_add(2 * node, l, mid, start, end, val)
                self._update_add(2 * node + 1, mid + 1, r, start, end, val)
                self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]
            def query(self, start, end):
                return self._query(1, 1, self.n, start, end)
            def _query(self, node, l, r, start, end):
                self.push(node, l, r)
                if start > r or end < l:
                    return 0
                if start <= l and r <= end:
                    return self.tree[node]
                mid = (l + r) // 2
                return self._query(2 * node, l, mid, start, end) + self._query(2 * node + 1, mid + 1, r, start, end)
        # 사용 예시:
        # n = 5
        # a = [0] + [10, 20, 30, 40, 50] # 1-based 배열
        # st = SegmentTree(n, a)
        # print(st.query(1, 5)) # 초기 합: 150
        # st.update_add(2, 4, 5) # 2~4에 +5
        # print(st.query(1, 5)) # 업데이트 후 합: 165
        # st.update_add(3, 3, -10) # 3에 -10 (포인트 업데이트처럼)
        # print(st.query(1, 5)) # 합: 155
        ```
        
    - Segment Tree Beats (Basic)
        
        ```python
        import sys
        
        class SegmentTreeBeats:
            def __init__(self, n, a):
                self.n = n
                self.tree = [None] * (4 * n)  # Node 객체 리스트
                self.INF = float('inf')
                self.build(1, 1, n, a)
        
            class Node:
                def __init__(self):
                    self.sum = 0
                    self.max1 = 0
                    self.max2 = 0
                    self.count1 = 0
                    self.lazy = 0
        
            def pushup(self, node):
                le = self.tree[2 * node]
                ri = self.tree[2 * node + 1]
                self.tree[node].sum = le.sum + ri.sum
                if le.max1 > ri.max1:
                    self.tree[node].max1 = le.max1
                    self.tree[node].count1 = le.count1
                    self.tree[node].max2 = max(le.max2, ri.max1)
                elif le.max1 < ri.max1:
                    self.tree[node].max1 = ri.max1
                    self.tree[node].count1 = ri.count1
                    self.tree[node].max2 = max(ri.max2, le.max1)
                else:
                    self.tree[node].max1 = le.max1
                    self.tree[node].count1 = le.count1 + ri.count1
                    self.tree[node].max2 = max(le.max2, ri.max2)
        
            def build(self, node, l, r, a):
                self.tree[node] = self.Node()
                self.tree[node].lazy = self.INF
                if l == r:
                    self.tree[node].sum = a[l]
                    self.tree[node].max1 = a[l]
                    self.tree[node].max2 = -self.INF
                    self.tree[node].count1 = 1
                    return
                mid = (l + r) // 2
                self.build(2 * node, l, mid, a)
                self.build(2 * node + 1, mid + 1, r, a)
                self.pushup(node)
        
            def apply(self, node, l, r, val):
                if val >= self.tree[node].max1:
                    return
                self.tree[node].sum -= (self.tree[node].max1 - val) * self.tree[node].count1
                self.tree[node].max1 = val
                if self.tree[node].lazy > val:
                    self.tree[node].lazy = val
        
            def propagate(self, node, l, r):
                if self.tree[node].lazy != self.INF:
                    mid = (l + r) // 2
                    self.apply(2 * node, l, mid, self.tree[node].lazy)
                    self.apply(2 * node + 1, mid + 1, r, self.tree[node].lazy)
                    self.tree[node].lazy = self.INF
        
            def break_condition(self, node, l, r, start, end, val):
                return start > r or end < l or self.tree[node].max1 <= val  # 업데이트 불필요 조건
        
            def tag_condition(self, node, l, r, start, end, val):
                return start <= l and r <= end and self.tree[node].max2 < val  # 전체 노드에 태그 적용 가능 조건
        
            def _update_chmin(self, node, l, r, start, end, val):
                if self.break_condition(node, l, r, start, end, val):
                    return
                if self.tag_condition(node, l, r, start, end, val):
                    self.apply(node, l, r, val)
                    return
                self.propagate(node, l, r)
                mid = (l + r) // 2
                self._update_chmin(2 * node, l, mid, start, end, val)
                self._update_chmin(2 * node + 1, mid + 1, r, start, end, val)
                self.pushup(node)
        
            def update_chmin(self, start, end, val):
                self._update_chmin(1, 1, self.n, start, end, val)
        
            def _query_sum(self, start, end, node, l, r):
                if start > r or end < l:
                    return 0
                if start <= l and r <= end:
                    return self.tree[node].sum
                self.propagate(node, l, r)
                mid = (l + r) // 2
                return self._query_sum(start, end, 2 * node, l, mid) + self._query_sum(start, end, 2 * node + 1, mid + 1, r)
        
            def query_sum(self, start, end):
                return self._query_sum(start, end, 1, 1, self.n)
        
        # 사용 예시:
        # n = 5
        # a = [0] + [10, 20, 30, 40, 50]  # 1-based 배열
        # st = SegmentTreeBeats(n, a)
        # print(st.query_sum(1, 5))  # 초기 합 쿼리: 150
        # st.update_chmin(2, 4, 25)  # 범위 2~4를 25로 chmin
        # print(st.query_sum(1, 5))  # 업데이트 후 합 쿼리: 130
        ```
        
    - Segment Tree Beats (Historical Information)
        
        ```python
        import sys
        
        class SegementTreeBeats:
            """
            값의 역사를 추적하는 세그먼트 트리
            - 지원 연산: 범위 덧셈, 범위 chmin/chmax, 범위 값 설정
            - 지원 쿼리: 현재 값, 역대 최댓값/최솟값의 범위 내 최댓값/최솟값/총합
            """
            INF = float('inf')
        
            class HistVal:
                def __init__(self):
                    # b_i = a_i + d_i (d_i >= 0), 역대 최댓값 추적
                    self.min_delta, self.smin_delta, self.min_delta_c, self.min_delta_s = 0, 0, 0, 0
                    self.historic_max, self.second_historic_max = 0, 0
                    # c_i = a_i + d_i (d_i <= 0), 역대 최솟값 추적
                    self.max_delta, self.smax_delta, self.max_delta_c, self.max_delta_s = 0, 0, 0, 0
                    self.historic_min, self.second_historic_min = 0, 0
                    self.init_empty()
        
                def init(self, x):
                    self.min_delta, self.smin_delta, self.min_delta_c = 0, SegementTreeBeats.INF, 1
                    self.historic_max, self.second_historic_max = x, -SegementTreeBeats.INF
                    self.max_delta, self.smax_delta, self.max_delta_c = 0, -SegementTreeBeats.INF, 1
                    self.historic_min, self.second_historic_min = x, SegementTreeBeats.INF
                    self.min_delta_s = self.max_delta_s = 0
        
                def init_empty(self):
                    self.min_delta = self.smin_delta = SegementTreeBeats.INF
                    self.min_delta_c = 0
                    self.historic_max = self.second_historic_max = -SegementTreeBeats.INF
                    self.max_delta = self.smax_delta = -SegementTreeBeats.INF
                    self.max_delta_c = 0
                    self.historic_min = self.second_historic_min = SegementTreeBeats.INF
                    self.min_delta_s = self.max_delta_s = 0
        
                def clamp_min_delta(self, x):
                    if self.min_delta < x:
                        self.min_delta_s += (x - self.min_delta) * self.min_delta_c
                        self.historic_max += (x - self.min_delta)
                        self.min_delta = x
        
                def clamp_max_delta(self, x):
                    if x < self.max_delta:
                        self.max_delta_s += (x - self.max_delta) * self.max_delta_c
                        self.historic_min += (x - self.max_delta)
                        self.max_delta = x
        
                def absorb(self, other):
                    self.clamp_min_delta(other.min_delta)
                    self.clamp_max_delta(other.max_delta)
        
                def apply_add(self, x, count):
                    if self.min_delta != SegementTreeBeats.INF: self.min_delta += x
                    if self.smin_delta != SegementTreeBeats.INF: self.smin_delta += x
                    self.min_delta_s += x * count
                    if self.max_delta != -SegementTreeBeats.INF: self.max_delta += x
                    if self.smax_delta != -SegementTreeBeats.INF: self.smax_delta += x
                    self.max_delta_s += x * count
        
                def get_historic_max(self):
                    return max(self.historic_max, self.second_historic_max)
        
                def get_historic_min(self):
                    return min(self.historic_min, self.second_historic_min)
        
                def merge(self, left, right):
                    self.min_delta_s = left.min_delta_s + right.min_delta_s
                    self.second_historic_max = max(left.second_historic_max, right.second_historic_max)
                    if left.min_delta < right.min_delta:
                        self.smin_delta, self.min_delta, self.min_delta_c = min(left.smin_delta,
                                                                                right.min_delta), left.min_delta, left.min_delta_c
                        self.second_historic_max, self.historic_max = max(self.second_historic_max,
                                                                          right.historic_max), left.historic_max
                    elif left.min_delta > right.min_delta:
                        self.smin_delta, self.min_delta, self.min_delta_c = min(left.min_delta,
                                                                                right.smin_delta), right.min_delta, right.min_delta_c
                        self.second_historic_max, self.historic_max = max(self.second_historic_max,
                                                                          left.historic_max), right.historic_max
                    else:
                        self.smin_delta, self.min_delta, self.min_delta_c = min(left.smin_delta,
                                                                                right.smin_delta), left.min_delta, left.min_delta_c + right.min_delta_c
                        self.historic_max = max(left.historic_max, right.historic_max)
                    self.max_delta_s = left.max_delta_s + right.max_delta_s
                    self.second_historic_min = min(left.second_historic_min, right.second_historic_min)
                    if left.max_delta > right.max_delta:
                        self.smax_delta, self.max_delta, self.max_delta_c = max(left.smax_delta,
                                                                                right.max_delta), left.max_delta, left.max_delta_c
                        self.second_historic_min, self.historic_min = min(self.second_historic_min,
                                                                          right.historic_min), left.historic_min
                    elif left.max_delta < right.max_delta:
                        self.smax_delta, self.max_delta, self.max_delta_c = max(left.max_delta,
                                                                                right.smax_delta), right.max_delta, right.max_delta_c
                        self.second_historic_min, self.historic_min = min(self.second_historic_min,
                                                                          left.historic_min), right.historic_min
                    else:
                        self.smax_delta, self.max_delta, self.max_delta_c = max(left.smax_delta,
                                                                                right.smax_delta), left.max_delta, left.max_delta_c + right.max_delta_c
                        self.historic_min = min(left.historic_min, right.historic_min)
        
            class Node:
                def __init__(self):
                    self.max_v = self.smax_v = -SegementTreeBeats.INF
                    self.min_v = self.smin_v = SegementTreeBeats.INF
                    self.max_c = self.min_c = 0
                    self.sum = 0
                    self.len = 0
                    self.lazy_add = 0
                    self.max_tracker = SegementTreeBeats.HistVal()
                    self.mid_tracker = SegementTreeBeats.HistVal()
                    self.min_tracker = SegementTreeBeats.HistVal()
        
            def __init__(self, arr):
                self.n = len(arr)
                self.tree = [self.Node() for _ in range(4 * self.n + 4)]
                self._build(1, 1, self.n, arr)
        
            def _pull_up(self, k):
                node, left, right = self.tree[k], self.tree[2 * k], self.tree[2 * k + 1]
                node.sum = left.sum + right.sum
                node.mid_tracker.merge(left.mid_tracker, right.mid_tracker)
        
                if left.max_v > right.max_v:
                    node.max_v, node.max_c, node.smax_v, node.max_tracker = left.max_v, left.max_c, max(left.smax_v,
                                                                                                        right.max_v), left.max_tracker
                elif left.max_v < right.max_v:
                    node.max_v, node.max_c, node.smax_v, node.max_tracker = right.max_v, right.max_c, max(left.max_v,
                                                                                                          right.smax_v), right.max_tracker
                else:
                    node.max_v, node.max_c, node.smax_v = left.max_v, left.max_c + right.max_c, max(left.smax_v, right.smax_v)
                    node.max_tracker.merge(left.max_tracker, right.max_tracker)
        
                if left.min_v < right.min_v:
                    node.min_v, node.min_c, node.smin_v, node.min_tracker = left.min_v, left.min_c, min(left.smin_v,
                                                                                                        right.min_v), left.min_tracker
                elif left.min_v > right.min_v:
                    node.min_v, node.min_c, node.smin_v, node.min_tracker = right.min_v, right.min_c, min(left.min_v,
                                                                                                          right.smin_v), right.min_tracker
                else:
                    node.min_v, node.min_c, node.smin_v = left.min_v, left.min_c + right.min_c, min(left.smin_v, right.smin_v)
                    node.min_tracker.merge(left.min_tracker, right.min_tracker)
        
                if left.min_v == left.max_v:
                    if node.min_v < left.min_v and left.max_v < node.max_v: node.mid_tracker.merge(node.mid_tracker,
                                                                                                   left.max_tracker)
                else:
                    if left.max_v < node.max_v: node.mid_tracker.merge(node.mid_tracker, left.max_tracker)
                    if node.min_v < left.min_v: node.mid_tracker.merge(node.mid_tracker, left.min_tracker)
                if right.min_v == right.max_v:
                    if node.min_v < right.min_v and right.max_v < node.max_v: node.mid_tracker.merge(node.mid_tracker,
                                                                                                     right.max_tracker)
                else:
                    if right.max_v < node.max_v: node.mid_tracker.merge(node.mid_tracker, right.max_tracker)
                    if node.min_v < right.min_v: node.mid_tracker.merge(node.mid_tracker, right.min_tracker)
        
            def _push_down(self, k):
                node = self.tree[k]
                if node.lazy_add != 0:
                    self._apply_add_to_node(2 * k, node.lazy_add)
                    self._apply_add_to_node(2 * k + 1, node.lazy_add)
                    node.lazy_add = 0
        
                self._apply_chmin_to_node(2 * k, node.max_v)
                self._apply_chmax_to_node(2 * k, node.min_v)
                self._apply_chmin_to_node(2 * k + 1, node.max_v)
                self._apply_chmax_to_node(2 * k + 1, node.min_v)
        
                self._propagate_history(k, 2 * k)
                self._propagate_history(k, 2 * k + 1)
        
            def _build(self, k, l, r, arr):
                node = self.tree[k]
                node.len = r - l + 1
                if l == r:
                    val = arr[l - 1]
                    node.sum = node.max_v = node.min_v = val
                    node.smax_v = -self.INF
                    node.smin_v = self.INF
                    node.max_c = node.min_c = 1
                    node.max_tracker.init(val)
                    node.mid_tracker.init_empty()
                    node.min_tracker.init(val)
                    return
        
                mid = (l + r) // 2
                self._build(2 * k, l, mid, arr)
                self._build(2 * k + 1, mid + 1, r, arr)
                self._pull_up(k)
        
            def _apply_add_to_node(self, k, val):
                node = self.tree[k]
                node.sum += val * node.len
                node.max_v += val
                if node.smax_v != -self.INF: node.smax_v += val
                node.min_v += val
                if node.smin_v != self.INF: node.smin_v += val
        
                node.max_tracker.apply_add(-val, node.max_c)
                if node.max_v != node.min_v:
                    node.mid_tracker.apply_add(-val, node.len - node.min_c - node.max_c)
                node.min_tracker.apply_add(-val, node.min_c)
                node.lazy_add += val
        
            def _apply_chmin_to_node(self, k, val):
                node = self.tree[k]
                if val >= node.max_v: return
        
                node.max_tracker.apply_add(node.max_v - val, node.max_c)
                node.sum += (val - node.max_v) * node.max_c
        
                if node.max_v == node.min_v:
                    node.min_tracker.apply_add(node.min_v - val, node.min_c)
                    node.max_v = node.min_v = val
                elif node.max_v == node.smin_v:
                    node.max_v = node.smin_v = val
                else:
                    node.max_v = val
        
            def _apply_chmax_to_node(self, k, val):
                node = self.tree[k]
                if val <= node.min_v: return
        
                node.min_tracker.apply_add(node.min_v - val, node.min_c)
                node.sum += (val - node.min_v) * node.min_c
        
                if node.min_v == node.max_v:
                    node.max_tracker.apply_add(node.max_v - val, node.max_c)
                    node.min_v = node.max_v = val
                elif node.min_v == node.smax_v:
                    node.min_v = node.smax_v = val
                else:
                    node.min_v = val
        
            def _propagate_history(self, p_idx, k_idx):
                p_node, k_node = self.tree[p_idx], self.tree[k_idx]
        
                if k_node.min_v == p_node.min_v:
                    p_node.min_tracker.absorb(k_node.min_tracker)
                elif k_node.max_v == p_node.min_v:
                    p_node.min_tracker.absorb(k_node.max_tracker)
                else:
                    p_node.min_tracker.absorb(k_node.mid_tracker)
        
                if k_node.max_v == p_node.max_v:
                    p_node.max_tracker.absorb(k_node.max_tracker)
                elif k_node.min_v == p_node.max_v:
                    p_node.max_tracker.absorb(k_node.min_tracker)
                else:
                    p_node.max_tracker.absorb(k_node.mid_tracker)
        
                p_node.mid_tracker.absorb(k_node.mid_tracker)
        
            def _recursive_add(self, k, l, r, ql, qr, val):
                if qr < l or ql > r: return
                if ql <= l and r <= qr:
                    self._apply_add_to_node(k, val)
                    if not self._try_normalize_max_history(k): self._deep_normalize_max_history(k, l, r)
                    if not self._try_normalize_min_history(k): self._deep_normalize_min_history(k, l, r)
                    return
        
                self._push_down(k)
                mid = (l + r) // 2
                self._recursive_add(2 * k, l, mid, ql, qr, val)
                self._recursive_add(2 * k + 1, mid + 1, r, ql, qr, val)
                self._pull_up(k)
        
            def _recursive_chmin(self, k, l, r, ql, qr, val):
                node = self.tree[k]
                if qr < l or ql > r or node.max_v <= val: return
                if ql <= l and r <= qr and node.smax_v < val:
                    self._apply_chmin_to_node(k, val)
                    if not self._try_normalize_max_history(k): self._deep_normalize_max_history(k, l, r)
                    if not self._try_normalize_min_history(k): self._deep_normalize_min_history(k, l, r)
                    return
        
                self._push_down(k)
                mid = (l + r) // 2
                self._recursive_chmin(2 * k, l, mid, ql, qr, val)
                self._recursive_chmin(2 * k + 1, mid + 1, r, ql, qr, val)
                self._pull_up(k)
        
            def _recursive_chmax(self, k, l, r, ql, qr, val):
                node = self.tree[k]
                if qr < l or ql > r or node.min_v >= val: return
                if ql <= l and r <= qr and node.smin_v > val:
                    self._apply_chmax_to_node(k, val)
                    if not self._try_normalize_max_history(k): self._deep_normalize_max_history(k, l, r)
                    if not self._try_normalize_min_history(k): self._deep_normalize_min_history(k, l, r)
                    return
        
                self._push_down(k)
                mid = (l + r) // 2
                self._recursive_chmax(2 * k, l, mid, ql, qr, val)
                self._recursive_chmax(2 * k + 1, mid + 1, r, ql, qr, val)
                self._pull_up(k)
        
            def _recursive_query(self, k, l, r, ql, qr, q_type):
                if qr < l or ql > r:
                    if 'sum' in q_type: return 0
                    return -self.INF if 'max' in q_type else self.INF
        
                node = self.tree[k]
                if ql <= l and r <= qr:
                    if q_type == 'hmax': return max(node.max_tracker.get_historic_max(), node.min_tracker.get_historic_max(),
                                                    node.mid_tracker.get_historic_max())
                    if q_type == 'hmin': return min(node.max_tracker.get_historic_min(), node.min_tracker.get_historic_min(),
                                                    node.mid_tracker.get_historic_min())
                    if q_type == 'hmax_sum':
                        if node.max_v == node.min_v: return node.sum + node.max_tracker.min_delta_s
                        return node.sum + node.max_tracker.min_delta_s + node.mid_tracker.min_delta_s + node.min_tracker.min_delta_s
                    if q_type == 'hmin_sum':
                        if node.max_v == node.min_v: return node.sum + node.max_tracker.max_delta_s
                        return node.sum + node.max_tracker.max_delta_s + node.mid_tracker.max_delta_s + node.min_tracker.max_delta_s
        
                self._push_down(k)
                mid = (l + r) // 2
                lv = self._recursive_query(2 * k, l, mid, ql, qr, q_type)
                rv = self._recursive_query(2 * k + 1, mid + 1, r, ql, qr, q_type)
        
                if 'sum' in q_type: return lv + rv
                return max(lv, rv) if 'max' in q_type else min(lv, rv)
        
            # --- History Normalization ---
            def _try_normalize_max_history(self, k):
                node = self.tree[k]
                if 0 < node.max_tracker.smin_delta and 0 < node.mid_tracker.smin_delta and 0 < node.min_tracker.smin_delta:
                    node.max_tracker.clamp_min_delta(0)
                    node.mid_tracker.clamp_min_delta(0)
                    node.min_tracker.clamp_min_delta(0)
                    return True
                return False
        
            def _try_normalize_min_history(self, k):
                node = self.tree[k]
                if node.max_tracker.smax_delta < 0 and node.mid_tracker.smax_delta < 0 and node.min_tracker.smax_delta < 0:
                    node.max_tracker.clamp_max_delta(0)
                    node.mid_tracker.clamp_max_delta(0)
                    node.min_tracker.clamp_max_delta(0)
                    return True
                return False
        
            def _deep_normalize_max_history(self, k, l, r):
                node = self.tree[k]
                if l == r or (
                        0 <= node.max_tracker.min_delta and 0 <= node.mid_tracker.min_delta and 0 <= node.min_tracker.min_delta): return
        
                self._push_down(k)
                mid = (l + r) // 2
                self._deep_normalize_max_history(2 * k, l, mid)
                self._deep_normalize_max_history(2 * k + 1, mid + 1, r)
                self._pull_up(k)
        
            def _deep_normalize_min_history(self, k, l, r):
                node = self.tree[k]
                if l == r or (
                        node.max_tracker.max_delta <= 0 and node.mid_tracker.max_delta <= 0 and node.min_tracker.max_delta <= 0): return
        
                self._push_down(k)
                mid = (l + r) // 2
                self._deep_normalize_min_history(2 * k, l, mid)
                self._deep_normalize_min_history(2 * k + 1, mid + 1, r)
                self._pull_up(k)
        
            def range_add(self, l, r, val):
                self._recursive_add(1, 1, self.n, l, r, val)
        
            def range_chmin(self, l, r, val):
                self._recursive_chmin(1, 1, self.n, l, r, val)
        
            def range_chmax(self, l, r, val):
                self._recursive_chmax(1, 1, self.n, l, r, val)
        
            def range_set(self, l, r, val):
                self.range_chmin(l, r, val)
                self.range_chmax(l, r, val)
        
            def query_historic_max(self, l, r):
                return self._recursive_query(1, 1, self.n, l, r, 'hmax')
        
            def query_historic_min(self, l, r):
                return self._recursive_query(1, 1, self.n, l, r, 'hmin')
        
            def query_historic_max_sum(self, l, r):
                return self._recursive_query(1, 1, self.n, l, r, 'hmax_sum')
        
            def query_historic_min_sum(self, l, r):
                return self._recursive_query(1, 1, self.n, l, r, 'hmin_sum')
        
        ```
        
    - Persistent Segment Tree
        
        ```python
        class PersistentSegmentTree:
            class Node:
                def __init__(self, value=0, left=None, right=None):
                    self.value = value
                    self.left = left
                    self.right = right
        
            def __init__(self, arr):
                self.n = len(arr)
                self.versions = []
                root = self._build(arr, 0, self.n - 1)
                self.versions.append(root)
        
            def _build(self, arr, left, right):
                if left == right:
                    return self.Node(value=arr[left])
                mid = (left + right) // 2
                left_child = self._build(arr, left, mid)
                right_child = self._build(arr, mid + 1, right)
                return self.Node(value=left_child.value + right_child.value, left=left_child, right=right_child)
        
            def update(self, version_idx, idx, new_value):
                prev_root = self.versions[version_idx]
                new_root = self._update(prev_root, 0, self.n - 1, idx, new_value)
                self.versions.append(new_root)
                return len(self.versions) - 1
        
            def _update(self, prev_node, left, right, idx, new_value):
                if left == right:
                    return self.Node(value=new_value)
                mid = (left + right) // 2
                if idx <= mid:
                    left_child = self._update(prev_node.left, left, mid, idx, new_value)
                    right_child = prev_node.right
                else:
                    left_child = prev_node.left
                    right_child = self._update(prev_node.right, mid + 1, right, idx, new_value)
                return self.Node(value=left_child.value + right_child.value, left=left_child, right=right_child)
        
            def query(self, version_idx, query_left, query_right):
                root = self.versions[version_idx]
                return self._query(root, 0, self.n - 1, query_left, query_right)
        
            def _query(self, node, left, right, query_left, query_right):
                if query_left > right or query_right < left:
                    return 0
                if query_left <= left and right <= query_right:
                    return node.value
                mid = (left + right) // 2
                return self._query(node.left, left, mid, query_left, query_right) + self._query(node.right, mid + 1, right, query_left, query_right)
        
        # 예시
        if __name__ == "__main__":
            pst = PersistentSegmentTree([1, 2, 3, 4, 5])
            print(pst.query(0, 1, 3))  # 9
            new_version = pst.update(0, 2, 10)
            print(pst.query(new_version, 1, 3))  # 16
            print(pst.query(0, 1, 3))  # 9 (원본 유지)
        ```
        
    - Merge Sort Tree
        
        ```python
        import bisect
        
        class MergeSortTree:
            def __init__(self, arr):
                self.n = len(arr)
                self.tree = [[] for _ in range(4 * self.n)]
                self._build(1, 0, self.n - 1, arr)
        
            def _build(self, node, start, end, arr):
                if start == end:
                    self.tree[node] = [arr[start]]
                    return
                mid = (start + end) // 2
                self._build(2 * node, start, mid, arr)
                self._build(2 * node + 1, mid + 1, end, arr)
                left = self.tree[2 * node]
                right = self.tree[2 * node + 1]
                i = j = 0
                merged = []
                while i < len(left) and j < len(right):
                    if left[i] <= right[j]:
                        merged.append(left[i])
                        i += 1
                    else:
                        merged.append(right[j])
                        j += 1
                merged.extend(left[i:])
                merged.extend(right[j:])
                self.tree[node] = merged
        
            def _count_le(self, node, start, end, l, r, val):
                if r < start or end < l:
                    return 0
                if l <= start and end <= r:
                    return bisect.bisect_right(self.tree[node], val)
                mid = (start + end) // 2
                return self._count_le(2 * node, start, mid, l, r, val) + self._count_le(2 * node + 1, mid + 1, end, l, r, val)
        
            def query_kth(self, l, r, k):
                low, high = min(self.tree[1]), max(self.tree[1])
                while low < high:
                    mid = (low + high) // 2
                    count = self._count_le(1, 0, self.n - 1, l, r, mid)
                    if count >= k:
                        high = mid
                    else:
                        low = mid + 1
                # 확인: 실제로 k개 이상 있는지
                if self._count_le(1, 0, self.n - 1, l, r, low) >= k:
                    return low
                return None  # k가 범위 크기 초과
        
            def query_count(self, l, r, val):
                return self._count_le(1, 0, self.n - 1, l, r, val) - self._count_le(1, 0, self.n - 1, l, r, val - 1)
        
            def query_count_range(self, l, r, low_val, high_val):
                return self._count_le(1, 0, self.n - 1, l, r, high_val) - self._count_le(1, 0, self.n - 1, l, r, low_val - 1)
        
        # 예시
        if __name__ == "__main__":
            arr = [1, 3, 2, 5, 4]
            mst = MergeSortTree(arr)
            print(mst.query_kth(0, 4, 3))  # 3
            print(mst.query_count(0, 4, 2))  # 1
            print(mst.query_count_range(0, 4, 2, 4))  # 3 (2,3,4)
            print(mst.query_kth(1, 3, 2))  # 3
        ```
        
- Fenwick Tree
    
    ```python
    import sys
    
    input = sys.stdin.readline
    
    class FenwickTree:
        def __init__(self, size):
            self.size = size
            self.tree = [0] * (size + 1)
        
        def update(self, idx, val):
            while idx <= self.size:
                self.tree[idx] += val
                idx += idx & -idx
        
        def query(self, idx):
            res = 0
            while idx > 0:
                res += self.tree[idx]
                idx -= idx & -idx
            return res
    
    # 입력 예시: 첫 줄 n q, 그 후 q줄 쿼리
    n, q = map(int, input().split())
    ft = FenwickTree(n)
    
    for _ in range(q):
        cmd, *args = map(int, input().split())
        if cmd == 1:
            a, b = args
            ft.update(a, b)
        elif cmd == 2:
            a = args[0]
            print(ft.query(a))
    ```
    
- HLD
    
    ```python
    class HeavyLightDecomposition:
        def __init__(self, n):
            self.N = n
            self.tree = [[-1 for _ in range(n)] for _ in range(n)]  # 인접 행렬
            self.node = [self.Node() for _ in range(n)]
            self.edge = [self.Edge() for _ in range(n)]
            self.segment_tree = self.SegmentTree(n)
            self.chain_heads = [-1] * n
    
        class Node:
            def __init__(self):
                self.par = None
                self.depth = None
                self.size = None
                self.pos_segbase = None
                self.chain = None
    
        class Edge:
            def __init__(self):
                self.weight = None
                self.deeper_end = None
    
        class SegmentTree:
            def __init__(self, n):
                self.base_array = [0] * n
                self.tree = [0] * (6 * n)
    
        def add_edge(self, e, u, v, w):
            self.tree[u-1][v-1] = e-1
            self.tree[v-1][u-1] = e-1
            self.edge[e-1].weight = w
    
        def dfs(self, curr, prev, dep):
            self.node[curr].par = prev
            self.node[curr].depth = dep
            self.node[curr].size = 1
            for j in range(self.N):
                if j != curr and j != self.node[curr].par and self.tree[curr][j] != -1:
                    self.edge[self.tree[curr][j]].deeper_end = j
                    self.dfs(j, curr, dep + 1)
                    self.node[curr].size += self.node[j].size
    
        def hld(self, curr_node, id, edge_counted, curr_chain):
            if self.chain_heads[curr_chain[0]] == -1:
                self.chain_heads[curr_chain[0]] = curr_node
            self.node[curr_node].chain = curr_chain[0]
            self.node[curr_node].pos_segbase = edge_counted[0]
            self.segment_tree.base_array[edge_counted[0]] = self.edge[id].weight if id is not None and id != -1 else 0
            edge_counted[0] += 1
            spcl_chld = -1
            spcl_edg_id = -1
            for j in range(self.N):
                if j != curr_node and j != self.node[curr_node].par and self.tree[curr_node][j] != -1:
                    if spcl_chld == -1 or self.node[spcl_chld].size < self.node[j].size:
                        spcl_chld = j
                        spcl_edg_id = self.tree[curr_node][j]
            if spcl_chld != -1:
                self.hld(spcl_chld, spcl_edg_id, edge_counted, curr_chain)
            for j in range(self.N):
                if j != curr_node and j != self.node[curr_node].par and j != spcl_chld and self.tree[curr_node][j] != -1:
                    curr_chain[0] += 1
                    self.hld(j, self.tree[curr_node][j], edge_counted, curr_chain)
    
        def build(self, root=0):
            self.dfs(root, root, 0)
            edge_counted = [0]
            curr_chain = [0]
            self.hld(root, -1, edge_counted, curr_chain)
            self.construct_st(0, self.N, 1)
    
        def construct_st(self, ss, se, si):
            if ss == se - 1:
                self.segment_tree.tree[si] = self.segment_tree.base_array[ss]
                return self.segment_tree.base_array[ss]
            mid = (ss + se) // 2
            self.segment_tree.tree[si] = max(self.construct_st(ss, mid, si * 2), self.construct_st(mid, se, si * 2 + 1))
            return self.segment_tree.tree[si]
    
        def update_st(self, ss, se, si, x, val):
            if ss > x or se <= x:
                return self.segment_tree.tree[si]
            if ss == x and ss == se - 1:
                self.segment_tree.tree[si] = val
                return val
            mid = (ss + se) // 2
            self.segment_tree.tree[si] = max(self.update_st(ss, mid, si * 2, x, val), self.update_st(mid, se, si * 2 + 1, x, val))
            return self.segment_tree.tree[si]
    
        def change(self, e, val):
            pos = self.node[self.edge[e].deeper_end].pos_segbase
            self.update_st(0, self.N, 1, pos, val)
    
        def get_lca(self, u, v):
            if self.node[u].depth > self.node[v].depth:
                u, v = v, u
            diff = self.node[v].depth - self.node[u].depth
            while diff:
                v = self.node[v].par
                diff -= 1
            while u != v:
                u = self.node[u].par
                v = self.node[v].par
            return u
    
        def rmq_st(self, ss, se, si, qs, qe):
            if qs <= ss and qe >= (se - 1):
                return self.segment_tree.tree[si]
            if se <= qs or ss > qe:
                return -1
            mid = (ss + se) // 2
            return max(self.rmq_st(ss, mid, 2 * si, qs, qe), self.rmq_st(mid, se, 2 * si + 1, qs, qe))
    
        def max_edge_query(self, u, v):
            res = -1
            while self.node[u].chain != self.node[v].chain:
                if self.node[self.chain_heads[self.node[u].chain]].depth < self.node[self.chain_heads[self.node[v].chain]].depth:
                    u, v = v, u
                head = self.chain_heads[self.node[u].chain]
                res = max(res, self.rmq_st(0, self.N, 1, self.node[head].pos_segbase, self.node[u].pos_segbase))
                u = self.node[head].par
            if self.node[u].depth > self.node[v].depth:
                u, v = v, u
            res = max(res, self.rmq_st(0, self.N, 1, self.node[u].pos_segbase, self.node[v].pos_segbase))
            return res
    
    # 사용 예시
    if __name__ == "__main__":
        hld = HeavyLightDecomposition(11)
    
        # 엣지 추가
        hld.add_edge(1, 1, 2, 13)
        hld.add_edge(2, 1, 3, 9)
        hld.add_edge(3, 1, 4, 23)
        hld.add_edge(4, 2, 5, 25)
        hld.add_edge(5, 2, 6, 5)
        hld.add_edge(6, 2, 7, 1)
        hld.add_edge(7, 3, 8, 17)
        hld.add_edge(8, 3, 9, 8)
        hld.add_edge(9, 4, 10, 16)
        hld.add_edge(10, 7, 11, 4)
    
        # build 호출로 내부 처리
        hld.build(root=0)
    
        # 쿼리 예시
        print(hld.max_edge_query(10, 6))  # 출력: 4
    
        # 업데이트 예시
        hld.change(9, 20)  # 엣지 10 (인덱스 9)을 20으로 변경
        print(hld.max_edge_query(10, 6))  # 출력: 20
    ```
    
- Splay Trees
    - Splay Tree
        
        ```python
        class Node:
            def __init__(self, value):
                self.value = value
                self.left = None
                self.right = None
                self.parent = None
        
        class SplayTree:
            def __init__(self):
                self.root = None
        
            def _rotate(self, node):
                parent = node.parent
                grand_parent = parent.parent
        
                if parent.left == node:
                    parent.left = node.right
                    if node.right:
                        node.right.parent = parent
                    node.right = parent
                else:
                    parent.right = node.left
                    if node.left:
                        node.left.parent = parent
                    node.left = parent
        
                parent.parent = node
                node.parent = grand_parent
                if grand_parent:
                    if grand_parent.left == parent:
                        grand_parent.left = node
                    else:
                        grand_parent.right = node
                else:
                    self.root = node
        
            def _splay(self, node):
                if not node:
                    return
                while node.parent:
                    parent = node.parent
                    grand_parent = parent.parent
                    if not grand_parent:
                        self._rotate(node)
                    else:
                        if (parent.left == node) == (grand_parent.left == parent):
                            self._rotate(parent)
                        else:
                            self._rotate(node)
                        self._rotate(node)
                self.root = node
        
            def find(self, value):
                node = self.root
                last_node = None
                while node:
                    last_node = node
                    if value < node.value:
                        node = node.left
                    elif value > node.value:
                        node = node.right
                    else:
                        self._splay(node)
                        return node
                if last_node:
                    self._splay(last_node)
                return None
        
            def insert(self, value):
                if not self.root:
                    self.root = Node(value)
                    return
        
                node = self.root
                while True:
                    if value < node.value:
                        if not node.left:
                            node.left = Node(value)
                            node.left.parent = node
                            self._splay(node.left)
                            return
                        node = node.left
                    else:
                        if not node.right:
                            node.right = Node(value)
                            node.right.parent = node
                            self._splay(node.right)
                            return
                        node = node.right
        
            def delete(self, value):
                node = self.find(value)
                if not node:
                    return
        
                if not node.left:
                    self.root = node.right
                    if self.root:
                        self.root.parent = None
                elif not node.right:
                    self.root = node.left
                    if self.root:
                        self.root.parent = None
                else:
                    max_node = node.left
                    while max_node.right:
                        max_node = max_node.right
                    self._splay(max_node)
                    max_node.right = node.right
                    if node.right:
                        node.right.parent = max_node
                    self.root = max_node
        
            def print_inorder(self):
                def _inorder(node):
                    if not node:
                        return []
                    return _inorder(node.left) + [node.value] + _inorder(node.right)
                print(f"트리 상태 (중위 순회): {_inorder(self.root)}")
        
        if __name__ == "__main__":
            tree = SplayTree()
            print("## 1. 삽입 테스트 ##")
            values = [5, 3, 7, 1, 4, 6, 8]
            for val in values:
                tree.insert(val)
                print(f"{val} 삽입 후:", end=" ")
                tree.print_inorder()
        
            print("\n## 2. 검색 테스트 ##")
            for val in [4, 9]:
                result = tree.find(val)
                print(f"{val} 검색: {'발견' if result else '없음'}, 루트 값: {tree.root.value if tree.root else None}")
                tree.print_inorder()
        
            print("\n## 3. 삭제 테스트 ##")
            for val in [3, 5]:
                tree.delete(val)
                print(f"{val} 삭제 후:", end=" ")
                tree.print_inorder()
        ```
        
    - Splay Tree with More Query
        
        ```python
        class Node:
            def __init__(self, value):
                self.value = value
                self.sum = value
                self.size = 1
                self.lazy = 0
                self.left = None
                self.right = None
                self.parent = None
        
        class SplayTree:
            def __init__(self):
                self.root = None
        
            def _get_size(self, node):
                return node.size if node else 0
        
            def _get_sum(self, node):
                return node.sum if node else 0
        
            def _update(self, node):
                if node:
                    node.size = 1 + self._get_size(node.left) + self._get_size(node.right)
                    node.sum = self._get_sum(node.left) + node.value + self._get_sum(node.right)
        
            def _push_down(self, node):
                if node and node.lazy != 0:
                    if node.left:
                        node.left.lazy += node.lazy
                        node.left.sum += node.lazy * self._get_size(node.left)
                    if node.right:
                        node.right.lazy += node.lazy
                        node.right.sum += node.lazy * self._get_size(node.right)
                    node.value += node.lazy
                    node.lazy = 0
        
            def _rotate(self, y):
                x = y.parent
                p = x.parent
        
                self._push_down(x)
                self._push_down(y)
        
                if y == x.left:
                    x.left = y.right
                    if y.right:
                        y.right.parent = x
                    y.right = x
                else:
                    x.right = y.left
                    if y.left:
                        y.left.parent = x
                    y.left = x
        
                y.parent = p
                if not p:
                    self.root = y
                elif x == p.left:
                    p.left = y
                else:
                    p.right = y
                x.parent = y
        
                self._update(x)
                self._update(y)
        
            def _splay(self, node, goal=None):
                if not node:
                    return
                while node.parent != goal:
                    parent = node.parent
                    grand_parent = parent.parent
                    if grand_parent != goal:
                        if (node == parent.left) == (parent == grand_parent.left):
                            self._rotate(parent)
                        else:
                            self._rotate(node)
                    self._rotate(node)
                if goal is None:
                    self.root = node
                self._update(node)
        
            def find_kth(self, k):
                if k < 1 or k > self._get_size(self.root):
                    return None
                node = self.root
                while node:
                    self._push_down(node)
                    left_size = self._get_size(node.left)
                    if k == left_size + 1:
                        break
                    elif k <= left_size:
                        node = node.left
                    else:
                        k -= left_size + 1
                        node = node.right
                if node:
                    self._splay(node)
                return node
        
            def split(self, k):
                if k <= 0:
                    return None, self
                if k >= self._get_size(self.root):
                    return self, None
                self.find_kth(k)
                right_root = self.root.right
                if right_root:
                    right_root.parent = None
                self.root.right = None
                self._update(self.root)
                left = self
                right = SplayTree()
                right.root = right_root
                return left, right
        
            def merge(self, other):
                if not self.root:
                    return other
                if not other.root:
                    return self
                self.find_kth(self._get_size(self.root))
                self.root.right = other.root
                if other.root:
                    other.root.parent = self.root
                self._update(self.root)
                return self
        
            def insert(self, pos, value):
                left, right = self.split(pos)
                new_node = Node(value)
                new_tree = SplayTree()
                new_tree.root = new_node
                if left is None:
                    left = new_tree
                else:
                    left = left.merge(new_tree)
                if right is None:
                    self.root = left.root
                else:
                    left = left.merge(right)
                    self.root = left.root
        
            def delete(self, pos):
                left, midright = self.split(pos - 1)
                if midright is None:
                    return
                mid, right = midright.split(1)
                if left is None:
                    self.root = right.root if right else None
                elif right is None:
                    self.root = left.root
                else:
                    left = left.merge(right)
                    self.root = left.root
        
            def range_sum(self, l, r):
                if l > r:
                    return 0
                left, midright = self.split(l - 1)
                if midright is None:
                    return 0
                mid, right = midright.split(r - (l - 1))
                res = self._get_sum(mid.root) if mid else 0
                midright = mid.merge(right) if mid and right else (mid if mid else right)
                full = left.merge(midright) if left and midright else (left if left else midright)
                self.root = full.root if full else None
                return res
        
            def range_add(self, l, r, val):
                if l > r:
                    return
                left, midright = self.split(l - 1)
                if midright is None:
                    return
                mid, right = midright.split(r - (l - 1))
                if mid:
                    node = mid.root
                    if node:
                        self._push_down(node)
                        node.lazy += val
                        node.sum += val * self._get_size(node)
                midright = mid.merge(right) if mid and right else (mid if mid else right)
                full = left.merge(midright) if left and midright else (left if left else midright)
                self.root = full.root if full else None
        
        if __name__ == "__main__":
            def print_tree_state(tree):
                size = tree._get_size(tree.root)
                if size == 0:
                    print("[] (비어 있음)")
                    return
                state = [tree.find_kth(i).value for i in range(1, size + 1)]
                print(f"{state} (크기: {size})")
        
            # 1. 1부터 10까지 값을 가진 초기 트리 생성
            print("## 1. 초기 트리 생성 ##")
            tree = SplayTree()
            for i in range(1, 11):
                tree.insert(i - 1, i)
        
            print("초기 상태:", end=" ")
            print_tree_state(tree)
            # 예상 결과: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] (크기: 10)
            print("초기 전체 합 (1-10):", tree.range_sum(1, 10))  # 예상: 55
            print("-" * 30)
        
            # 2. 중첩된 구간 갱신 (Lazy Propagation 테스트)
            print("## 2. 중첩 구간 갱신 ##")
            print("[3, 7] 구간에 10 더하기...")
            tree.range_add(3, 7, 10)  # [.., 13, 14, 15, 16, 17, ..]
        
            print("[5, 9] 구간에 5 더하기...")
            tree.range_add(5, 9, 5)  # [.., 15+5, 16+5, 17+5, 8+5, 9+5, ..]
        
            print("[1, 2] 구간에 -2 빼기...")
            tree.range_add(1, 2, -2)  # [1-2, 2-2, ..]
        
            print("중첩 갱신 후 상태:", end=" ")
            print_tree_state(tree)
            # 예상 결과: [-1, 0, 13, 14, 20, 21, 22, 13, 14, 10] (크기: 10)
            print("-" * 30)
        
            # 3. 갱신 후 값 및 구간합 검증
            print("## 3. 갱신 후 검증 ##")
            print("5번째 값 (find_kth):", tree.find_kth(5).value)  # 예상: 20
            print("구간합(4-6):", tree.range_sum(4, 6))  # 예상: 14 + 20 + 21 = 55
            print("전체 합:", tree.range_sum(1, 10))  # 예상: 126
            print("-" * 30)
        
            # 4. 삭제 및 삽입 (구조 변경)
            print("## 4. 삭제 및 삽입 ##")
            print("5번째 원소 (값 20) 삭제...")
            tree.delete(5)
            print("삭제 후 상태:", end=" ")
            print_tree_state(tree)
            # 예상 결과: [-1, 0, 13, 14, 21, 22, 13, 14, 10] (크기: 9)
        
            print("\n1번째 원소 (값 -1) 삭제...")
            tree.delete(1)
            print("삭제 후 상태:", end=" ")
            print_tree_state(tree)
            # 예상 결과: [0, 13, 14, 21, 22, 13, 14, 10] (크기: 8)
        
            print("\n맨 뒤(8번 인덱스)에 100 삽입...")
            tree.insert(8, 100)
            print("삽입 후 상태:", end=" ")
            print_tree_state(tree)
            # 예상 결과: [0, 13, 14, 21, 22, 13, 14, 10, 100] (크기: 9)
            print("-" * 30)
        
            # 5. 최종 상태 검증
            print("## 5. 최종 검증 ##")
            print("최종 3번째 값:", tree.find_kth(3).value)  # 예상: 14
            print("최종 구간합(1-9):", tree.range_sum(1, 9))  # 예상: 207
        ```
        

## 탐색

- Mo’s Algorithm
    
    ```python
    import sys
    
    input = sys.stdin.readline
    
    N = int(input())
    A = list(map(int, input().split()))
    M = int(input())
    
    S = int(N**0.5)
    
    queries = []
    for i in range(M):
        l, r = map(int, input().split())
        queries.append([l - 1, r - 1, i])
    
    queries.sort(key=lambda q: (q[0] // S, q[1] if (q[0] // S) % 2 == 0 else -q[1]))
    
    answers = [0] * M
    
    count = [0] * 1000001
    
    current_answer = 0
    
    def add(idx):
        global current_answer
        val = A[idx]
        if count[val] == 0:
            current_answer += 1
        count[val] += 1
    
    def remove(idx):
        global current_answer
        val = A[idx]
        count[val] -= 1
        if count[val] == 0:
            current_answer -= 1
    
    q_l, q_r, q_idx = queries[0]
    l, r = q_l, q_l - 1
    while r < q_r:
        r += 1
        add(r)
    answers[q_idx] = current_answer
    
    for i in range(1, M):
        q_l, q_r, q_idx = queries[i]
        
        while l > q_l:
            l -= 1
            add(l)
        while l < q_l:
            remove(l)
            l += 1
            
        while r < q_r:
            r += 1
            add(r)
        while r > q_r:
            remove(r)
            r -= 1
            
        answers[q_idx] = current_answer
    
    for ans in answers:
        print(ans)
    ```
    
- 

## 그래프

### [BFS](/study/algorithms/graph/)

- 큐
    
    ```python
    '''
    :param graph : list
    :param row_size : int - 열 크기
    :param column_size : int - 행 크기
    :param source : tuple - 시작 지점 (y,x)
    :param sink : tuple - 도착 지점 (y,x)
    :param wall : any
    :param direction : list - 움직이는 방향, 기본 4방향
    :return count : int - 움직인 거리
    '''
    ```
    
    ```python
    def bfs(graph, row_size, column_size, source, sink, wall, direction=None):
        from collections import deque
        if direction is None:
            direction = [(1, 0), (0, 1), (-1, 0), (0, -1)]
    
        visited = [[-1] * column_size for _ in range(row_size)]
        queue = deque([source])
        visited[source[0]][source[1]] = 1
    
        while queue:
            y, x = queue.popleft()
            if (y, x) == sink:
                return visited[y][x]
            for dy, dx in direction:
                ny, nx = y + dy, x + dx
                if 0 <= ny < row_size and 0 <= nx < column_size and visited[ny][nx] == -1 and graph[ny][nx] != wall:
                    visited[ny][nx] = visited[y][x] + 1
                    queue.append((ny, nx))
        return -1
    ```
    

### [DFS](/study/algorithms/graph/)

- 스택
    
    ```python
    '''
    :param graph : list
    :param row_size : int - 열 크기
    :param column_size : int - 행 크기
    :param source : tuple - 시작 지점 (y,x)
    :param sink : tuple - 도착 지점 (y,x)
    :param wall : any
    :param direction : list - 움직이는 방향, 기본 4방향
    :return count : int - 움직인 거리
    '''
    ```
    
    ```python
    def dfs(graph, row_size, column_size, source, sink, wall, direction=None):
        if direction is None:
            direction = [(1, 0), (0, 1), (-1, 0), (0, -1)]
    
        visited = [[-1] * column_size for _ in range(row_size)]
        stack = [source]
        visited[source[0]][source[1]] = 1
    
        while stack:
            y, x = stack.pop()
            if (y, x) == sink:
                return visited[y][x]
            for dy, dx in direction:
                ny, nx = y + dy, x + dx
                if 0 <= ny < row_size and 0 <= nx < column_size:
                    if visited[ny][nx] == -1 and graph[ny][nx] != wall:
                        visited[ny][nx] = visited[y][x] + 1
                        stack.append((ny, nx))
        return -1
    
    ```
    
- 재귀
    
    ```python
    '''
    :param graph : list
    :param row_size : int - 열 크기
    :param column_size : int - 행 크기
    :param source : tuple - 시작 지점 (y,x)
    :param sink : tuple - 도착 지점 (y,x)
    :param wall : any
    :param direction : list - 움직이는 방향, 기본 4방향
    :return count : int - 움직인 최소 거리
    '''
    ```
    
    ```python
    def dfs(graph, row_size, column_size, source, sink, wall, direction=None):
        if direction is None:
            direction = [(1, 0), (0, 1), (-1, 0), (0, -1)]
    
        visited = [[False] * column_size for _ in range(row_size)]
        min_dist = [float('inf')]
    
        def recur(y, x, dist):
            if (y, x) == sink:
                min_dist[0] = min(min_dist[0], dist)
                return
    
            for dy, dx in direction:
                ny, nx = y + dy, x + dx
                if 0 <= ny < row_size and 0 <= nx < column_size:
                    if not visited[ny][nx] and graph[ny][nx] != wall:
                        visited[ny][nx] = True
                        recur(ny, nx, dist + 1)
                        visited[ny][nx] = False  # 백트래킹
    
        sy, sx = source
        visited[sy][sx] = True
        recur(sy, sx, 1)
    
        return min_dist[0] if min_dist[0] != float('inf') else -1
    
    ```
    

### [다익스트라](/study/algorithms/graph/dijkstra/)

- 힙큐
    
    ```python
    '''
    :param graph : dict - 각 노드의 인접 리스트 {node: [(to, cost), ...]}
    :param node_size : int - 전체 노드 수
    :param source : int - 시작 노드
    :return dist: list - start-> 각 노드에 대한 최소 거리
    '''
    ```
    
    ```python
    def dijkstra(graph, node_size, source):
        import heapq
    
        INF = float('inf')
        dist = [INF] * node_size
        dist[source] = 0
        heap = [(0, source)]
    
        while heap:
            cost, node = heapq.heappop(heap)
            if dist[node] < cost:
                continue
            for to, w in graph.get(node, []):
                new_cost = cost + w
                if new_cost < dist[to]:
                    dist[to] = new_cost
                    heapq.heappush(heap, (new_cost, to))
                    
        return dist
    
    ```
    

### [벨만-포드](/study/algorithms/graph/bellman-ford/)

- 기본
    
    ```python
    '''
    :param graph : dict - 각 노드의 인접 리스트 {node: [(to, cost), ...]}
    :param node_size : int - 전체 노드 수
    :param source : int - 시작 노드
    :return dist: list - 최소 비용 (음수 사이클이 존재하면 예외 처리)
    '''
    ```
    
    ```python
    def bellman_ford(graph, node_size, source):
        INF = int(1e18)
        dist = [INF] * (node_size + 1)
        dist[source] = 0
    
        for i in range(node_size):
            for u in range(1, node_size + 1):
                for v, cost in graph[u]:
                    if dist[u] != INF and dist[v] > dist[u] + cost:
                        dist[v] = dist[u] + cost
                        if i == node_size - 1:
                            return None
        return dist
    ```
    

### [플로이드-워셜](/study/algorithms/graph/floyd-warshall/)

- 기본
    
    ```python
    '''
    :param graph : list[list[int]] - 인접 행렬 (graph[i][j] = i → j 비용, 연결 안 되어 있으면 inf)
    :param node_size : int - 정점 수
    :return dist : list[list[int]] - 최단 거리 테이블
    '''
    ```
    
    ```python
    def floyd_warshall(graph, node_size):
        INF = float('inf')
        dist = [row[:] for row in graph]  # 깊은 복사
    
        for k in range(node_size):
            for i in range(node_size):
                for j in range(node_size):
                    if dist[i][k] != INF and dist[k][j] != INF:
                        dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
        
        # 음수 사이클 확인 (i → i 비용이 음수면 사이클 존재)
        for i in range(node_size):
            if dist[i][i] < 0:
                return None
    
        return dist
    
    ```
    

### 분리 집합

- 클래스 형태
    
    ```python
    class UnionFind:
        def __init__(self, n):
            """
            n개의 원소를 각각 독립된 집합으로 초기화
            :param n: 원소의 수
            """
            self.parent = [i for i in range(n)]  # 각 원소의 부모는 자기 자신
            self.rank = [1] * n  # 트리의 높이 또는 랭크
            self.set_size = [1] * n  # 각 집합의 크기 (option, size tracking)
    
        def find(self, x):
            """
            x가 속한 집합의 루트(대표 원소)를 찾는다 (경로 압축 적용)
            :param x: 원소
            :return: 루트 노드 번호
            """
            if self.parent[x] != x:
                self.parent[x] = self.find(self.parent[x])  # 경로 압축
            return self.parent[x]
    
        def union(self, x, y):
            """
            x와 y가 속한 두 집합을 합친다 (union by rank 적용)
            :param x: 원소 x
            :param y: 원소 y
            :return: 병합 성공 시 True, 이미 같은 집합이면 False
            """
            x_root = self.find(x)
            y_root = self.find(y)
            if x_root == y_root:
                return False  # 이미 같은 집합
    
            # 랭크를 기준으로 루트 노드를 선택
            if self.rank[x_root] < self.rank[y_root]:
                x_root, y_root = y_root, x_root
    
            self.parent[y_root] = x_root
            if self.rank[x_root] == self.rank[y_root]:
                self.rank[x_root] += 1
    
            self.set_size[x_root] += self.set_size[y_root]
            return True
    
        def same(self, x, y):
            """
            x와 y가 같은 집합에 속해 있는지 확인
            :param x: 원소 x
            :param y: 원소 y
            :return: True 또는 False
            """
            return self.find(x) == self.find(y)
    
        def size(self, x):
            """
            x가 속한 집합의 크기를 반환
            :param x: 원소
            :return: 집합 크기
            """
            return self.set_size[self.find(x)]
    
    ```
    
- 함수 형태
    
    ```python
    def make_union_find(n):
        """
        유니온 파인드를 위한 parent, size 배열 초기화
        :param n: 노드 개수
        :return: (parent, size) 튜플
        """
        parent = [i for i in range(n)]
        size = [1] * n
        return parent, size
    
    def find(parent, x):
        """
        x의 대표 노드(루트)를 찾는 함수 (경로 압축 적용)
        :param parent: 부모 배열
        :param x: 노드 x
        :return: x의 루트
        """
        if parent[x] != x:
            parent[x] = find(parent, parent[x])  # 경로 압축
        return parent[x]
    
    def union(parent, size, x, y):
        """
        두 원소 x, y가 속한 집합을 병합 (size 기준으로 병합)
        :param parent: 부모 배열
        :param size: 집합 크기 배열
        :param x: 노드 x
        :param y: 노드 y
        :return: 병합 성공 여부 (True/False)
        """
        x_root = find(parent, x)
        y_root = find(parent, y)
        if x_root == y_root:
            return False  # 이미 같은 집합
    
        # 더 큰 트리에 작은 트리를 붙임
        if size[x_root] < size[y_root]:
            x_root, y_root = y_root, x_root
    
        parent[y_root] = x_root
        size[x_root] += size[y_root]
        return True
    
    def same(parent, x, y):
        """
        두 원소가 같은 집합에 속하는지 확인
        :param parent: 부모 배열
        :param x: 노드 x
        :param y: 노드 y
        :return: True or False
        """
        return find(parent, x) == find(parent, y)
    
    def get_size(size, parent, x):
        """
        x가 속한 집합의 크기를 반환
        :param size: 집합 크기 배열
        :param parent: 부모 배열
        :param x: 노드 x
        :return: 해당 집합의 크기
        """
        return size[find(parent, x)]
    
    ```
    

### 크루스칼 (최소 스패닝 트리)

- 입력 형태가 (cost,a,b)
    
    ```python
    def make_union_find(n):
        parent = [i for i in range(n)]
        size = [1] * n
        return parent, size
    
    def find(parent, x):
        if parent[x] != x:
            parent[x] = find(parent, parent[x])
        return parent[x]
    
    def union(parent, size, x, y):
        x_root = find(parent, x)
        y_root = find(parent, y)
        if x_root == y_root:
            return False
        if size[x_root] < size[y_root]:
            x_root, y_root = y_root, x_root
        parent[y_root] = x_root
        size[x_root] += size[y_root]
        return True
    
    def kruskal(n, edges):
        """
        크루스칼 알고리즘으로 최소 신장 트리(MST) 구성
        :param n: 노드 수
        :param edges: 간선 리스트 [(가중치, 노드1, 노드2), ...]
        :return: 최소 비용 합, 선택된 간선 리스트
        """
        parent, size = make_union_find(n)
        edges.sort()  # 가중치 기준 정렬
        total_cost = 0
        mst_edges = []
    
        for cost, u, v in edges:
            if union(parent, size, u, v):
                total_cost += cost
                mst_edges.append((u, v, cost))
    
        return total_cost, mst_edges
    
    ```
    

### 위상 정렬

- 기본
    
    ```python
    def topological_sort(graph, node_count):
        """
        위상 정렬 (Kahn's algorithm, BFS 기반)
        :param graph: 인접 리스트 형식의 DAG (graph[u] = [v1, v2, ...])
        :param node_count: 전체 노드 수 (0 ~ node_count - 1)
        :return: 위상 정렬 순서 리스트 (사이클이 있으면 빈 리스트 반환)
        """
        from collections import deque
        indegree = [0] * node_count  # 각 노드의 진입 차수
    
        # 진입 차수 계산
        for u in graph:
            for v in graph[u]:
                indegree[v] += 1
    
        # 진입 차수가 0인 노드들을 큐에 넣기
        queue = deque([i for i in range(node_count) if indegree[i] == 0])
        result = []
    
        while queue:
            u = queue.popleft()
            result.append(u)
            for v in graph.get(u, []):
                indegree[v] -= 1
                if indegree[v] == 0:
                    queue.append(v)
    
        if len(result) == node_count:
            return result  # 정상적인 위상 정렬 결과
        else:
            return []      # 사이클 존재 (위상 정렬 불가)
    
    ```
    

### SCC

- 타잔 알고리즘
    
    ```python
    def tarjans_scc(graph, node_count):
        """
        Tarjan's Algorithm으로 SCC(강한 연결 요소) 찾기
        :param graph: 인접 리스트 (graph[u] = [v1, v2, ...])
        :param node_count: 전체 노드 수
        :return: SCC 리스트 (각 SCC는 리스트 형태, 내부 정점 순서는 DFS 역순)
        """
        index = 0
        index_list = [-1] * node_count      # 방문 순서 기록
        lowlink = [0] * node_count          # 가장 위로 올라갈 수 있는 정점
        on_stack = [False] * node_count     # 스택에 있는지 여부
        stack = []
        sccs = []
    
        def dfs(v):
            nonlocal index
            index_list[v] = lowlink[v] = index
            index += 1
            stack.append(v)
            on_stack[v] = True
    
            for w in graph.get(v, []):
                if index_list[w] == -1:
                    dfs(w)
                    lowlink[v] = min(lowlink[v], lowlink[w])
                elif on_stack[w]:
                    lowlink[v] = min(lowlink[v], index_list[w])
    
            # SCC 루트 발견
            if lowlink[v] == index_list[v]:
                scc = []
                while True:
                    w = stack.pop()
                    on_stack[w] = False
                    scc.append(w)
                    if w == v:
                        break
                sccs.append(scc)
    
        for v in range(node_count):
            if index_list[v] == -1:
                dfs(v)
    
        return sccs
    ```
    

### 2-SAT

- 식의 모순 여부
    
    ```python
    def two_sat(n, clauses):
        """
        2-SAT 풀이 (음수 리터럴로 입력받는 버전)
        :param n: 변수 개수 (변수는 1 ~ n)
        :param clauses: [(a, b)] 형태, a 또는 b가 True 되어야 함
                        a, b는 각각 정수 (음수: 부정된 변수)
        :return: (가능 여부, 변수 값 리스트 [x1, x2, ..., xn])
                 값은 True/False, 인덱스는 0부터 시작
        """
        def var_id(x):
            x = x - 1 if x > 0 else -x - 1
            return 2 * x + (0 if x >= 0 and x > 0 else 1 if x < 0 else (0 if x > 0 else 1))
    
        graph = [[] for _ in range(2 * n)]
    
        def literal_to_id(x):
            var = abs(x) - 1
            return 2 * var + (0 if x > 0 else 1)
    
        # 1. Implication Graph 구성
        for a, b in clauses:
            graph[literal_to_id(-a)].append(literal_to_id(b))  # ¬a → b
            graph[literal_to_id(-b)].append(literal_to_id(a))  # ¬b → a
    
        # 2. Tarjan's SCC
        index = 0
        indices = [-1] * (2 * n)
        lowlink = [0] * (2 * n)
        on_stack = [False] * (2 * n)
        stack = []
        scc_id = [0] * (2 * n)
        scc_count = 0
    
        def dfs(u):
            nonlocal index, scc_count
            indices[u] = lowlink[u] = index
            index += 1
            stack.append(u)
            on_stack[u] = True
    
            for v in graph[u]:
                if indices[v] == -1:
                    dfs(v)
                    lowlink[u] = min(lowlink[u], lowlink[v])
                elif on_stack[v]:
                    lowlink[u] = min(lowlink[u], indices[v])
    
            if lowlink[u] == indices[u]:
                while True:
                    v = stack.pop()
                    on_stack[v] = False
                    scc_id[v] = scc_count
                    if v == u:
                        break
                scc_count += 1
    
        for i in range(2 * n):
            if indices[i] == -1:
                dfs(i)
    
        # 3. 모순 체크
        for i in range(n):
            if scc_id[2 * i] == scc_id[2 * i + 1]:
                return False
    
        return True
    
    ```
    
- 식의 해까지
    
    ```python
    def two_sat(n, clauses):
        """
        2-SAT 풀이 (음수 리터럴로 입력받는 버전)
        :param n: 변수 개수 (변수는 1 ~ n)
        :param clauses: [(a, b)] 형태, a 또는 b가 True 되어야 함
                        a, b는 각각 정수 (음수: 부정된 변수)
        :return: (가능 여부, 변수 값 리스트 [x1, x2, ..., xn])
                 값은 True/False, 인덱스는 0부터 시작
        """
        def var_id(x):
            x = x - 1 if x > 0 else -x - 1
            return 2 * x + (0 if x >= 0 and x > 0 else 1 if x < 0 else (0 if x > 0 else 1))
    
        graph = [[] for _ in range(2 * n)]
    
        def literal_to_id(x):
            var = abs(x) - 1
            return 2 * var + (0 if x > 0 else 1)
    
        # 1. Implication Graph 구성
        for a, b in clauses:
            graph[literal_to_id(-a)].append(literal_to_id(b))  # ¬a → b
            graph[literal_to_id(-b)].append(literal_to_id(a))  # ¬b → a
    
        # 2. Tarjan's SCC
        index = 0
        indices = [-1] * (2 * n)
        lowlink = [0] * (2 * n)
        on_stack = [False] * (2 * n)
        stack = []
        scc_id = [0] * (2 * n)
        scc_count = 0
    
        def dfs(u):
            nonlocal index, scc_count
            indices[u] = lowlink[u] = index
            index += 1
            stack.append(u)
            on_stack[u] = True
    
            for v in graph[u]:
                if indices[v] == -1:
                    dfs(v)
                    lowlink[u] = min(lowlink[u], lowlink[v])
                elif on_stack[v]:
                    lowlink[u] = min(lowlink[u], indices[v])
    
            if lowlink[u] == indices[u]:
                while True:
                    v = stack.pop()
                    on_stack[v] = False
                    scc_id[v] = scc_count
                    if v == u:
                        break
                scc_count += 1
    
        for i in range(2 * n):
            if indices[i] == -1:
                dfs(i)
    
        # 3. 모순 체크
        for i in range(n):
            if scc_id[2 * i] == scc_id[2 * i + 1]:
                return (False, [])
    
        # 4. 값 할당 (SCC 역순)
        order = sorted(range(2 * n), key=lambda x: -scc_id[x])
        value = [None] * (2 * n)
        assignment = [False] * n
        for u in order:
            var = u // 2
            is_true = (u % 2 == 0)
            if value[var] is None:
                value[var] = not is_true
                assignment[var] = value[var]
    
        return (True, assignment)
    
    ```
    

### 최대유량

- 최대 유량 (에드몬드 - 카프)
    
    ```python
    from collections import deque
    
    class Edge:
        def __init__(self, to, cap):
            self.to = to        # 도착 정점
            self.cap = cap      # 간선 용량
            self.flow = 0       # 현재 흐르고 있는 유량
            self.rev = None     # 역방향 간선 (Edge 객체)
    
    def add_edge(graph, fr, to, cap):
        """
        fr → to 용량이 cap인 간선을 추가하고,
        to → fr 역방향 간선(cap=0)도 추가하여 residual graph 구성.
        각 간선은 서로의 역방향을 Edge 객체로 참조함.
        """
        forward = Edge(to, cap)
        backward = Edge(fr, 0)
        forward.rev = backward
        backward.rev = forward
        graph[fr].append(forward)
        graph[to].append(backward)
    
    def bfs(graph, s, t, parent):
        """
        BFS로 증가 경로를 탐색하여 parent 배열을 채움.
        parent[v] = (u, e): v로 오기 위한 직전 노드 u와 간선 e.
        :return: 증가 경로가 존재하면 True, 없으면 False
        """
        n = len(graph)
        visited = [False] * n
        queue = deque([s])
        visited[s] = True
    
        while queue:
            u = queue.popleft()
            for e in graph[u]:
                if not visited[e.to] and e.cap - e.flow > 0:  # 잔여 용량 존재
                    visited[e.to] = True
                    parent[e.to] = (u, e)
                    if e.to == t:
                        return True  # 도착 정점까지 도달 성공
                    queue.append(e.to)
        return False
    
    def edmonds_karp(graph, s, t):
        """
        Edmonds-Karp 알고리즘 (BFS 기반 Ford-Fulkerson)
        :param graph: 인접 리스트 (각 요소는 Edge 객체 리스트)
        :param s: source 정점 번호
        :param t: sink 정점 번호
        :return: source에서 sink까지의 최대 유량
        """
        total_flow = 0
        n = len(graph)
    
        while True:
            parent = [None] * n  # 증가 경로 추적용
            if not bfs(graph, s, t, parent):
                break  # 증가 경로 없으면 종료
    
            # 증가 경로 상의 최소 잔여 용량 계산
            path_flow = float('inf')
            v = t
            while v != s:
                u, e = parent[v]
                path_flow = min(path_flow, e.cap - e.flow)
                v = u
    
            # 경로를 따라 유량 흘리기
            v = t
            while v != s:
                u, e = parent[v]
                e.flow += path_flow
                e.rev.flow -= path_flow  # 역방향 유량 보정
                v = u
    
            total_flow += path_flow  # 누적 유량 증가
    
        return total_flow
    
    ```
    
- 최대 유량 (디닉)
    
    ```python
    from collections import deque
    import sys
    
    class Dinic:
        def __init__(self, n):
            self.n = n  # 노드 수
            self.graph = [{} for _ in range(n)]  # 그래프: 인접 리스트 (dict: to -> capacity)
            self.level = [-1] * n  # BFS 레벨
            self.iter = [0] * n    # DFS 반복자
    
        def add_edge(self, fr, to, cap):
            # 양방향 에지 추가: fr -> to (cap), to -> fr (0, 역방향)
            self.graph[fr][to] = cap
            if to not in self.graph[fr]:
                self.graph[fr][to] = 0
            if fr not in self.graph[to]:
                self.graph[to][fr] = 0
    
        def bfs(self, s):
            # BFS로 레벨 그래프 구축
            self.level = [-1] * self.n
            self.level[s] = 0
            q = deque([s])
            while q:
                u = q.popleft()
                for v in self.graph[u]:
                    if self.graph[u][v] > 0 and self.level[v] < 0:  # 잔여 용량 > 0이고 방문 안 함
                        self.level[v] = self.level[u] + 1
                        q.append(v)
    
        def dfs(self, u, t, f):
            # DFS로 증강 경로 찾기
            if u == t:
                return f
            for v in list(self.graph[u].keys())[self.iter[u]:]:  # iter부터 탐색
                self.iter[u] += 1
                if self.level[u] < self.level[v] and self.graph[u][v] > 0:
                    d = self.dfs(v, t, min(f, self.graph[u][v]))
                    if d > 0:
                        self.graph[u][v] -= d  # 잔여 용량 업데이트
                        self.graph[v][u] += d  # 역방향 증가
                        return d
            return 0
    
        def max_flow(self, s, t):
            # 최대 유량 계산
            flow = 0
            while True:
                self.bfs(s)
                if self.level[t] < 0:  # 싱크 도달 불가
                    return flow
                self.iter = [0] * self.n
                while True:
                    f = self.dfs(s, t, sys.maxsize)  # 무한대 대신 sys.maxsize 사용
                    if f == 0:
                        break
                    flow += f
    
    # 사용 예시 (스켈레톤이므로 실제 그래프는 직접 추가)
    # dinic = Dinic(노드수)
    # dinic.add_edge(출발, 도착, 용량)
    # print(dinic.max_flow(소스, 싱크))
    ```
    
- 최소 비용 최대 유량 (음수 간선 존재)
    
    **O(F × E)** (평균) / **O(F × V × E)** (최악)
    
    ```python
    from collections import deque
    
    class Edge:
        def __init__(self, to, cap, cost):
            self.to = to        # 도착 정점
            self.cap = cap      # 용량
            self.cost = cost    # 단위 유량당 비용
            self.flow = 0       # 현재 유량
            self.rev = None     # 역방향 간선 (Edge 객체)
    
    def add_edge(graph, fr, to, cap, cost):
        """
        용량 cap, 비용 cost인 간선을 fr → to에 추가
        잔여 네트워크를 위해 to → fr 역방향도 함께 추가 (용량 0, 비용 -cost)
        """
        forward = Edge(to, cap, cost)
        backward = Edge(fr, 0, -cost)
        forward.rev = backward
        backward.rev = forward
        graph[fr].append(forward)
        graph[to].append(backward)
    
    def spfa(graph, s, t, dist, parent):
        """
        SPFA (Shortest Path Faster Algorithm)
        최소 비용 증가 경로를 찾음. parent[v] = (u, edge)
        """
        n = len(graph)
        in_queue = [False] * n
        dist[:] = [float('inf')] * n
        dist[s] = 0
        queue = deque([s])
        while queue:
            u = queue.popleft()
            in_queue[u] = False
            for e in graph[u]:
                if e.cap - e.flow > 0 and dist[e.to] > dist[u] + e.cost:
                    dist[e.to] = dist[u] + e.cost
                    parent[e.to] = (u, e)
                    if not in_queue[e.to]:
                        in_queue[e.to] = True
                        queue.append(e.to)
        return dist[t] != float('inf')
    
    def min_cost_max_flow(graph, s, t):
        """
        최소 비용 최대 유량 계산
        :param graph: 인접 리스트 (Edge 객체 리스트)
        :param s: source 정점
        :param t: sink 정점
        :return: (최대 유량, 최소 비용)
        """
        flow = 0
        cost = 0
        n = len(graph)
        dist = [0] * n
        parent = [None] * n
    
        while spfa(graph, s, t, dist, parent):
            # 가능한 최소 잔여 용량
            path_flow = float('inf')
            v = t
            while v != s:
                u, e = parent[v]
                path_flow = min(path_flow, e.cap - e.flow)
                v = u
    
            # 유량 흘리기
            v = t
            while v != s:
                u, e = parent[v]
                e.flow += path_flow
                e.rev.flow -= path_flow
                cost += path_flow * e.cost
                v = u
    
            flow += path_flow
    
        return flow, cost
    ```
    
- 최소 비용 최대 유량 (음수 간선 X)
    
    시간 복잡도 O(F * E log V)
    
    ```python
    from heapq import heappush, heappop
    
    class Edge:
        def __init__(self, to, cap, cost):
            self.to = to        # 도착 정점
            self.cap = cap      # 용량
            self.cost = cost    # 유량 당 비용
            self.flow = 0       # 현재 유량
            self.rev = None     # 역방향 간선 (Edge 객체)
    
    def add_edge(graph, fr, to, cap, cost):
        """
        용량이 cap, 비용이 cost인 간선 fr → to 추가 (잔여 그래프 포함)
        """
        forward = Edge(to, cap, cost)
        backward = Edge(fr, 0, -cost)
        forward.rev = backward
        backward.rev = forward
        graph[fr].append(forward)
        graph[to].append(backward)
    
    def dijkstra_with_potential(graph, s, t, dist, parent, potential):
        """
        다익스트라로 최소 비용 경로 탐색 (잠재력 보정 포함)
        :return: 도달 가능 여부
        """
        n = len(graph)
        dist[:] = [float('inf')] * n
        dist[s] = 0
        hq = [(0, s)]
        while hq:
            d, u = heappop(hq)
            if dist[u] < d:
                continue
            for e in graph[u]:
                if e.cap - e.flow > 0:
                    cost = e.cost + potential[u] - potential[e.to]
                    if dist[e.to] > dist[u] + cost:
                        dist[e.to] = dist[u] + cost
                        parent[e.to] = (u, e)
                        heappush(hq, (dist[e.to], e.to))
        return dist[t] != float('inf')
    
    def min_cost_max_flow_dijkstra(graph, s, t, maxf=float('inf')):
        """
        다익스트라 + Potential 기반 MCMF
        :return: (최대 유량, 최소 비용)
        """
        n = len(graph)
        potential = [0] * n
        dist = [0] * n
        parent = [None] * n
        total_flow = 0
        total_cost = 0
    
        while total_flow < maxf and dijkstra_with_potential(graph, s, t, dist, parent, potential):
            for i in range(n):
                if dist[i] < float('inf'):
                    potential[i] += dist[i]
    
            path_flow = maxf - total_flow
            v = t
            while v != s:
                u, e = parent[v]
                path_flow = min(path_flow, e.cap - e.flow)
                v = u
    
            v = t
            while v != s:
                u, e = parent[v]
                e.flow += path_flow
                e.rev.flow -= path_flow
                v = u
    
            total_flow += path_flow
            total_cost += path_flow * potential[t]
    
        return total_flow, total_cost
    
    ```
    
- 최소컷
    
    ```python
    from collections import deque
    import sys
    import copy  # 원본 그래프 저장을 위해 추가
    
    class Dinic:
        def __init__(self, n,s,t):
            self.n = n
            self.graph = [{} for _ in range(n)]
            self.original_graph = [{} for _ in range(n)]
            self.level = [-1] * n
            self.iter = [0] * n
            self.flow = -1
            self.t = t
            self.s = s
    
        def add_edge(self, fr, to, cap):
            self.graph[fr][to] = cap
            self.original_graph[fr][to] = cap
            if fr not in self.graph[to]:
                self.graph[to][fr] = 0
    
        def bfs(self, s):
            self.level = [-1] * self.n
            self.level[s] = 0
            q = deque([s])
            while q:
                u = q.popleft()
                for v, cap in self.graph[u].items():
                    if cap > 0 and self.level[v] < 0:
                        self.level[v] = self.level[u] + 1
                        q.append(v)
    
        def dfs(self, u, t, f):
            if u == t:
                return f
            neighbors = list(self.graph[u].keys())
            while self.iter[u] < len(neighbors):
                v = neighbors[self.iter[u]]
                if self.level[u] < self.level[v] and self.graph[u][v] > 0:
                    d = self.dfs(v, t, min(f, self.graph[u][v]))
                    if d > 0:
                        self.graph[u][v] -= d
                        self.graph[v][u] += d
                        return d
                self.iter[u] += 1
            return 0
    
        def max_flow(self, s, t):
            if self.flow != -1:
                return self.max_flow
            flow = 0
            while True:
                self.bfs(s)
                if self.level[t] < 0:
                    self.flow = flow
                    return flow
                self.iter = [0] * self.n
                while True:
                    f = self.dfs(s, t, sys.maxsize)
                    if f == 0:
                        break
                    flow += f
    
        def get_min_cut(self, s):
            if self.flow == -1:
                self.max_flow(s,self.t)
            reachable_nodes = {s}
            q = deque([s])
            visited = {s}
    
            while q:
                u = q.popleft()
                for v, cap in self.graph[u].items():
                    if cap > 0 and v not in visited:
                        visited.add(v)
                        reachable_nodes.add(v)
                        q.append(v)
            min_cut_edges = []
            for u in reachable_nodes:
                for v, cap in self.original_graph[u].items():
                    if v not in reachable_nodes and cap > 0:
                        min_cut_edges.append((u, v))
    
            return min_cut_edges
    
    # --- 사용 예시 ---
    # 노드 6개, 소스 0, 싱크 5
    n = 6
    s, t = 0, 5
    dinic = Dinic(n,s,t)
    
    # 원본 그래프 간선 추가
    dinic.add_edge(0, 1, 16)
    dinic.add_edge(0, 2, 13)
    dinic.add_edge(1, 2, 10)
    dinic.add_edge(1, 3, 12)
    dinic.add_edge(2, 1, 4)
    dinic.add_edge(2, 4, 14)
    dinic.add_edge(3, 2, 9)
    dinic.add_edge(3, 5, 20)
    dinic.add_edge(4, 3, 7)
    dinic.add_edge(4, 5, 4)
    
    # 1. 최대 유량 계산 (이것이 최소 컷의 용량)
    max_flow_value = dinic.max_flow(s, t)
    print(f"최대 유량 / 최소 컷 용량: {max_flow_value}")
    
    # 2. 최소 컷 간선 찾기
    min_cut_edges = dinic.get_min_cut(s)
    print(f"최소 컷을 구성하는 간선: {min_cut_edges}")
    ```
    

### 이분 매칭

- Hopcroft-Karp
    
    ```python
    from collections import deque
    
    def hopcroft_karp(graph,n = -1,m = -1):
        """
        Hopcroft-Karp 알고리즘 (최대 이분 매칭)
        :param graph: 왼쪽 정점 기준 인접 리스트 (graph[u] = [v1, v2, ...])
        :return: (최대 매칭 수, match_left 리스트)
        """
        n_left = n if n != -1 else len(graph)
        n_right = m if m != -1 else max((v for adj in graph for v in adj), default=-1) + 1
    
        match_left = [-1] * n_left
        match_to = [-1] * n_right
        level = [0] * n_left
    
        def bfs():
            queue = deque()
            for u in range(n_left):
                if match_left[u] == -1:
                    level[u] = 0
                    queue.append(u)
                else:
                    level[u] = float('inf')
            found = False
            while queue:
                u = queue.popleft()
                for v in graph[u]:
                    w = match_to[v]
                    if w == -1:
                        found = True
                    elif level[w] == float('inf'):
                        level[w] = level[u] + 1
                        queue.append(w)
            return found
    
        def dfs(u):
            for v in graph[u]:
                w = match_to[v]
                if w == -1 or (level[w] == level[u] + 1 and dfs(w)):
                    match_left[u] = v
                    match_to[v] = u
                    return True
            return False
    
        match_count = 0
        while bfs():
            for u in range(n_left):
                if match_left[u] == -1 and dfs(u):
                    match_count += 1
    
        return match_count, match_left
    
    ```
    

## 문자열

- KMP
    
    ```python
    def get_pi(pattern):
        n = len(pattern)
        pi = [0] * n
        j = 0  # 접두사의 길이
    
        for i in range(1, n):
            while j > 0 and pattern[i] != pattern[j]:
                j = pi[j - 1]
            if pattern[i] == pattern[j]:
                j += 1
                pi[i] = j
        return pi
    
    def kmp_search(text, pattern):
        pi = get_pi(pattern)
        n, m = len(text), len(pattern)
        j = 0  # 패턴 인덱스
        result = []
    
        for i in range(n):  # 텍스트 인덱스
            while j > 0 and text[i] != pattern[j]:
                j = pi[j - 1]
            if text[i] == pattern[j]:
                j += 1
                if j == m:
                    result.append(i - m + 1)  # 패턴이 끝까지 일치한 경우
                    j = pi[j - 1]  # 다음 일치를 위해 점프
        return result
    ```
    
- Aho - Corasick
    
    ```python
    from collections import deque
    
    class Node:
        def __init__(self):
            self.children = {}  # 자식 노드: {char: Node}
            self.fail = None  # Fail 포인터
            self.output = []  # 이 노드에서 끝나는 패턴 인덱스 리스트
    
    class AhoCorasick:
        def __init__(self):
            self.root = Node()
            self.root.fail = self.root  # 루트의 Fail은 자기 자신
            self.pattern_lengths = {}  # 패턴 인덱스: 길이 저장 dict 추가
    
        def add_pattern(self, pattern, id):
            # 패턴을 Trie에 삽입
            node = self.root
            for char in pattern:
                if char not in node.children:
                    node.children[char] = Node()
                node = node.children[char]
            node.output.append(id)  # 패턴 끝에 인덱스 추가
            self.pattern_lengths[id] = len(pattern)  # 패턴 길이 저장
    
        def build_fail(self):
            # BFS로 Fail 포인터 구축
            queue = deque()
            for child in self.root.children.values():
                child.fail = self.root
                queue.append(child)
    
            while queue:
                current = queue.popleft()
                for char, child in current.children.items():
                    fail = current.fail
                    while fail != self.root and char not in fail.children:
                        fail = fail.fail
                    if char in fail.children:
                        fail = fail.children[char]
                    child.fail = fail if fail != self.root or char in self.root.children else self.root
    
                    # 출력 링크: Fail의 output을 병합 (리스트 병합)
                    child.output = child.output + child.fail.output
    
                    queue.append(child)
    
        def search(self, text):
            # 텍스트에서 패턴 검색, 매칭 위치 반환
            node = self.root
            results = []  # (패턴 인덱스, 시작 위치) 리스트
            for i, char in enumerate(text):
                while node != self.root and char not in node.children:
                    node = node.fail
                if char in node.children:
                    node = node.children[char]
                else:
                    node = self.root  # 루트로 리셋
    
                for idx in node.output:
                    start_pos = i - self.pattern_lengths[idx] + 1
                    results.append((idx, start_pos))
            return results
    
    # 사용 예시
    # ac = AhoCorasick()
    # ac.add_pattern("pattern1", 0)
    # ac.add_pattern("pattern2", 1)
    # ac.build_fail()
    # results = ac.search("text to search")
    # print(results)
    ```
    
- Trie
    
    ```python
    import sys
    
    class TrieNode:
        def __init__(self):
            self.children = {}  # 자식 노드 딕셔너리 (문자: TrieNode)
            self.is_end_of_word = False  # 단어의 끝인지 표시
    
    class Trie:
        def __init__(self):
            self.root = TrieNode()  # 루트 노드 초기화
    
        def insert(self, word):
            node = self.root
            for char in word:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
            node.is_end_of_word = True  # 단어 끝 표시
    
        def search(self, word):
            node = self.root
            for char in word:
                if char not in node.children:
                    return False
                node = node.children[char]
            return node.is_end_of_word  # 단어 끝인지 확인
    
        def starts_with(self, prefix):
            node = self.root
            for char in prefix:
                if char not in node.children:
                    return False
                node = node.children[char]
            return True  # 접두사가 존재하는지 확인
    
        def delete(self, word):
            def _delete(node, word, depth):
                if depth == len(word):
                    if node.is_end_of_word:
                        node.is_end_of_word = False
                    return len(node.children) == 0
                char = word[depth]
                if char in node.children:
                    if _delete(node.children[char], word, depth + 1):
                        del node.children[char]
                        return len(node.children) == 0 and not node.is_end_of_word
                return False
            _delete(self.root, word, 0)
    
    if __name__ == "__main__":
        input = sys.stdin.readline
        trie = Trie()
        
        # 단어 삽입 예시
        words = ["apple", "app", "banana"]
        for word in words:
            trie.insert(word)
        
        # 검색 예시
        print(trie.search("apple"))  # True
        print(trie.search("ap"))     # False
        print(trie.starts_with("app"))  # True
        
        # 삭제 예시
        trie.delete("app")
        print(trie.search("app"))    # False
        print(trie.search("apple"))  # True (app 삭제 후에도 apple은 남음)
        
        # 사용자 입력으로 단어 검색
        query = input().strip()
        print(trie.search(query))
    ```
    
- Manacher
    
    ```python
    import sys
    
    input = sys.stdin.readline
    
    def manacher(s):
        # 문자열을 #으로 구분하여 홀수/짝수 팰린드롬 처리
        t = '^#' + '#'.join(s) + '#$'
        n = len(t)
        p = [0] * n  # 각 중심에서의 팰린드롬 반지름
        c = r = 0  # 현재 중심과 오른쪽 끝
        
        for i in range(1, n-1):
            # 대칭 위치의 값 활용
            if i < r:
                p[i] = min(r - i, p[2*c - i])
            
            # 팰린드롬 확장
            while t[i - p[i] - 1] == t[i + p[i] + 1]:
                p[i] += 1
            
            # 오른쪽 끝 업데이트
            if i + p[i] > r:
                c = i
                r = i + p[i]
        
        # 가장 긴 팰린드롬 길이 찾기
        max_len = max(p)
        return max_len
    
    # 입력 받기 (예: 첫 줄에 문자열)
    s = input().strip()
    print(manacher(s))
    ```
    

## DP

- CHT
    
    ```python
    class ConvexHullTrick:
        def __init__(self):
            self.hull = deque()
    
        def check(self, l1, l2, l3):
            return (l2[1] - l1[1]) * (l2[0] - l3[0]) >= (l3[1] - l2[1]) * (l1[0] - l2[0])
    
        def add(self, m, b):
            line = (m, b)
            while len(self.hull) >= 2 and self.check(self.hull[-2], self.hull[-1], line):
                self.hull.pop()
            self.hull.append(line)
    
        def get(self, line, x):
            return line[0] * x + line[1]
    
        def query(self, x):
            while len(self.hull) >= 2 and self.get(self.hull[0], x) >= self.get(self.hull[1], x):
                self.hull.popleft()
            return self.get(self.hull[0], x)
    ```
    

## 수학

- NTT
    
    ```python
    def cooley_tukey_ntt(a, gen, modulus):
        # 재귀적 Cooley-Tukey NTT
        if len(a) == 1:
            return a[:]
        # omegas precompute: gen^k % modulus
        omegas = [0] * len(a)
        omegas[0] = 1
        for i in range(1, len(omegas)):
            omegas[i] = omegas[i-1] * gen % modulus
        # 다음 레벨 gen: gen^2
        gen2 = pow(gen, 2, modulus)
        # 짝수/홀수 분할
        even = cooley_tukey_ntt(a[::2], gen2, modulus)
        odd = cooley_tukey_ntt(a[1::2], gen2, modulus)
        # butterfly 결합
        out = [0] * len(a)
        for k in range(len(a)//2):
            p = even[k]
            q = (omegas[k] * odd[k]) % modulus
            out[k] = (p + q) % modulus
            out[k + len(a)//2] = (p - q) % modulus
        return out
    
    def intt(a, gen, modulus):
        # iNTT: NTT with gen^{-1} 후 1/N 스케일링
        gen_inv = pow(gen, -1, modulus)
        res = cooley_tukey_ntt(a, gen_inv, modulus)
        N = len(a)
        N_inv = pow(N, -1, modulus)
        return [(x * N_inv) % modulus for x in res]
    
    # 예시 사용법
    mod = 17  # 소수 모듈로, 998244353 추천
    a = [1, 2, 3, 4, 5, 6, 7, 8]  # 길이 8 (2^3)
    gen = pow(3, 2, mod)  # 3은 16차 원시근, pow(3, 16/8, mod)=9 (8차 원시근)
    ntt_res = cooley_tukey_ntt(a, gen, mod)
    print("NTT 결과:", ntt_res)  # [2, 1, 12, 3, 13, 6, 14, 8]
    intt_res = intt(ntt_res, gen, mod)
    print("iNTT 결과:", intt_res)  # [1, 2, 3, 4, 5, 6, 7, 8]
    ```
    
- FFT
- Shoelace Formula
    
    ```python
    def shoelace_formula(points, n):
        # 넓이 계산을 위한 초기값
        area = 0.0
        # 신발끈 공식 적용
        for i in range(n):
            j = (i + 1) % n  # 다음 점 인덱스 (마지막 점은 첫 점과 연결)
            area += points[i][0] * points[j][1]
            area -= points[i][1] * points[j][0]
        # 절댓값 취하고 2로 나누기
        area = abs(area) / 2.0
        return area
    
    def main():
        # 예시: 단위 정사각형 좌표
        points = [(0, 0), (0, 1), (1, 1), (1, 0)]
        n = len(points)
        
        # 점의 개수 유효성 검사
        if n < 3:
            print("다각형은 최소 3개의 점이 필요합니다.")
            return
        
        # 넓이 계산
        result = shoelace_formula(points, n)
        
        # 결과 출력 (소수점 이하 1자리)
        print(f"다각형의 넓이: {result:.1f}")
    
    if __name__ == "__main__":
        main()
    ```
    
- Convex Hull
- Extended Euclidean
    
    ```python
    import sys
    
    input = sys.stdin.readline
    
    def extended_gcd(a, b):
        # 기본 케이스: b가 0이면 GCD는 a, x=1, y=0
        if b == 0:
            return a, 1, 0
        # 재귀 호출
        g, x1, y1 = extended_gcd(b, a % b)
        # x와 y 업데이트
        x = y1
        y = x1 - (a // b) * y1
        return g, x, y
    
    # 메인 부분: 두 정수 입력 받기
    a, b = map(int, input().split())
    g, x, y = extended_gcd(a, b)
    
    # 결과 출력 (GCD, x, y)
    print(g, x, y)
    ```
    
- Pollard's rho
    
    ```python
    import math
    import random
    import heapq
    
    n = int(input())
    basic_primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41}
    
    def power(x, y, p):
        res = 1
        x = x % p
        while y > 0:
            if y & 1:  # y가 홀수면
                res = res * x % p  # x와 곱하고 나머지 연산
            # y가 짝수이면
            y = y >> 1  # y /= 2
            x = (x * x) % p  # 거듭제곱 계산
        return res
    
    # 밀러-라빈 판정
    def miller_rabin(n, a):
        d = n - 1  # 홀수
        while d % 2 == 0:
            d //= 2  # 2^d*r+1
    
        x = power(a, d, n)  # a^{d} % n 계산
    
        if x == 1 or x == n - 1:  # x가 1 또는 n-1이면 소수
            return True
        while d != n - 1:  # n-1이 아닌 동안
            x = power(x, 2, n)  # x^{2} % n 계산
            d *= 2
            # x가 1이면 합성수이고 아니면 소수
            if x == 1:
                return False
            if x == n - 1:
                return True
        return False
    
    def isPrime(n):
        if n in basic_primes:  # 기본적으로 소수인 경우
            return True
        if n == 1 or n % 2 == 0:  # 1과 2의 배수는 소수가 아님
            return False
        for a in basic_primes:
            # long long 범위는 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41의 소수로 검사.
            # 37까지만 검사해도 됨
            # 성립하지 않아 false를 반환하면 아마도 소수가 아님 (not False = True)
            if not miller_rabin(n, a):
                return False
    
        return True
    
    def f(x,c,n):
        return (x**2 + c) % n
    
    def pollads_ro(n):
        # 1은 소수가 아님
        if n == 1:
            return 1
        # 2를 제외한 모든 짝수는 합성수에 해당
        if n % 2 == 0:
            return 2
        # 이미 소수라면 소인수에 해당 or N이 소수라면 자기 자신만이 소인수에 해당함.
        if isPrime(n):
            return n
        x = random.randrange(2,n)
        c = random.randrange(1,n)
        y = x
        g = 1
        # gcd != 1 소인수일 가능성이 있음
        # gcd(x-y,n) = gcd(30,81) = 3 즉 결정론적인 함수를 돌아서 나온 함숫값하고 최대공약수를 뽑았을 때
        # gcd 값이 1이 아니면 어쨋든 gcd 값인 인수는 있다는것 이게 소수이면 소인수
        while g == 1:
            # 폴라드 로의 자명한 결정론적 함수(x^2 + c)로 두개의 포인터 생성
            # x는 f(x) y=f(f(y)) 이렇게하면 속도가 다른 두개의 포인터가 사이클이 있는 결정론적 함수를 돌게 됨
            # 모듈러 n만 보고 있지만 이는 위에서 설명한 모듈러 d도 내포하고 있는것
            x = f(x,c,n)
            y = f(f(y,c,n),c,n)
            g = math.gcd(x-y,n)
            # g == n이라는 뜻은 x == y 라는뜻 두개의 포인터가 충돌했다는 뜻은 아마도 소인수에 해당하는 부분이 없다는것
            # 다시 폴라드-로 알고리즘을 돌 것
            if g == n:
                return pollads_ro(n)
        # 만약 g의 값이 소수가 아니라면 소인수는 아님으로 폴라드-로 알고리즘을 g의 값으로 다시 돌기
        # g가 N의 약수임으로 g의 약수 또한 N의 약수임
        if not isPrime(g):
            return pollads_ro(g)
        return g
    
    factor = []
    while n > 1:
        p = pollads_ro(n)
        n //= p
        heapq.heappush(factor, p)
    
    while factor:
        print(heapq.heappop(factor))
    ```
