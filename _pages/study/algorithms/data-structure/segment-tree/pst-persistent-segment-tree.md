---
title: "PST(Persistent Segment Tree)"
permalink: /study/algorithms/data-structure/segment-tree/pst-persistent-segment-tree/
toc: true
---

[상위 페이지 · Segment Tree](/study/algorithms/data-structure/segment-tree/)

PST는 세그먼트 트리의 각 버전을 모두 저장하여 과거의 상태를 조회할 수 있게 해주는 자료구조이다. 이는 각 쿼리마다 세그먼트 트리의 상태를 보존하면서 업데이트를 수행할 수 있다.

## 배경

일반적인 세그먼트 트리는 값이 업데이트될 때 이전 상태를 잃어버린다. 하지만 어떤 문제들은 특정 시점의 상태를 조회해야 하는 경우가 있다. PST는 이러한 문제를 해결하기 위해 고안되었다.

## 장단점

### 장점

- 모든 버전의 세그먼트 트리를 저장할 수 있다
- 각 업데이트마다 O(logN)의 추가 공간만 필요하다
- 과거 버전에 대한 쿼리를 효율적으로 처리할 수 있다

### 단점

- 구현이 복잡하다
- 메모리 사용량이 일반 세그먼트 트리보다 크다
- 초기 설정 시간이 더 필요하다

## 구현 (Python)

```python
class Node:
    def __init__(self, left=None, right=None, val=0):
        self.left = left
        self.right = right
        self.val = val

class PST:
    def __init__(self, arr):
        self.arr = arr
        self.n = len(arr)
        self.roots = []
        self.roots.append(self.build(0, self.n-1))
    
    def build(self, left, right):
        node = Node()
        if left == right:
            node.val = self.arr[left]
            return node
        
        mid = (left + right) // 2
        node.left = self.build(left, mid)
        node.right = self.build(mid+1, right)
        node.val = node.left.val + node.right.val
        return node
    
    def update(self, pos, val):
        self.roots.append(self._update(self.roots[-1], 0, self.n-1, pos, val))
    
    def _update(self, node, left, right, pos, val):
        if pos < left or pos > right:
            return node
        
        new_node = Node()
        if left == right:
            new_node.val = val
            return new_node
        
        mid = (left + right) // 2
        new_node.left = self._update(node.left, left, mid, pos, val)
        new_node.right = self._update(node.right, mid+1, right, pos, val)
        new_node.val = new_node.left.val + new_node.right.val
        return new_node
    
    def query(self, version, ql, qr):
        return self._query(self.roots[version], 0, self.n-1, ql, qr)
    
    def _query(self, node, left, right, ql, qr):
        if ql > right or qr < left:
            return 0
        if ql <= left and right <= qr:
            return node.val
            
        mid = (left + right) // 2
        return (self._query(node.left, left, mid, ql, qr) + 
                self._query(node.right, mid+1, right, ql, qr))

```

## 함수 설명

### 1. 초기화 및 Node 클래스

```python
class Node:
    def __init__(self, left=None, right=None, val=0):
        self.left = left
        self.right = right
        self.val = val

```

Node 클래스는 세그먼트 트리의 각 노드를 표현한다. 왼쪽 자식(left), 오른쪽 자식(right), 그리고 해당 노드의 값(val)을 저장한다.

### 2. build 함수

```python
def build(self, left, right):
    node = Node()
    if left == right:
        node.val = self.arr[left]
        return node
    
    mid = (left + right) // 2
    node.left = self.build(left, mid)
    node.right = self.build(mid+1, right)
    node.val = node.left.val + node.right.val
    return node

```

build 함수는 초기 세그먼트 트리를 구축한다. 리프 노드는 배열의 각 원소 값을 가지며, 내부 노드는 자식 노드들의 합을 저장한다.

### 3. update 함수

```python
def update(self, pos, val):
    self.roots.append(self._update(self.roots[-1], 0, self.n-1, pos, val))

```

update 함수는 새로운 버전의 세그먼트 트리를 생성하면서 특정 위치의 값을 업데이트한다. 이전 버전은 그대로 유지된다.

### 4. query 함수

```python
def query(self, version, ql, qr):
    return self._query(self.roots[version], 0, self.n-1, ql, qr)

```

query 함수는 특정 버전의 세그먼트 트리에서 주어진 범위의 합을 계산한다. version 매개변수를 통해 원하는 시점의 상태를 조회할 수 있다.

## 시간복잡도

- **build:** O(N) - 초기 트리 구축
- **update:** O(logN) - 한 경로의 노드들만 새로 생성
- **query:** O(logN) - 일반 세그먼트 트리와 동일
- **공간복잡도:** O(NlogN) - 각 업데이트마다 O(logN)개의 새로운 노드 생성

## 적용사례

- **시점별 구간 합 쿼리:** 배열의 특정 시점에서의 구간 합을 구하는 문제
- **K번째 수 찾기:** 특정 시점에서의 K번째 수를 찾는 문제
- **히스토리 관리:** 데이터 구조의 이전 상태를 보존해야 하는 문제
- **버전 관리:** 코드나 문서의 버전 관리 시스템 구현
