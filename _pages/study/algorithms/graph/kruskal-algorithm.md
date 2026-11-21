---
title: "Kruskal Algorithm"
permalink: /study/algorithms/graph/kruskal-algorithm/
toc: true
---

[상위 페이지 · Graph](/study/algorithms/graph/)

## 선행 지식

- 유니온 파인드 (Union Find)

## 설명

크루스칼(Kruskal) 알고리즘은 최소 비용 신장 트리(Minimum Spanning Tree)를 구하는 알고리즘 중 하나이다.

이 알고리즘은 간선의 가중치를 기준으로 오름차순으로 정렬한 뒤, 사이클을 형성하지 않도록 간선을 하나씩 선택하면서 최소 신장 트리를 만들어 나간다.

즉, 가장 작은 가중치를 가진 간선부터 선택하여 이미 선택된 노드와 연결되지 않는 새로운 노드를 연결하는 것이다.

이 알고리즘의 시간 복잡도는 O(ElogE)이며, E는 간선의 개수를 의미한다.

크루스칼 알고리즘은 그리디 알고리즘의 일종으로, 최적해를 구하는 것이 보장된다.

## 예시

다음은 크루스칼 알고리즘을 사용하여 최소 비용 신장 트리를 구하는 예시이다.

![](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/MST_kruskal_en.gif/300px-MST_kruskal_en.gif)

위 그림에서 처음에는 모든 정점이 각각 독립된 트리를 형성하고 있다. 간선을 가중치를 기준으로 정렬한 뒤, 가장 작은 가중치를 가지는 간선부터 하나씩 선택하면서 두 개의 트리를 하나로 합치는 과정을 반복하면 최소 비용 신장 트리를 구할 수 있다.

## 파이썬 코드

```python
# 크루스칼 알고리즘 구현 예시 (간선 리스트 이용)
def kruskal(graph):
    parent = dict()
    rank = dict()
    mst = list()

    def find(node):
        if parent[node] != node:
            parent[node] = find(parent[node])
        return parent[node]

    def union(node_v, node_u):
        root1 = find(node_v)
        root2 = find(node_u)
        if root1 != root2:
						# 더 부모의 숫자가 큰쪽이나 작은쪽으로 하나의 기준을 정해 병합
            if rank[root1] > rank[root2]:
                parent[root2] = root1
            else:
                parent[root1] = root2
                if rank[root1] == rank[root2]: rank[root2] += 1

    for node in graph['vertices']:
        parent[node] = node
        rank[node] = 0

    edges = graph['edges']
    edges.sort()

    for edge in edges:
        weight, node_v, node_u = edge
				# 동일한 부모를 가르키지 않을 시
        if find(node_v) != find(node_u):
            union(node_v, node_u)
            mst.append(edge)

    return mst

```
