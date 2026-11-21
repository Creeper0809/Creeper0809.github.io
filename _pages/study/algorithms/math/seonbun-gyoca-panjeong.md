---
title: "선분 교차 판정"
permalink: /study/algorithms/math/seonbun-gyoca-panjeong/
toc: true
---

[상위 페이지 · Math](/study/algorithms/math/)

선분 교차 판정은 컴퓨터 그래픽스, 게임 개발, 계산 기하학 등 다양한 분야에서 중요한 알고리즘이다. 두 선분이 서로 교차하는지 여부를 판단하는 방법으로, 충돌 감지, 클리핑, 다각형 처리 등에 활용된다.

## 기본 개념

2D 공간에서 두 선분 AB와 CD가 있을 때, 이 두 선분이 교차하는지 판단하는 방법에는 여러 가지가 있다.

## 1. 벡터의 외적을 이용한 방법

이 방법은 가장 널리 사용되는 방법 중 하나로, 벡터의 외적(cross product)을 활용한다.

```python
def do_intersect(A, B, C, D):
    # 선분 AB를 기준으로 점 C와 D의 위치 확인
    cross1 = cross_product(B - A, C - A)
    cross2 = cross_product(B - A, D - A)
    
    # 선분 CD를 기준으로 점 A와 B의 위치 확인
    cross3 = cross_product(D - C, A - C)
    cross4 = cross_product(D - C, B - C)
    
    # 두 선분이 교차하려면 다음 조건을 만족해야 함
    return (cross1 * cross2 <= 0) and (cross3 * cross4 <= 0)

def cross_product(v1, v2):
    return v1.x * v2.y - v1.y * v2.x

```

여기서 외적의 부호는 점이 선분의 어느 쪽에 위치하는지를 나타낸다. 선분 AB를 기준으로 C와 D가 서로 다른 쪽에 있고, 선분 CD를 기준으로 A와 B가 서로 다른 쪽에 있다면 두 선분은 교차한다.

### 기하적 해석

벡터의 외적은 두 벡터가 이루는 평행사변형의 넓이와 관련이 있으며, 그 부호는 두 벡터의 회전 방향을 나타낸다. 점 C와 D가 선분 AB를 기준으로 서로 다른 방향에 있다는 것은 벡터 AB를 기준으로 AC와 AD가 서로 다른 방향으로 회전한다는 의미이다. 마찬가지로, 점 A와 B가 선분 CD를 기준으로 서로 다른 방향에 있다면, 두 선분은 교차점을 가진다.

## 2. 직선의 방정식을 이용한 방법

두 선분을 직선의 방정식으로 표현한 후, 교점을 계산하고 그 교점이 두 선분 위에 있는지 확인하는 방법이다.

```python
def do_intersect(A, B, C, D):
    # 두 직선의 방정식을 구함
    a1 = B.y - A.y
    b1 = A.x - B.x
    c1 = a1 * A.x + b1 * A.y
    
    a2 = D.y - C.y
    b2 = C.x - D.x
    c2 = a2 * C.x + b2 * C.y
    
    # 판별식
    det = a1 * b2 - a2 * b1
    
    if abs(det) < EPSILON:
        # 두 직선이 평행하거나 일치
        return False  # 더 복잡한 검사가 필요
    else:
        # 교점 계산
        x = (b2 * c1 - b1 * c2) / det
        y = (a1 * c2 - a2 * c1) / det
        
        # 교점이 두 선분 위에 있는지 확인
        return is_point_on_segment(A, B, Point(x, y)) and \
               is_point_on_segment(C, D, Point(x, y))

def is_point_on_segment(A, B, P):
    # P가 선분 AB 위에 있는지 확인
    return min(A.x, B.x) <= P.x <= max(A.x, B.x) and \
           min(A.y, B.y) <= P.y <= max(A.y, B.y)

```

### 기하적 해석

이 방법은 두 직선의 교점을 명시적으로 계산한다. 두 직선의 방정식 ax + by = c의 형태로 표현하고, 크래머의 법칙을 사용하여 교점의 좌표를 구한다. 판별식(determinant)의 값이 0에 가까우면 두 직선이 평행하거나 일치함을 의미한다. 교점을 구한 후에는 그 점이 실제로 두 선분 위에 있는지 확인하여 교차 여부를 결정한다.

## 특수 케이스 처리

선분 교차 판정에서는 다음과 같은 특수 케이스를 고려해야 한다:

- **평행한 선분:** 두 선분이 평행할 경우 교차 여부를 별도로 판단해야 한다.
- **겹치는 선분:** 두 선분이 일부분 또는 전체가 겹치는 경우이다.
- **끝점에서만 교차:** 한 선분의 끝점이 다른 선분 위에 있는 경우이다.
- **수치 오차:** 부동 소수점 연산에서 발생할 수 있는 오차를 고려해야 한다.

## 최적화 방법

많은 선분을 처리해야 하는 경우, 다음과 같은 최적화 방법을 고려할 수 있다:

- **경계 상자(Bounding Box) 검사:** 두 선분의 경계 상자가 겹치지 않으면 선분도 교차하지 않는다.
- **공간 분할 구조:** 쿼드트리, R-트리 등의 자료구조를 활용하여 검사해야 할 선분의 수를 줄일 수 있다.
- **스위핑 알고리즘:** Bentley-Ottmann 알고리즘과 같은 스위핑 기법을 활용하여 O(n log n) 시간 복잡도로 n개 선분 사이의 모든 교차점을 찾을 수 있다.

## 결론

선분 교차 판정은 단순해 보이지만 다양한 케이스를 고려해야 하는 기본적인 기하학 알고리즘이다. 구현 방법에 따라 성능과 정확도가 달라질 수 있으므로, 응용 분야에 맞는 적절한 방법을 선택하는 것이 중요하다.

## 전체 코드

```python
from typing import Tuple

Point = Tuple[float, float]

EPS = 1e-9

def orientation(a, b, c):
    # cross가 0에 매우 가까우면 공선으로 본다
    v = cross(b[0]-a[0], b[1]-a[1],
              c[0]-a[0], c[1]-a[1])
    if abs(v) < EPS:
        return 0
    return 1 if v < 0 else 2

def on_segment(a, b, c):
    # b가 a–c 범위 안에 있는지를 ε 여유 두고 검사
    return (min(a[0], c[0]) - EPS <= b[0] <= max(a[0], c[0]) + EPS and
            min(a[1], c[1]) - EPS <= b[1] <= max(a[1], c[1]) + EPS)

def segments_intersect(p1: Point, p2: Point, p3: Point, p4: Point) -> bool:
    """
    선분 p1–p2와 p3–p4가 교차하는지 판정.
    일반 위치 교차, 끝점 접촉, 공선(overlap) 모두 True로 처리.
    """
    o1 = orientation(p1, p2, p3)
    o2 = orientation(p1, p2, p4)
    o3 = orientation(p3, p4, p1)
    o4 = orientation(p3, p4, p2)

    # 1) 일반 교차: 서로 다른 쪽에 위치
    if o1 != o2 and o3 != o4:
        return True

    # 2) 특수 케이스: 공선이면서 점이 선분 위에 있는 경우
    if o1 == 0 and on_segment(p1, p3, p2):
        return True
    if o2 == 0 and on_segment(p1, p4, p2):
        return True
    if o3 == 0 and on_segment(p3, p1, p4):
        return True
    if o4 == 0 and on_segment(p3, p2, p4):
        return True

    # 그 외에는 교차하지 않음
    return False

# 사용 예시
if __name__ == "__main__":
    # 교차하는 예
    A, B = (0, 0), (4, 4)
    C, D = (0, 4), (4, 0)
    print(segments_intersect(A, B, C, D))  # True

    # 공선(overlap) 예
    E, F = (1, 1), (3, 3)
    print(segments_intersect(A, B, E, F))  # True

    # 떨어져 있는 예
    G, H = (5, 5), (6, 6)
    print(segments_intersect(A, B, G, H))  # False

```
