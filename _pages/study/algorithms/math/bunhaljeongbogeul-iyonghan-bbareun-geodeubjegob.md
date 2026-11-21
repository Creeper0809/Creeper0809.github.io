---
title: "분할정복을 이용한 빠른 거듭제곱"
permalink: /study/algorithms/math/bunhaljeongbogeul-iyonghan-bbareun-geodeubjegob/
math: true
toc: true
---

[상위 페이지 · Math](/study/algorithms/math/)

## 선행지식

- 재귀 함수

## 설명

빠른 거듭제곱 알고리즘은 다음과 같은 수식으로 증명할 수 있다.

- $$n$$ 이 짝수일 경우,

$${a^n = (a^{n/2})^2}$$

- $$n$$ 이 홀수일 경우,

$${a^n = a(a^{(n-1)/2})^2}$$

즉, 거듭제곱의 지수를 이진수로 표현하면 다음과 같이 나타낼 수 있다.

$$n = 2^k b_{k} + 2^{k-1} b_{k-1} + \cdots + 2 b_1 + b_0$$

여기서 $$b_i$$는 0 또는 1이다. 예를 들어, $$n = 10$$일 때 $$10 = 2^3 \times 1 + 2^2 \times 0 + 2^1 \times 1 + 2^0 \times 0$$이 된다.

이때 거듭제곱 $$a^n$$은 다음과 같이 나타낼 수 있다.

$$a^n = a^{2^k b_k} \cdot (a^{2^{k-1} b_{k-1}})^2 \cdots (a^{2 b_1})^2 \cdot a^{b_0}$$

따라서 거듭제곱의 지수 $$n$$을 이진수로 표현한 후, 위의 공식을 이용하여 거듭제곱을 계산할 수 있다.

위의 수식만으로는 이해하기 어려울 수 있으니 구체적인 예를 들어보겠다.

$$10^8$$은 $$10^2*10^2*10^2*10^2$$으로 나타낼 수 있다. 이렇게 하면 10을 8번 곱하는 대신 $$10^2*10^2*10^2*10^2$$와 같이 log n + 1번의 연산으로 줄일 수 있다.

홀수 지수의 경우도 마찬가지다. 예를 들어 $$10^7$$은 $$10^3*10^2*10^2$$으로 계산할 수 있다.

이러한 분할 정복 방식을 구현하기 위해서는 재귀 함수를 사용해야 한다.

```python
# 시간복잡도 O(n)

def power(x, y):
    if y == 0:
        return 1

    return power(x, y - 1) * x
    

# 시간복잡도 O(logn)
# y가 8이라면
# 재귀를 통해 8 4 2 1 0으로 분해
# 0에서 1 리턴
# 1에서 x리턴
# 2에서 x^2 리턴
# 4에서 x^2 * x^2 리턴
# 8에서 (x^2 * x^2) * (x^2 * x^2) 리턴

def power(x, y):
    if y == 0:
        return 1
    # 계산을 한 번만 하기 위해서 변수에 저장
    subresult = power(x, y // 2)

    # 문제를 최대한 똑같은 크기의 문제 두 개로 나눈다.
    if y % 2 == 0:
        return subresult * subresult
    else:
        return x * subresult * subresult

# y가 8이면 4번, y가 32면 6번 호출, 즉 lg y + 1번 호출

#테스트
print(power(3, 5))
print(power(5, 6))
print(power(7, 9))
```

## 모듈러 거듭제곱

모듈러 거듭제곱을 비트 연산을 이용하여 구현할 수도 있다. 이 방법은 재귀를 사용하지 않고 반복문으로 구현한다.

거듭제곱의 지수를 이진수로 표현했을 때, 각 비트가 1인 위치에서만 곱셈을 수행하는 방식이다.

예를 들어 $$3^{13}$$을 계산할 때, 13은 이진수로 1101이므로:

$$3^{13} = 3^8 \times 3^4 \times 3^1$$

이렇게 계산할 수 있다.

```python
# 비트 연산을 이용한 모듈러 거듭제곱
def mod_power_bit(x, y, m):
    result = 1
    x = x % m
    
    while y > 0:
        # y의 마지막 비트가 1이면 현재의 x를 곱함
        if y & 1:
            result = (result * x) % m
        # x를 제곱하고
        x = (x * x) % m
        # y를 오른쪽으로 시프트
        y = y >> 1
    
    return result

# 테스트
print(mod_power_bit(3, 13, 7))  # 3^13 mod 7
print(mod_power_bit(5, 15, 13)) # 5^15 mod 13
print(mod_power_bit(7, 20, 11)) # 7^20 mod 11
```

이 방법은 재귀를 사용하지 않아 스택 오버플로우의 위험이 없고, 비트 연산을 통해 효율적으로 계산할 수 있다는 장점이 있다.
