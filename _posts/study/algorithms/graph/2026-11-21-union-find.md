---
title: "Union-Find"
permalink: /study/algorithms/graph/union-find/
toc: true
excerpt: "Union-Find 알고리즘은 분리 집합 또는 서로소 집합( Disjoint-Set )을 표현하고 관리하는 알고리즘이다. 이는 겹치는 원소가 없는 여러 집합을 표현하고, 이들을 효율적으로 합치고 찾을 수 있는 자료구조와 알고리즘을 의미한다."
categories: ["알고리즘"]
tags: ["그래프", "분리 집합"]
---

[상위 페이지 · Graph](/study/algorithms/graph/)

## 선행 지식

- 그래프의 이해

![](/assets/images/study/algorithms/union-find-icon-450a8f55.png)

## 설명

Union-Find 알고리즘은 분리 집합 또는 서로소 집합(**Disjoint-Set**)을 표현하고 관리하는 알고리즘이다. 이는 겹치는 원소가 없는 여러 집합을 표현하고, 이들을 효율적으로 합치고 찾을 수 있는 자료구조와 알고리즘을 의미한다.

## 예시

예를 들어, 원소 1부터 15까지가 처음에는 모두 독립 집합이라고 하자. 이때 A = {1, 2, 3, 4, 5}, B = {11, 12, 13, 14, 15}처럼 서로소 집합 두 개를 하나로 합칠 수 있다.

1. 초기 상태에서는 모든 원소가 자기 자신을 부모로 가진다.
2. 대표 원소끼리 union(1, 11)을 수행하면 A와 B가 같은 컴포넌트로 연결된다.
3. 이후 find를 호출하면 A와 B의 원소들이 동일한 루트를 공유함을 확인할 수 있다.

## 코드

다음은 Union-Find 알고리즘의 구현 코드이다.

```python
class UnionFind:
    def __init__(self, n):
        self.parent = [i for i in range(n)]
		# 자신의 최고 부모를 찾는 함수
    def find(self, x):
        while self.parent[x] != x:
            x = self.parent[x]
        return x
		#X와 Y의 부모끼리 병합
    def union(self, x, y):
        x_root = self.find(x)
        y_root = self.find(y)

        if x_root != y_root:
            self.parent[x_root] = y_root
```

위 코드에서 find() 함수는 원소 x의 루트를 찾고, union() 함수는 원소 x와 y가 속한 집합을 합친다. 앞서 설명한 집합 A와 B의 병합은 다음과 같이 구현할 수 있다.

```python
n = 16
uf = UnionFind(n)

# A와 B의 원소를 순서대로 연결
for i in range(1, 6):
    uf.union(i, i + 10)

# A와 B가 같은 집합인지 확인
for i in range(1, 16):
    print(uf.find(i) == uf.find(i + 1)) # True 출력
```

## 경로 단축

Union-Find 알고리즘의 경로 단축은 find() 함수의 재귀 호출을 최적화하는 방법이다. 이를 적용하면 탐색한 노드들을 루트 노드에 직접 연결하여 이후 탐색 시간을 단축할 수 있다.

다음은 경로 단축이 적용된 Union-Find 알고리즘의 구현이다.

```python
class UnionFind:
    def __init__(self, n):
        self.parent = [i for i in range(n)]

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        x_root = self.find(x)
        y_root = self.find(y)

        if x_root != y_root:
            self.parent[x_root] = y_root
```

find() 함수의 if self.parent[x] != x: 조건문에서 경로 단축이 적용된다. 이 코드로 경로 단축을 적용한 집합 A와 B의 병합은 다음과 같이 구현할 수 있다.

```python
n = 16
uf = UnionFind(n)

# A와 B의 원소를 순서대로 연결
for i in range(1, 6):
    uf.union(i, i + 10)

# 경로 단축 적용
for i in range(1, 16):
    uf.find(i)

# A와 B가 같은 집합인지 확인
for i in range(1, 16):
    print(uf.find(i) == uf.find(i + 1)) # True 출력
```
