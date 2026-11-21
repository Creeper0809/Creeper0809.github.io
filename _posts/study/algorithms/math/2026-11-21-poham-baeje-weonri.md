---
title: "포함 배제 원리"
permalink: /study/algorithms/math/poham-baeje-weonri/
toc: true
excerpt: "포함배제 원리는 집합의 합과 교집합을 이용하여 원하는 결과를 구하는 방법이다."
categories: ["알고리즘"]
tags: ["수학", "포함 배제 원리", "조합론"]
---

[상위 페이지 · Math](/study/algorithms/math/)

포함배제 원리는 집합의 합과 교집합을 이용하여 원하는 결과를 구하는 방법이다.

집합 A, B, C의 합집합을 구하는 경우 다음과 같은 수식을 이용한다.

```
A ∪ B ∪ C = (A + B + C) - (A ∩ B) - (A ∩ C) - (B ∩ C) + (A ∩ B ∩ C)
```

위 수식에서 우변의 첫 번째 항은 각 집합의 원소 합을 나타내고 이후의 항들은 각 집합 간의 중복 원소를 조정하는 역할을 한다.

## 예제

다음과 같은 집합 A, B, C가 있을 때,

```
A = {1, 2, 3}
B = {2, 3, 4}
C = {3, 4, 5}
```

A, B, C의 합집합을 포함배제 원리로 구하면:

```
A ∪ B ∪ C = (A + B + C) - (A ∩ B) - (A ∩ C) - (B ∩ C) + (A ∩ B ∩ C)
           = (1+2+3+2+3+4+3+4+5) - (2+3) - (3) - (3+4) + (3)
           = 15
```

따라서 A, B, C의 합집합은 {1, 2, 3, 4, 5}이고, 원소의 합은 15이다.

이를 파이썬 코드로 구현하면 다음과 같다.

## 파이썬 구현

```python
A = {1, 2, 3}  # 집합 A
B = {2, 3, 4}  # 집합 B
C = {3, 4, 5}  # 집합 C

# 집합 A, B, C의 합집합 구하기
union = len(A) + len(B) + len(C) - len(A.intersection(B)) - len(A.intersection(C)) - len(B.intersection(C)) + len(A.intersection(B).intersection(C))

print(union)  # 결과 출력
```

포함배제 원리는 집합 이론에서 중요한 개념으로, 다양한 문제 해결에 활용할 수 있다.

### "1부터 100까지의 자연수 중에서 3의 배수 또는 5의 배수인 수의 합을 구하시오."

이 문제는 다음과 같이 해결할 수 있다. 3의 배수 집합을 A, 5의 배수 집합을 B라고 하면:

```python
A = {3, 6, 9, ..., 99}
B = {5, 10, 15, ..., 100}

A ∪ B = {3, 5, 6, 9, 10, 12, ..., 99, 100}
```

15의 배수는 A와 B의 교집합이므로, 포함배제 원리를 적용하면:

```
sum(A ∪ B) = sum(A) + sum(B) - sum(A ∩ B)
```

파이썬으로 구현하면:

```python
A = set(range(3, 101, 3))  # 3의 배수 집합
B = set(range(5, 101, 5))  # 5의 배수 집합

# 포함배제 원리 적용
result = sum(A) + sum(B) - sum(A.intersection(B))

print(result)  # 결과 출력
```

이렇게 포함배제 원리를 활용하여 복잡한 문제를 효율적으로 해결할 수 있다.

아래는 집합의 개수가 n개일때 포함배제원리를 이용한 값을 리턴해주는 함수이다

```python
def inclusion_exclusion(*sets):
    """
    입력: 집합 A1, A2, ..., An (n개)
    출력: 집합 A1, A2, ..., An의 합집합의 크기
    """
    # 합집합 구하기
    union = set()
    for s in sets:
        union = union.union(s)

    # 교집합 구하기
    intersect = sets[0].intersection(*sets[1:])

    # 포함배제 원리를 이용하여 합집합 구하기
    result = len(union) - len(intersect)
    return result
```
