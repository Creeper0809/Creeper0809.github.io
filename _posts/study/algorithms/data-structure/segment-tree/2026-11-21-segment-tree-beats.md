---
title: "Segment Tree Beats"
permalink: /study/algorithms/data-structure/segment-tree/segment-tree-beats/
toc: true
excerpt: "세그먼트 트리 비츠(Segment Tree Beats)는 일반적인 세그먼트 트리에 여러 가지 고급 기능을 추가하여, 구간 최댓값·최솟값 제한(Chmin/Chmax), 구간 덧셈, 구간 합 등 복잡한 연산을 모두 효율적으로 처리할 수 있도록 만든 자료구조이다. 전통적인 세그먼트 트리에서는 구간에 값을 덮어씌우거나(Assign), 구간에 추가(Add), 구간 합(Query) 정도만을 지원하지만, 세그먼트 트리 비츠는 그보다 더 복잡한 조건(예: \"구간 [l, r] 내에서 x보다 큰 모든 값을 x로 바꾸고, 해당 구간의 합을 구한다\")을 모두 O(logN) 수준으로 수행할 수 있게"
---

[상위 페이지 · Segment Tree](/study/algorithms/data-structure/segment-tree/)

세그먼트 트리 비츠(Segment Tree Beats)는 일반적인 세그먼트 트리에 여러 가지 고급 기능을 추가하여, 구간 최댓값·최솟값 제한(Chmin/Chmax), 구간 덧셈, 구간 합 등 복잡한 연산을 모두 효율적으로 처리할 수 있도록 만든 자료구조이다. 전통적인 세그먼트 트리에서는 구간에 값을 덮어씌우거나(Assign), 구간에 추가(Add), 구간 합(Query) 정도만을 지원하지만, 세그먼트 트리 비츠는 그보다 더 복잡한 조건(예: "구간 [l, r] 내에서 x보다 큰 모든 값을 x로 바꾸고, 해당 구간의 합을 구한다")을 **모두** O(logN) 수준으로 수행할 수 있게 설계되었다.

세그먼트 트리 비츠의 핵심은 각 노드에 다음과 같은 정보를 추가로 저장하고, **브레이크 조건(Break Condition)**과 **태그 조건(Tag Condition)**을 정확하게 설계하여 불필요한 재귀 호출을 최소화하는 데 있다. 이를 통해 겉보기에는 복잡해 보이는 연산도 실질적인 연산 횟수를 낮추어 준다.

이는 당연하면서도 어려움으로 매우 자세히 설명하겠다.

## 1. 세그먼트 트리 비츠가 왜 필요한가?

일반적인 세그먼트 트리는 다음과 같은 연산을 지원한다:

- 구간 합(range_sum), 구간 최댓값/최솟값(range_max/range_min) 쿼리
- 구간 덮어씌우기(range_assign) 또는 구간 덧셈(range_add) 업데이트 (Lazy Propagation)

하지만 이를 확장하여 다음과 같은 작업을 효율적으로 처리하려면 전통적 세그먼트 트리로는 **O(N)** 수준의 최악 시간복잡도가 나오는 경우가 많다:

- **구간 [l, r] 내에서, 각 원소가 x보다 크면 x로 바꿈** (구간 Chmin)
- **구간 [l, r] 내에서, 각 원소가 x보다 작으면 x로 바꿈** (구간 Chmax)
- 복합적인 조건(예: 한 번에 Chmin, Chmax, Add, Query를 섞어 수행)

이를 해결하기 위해 "세그먼트 트리 비츠"라는 개념이 등장했다. 핵심 아이디어는 다음과 같다:

1. **각 구간(트리 노드)에 대해, 단순히 최댓값/최솟값/합뿐 아니라 "두 번째 최댓값(second max)"이나 "두 번째 최솟값(second min)"까지도 저장**하여, 구간 내에 어떤 값들이 위치하는지 더 세밀하게 파악한다.
2. **브레이크 조건(Break Condition)**: "이 구간 전체는 이미 x 이하(혹은 이미 x 이상)이므로 더 이상 재귀할 필요가 없다"라는 조건을 빠르게 판단하고, 자식 노드로 내려가는 것을 멈춘다.
3. **태그 조건(Tag Condition)**: "이 구간 전체의 최댓값을 x로 제한하면(Chmin) 구간 내 몇 개의 최댓값이 바뀌고, 합도 이만큼 차감된다"라며, 실제로 자식 노드들을 전부 방문하지 않고도 노드 하나만 조정해서 업데이트가 끝나도록 설계한다.

이 두 가지 조건을 잘 설계하면, 일반적인 Lazy Propagation만 사용하는 구간 업데이트보다 훨씬 다양한 유형의 업데이트를 **대략 O(logN)** 시간에 수행할 수 있게 된다.

---

## 2. 핵심 아이디어: Break Condition과 Tag Condition

### 2.1. Break Condition(브레이크 조건)

- **의미**: "이 노드는 이번 연산 범위에서 더 이상 내려가서 처리할 필요가 없다"고 판단되는 조건.
- **예시**: range_chmin(left, right, x)에서, 현재 노드의 구간 전체 최댓값(max_val[k])이 이미 x보다 작거나 같다면, "더 이상 이 구간에 Chmin을 적용할 필요가 없다."
    - 즉, if max_val[k] <= x: return이 대표적인 Break Condition이다.
- **장점**: 불필요한 재귀 호출을 막아줌으로써, 시간 복잡도를 크게 줄인다.

### 2.2. Tag Condition(태그 조건)

- **의미**: "현재 구간 전체가 범위 내에 포함되어 있고, 두 번째 최댓값(second max)이 x보다 작아서, 단순히 최댓값만 x로 낮추면 그 구간의 모든 원소가 x 이하가 된다"라는 조건.
- **예시**: if left <= l and r <= right and smax_val[k] < x:
    - 이때는 "이 구간에서 최댓값이 x보다 무조건 크고(조건이 성립해야지만 태그를 걸 수 있다), 두 번째 최댓값이 x보다 작기 때문에, 최댓값만 x로 바꾸면 된다."
    - 이렇게 하면 자식 노드를 탐색할 필요 없이, "구간 최댓값을 x로 변경하고, 바뀐 최댓값만큼 합에서 차감한다"고 간단히 처리한다.
- **장점**: 자식으로 내려가는 일이 없으므로, 연산 횟수가 추가로 들지 않는다.

---

## 3. 자료구조 구성

### 3.1. 항등원(Identity Element) 설명

세그먼트 트리 비츠에서는 여러 가지 값을 "결합 연산"할 때 사용할 항등원을 미리 정의해야 한다. 다음과 같다:

1. **최댓값의 항등원**: -∞ (float('-inf'))
    - 이유: 구간 내 최댓값을 구할 때, 아무 원소도 없는 구간(가상의 구간)을 표현하기 위한 값.
2. **두 번째 최댓값의 항등원**: -∞ (float('-inf'))
    - 이유: 구간 내에 진짜 두 번째로 큰 값이 없을 때, "비교 불가능"을 의미.
3. **최솟값의 항등원**: +∞ (float('inf'))
    - 이유: 구간 내 최솟값을 구할 때, 아무 원소도 없는 구간을 표현하기 위한 값.
4. **두 번째 최솟값의 항등원**: +∞ (float('inf'))
    - 이유: 구간 내에 진짜 두 번째로 작은 값이 없을 때, "비교 불가능"을 의미.
5. **구간 합의 항등원**: 0
    - 이유: 아무 원소도 없으면 합이 0이어야 한다.
6. **lazy_add의 항등원**: 0
    - 이유: 덧셈을 지연시킬 때, 더할 게 없으면 0을 사용한다.

### 3.2. 노드에 저장할 정보

세그먼트 트리 비츠는 단순히 최댓값·최솟값·합만 저장하는 것이 아니라, 아래 정보를 모두 저장해야 한다.

1. **max_val[k]**: 해당 노드(구간)의 최댓값
2. **smax_val[k]**: 해당 노드(구간)의 두 번째 최댓값
3. **max_cnt[k]**: 해당 노드 내에서 "최댓값이 등장하는 횟수"
4. **min_val[k]**: 해당 노드(구간)의 최솟값
5. **smin_val[k]**: 해당 노드(구간)의 두 번째 최솟값
6. **min_cnt[k]**: 해당 노드 내에서 "최솟값이 등장하는 횟수"
7. **sum_val[k]**: 해당 노드(구간)의 합
8. **lazy_add[k]**: 해당 노드(구간)에 지연시킬 덧셈 값 (Lazy Propagation)

이 정보를 통해서 "구간의 최댓값 제한(Chmin)", "구간의 최솟값 제한(Chmax)", "구간 덧셈(Add)", "구간 합(Query)" 등 모든 연산을 빠르게 구현할 수 있다.

---

## 4. 전체 코드 구현

아래는 Python으로 작성한 **세그먼트 트리 비츠**의 전체 코드이다. 이후 섹션에서 각 함수별로 상세히 설명한다.

```python
class SegmentTreeBeats:
    def __init__(self, arr):
        """
        초기화 함수. 길이가 N인 배열 arr를 받아 세그먼트 트리 비츠를 준비한다.
        """
        self.n = len(arr)
        # 세그먼트 트리의 실제 크기를 구하기 위해, N에 대한 2의 제곱수 크기로 확장
        self.size = 1 << (self.n - 1).bit_length()
        
        # 각 배열은 1번 인덱스부터 사용하며, 총 2 * size 크기로 선언
        INF = float('inf')
        N_INF = float('-inf')
        
        # 최댓값, 두 번째 최댓값, 최댓값 등장 횟수
        self.max_val   = [N_INF] * (2 * self.size)
        self.smax_val  = [N_INF] * (2 * self.size)
        self.max_cnt   = [0] * (2 * self.size)
        
        # 최솟값, 두 번째 최솟값, 최솟값 등장 횟수
        self.min_val   = [INF] * (2 * self.size)
        self.smin_val  = [INF] * (2 * self.size)
        self.min_cnt   = [0] * (2 * self.size)
        
        # 구간 합
        self.sum_val   = [0] * (2 * self.size)
        
        # Lazy Propagation을 위한 덧셈 태그
        self.lazy_add  = [0] * (2 * self.size)
        
        # 리프 노드(트리의 가장 하단)에 실제 배열 값 반영
        for i in range(self.n):
            v = arr[i]
            idx = self.size + i
            self.max_val[idx] = v
            self.min_val[idx] = v
            self.sum_val[idx] = v
            self.max_cnt[idx] = 1
            self.min_cnt[idx] = 1
        
        # 나머지 리프(빈 구간)은 항등원으로 초기화되어 있으므로, 별도 작업 불필요
        # 내부 노드 값을 부모로부터 갱신
        for i in range(self.size - 1, 0, -1):
            self._update(i)
    
    
    def _update(self, k):
        """
        idx = k인 노드의 정보를 자식 노드 2*k, 2*k+1 정보를 합쳐서 갱신한다.
        """
        left = 2 * k
        right = 2 * k + 1
        
        # ========== 최대값 정보 갱신 ==========
        if self.max_val[left] == self.max_val[right]:
            # 두 자식의 최댓값이 같으면, 현재 노드 최댓값은 동일하고,
            # 등장 횟수를 합치며, 두 번째 최댓값은 자식들의 두 번째 최댓값 중 큰 값
            self.max_val[k] = self.max_val[left]
            self.max_cnt[k] = self.max_cnt[left] + self.max_cnt[right]
            self.smax_val[k] = max(self.smax_val[left], self.smax_val[right])
        elif self.max_val[left] > self.max_val[right]:
            # 왼쪽 자식이 더 큰 경우
            self.max_val[k] = self.max_val[left]
            self.max_cnt[k] = self.max_cnt[left]
            # 두 번째 최댓값은 왼쪽 자식의 두 번째 최댓값과 오른쪽 자식의 최댓값 중 더 큰 값
            self.smax_val[k] = max(self.smax_val[left], self.max_val[right])
        else:
            # 오른쪽 자식이 더 큰 경우
            self.max_val[k] = self.max_val[right]
            self.max_cnt[k] = self.max_cnt[right]
            # 두 번째 최댓값은 오른쪽 자식의 두 번째 값과 왼쪽 자식의 최댓값 중 더 큰 값
            self.smax_val[k] = max(self.max_val[left], self.smax_val[right])
        
        # ========== 최솟값 정보 갱신 ==========
        if self.min_val[left] == self.min_val[right]:
            self.min_val[k] = self.min_val[left]
            self.min_cnt[k] = self.min_cnt[left] + self.min_cnt[right]
            self.smin_val[k] = min(self.smin_val[left], self.smin_val[right])
        elif self.min_val[left] < self.min_val[right]:
            self.min_val[k] = self.min_val[left]
            self.min_cnt[k] = self.min_cnt[left]
            self.smin_val[k] = min(self.smin_val[left], self.min_val[right])
        else:
            self.min_val[k] = self.min_val[right]
            self.min_cnt[k] = self.min_cnt[right]
            self.smin_val[k] = min(self.min_val[left], self.smin_val[right])
        
        # ========== 구간 합 갱신 ==========
        self.sum_val[k] = self.sum_val[left] + self.sum_val[right]
    
    
    def _propagate(self, k, left, right):
        """
        Lazy Propagation 처리 함수. idx = k인 노드에 lazy_add[k]가 남아 있으면, 실제 노드 정보와 자식 노드에 전파한다.
        
        (left, right)는 해당 노드 k가 담당하는 구간의 범위 [left, right)이다.
        """
        # 1) Lazy 값이 0이면 아무 작업도 하지 않음
        if self.lazy_add[k] == 0:
            return
        
        add_val = self.lazy_add[k]
        
        # 2) 자식이 존재하면, 자식들에게 lazy_add를 전파
        if k < self.size:  # 내부 노드라면
            self.lazy_add[2*k]   += add_val
            self.lazy_add[2*k+1] += add_val
        
        # 3) 현재 노드의 정보에 'add_val'만큼 증가 적용
        # 최댓값, 두 번째 최댓값
        if self.max_val[k] != float('-inf'):
            self.max_val[k]  += add_val
        if self.smax_val[k] != float('-inf'):
            self.smax_val[k] += add_val
        
        # 최솟값, 두 번째 최솟값
        if self.min_val[k] != float('inf'):
            self.min_val[k]  += add_val
        if self.smin_val[k] != float('inf'):
            self.smin_val[k] += add_val
        
        # 구간 합: (right - left)만큼 모든 원소가 add_val씩 증가
        self.sum_val[k] += add_val * (right - left)
        
        # 4) lazy_add[k]를 0으로 초기화
        self.lazy_add[k] = 0
    
    
    def range_chmin(self, left, right, x, k=1, l=0, r=None):
        """
        구간 [left, right) 내 모든 원소에 대해, 만약 원소 > x라면 원소를 x로 바꾼다 (Chmin).
        k: 현재 노드 번호, l~r: 현재 노드가 담당하는 구간 [l, r)
        """
        if r is None:
            r = self.size
        
        # ==== Break Condition 1: 구간이 겹치지 않을 때 ====
        if right <= l or r <= left:
            return
        
        # ==== Break Condition 2: 이미 이 구간 전체의 최댓값이 x 이하일 때 ====
        if self.max_val[k] <= x:
            return
        
        # ==== Tag Condition: 현재 구간이 완전 포함되면서, 두 번째 최댓값 < x일 때 ====
        if left <= l and r <= right and self.smax_val[k] < x:
            # 이 구간의 최대값은 self.max_val[k]이고, 두 번째 최대값은 self.smax_val[k]
            # 두 번째 최대값 < x < 현재 최대값 이므로, 이 구간 내 최댓값만 x로 낮추면 된다.
            diff = self.max_val[k] - x
            # 구간 내 최댓값은 x가 되고,
            self.max_val[k] = x
            # 구간 합에서는 (diff * 최댓값 등장 횟수)만큼 차감
            self.sum_val[k] -= diff * self.max_cnt[k]
            # 실제로, 이 시점에서 children에게 퍼트릴 필요 없이 'max_val'만 낮추면 된다.
            return
        
        # 일반 케이스: lazy 값이 있으면 먼저 전파하고, 자식으로 내려간 뒤 갱신
        self._propagate(k, l, r)
        mid = (l + r) // 2
        self.range_chmin(left, right, x, 2*k,   l,   mid)
        self.range_chmin(left, right, x, 2*k+1, mid, r)
        self._update(k)
    
    
    def range_add(self, left, right, x, k=1, l=0, r=None):
        """
        구간 [left, right) 내 모든 원소에 x를 더한다 (Add).
        k: 현재 노드 번호, l~r: 현재 노드가 담당하는 구간 [l, r)
        """
        if r is None:
            r = self.size
        
        # ==== Break Condition: 구간이 겹치지 않을 때 ====
        if right <= l or r <= left:
            return
        
        # ==== Tag Condition: 현재 노드 구간이 [left, right)에 완전 포함될 때 ====
        if left <= l and r <= right:
            self.lazy_add[k] += x
            # lazy_add가 쌓였으므로 직접 적용
            self._propagate(k, l, r)
            return
        
        # 일반 케이스: lazy 값을 전파한 뒤, 자식으로 내려가서 갱신
        self._propagate(k, l, r)
        mid = (l + r) // 2
        self.range_add(left, right, x, 2*k,   l,   mid)
        self.range_add(left, right, x, 2*k+1, mid, r)
        self._update(k)
    
    
    def range_sum(self, left, right, k=1, l=0, r=None):
        """
        구간 [left, right)의 합을 반환한다 (Query).
        k: 현재 노드 번호, l~r: 현재 노드가 담당하는 구간 [l, r)
        """
        if r is None:
            r = self.size
        
        # ==== Break Condition: 구간이 겹치지 않을 때 ====
        if right <= l or r <= left:
            return 0
        
        # lazy가 남아 있으면 전파
        self._propagate(k, l, r)
        
        # 현재 노드 구간이 완전히 포함될 때
        if left <= l and r <= right:
            return self.sum_val[k]
        
        # 그렇지 않으면 자식 노드로 합산
        mid = (l + r) // 2
        s1 = self.range_sum(left, right, 2*k,   l,   mid)
        s2 = self.range_sum(left, right, 2*k+1, mid, r)
        return s1 + s2

```

## 5. 각 함수별 상세 설명

아래 섹션에서는 위 코드에서 사용된 각 함수를 하나씩 떼어내어 왜 그렇게 구현했는지, 특히 Break Condition과 Tag Condition을 중심으로 자세히 풀이한다.
5.1. init 내부 로직 분석

```python
def __init__(self, arr):
    self.n = len(arr)
    self.size = 1 << (self.n - 1).bit_length()
    INF = float('inf')
    N_INF = float('-inf')
    
    self.max_val   = [N_INF] * (2 * self.size)
    self.smax_val  = [N_INF] * (2 * self.size)
    self.max_cnt   = [0] * (2 * self.size)
    self.min_val   = [INF] * (2 * self.size)
    self.smin_val  = [INF] * (2 * self.size)
    self.min_cnt   = [0] * (2 * self.size)
    self.sum_val   = [0] * (2 * self.size)
    self.lazy_add  = [0] * (2 * self.size)
    
    for i in range(self.n):
        v = arr[i]
        idx = self.size + i
        self.max_val[idx] = v
        self.min_val[idx] = v
        self.sum_val[idx] = v
        self.max_cnt[idx] = 1
        self.min_cnt[idx] = 1
    
    for i in range(self.size - 1, 0, -1):
        self._update(i)

```

1. size 계산
    - 원래 배열 길이 n보다 같거나 큰, 가장 작은 2의 제곱수 크기를 구한다.
    - 예를 들어 n = 5라면 size = 8(=2³)가 된다.
    - 이를 통해 트리의 깊이 균형을 맞추고, 내부 인덱스 계산을 쉽게 한다.
2. 각 배열 초기화
    - max_val, smax_val, min_val, smin_val 등의 배열 크기를 2 × size로 선언한다.
    - 이는 "1번 인덱스"부터 트리의 루트가 k = 1이고, 마지막 리프는 size + (size-1)까지 사용하기 위함이다.
3. 리프 노드(하단)에 원소 삽입
    - 실제 배열 arr의 값들을 "트리의 리프(subarray 규모 1인 구간)"로 복사한다.
    - 인덱스 idx = size + i에 arr[i] 값을 대입하며,
        - max_val[idx] = v, min_val[idx] = v, sum_val[idx] = v
        - 동시에 max_cnt[idx] = 1, min_cnt[idx] = 1로 설정한다.
    - 리프 외 공간(나머지 인덱스)는 이미 항등원으로 초기화되어 있으므로 신경 쓸 필요가 없다.
4. 내부 노드 값 갱신
    - 리프 노드를 전부 채운 뒤, 위로 올라가며 부모 노드의 정보를 갱신한다.
    - for i in range(self.size - 1, 0, -1): self._update(i) 반복을 통해,
        - 각 내부 노드 i가 자식 노드 2×i와 2×i+1의 정보를 보고 합치는 과정을 수행한다.

이 단계가 끝나면 배열 전체에 대한 세그먼트 트리 비츠의 초기 정보가 준비된다.

---

### 5.2. update의 Break Condition, Tag Condition

```python
def _update(self, k):
    left = 2 * k
    right = 2 * k + 1
    
    # ======= 최댓값 정보 갱신 =======
    if self.max_val[left] == self.max_val[right]:
        self.max_val[k] = self.max_val[left]
        self.max_cnt[k] = self.max_cnt[left] + self.max_cnt[right]
        self.smax_val[k] = max(self.smax_val[left], self.smax_val[right])
    elif self.max_val[left] > self.max_val[right]:
        self.max_val[k] = self.max_val[left]
        self.max_cnt[k] = self.max_cnt[left]
        self.smax_val[k] = max(self.smax_val[left], self.max_val[right])
    else:
        self.max_val[k] = self.max_val[right]
        self.max_cnt[k] = self.max_cnt[right]
        self.smax_val[k] = max(self.max_val[left], self.smax_val[right])
    
    # ======= 최솟값 정보 갱신 =======
    if self.min_val[left] == self.min_val[right]:
        self.min_val[k] = self.min_val[left]
        self.min_cnt[k] = self.min_cnt[left] + self.min_cnt[right]
        self.smin_val[k] = min(self.smin_val[left], self.smin_val[right])
    elif self.min_val[left] < self.min_val[right]:
        self.min_val[k] = self.min_val[left]
        self.min_cnt[k] = self.min_cnt[left]
        self.smin_val[k] = min(self.smin_val[left], self.min_val[right])
    else:
        self.min_val[k] = self.min_val[right]
        self.min_cnt[k] = self.min_cnt[right]
        self.smin_val[k] = min(self.min_val[left], self.smin_val[right])
    
    # ======= 구간 합 정보 갱신 =======
    self.sum_val[k] = self.sum_val[left] + self.sum_val[right]

```

**목적**: 자식 노드(왼쪽 left = 2*k, 오른쪽 right = 2*k+1)의 정보를 종합하여 부모 노드 k의 정보를 갱신한다.

(단, Lazy Propagation으로 미처 적용되지 않은 값이 있으면, _update 호출 전 반드시 _propagate가 먼저 실행되어 있거나, 자식 노드 값이 실제 최신 상태여야 한다.)

**최대값 정보 갱신**

1. **max_val[left] == max_val[right]**
    - 두 자식 노드의 최댓값이 같다면,
        - 부모 노드의 최댓값(max_val[k])도 그 값이고,
        - 최댓값 등장 횟수(max_cnt[k])는 두 자식이 가진 등장 횟수를 합친다.
        - 두 번째 최댓값(smax_val[k])은 "자식들의 두 번째 최댓값 중 큰 것"으로 결정한다.
            - 왜냐하면, **만약 두 자식이 같은 최댓값을 가지면**, 부모 노드에선 이 최댓값이 2번 이상 등장하므로 "두 번째로 큰 값"은 자식들이 갖고 있는 **"두 번째로 큰 값들"** 중 큰 쪽이 된다.
2. **max_val[left] > max_val[right]**
    - 왼쪽 자식 구간의 최댓값이 더 클 때,
        - 부모 노드 최댓값(max_val[k])은 max_val[left]이고,
        - 등장 횟수(max_cnt[k])는 왼쪽 자식 쪽 등장 횟수(max_cnt[left])와 같다.
        - 두 번째 최댓값(smax_val[k])은 "왼쪽 자식의 두 번째 최댓값 vs 오른쪽 자식의 최댓값 중 큰 값"을 선택한다.
            - 이유는, 부모 구간에서 실제로 두 번째로 큰 값은 "왼쪽 자식 구간 내 두 번째로 큰 값" 혹은 "오른쪽 자식의 최댓값" 중 **더 큰 값**이기 때문이다.
3. **max_val[left] < max_val[right]**
    - 오른쪽 자식 구간의 최댓값이 더 클 때,
        - max_val[k] = max_val[right], max_cnt[k] = max_cnt[right]
        - smax_val[k] = max(max_val[left], smax_val[right])
            - 즉, 두 번째 최댓값은 왼쪽 자식의 최댓값 혹은 오른쪽 자식의 두 번째 최댓값 중 큰 쪽.

**최솟값 정보 갱신**

- 최대값과 **정확히 반대로**, 최솟값을 찾는다.
1. **min_val[left] == min_val[right]**
    - 부모 노드의 min_val[k] = min_val[left]
    - min_cnt[k] = min_cnt[left] + min_cnt[right]
    - smin_val[k] = min(smin_val[left], smin_val[right])
        - 두 자식의 최솟값이 같으면, 부모 구간에서 이 최솟값이 2개 이상 존재하므로, "두 번째 최솟값"은 자식들의 두 번째 최솟값 중 작은 값이 된다.
2. **min_val[left] < min_val[right]**
    - min_val[k] = min_val[left], min_cnt[k] = min_cnt[left]
    - smin_val[k] = min(smin_val[left], min_val[right])
        - 왼쪽이 더 작은 경우, 부모의 두 번째 최솟값은 "왼쪽 자식의 두 번째 최솟값" vs "오른쪽 자식의 최솟값" 중 작은 값.
3. **min_val[left] > min_val[right]**
    - min_val[k] = min_val[right], min_cnt[k] = min_cnt[right]
    - smin_val[k] = min(min_val[left], smin_val[right])

**구간 합 정보 갱신**

- sum_val[k] = sum_val[left] + sum_val[right]
    - 단순히 두 자식 구간의 합을 합산하면 부모 구간의 합이 된다.

> 요약: _update(k)는 "브레이크/태그"와는 무관하게, 자식 노드들이 최신 상태(모든 lazy 값이 전파된 상태)일 때, 부모 노드를 올바르게 갱신해 주는 역할만 수행한다.
> 

### 5.3. propagate의 역할과 구현 의도

```python
def _propagate(self, k, left, right):
    if self.lazy_add[k] == 0:
        return
    
    add_val = self.lazy_add[k]
    
    # 부모 노드일 경우 자식 노드에 태그 전파
    if k < self.size:
        self.lazy_add[2*k]   += add_val
        self.lazy_add[2*k+1] += add_val
    
    # 현재 노드의 모든 값에 add_val을 적용:
    # 최댓값, 두 번째 최댓값
    if self.max_val[k] != float('-inf'):
        self.max_val[k]  += add_val
    if self.smax_val[k] != float('-inf'):
        self.smax_val[k] += add_val
    
    # 최솟값, 두 번째 최솟값
    if self.min_val[k] != float('inf'):
        self.min_val[k]  += add_val
    if self.smin_val[k] != float('inf'):
        self.smin_val[k] += add_val
    
    # 구간 합: (right - left) * add_val 만큼 증가
    self.sum_val[k] += add_val * (right - left)
    
    # lazy_add 초기화
    self.lazy_add[k] = 0

```

propagate 함수는 구간 덧셈(range_add) 연산을 처리하거나, 어떤 연산 도중에 "이 노드에 lazy_add 태그가 남아 있는지" 확인할 때 사용된다. 주요 역할은 다음과 같다.

1. **Tag Condition 수행**
    - 만약 lazy_add[k] ≠ 0이면, 이 노드 구간에는 아직 "덧셈"이 적용되지 않은 상태라는 뜻이다.
    - 이때, 자식 노드(2×k, 2×k+1)에게도 동일한 lazy_add 값을 전달해야 한다.
2. **현재 노드 정보 갱신**
    - max_val, smax_val, min_val, smin_val, sum_val 등 **모든** 값에 대해 "덧셈(add_val)"을 적용해 준다.
    - 특히, smax_val[k] 또는 smin_val[k]이 항등원(여기서는 ∞ 혹은 +∞)이라면, 더하지 않아야 한다.
        - 이유: 아직 구간에 원소가 존재하지 않아 "두 번째 최댓값" 자체가 유효하지 않은 경우를 피하기 위해서이다.
    - sum_val[k]는 "구간 내 원소의 합"이므로, "모든 원소가 add_val씩 증가"하면 add_val × (구간 크기)만큼 합이 증가한다.
        - 구간 크기는 (right - left)이다. (구간을 반개씩 쪼개면서 넘겨주므로 항상 정확하게 계산된다.)
3. **Lazy 태그 초기화**
    - "지금 이 노드의 정보를 모두 적용했으니, 더 이상 lazy_add[k]는 없어야 한다"는 의미로 lazy_add[k] = 0을 해준다.

> 주의: propagate는 "현재 노드에 저장된 Lazy 태그를 실제 값에 반영하고, 자식에게도 똑같이 태그를 넘기는" 역할을 하므로, 갱신 시 먼저 propagate를 호출하여 자식들의 값이 모두 최신 상태가 되도록 해야 올바른 업데이트와 쿼리를 보장할 수 있다.
> 

### 5.4. range_chmin에서의 Break Condition과 Tag Condition

```python
def range_chmin(self, left, right, x, k=1, l=0, r=None):
    if r is None:
        r = self.size
    
    # ===== Break Condition 1: 구간이 겹치지 않을 때 =====
    if right <= l or r <= left:
        return
    
    # ===== Break Condition 2: 이미 이 구간의 최대값이 x 이하일 때 =====
    if self.max_val[k] <= x:
        return
    
    # ===== Tag Condition: 구간이 완전 포함 && 두 번째 최대값 < x =====
    if left <= l and r <= right and self.smax_val[k] < x:
        diff = self.max_val[k] - x
        self.max_val[k] = x
        self.sum_val[k] -= diff * self.max_cnt[k]
        return
    
    # 일반 케이스: lazy가 있으면 전파하고, 자식으로 내려가며 처리
    self._propagate(k, l, r)
    mid = (l + r) // 2
    self.range_chmin(left, right, x, 2*k,   l,   mid)
    self.range_chmin(left, right, x, 2*k+1, mid, r)
    self._update(k)

```

range_chmin(left, right, x)는 "구간 [left, right)의 모든 원소 중, 만약 x보다 큰 값이 있다면 그 값을 x로 바꾸라"는 연산이다.

**Break Condition 1: "구간이 겹치지 않을 때"**

- if right ≤ l or r ≤ left: return
    - 현재 노드가 담당하는 구간이 [l, r)이고, 우리가 원하는 연산 범위는 [left, right)이다.
    - **두 구간이 겹치지 않으면 아무 작업도 할 필요가 없으므로 즉시 반환**한다.
    

**Break Condition 2: "이미 이 구간의 최대값이 x 이하일 때"**

- if max_val[k] ≤ x: return
    - 현재 노드가 담당하는 구간 전체의 **최댓값**(max_val[k])이 이미 x 이하라는 것은, "이 구간에는 x보다 큰 값이 하나도 없다"는 의미이다.
    - 그러므로 이 구간의 모든 원소는 이미 x 이하 상태이므로, 굳이 내려가서 자식들을 볼 이유가 없고, 바로 반환한다.
    - **효과**: 매우 강력한 가지치기(Pruning)가 된다. 많은 연산을 줄여 주므로 시간복잡도가 줄어든다.
    

**Tag Condition: "완전히 포함 && 두 번째 최대값 < x"**

- if left ≤ l and r ≤ right and smax_val[k] < x:
    - "현재 노드 구간 [l, r)가 완전히 연산 범위 [left, right) 안에 들어오고"
    - "이 구간에서 **두 번째 최댓값**(smax_val[k])이 x보다 작다" (즉, 이 구간에서 최댓값만 x보다 크고, 그 다음으로 큰 값은 이미 x보다 작다)
    - 이 두 가지가 모두 참이면, **이 구간 내에서 '가장 큰 값'을 모두 x로 낮추면**
        - "원래 구간의 최댓값 = max_val[k]"에서
        - "max_cnt[k]개만큼의 값이 x 이하로 낮아지는데"
        - 그만큼 구간 합 sum_val[k]에서 diff = (max_val[k] - x) × max_cnt[k]만큼 차감해 주면,
    - **자식 노드를 탐색하지 않고도** 구간 전체를 올바르게 처리할 수 있다.
    - 따라서, 단순히
        
        ```python
        diff = self.max_val[k] - x
        self.max_val[k] = x
        self.sum_val[k] -= diff * self.max_cnt[k]
        ```
        
        와 같이 적용하고 **즉시 반환**한다.
        
- **효과**: 재귀 호출 비용을 획기적으로 줄인다.

**일반 케이스**

- 위 두 가지 조건을 만족하지 않으면,
    1. propagate(k, l, r)로 Lazy Propagation이 남아 있으면 먼저 적용한다.
    2. 구간을 절반으로 나눠서, 왼쪽 자식(2×k)과 오른쪽 자식(2×k+1)에 재귀 호출을 보낸다.
    3. 두 자식이 모두 갱신된 후에는 update(k)를 통해 부모 노드를 다시 갱신한다.

---

### 5.5. range_add에서의 Break Condition과 Tag Condition

```python
def range_add(self, left, right, x, k=1, l=0, r=None):
    if r is None:
        r = self.size
    
    # ===== Break Condition: 구간이 겹치지 않을 때 =====
    if right <= l or r <= left:
        return
    
    # ===== Tag Condition: 완전 포함되면 바로 lazy 적용 =====
    if left <= l and r <= right:
        self.lazy_add[k] += x
        self._propagate(k, l, r)
        return
    
    # 일반 케이스: propagate 후 자식 노드로 재귀
    self._propagate(k, l, r)
    mid = (l + r) // 2
    self.range_add(left, right, x, 2*k,   l,   mid)
    self.range_add(left, right, x, 2*k+1, mid, r)
    self._update(k)

```

range_add(left, right, x)는 "구간 [left, right) 내 모든 원소에 x를 더하라"는 연산이다.

**Break Condition: "구간이 겹치지 않을 때"**

- if right ≤ l or r ≤ left: return
    - range_chmin과 동일하게, 두 구간이 겹치지 않으면 아무 작업도 하지 않고 반환.
    

**Tag Condition: "구간이 완전히 포함될 때"**

- if left ≤ l and r ≤ right:
    - 현재 노드 구간 [l, r)가 연산 범위 [left, right)에 **완전히 들어온 상태**라면,
    - 이 구간에 덧셈 x만큼을 지연태그(Lazy)로 붙여 놓으면 된다.
    - 따라서, self.lazy_add[k] += x로 lazy 태그를 쌓고, self._propagate(k, l, r)을 통해 실제 노드 값(최댓값, 최솟값, 합 등)에 적용한다.
        - (lazy 태그를 전파하자마자 바로 적용해도 되고, 다음 자식 탐색 때 적용해도 무방하다.)
    - 자식 노드를 굳이 방문할 필요가 없으므로 return하여 종료한다.
    

**일반 케이스**

- "완전히 포함되지 않은, 즉 구간이 일부 겹치는 경우"라면:
    1. self._propagate(k, l, r)로 현재 노드에 남아 있는 lazy를 먼저 처리한다.
    2. 중간 지점 mid = (l + r)/2를 계산하여 왼쪽 자식 및 오른쪽 자식에 각각 range_add 재귀 호출을 보낸다.
    3. 자식들이 다 갱신된 뒤 self._update(k)로 부모 노드를 갱신한다.

### 5.6. range_sum의 동작 메커니즘

```python
def range_sum(self, left, right, k=1, l=0, r=None):
    if r is None:
        r = self.size
    
    # ==== Break Condition: 구간이 겹치지 않을 때 ====
    if right <= l or r <= left:
        return 0
    
    # lazy가 남아 있으면 전파
    self._propagate(k, l, r)
    
    # ==== 구간이 완전 포함될 때 ====
    if left <= l and r <= right:
        return self.sum_val[k]
    
    # 부분 겹침: 자식으로 쪼개서 합산
    mid = (l + r) // 2
    s1 = self.range_sum(left, right, 2*k,   l,   mid)
    s2 = self.range_sum(left, right, 2*k+1, mid, r)
    return s1 + s2
```

range_sum(left, right)는 "구간 [left, right)의 합을 구하라"는 가장 기본적인 쿼리이다.

1. **Break Condition: 겹치지 않을 때**
    - if right ≤ l or r ≤ left: return 0
    - 아무런 기여도 없는 부분이므로, 0을 반환.
2. **Lazy 전파**
    - self._propagate(k, l, r)
    - 만약 이전에 range_add, range_chmin 등에서 lazy 태그(lazy_add[k])가 남아 있다면, 그 태그를 먼저 이 노드에 적용하고 자식에게도 전파해 주어야 한다.
    - 그래야 sum_val[k]가 최신 상태가 된다.
3. **완전 포함 구간**
    - if left ≤ l and r ≤ right: return self.sum_val[k]
    - 현재 노드 구간이 요청 구간에 완전히 포함되면, 이 노드가 기억하고 있는 sum_val[k]를 바로 반환한다.
4. **부분 겹침**
    - mid = (l + r)/2
    - 왼쪽 자식(2k)과 오른쪽 자식(2k+1)에 각각 range_sum을 재귀 호출하여 합을 구하고, 더해서 반환한다.

---

## 6. 예시를 통한 동작 이해

이제 작은 배열에 대한 예시를 통해, 위 코드가 어떻게 동작하는지 단계별로 살펴보자.

예시 배열: [5, 3, 8, 7] (인덱스 0부터 3까지)

트리 구조(가장 작은 2의 제곱수 크기는 4)로 보면, 세그먼트 트리 레벨 구성은 다음과 같다.

```json
인덱스:           1
             /        \
            2          3
          /   \      /   \
         4     5    6     7
        / \   / \  / \   / \
(리프단)8  9 10 11 12 13 14 15

```

- 실제 값 할당은 size = 4이므로 리프 인덱스는 4 ~ 7번.
    - k=4: arr[0] = 5
    - k=5: arr[1] = 3
    - k=6: arr[2] = 8
    - k=7: arr[3] = 7
- 나머지 인덱스(8~15)는 사용하지 않으며, 항등원 상태이다.

### 6.1. 초기 _update 과정을 통한 정보 계산

1. k=4,5,6,7 (리프) 노드는 이미
    - max_val = arr[i], smax_val = -inf, max_cnt = 1
    - min_val = arr[i], smin_val = +inf, min_cnt = 1
    - sum_val = arr[i] 상태이다.
2. k=2를 갱신(자식: k=4, k=5)
    - max_val[4] = 5, max_val[5] = 3 → max_val[2] = 5, max_cnt[2] = 1
        - 두 번째 최댓값 smax_val[2] = max(smax_val[4], max_val[5]) = max(-inf, 3) = 3
    - min_val[4] = 5, min_val[5] = 3 → min_val[2] = 3, min_cnt[2] = 1
        - 두 번째 최솟값 smin_val[2] = min(smin_val[4], min_val[5]) = min(+inf, 3) = 3
    - sum_val[2] = sum_val[4] + sum_val[5] = 5 + 3 = 8
3. k=3를 갱신(자식: k=6, k=7)
    - max_val[6] = 8, max_val[7] = 7 → max_val[3] = 8, max_cnt[3] = 1
        - smax_val[3] = max(max_val[7], smax_val[6]) = max(7, -inf) = 7
    - min_val[6] = 8, min_val[7] = 7 → min_val[3] = 7, min_cnt[3] = 1
        - smin_val[3] = min(min_val[7], smin_val[6]) = min(7, +inf) = 7
    - sum_val[3] = 8 + 7 = 15
4. k=1를 갱신(자식: k=2, k=3)
    - max_val[2] = 5, max_val[3] = 8 → max_val[1] = 8, max_cnt[1] = 1
        - smax_val[1] = max(max_val[2], smax_val[3]) = max(5, 7) = 7
    - min_val[2] = 3, min_val[3] = 7 → min_val[1] = 3, min_cnt[1] = 1
        - smin_val[1] = min(min_val[3], smin_val[2]) = min(7, 3) = 3
    - sum_val[1] = 8 + 15 = 23

이제 초기 트리가 완성되었다.

### 6.2. 예시 1: range_chmin(1, 4, 6) 연산

**연산 의미**: 인덱스 1부터 3까지(0-based, 즉 arr[1]=3, arr[2]=8, arr[3]=7)에 대해 "값이 6보다 크면 6으로 바꿔라."

- 실제 대상 원소: arr = [5, 3, 8, 7] → indices 1~3 = [3, 8, 7]
- "3은 6보다 작음(패스), 8은 6보다 크므로 6으로, 7은 6보다 크므로 6으로."
- 최종 배열 상태 예상: [5, 3, 6, 6].

**호출: range_chmin(1, 4, 6, k=1, l=0, r=4)**

- 현재 노드 = k=1, 구간 [0,4), 연산 범위 [1,4).
- **Break Condition 1**: [0,4) ∩ [1,4) → 겹치므로 통과
- **Break Condition 2**: max_val[1] = 8 → 8 > 6, 통과
- **Tag Condition**: 구간 [0,4)는 완전히 [1,4)에 포함되지 않으므로 적용 불가(0 ≤ 1? X).
- → **일반 케이스**: _propagate(1,0,4), mid=2.

**자식 탐색: 왼쪽 자식 k=2 구간 [0,2)**

- 호출: range_chmin(1,4,6, k=2, l=0, r=2)
- **Break Condition 1**: [0,2) ∩ [1,4) → 겹치므로 통과
- **Break Condition 2**: max_val[2] = 5 → 5 ≤ 6이므로, "이미 이 구간의 최댓값이 6 이하"라 판단 → **즉시 반환**.
    - (실제로 k=2 구간은 인덱스 [0,1]에 해당하는 값 [5,3]. 두 값 모두 ≤6이므로, 내려갈 필요 없다.)

**자식 탐색: 오른쪽 자식 k=3 구간 [2,4)**

- 호출: range_chmin(1,4,6, k=3, l=2, r=4)
- **Break Condition 1**: [2,4) ∩ [1,4) → 겹침
- **Break Condition 2**: max_val[3] = 8 → 8 > 6 → 통과
- **Tag Condition**: 구간 [2,4)가 [1,4)에 완전 포함(1 ≤ 2 & 4 ≤ 4)되고, smax_val[3] = 7이 6보다 큼(7 ≥ 6) → 두 번째 최댓값이 6보다 크므로 "이 구간 전체를 한 번에 처리할 수 없다."
- → **일반 케이스**: _propagate(3,2,4), mid=3.

**자식 탐색: k=6 구간 [2,3)**

- 호출: range_chmin(1,4,6, k=6, l=2, r=3)
- **Break Condition 1**: [2,3) ∩ [1,4) → 겹침
- **Break Condition 2**: max_val[6] = 8 → 8 > 6 → 통과
- **Tag Condition**: 구간 [2,3)가 [1,4)에 포함되고(1 ≤ 2 & 3 ≤ 4), smax_val[6] = -inf이므로(리프 노드라 두 번째 최댓값이 -inf)
    - inf < 6이므로 Tag Condition이 성립한다.
- → **Tag 적용**:
    
    ```python
    diff = max_val[6] - 6 = 8 - 6 = 2
    max_val[6] = 6
    sum_val[6] -= 2 * max_cnt[6] = 8 - 2*1 = 6
    ```
    
- 리프 노드 k=6가 "값 8 → 6"로 바뀌었고, sum_val=6로 갱신.
- → 즉시 반환.

**자식 탐색: k=7 구간 [3,4)**

- 호출: range_chmin(1,4,6, k=7, l=3, r=4)
- **Break Condition 1**: [3,4) ∩ [1,4) → 겹침
- **Break Condition 2**: max_val[7] = 7 > 6 → 통과
- **Tag Condition**: 구간 [3,4)가 [1,4)에 포함되고(1 ≤ 3, 4 ≤ 4), 리프 노드라 smax_val[7] = -inf < 6 → 성립→ Tag 적용:
    
    ```python
    diff = 7 - 6 = 1
    max_val[7] = 6
    sum_val[7] -= 1 * 1 = 7 - 1 = 6
    ```
    
- 리프 노드 k=7가 "값 7 → 6"으로 바뀌었고, sum_val[7] = 6으로 갱신.

→ 즉시 반환.

**리턴 후 부모 갱신**

1. k=3 (구간 [2,4)):
    - _update(3) 호출
    - 왼쪽 자식(k=6)의 max_val=6, smax_val=-∞, max_cnt=1, min_val=6, smin_val=+∞, sum_val=6
    - 오른쪽 자식(k=7)의 max_val=6, smax_val=-∞, max_cnt=1, min_val=6, smin_val=+∞, sum_val=6
    - max_val[3] = 6, max_cnt[3] = 2 (두 자식 최댓값이 같으므로 등장 횟수 합산)
    - smax_val[3] = max(smax_val[6], smax_val[7]) = max(-∞, -∞) = -∞
    - min_val[3] = 6, min_cnt[3] = 2, smin_val[3] = min(smin_val[6], smin_val[7]) = +∞
    - sum_val[3] = 6 + 6 = 12
2. k=1 (구간 [0,4)):
    - _update(1) 호출
    - 왼쪽 자식(k=2)는 변경 없음: max_val=5, smax_val=3, max_cnt=1, min_val=3, sum_val=8
    - 오른쪽 자식(k=3)는 갱신 후 max_val=6, smax_val=-∞, max_cnt=2, min_val=6, sum_val=12
    - max_val[1] = 6 (7이 사라지고 6이 최댓값), max_cnt[1] = 2 (오른쪽 자식에서 6이 2번 등장)
    - smax_val[1] = max(max_val[2]=5, smax_val[3]=-∞) = 5
    - min_val[1] = 3 언변화(왼쪽 자식이 여전히 최솟값), min_cnt[1] = 1
    - smin_val[1] = min(min_val[2]=3, smin_val[3]=+∞) = 3
    - sum_val[1] = sum_val[2]=8 + sum_val[3]=12 = 20

이로써, "구간 [1,4)에 대해 6보다 큰 값을 모두 6으로 바꾸기" 연산이 완료되었다. 최종 트리의 합은 20이므로, 전체 배열 합이 실제로 5 + 3 + 6 + 6 = 20과 일치함이 확인된다.

---

### 6.3. 예시 2: range_sum(0, 2) 연산

"인덱스 0~1(배열 [5,3]) 범위의 합을 구하라."

1. 호출: range_sum(0,2, k=1, l=0, r=4)
    - **Break Condition**: 겹침 → 통과
    - _propagate(1,0,4) → lazy 없음 → 패스
    - 현재 구간 [0,4)는 완전 포함되지 않으므로(0 ≤ 0이지만 4 ≤ 2가 아님) → 자식 호출
2. 왼쪽 자식: range_sum(0,2, k=2, l=0, r=2)
    - **Break Condition**: 겹침 → 통과
    - _propagate(2,0,2) → lazy 없음 → 패스
    - [0,2)는 요청 범위 [0,2)에 완전 포함 → return sum_val[2] = 8
3. 오른쪽 자식: range_sum(0,2, k=3, l=2, r=4)
    - **Break Condition**: 겹침? [2,4) ∩ [0,2) → 겹치지만 교집합이 공집합 → 2 ≥ 2이므로 **실제로 "겹치지 않은" 상태**로 간주 → return 0
4. 최종 반환: 8 + 0 = 8
    - 실제 배열 [5,3] 합 역시 8이므로 정확.

---

## 7. 시간복잡도 분석

- **초기화(__init__)**:
    - 리프 노드에 값을 복사하는 데 O(N).
    - 내부 노드 _update를 호출하는 데 O(size)≈O(2N).
    - 전체적으로 O(N)이다.
- **range_chmin / range_add / range_sum**:
    - 일반적인 세그먼트 트리와 유사하게, 한 번에 **한 루트-리프 경로를 타고 내려가면서 수행**되므로 기본적으로는 O(logN)이다.
    - 다만, **break condition**이나 **tag condition**에 의해 "더 이상 내려갈 필요가 없을 때" 바로 반환하므로, 실제 수행 횟수는 보통 더 적다.
    - **최악의 경우**에도 깊이가 O(logN)이고, 각 노드에서 하는 연산(조건 검사 및 변수 갱신)이 O(1)이므로, O(logN)가 보장된다.

---

## 8. 적용 사례 및 주의사항

### 8.1. 주요 적용 문제 예시

- **AtCoder "Range Chmin Chmax Add Range Sum"**
    - 구간에 Chmin, Chmax, Add가 혼합된 복합 연산과 구간 합 쿼리가 주어질 때,
    - 세그먼트 트리 비츠를 사용하면 모든 연산을 O(logN)에 처리할 수 있다.
- **구간 최댓값 제한을 여러 번 수행한 뒤, 구간 합이나 최솟값/최댓값을 구해야 하는 문제**
    - 연산 단위를 "한 번에 하나씩" 처리하는 세그먼트 트리는 느리지만, 비츠를 이용하면 훨씬 빨라진다.

### 8.2. 구현 시 주의사항

1. **브레이크 조건과 태그 조건을 반드시 명확히 이해하고 구현해야 한다.**
    - 잘못된 조건을 걸어두면 논리적 버그를 유발하거나, 시간복잡도가 O(N) 이상으로 증가할 수 있다.
2. **Lazy Propagation 시점**
    - range_chmin, range_add, range_sum 등에서 무조건 "노드에 접근했을 때는 _propagate로 Lazy를 먼저 처리"해야 한다.
    - 만약 Lazy 태그를 전파하지 않고 _update만 호출하면, 자식 노드 정보가 최신 상태가 아니어서 잘못된 결과를 낼 수 있다.
3. **항등원 초기화**
    - "두 번째 최댓값"이나 "두 번째 최솟값"을 -∞ 혹은 +∞로 설정해야, 실제 값이 없을 때 비교 로직에서 오류가 나지 않는다.
    - 특히, "리프"에서는 두 번째 최댓값과 두 번째 최솟값을 초기화하지 않고 그냥 항등원인 채로 두어야 한다.

---

## 정리

- 세그먼트 트리 비츠는 **구간에 복합적인 조건을 걸어 업데이트**(Chmin, Chmax, Add 등)하고, 동시에 **구간 합·최댓값·최솟값 등을 효율적으로 쿼리**할 수 있는 고급 자료구조이다.
- 핵심은 각 노드에 "최댓값·두 번째 최댓값·등장 횟수"와 "최솟값·두 번째 최솟값·등장 횟수"를 저장하고,
    - **Break Condition**으로 "더 이상 내려갈 필요 없는 경우"를 걸어 시간을 절약하고,
    - **Tag Condition**으로 "현재 구간만 보면 바로 처리할 수 있는 경우"를 잡아 재귀를 단축시키는 것이다.
- 구현은 복잡하지만, 잘 설계된 경우 모든 연산이 O(logN)에 처리되며, 실제 알고리즘 대회나 경쟁 프로그래밍에서 매우 중요한 기법이다.
