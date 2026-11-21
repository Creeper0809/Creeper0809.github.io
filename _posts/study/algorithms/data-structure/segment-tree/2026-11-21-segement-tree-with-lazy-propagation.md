---
title: "Segement Tree with Lazy Propagation"
permalink: /study/algorithms/data-structure/segment-tree/segement-tree-with-lazy-propagation/
toc: true
excerpt: "세그먼트 트리는 구간 쿼리를 효율적으로 처리하는 자료구조이다. 하지만 구간 업데이트 연산에서는 한계를 보인다. 구간 내 모든 노드를 개별적으로 업데이트해야 하므로, 최악의 경우 O(N)의 시간 복잡도가 발생한다."
categories: ["알고리즘"]
tags: ["자료 구조", "세그먼트 트리"]
---

[상위 페이지 · Segment Tree](/study/algorithms/data-structure/segment-tree/)

## 배경: 세그먼트 트리의 한계

세그먼트 트리는 구간 쿼리를 효율적으로 처리하는 자료구조이다. 하지만 구간 업데이트 연산에서는 한계를 보인다. 구간 내 모든 노드를 개별적으로 업데이트해야 하므로, 최악의 경우 O(N)의 시간 복잡도가 발생한다.

좀 더 자세한 예시를 들어보자. 노드를 업데이트했는데 이후 쿼리에서 해당 노드에 대한 접근이 전혀 일어나지 않았다면, 불필요한 시간을 낭비한 것이다. 이를 방지하기 위해 실제로 노드의 값이 필요한 시점까지 업데이트를 미루는 것이 핵심 개념이다.

## Lazy Propagation의 개념

Lazy Propagation은 이러한 한계를 극복하기 위한 최적화 기법이다. 업데이트를 즉시 수행하지 않고 지연시키는 방식으로, 각 노드에 지연된 업데이트 정보를 저장하고 필요한 시점에만 자식 노드로 전파한다.

## 장점

- 구간 업데이트 연산의 시간 복잡도를 O(logN)으로 최적화할 수 있다.
- 불필요한 업데이트 연산을 최소화하여 전체 성능이 향상된다.
- 메모리 접근 횟수가 감소하여 캐시 효율성이 개선된다.

## 단점

- 각 노드마다 lazy 값을 저장하기 위한 추가 메모리가 필요하다.
- 일반 세그먼트 트리에 비해 구현이 복잡하다.
- 다양한 업데이트가 필요한 경우 lazy 값 관리가 까다롭다.

## 구현

각 함수별 주요 변경사항을 살펴보고, 구현 코드를 확인해보자:

### 1. **init** 함수의 변경

기존 세그먼트 트리와 비교했을 때 다음과 같은 차이가 있다:

- lazy 배열을 추가로 초기화 (self.lazy = [0] * (4 * self.n))
- 트리의 크기는 동일하게 4N 유지

```python
def __init__(self, arr):
    self.n = len(arr)
    self.tree = [0] * (4 * self.n)
    self.lazy = [0] * (4 * self.n)  # lazy 배열 추가
    self._build(arr, 0, 0, self.n - 1)

```

### 2. propagate 함수 추가

새롭게 추가된 핵심 함수로 다음 작업을 수행한다:

- 현재 노드의 lazy 값이 존재하는지 확인
- lazy 값이 있다면 현재 노드의 값을 갱신 (구간 크기를 곱해서 적용)
- 자식 노드가 있다면 lazy 값을 전파
- 현재 노드의 lazy 값을 0으로 초기화

```python
def _propagate(self, node, start, end):
    if self.lazy[node] != 0:
        self.tree[node] += (end - start + 1) * self.lazy[node]
        if start != end:  # 리프 노드가 아니면 자식에게 전파
            self.lazy[2*node+1] += self.lazy[node]
            self.lazy[2*node+2] += self.lazy[node]
        self.lazy[node] = 0  # lazy 값 초기화

```

### 3. update_range 함수의 변경

기존 update 함수와 비교했을 때 주요 변경점:

- 함수 시작 시 propagate 호출하여 지연된 업데이트 처리
- 구간이 완전히 포함될 경우 lazy 값만 설정
- 부분 구간의 경우 재귀적으로 처리하되, 각 단계에서 propagate 호출

```python
def update_range(self, left, right, diff, node=0, start=0, end=None):
    if end is None:
        end = self.n - 1
    
    self._propagate(node, start, end)  # 현재 노드의 lazy 처리
    
    if right < start or end < left:
        return
    
    if left <= start and end <= right:
        # 구간이 완전히 포함되면 lazy 값만 설정
        self.tree[node] += (end - start + 1) * diff
        if start != end:
            self.lazy[2*node+1] += diff
            self.lazy[2*node+2] += diff
        return
    
    mid = (start + end) // 2
    self.update_range(left, right, diff, 2*node+1, start, mid)
    self.update_range(left, right, diff, 2*node+2, mid+1, end)
    self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]

```

### 4. query_range 함수의 변경

쿼리 함수의 주요 변경사항:

- 쿼리 처리 전 반드시 propagate 호출
- lazy 값 처리 후 기존과 동일한 방식으로 쿼리 수행

```python
def query_range(self, left, right, node=0, start=0, end=None):
    if end is None:
        end = self.n - 1
        
    if right < start or end < left:
        return 0
        
    self._propagate(node, start, end)  # 쿼리 전에 lazy 처리
    
    if left <= start and end <= right:
        return self.tree[node]
        
    mid = (start + end) // 2
    return (self.query_range(left, right, 2*node+1, start, mid) + 
            self.query_range(left, right, 2*node+2, mid+1, end))

```

사용 예시:

```python
# 초기 배열로 세그먼트 트리 생성
arr = [1, 2, 3, 4, 5]
lst = LazySegmentTree(arr)

# 구간 [1, 3]의 모든 원소에 2를 더함
lst.update_range(1, 3, 2)

# 구간 [0, 2]의 합을 조회
result = lst.query_range(0, 2)  # 결과: 8 (1 + 4 + 5)
```

## 시뮬레이션

[https://codepen.io/Creeper0809/pen/XJmaPNX](https://codepen.io/Creeper0809/pen/XJmaPNX)

## 적용 사례

구간 합, 구간 최대/최소값과 같이 구간 업데이트가 빈번한 연산에서 특히 효과적이다.
