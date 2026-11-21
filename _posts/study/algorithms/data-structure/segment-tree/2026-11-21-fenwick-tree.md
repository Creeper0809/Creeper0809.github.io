---
title: "Fenwick Tree"
permalink: /study/algorithms/data-structure/segment-tree/fenwick-tree/
toc: true
excerpt: "펜윅 트리는 1994년 Peter M. Fenwick가 제안한 자료구조로, 구간 합을 구하거나 값을 업데이트하는 연산을 효율적으로 수행할 수 있는 자료구조이다."
categories: ["알고리즘"]
tags: ["자료 구조", "세그먼트 트리"]
---

[상위 페이지 · Segment Tree](/study/algorithms/data-structure/segment-tree/)

펜윅 트리는 1994년 Peter M. Fenwick가 제안한 자료구조로, 구간 합을 구하거나 값을 업데이트하는 연산을 효율적으로 수행할 수 있는 자료구조이다.

## 배경

기존의 구간 합을 구하는 방법들의 한계를 극복하기 위해 등장했다. 일반 배열은 구간 합을 구할 때 O(N)의 시간이 필요하고, 세그먼트 트리는 구현이 복잡하다는 단점이 있다.

## 장단점

### 장점

- 구현이 비교적 간단하다
- 메모리 사용량이 적다 (원본 배열 크기와 동일)
- 빠른 수행 시간 (구간 합, 업데이트 모두 O(logN))

### 단점

- 구간 최소값, 최대값과 같은 다른 연산은 지원하지 않는다
- 원본 배열의 크기가 고정되어야 한다

## 구현

```python
class FenwickTree:
    def __init__(self, n):
        self.size = n
        self.tree = [0] * (n + 1)
    
    def update(self, idx, diff):
        while idx <= self.size:
            self.tree[idx] += diff
            idx += (idx & -idx)
    
    def prefix_sum(self, idx):
        result = 0
        while idx > 0:
            result += self.tree[idx]
            idx -= (idx & -idx)
        return result
    
    def range_sum(self, start, end):
        return self.prefix_sum(end) - self.prefix_sum(start - 1)

```

### 1. 초기화 (**init**)

펜윅 트리는 1-based indexing을 사용하므로 크기를 n+1로 초기화한다. tree 배열은 구간 합을 저장하는 데 사용된다.

```python
def __init__(self, n):
    self.size = n
    self.tree = [0] * (n + 1)

```

### 2. 업데이트 (update)

특정 인덱스의 값을 변경할 때 사용한다. idx & -idx는 최하위 비트(LSB)를 구하는 연산으로, 다음 업데이트할 위치를 결정한다.

```python
def update(self, idx, diff):
    while idx <= self.size:
        self.tree[idx] += diff
        idx += (idx & -idx)

```

### 3. 구간 합 구하기 (prefix_sum)

1부터 idx까지의 구간 합을 계산한다. LSB를 빼가면서 저장된 구간 합들을 더한다.

```python
def prefix_sum(self, idx):
    result = 0
    while idx > 0:
        result += self.tree[idx]
        idx -= (idx & -idx)
    return result

```

### 4. 특정 구간의 합 구하기 (range_sum)

start부터 end까지의 구간 합을 계산한다. 두 개의 prefix_sum 결과의 차이를 이용한다.

```python
def range_sum(self, start, end):
    return self.prefix_sum(end) - self.prefix_sum(start - 1)

```

## 시간 복잡도

- **초기화:** O(N) - N개의 원소를 모두 0으로 초기화
- **업데이트:** O(logN) - 트리의 높이만큼 반복
- **구간 합 계산:** O(logN) - 트리의 높이만큼 반복

## 적용 사례

- 누적 합이 필요한 동적 프로그래밍 문제
- 실시간으로 데이터가 변경되는 구간 합 계산
- 온라인 저지 사이트의 구간 합 관련 문제
- 데이터 분석에서의 누적 통계 계산

## 사용 예시

```python
# 펜윅 트리 사용 예시
fenwick = FenwickTree(10)  # 크기 10의 펜윅 트리 생성

# 값 업데이트
fenwick.update(1, 5)  # 인덱스 1에 5 추가
fenwick.update(3, 7)  # 인덱스 3에 7 추가

# 구간 합 계산
print(fenwick.range_sum(1, 3))  # 1부터 3까지의 구간 합 출력
```
