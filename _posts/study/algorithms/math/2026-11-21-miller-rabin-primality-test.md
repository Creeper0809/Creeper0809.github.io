---
title: "Miller-Rabin Primality Test"
permalink: /study/algorithms/math/miller-rabin-primality-test/
math: true
toc: true
excerpt: "밀러-라빈 소수 판정법은 확률적 소수 판정법의 한 종류이다. 이 알고리즘은 합성수를 소수로 판정할 확률이 매우 낮으며, 실행 시간이 빠르다는 장점이 있다."
categories: ["알고리즘"]
tags: ["수학", "밀러 라빈", "정수론"]
---

[상위 페이지 · Math](/study/algorithms/math/)

## 선행지식

- [페르마의 소정리/오일러 정리](/study/algorithms/math/pereumayi-sojeongri-oilreo-jeongri/)

## 설명

밀러-라빈 소수 판정법은 확률적 소수 판정법의 한 종류이다. 이 알고리즘은 합성수를 소수로 판정할 확률이 매우 낮으며, 실행 시간이 빠르다는 장점이 있다.

## 기본 개념

주어진 홀수 n이 소수인지 판정하기 위해, n-1을 $$2^s * d$$ (d는 홀수)로 표현한다. 이때 임의의 수 a(밀러-라빈 기저)에 대해 다음 조건들 중 하나를 만족하면 n은 '아마도 소수'이다:

- $$a^d ≡ 1 \pmod n$$
- $$a^{2^r * d} \equiv -1 \pmod n$$, 0 ≤ r < s

이는 [페르마의 소정리/오일러 정리](/study/algorithms/math/pereumayi-sojeongri-oilreo-jeongri/) 를 바탕으로 한다.

## 증명

페르마의 소정리에 따라 n이 소수라면 1~n-1까지의 모든 정수 a에 대해  $$a^{n-1} \equiv 1 \pmod n$$ 을 성립한다. 하지만 역은 성립하지 않으며 이런 합성수를 “카마이클 수” 라고 한다.

이를 해결하기 위해 밀러라빈은 1의 제곱근 성질 이라는 좀 더 강력한 제한 조건을 걸어 카마이클 수를 걸러내려고 했다.

이 1의 제곱근 성질은 다음과 같다

- 만약 n이 소수라면 $$x^2 \equiv 1 \pmod n$$ 의 해는 $$x \equiv -1 \pmod n$$ 과 $$x \equiv 1 \pmod n$$ 두개 뿐이다.
- 만약 n이 합성수라면 $$x^2 \equiv 1 \pmod n$$ 의 해로 -1과 1이 아닌 임의의 y가 존재할 수 있다
    - 예시) n = 15라면 1,-1외에 16 = $$4^2$$ 즉 $$16 \equiv 1 \pmod {15}$$ 가 존재한다. 4는 1도 -1도 아니다.

1의 제곱근 성질은 밀러-라빈 테스트의 핵심적인 확인 과정에 적용된다. 테스트는 $$a^{n-1}=a^{2^s\cdot d}$$에서 시작하여 **제곱근을 계속 거슬러 올라간다.**

예를 들어, $$(a^{2^r*d})^2 \equiv 1 \pmod n$$ 이라는 것을 확인 했다면 n이 소수일 경우 1의 제곱근 성질에 따라 반드시 제곱하기 전의 값인 $$a^{2^r*d}$$ 는 1 또는 -1이어야한다. 여기서 $$x=a^{2^r*d}$$ 로 치환하면 1의 제곱근 성질을 적용할 수 있다.

## 밀러 - 라빈 동작

<aside markdown="1">
💡

[페르마의 소정리/오일러 정리](/study/algorithms/math/pereumayi-sojeongri-oilreo-jeongri/) 

p가 소수이고 p, a가 서로소이면, $$a^{p-1} \equiv 1\ \pmod p$$다

</aside>

<aside markdown="1">
💡

보조 정리

$$a^{n-1} \equiv (a^{(n-1)/2})^2 \equiv 1\ or\ -1 \pmod n$$ 

</aside>

### 동작

1. n은 우선 홀수여야 한다. (짝수면 2의 배수이므로 소수가 아님)
2. 임의의 선택된 a와 n은 서로소 여야한다. ( a와 n이 서로소가 아니라면 a는 n의 약수이기에 테스트를 시행 할 필요가 없다)
3. 페르마의 소정리에 의해 n이 소수이고 a와 n이 서로소라면 다음 식이 성립한다. n-1은 짝수이므로 $$2^s*d$$의 형태로 표현할 수 있다.
    
    $$
    a^{n-1} = a^{2^sd} \equiv 1 \pmod n
    $$
    
    1. 예: n = 13일 때 → $$2^2 * 3$$, s = 2, d = 3
4. 보조정리에 의해 다음과 같이 표현할 수 있다.

$$
a^{2^sd} \equiv (a^{2^{s-1}d})^2 \equiv 1 \pmod n
\\
a^{2^{s-1}d} \equiv 1\ or\ -1 \pmod n
$$

1. 만약 결과가 1이라면 아직 합성수도 소수도 제대로 확정을 지을 수 없으니 보조정리를 적용한다.
2. 계속해서 1이 나오는 경우에는 결국 $$a^{2d} \equiv 1 \pmod n$$까지 도달하여, 마지막으로 $$a^d \equiv 1\pmod n\ or\ a^d \equiv -1\pmod n$$의 값을 갖게 된다.
3. 이때 결과가 -1이면 밀러-라빈 테스트에 의해 소수일 가능성이 있으며, 만약 -1 or 1이 아니라면 이는 a가 n이 합성수라는것의 증거가 된다.
4. 이 방법은 N을 "아마도" 소수일 것이라고 확률적으로 판정하므로, N이 소수일 확률을 높이기 위해서는 가능한 한 많은 a값으로 테스트해야 한다.
5. int 범위의 N은 a = 2, 7, 61로, long long 범위의 N은 37 이하의 소수들에 대해서만 테스트해도 소수 여부를 확실히 판정할 수 있음이 자명하다.

## 테스트를 여러 소수로 해야하는 이유

밀러 라빈은 계속해서 “아마도 소수”임을 강조한다. 하나의 밑수만으로 테스트했을때는 다음과 같은 문제가 생길 수 있다.

### "아마도 소수"의 이유

**2047**은 강력한 유사 소수의 가장 작은 예시 중 하나이다.

1. **실제**: 2047은 **합성수**이다. (2047=23×89)
2. **테스트**: 밑 a = 2를 사용하여 2047에 밀러-라빈 테스트를 수행해 보자.
    - n−1=2046=21×1023 이므로, s=1, d=1023이다.
    - 테스트의 첫 번째 조건인 $$a^d \pmod{n}$$을 계산한다.
    - $$2^{1023}\pmod {2047}$$을 계산하면 놀랍게도 **1**이 나온다.
3. **결과**: 밀러-라빈 테스트의 첫 번째 조건($$a^d\equiv1$$)을 만족했기 때문에, 알고리즘은 2047을 **"아마도 소수일 것이다"라고 판정**한다.

따라서 **2047**은 밑 **2**에 대한 강력한 유사 소수이며 이것이 바로 밀러-라빈 알고리즘의 '예외' 사례이며 여러 밑수로 테스트를 진행해야하는 이유이다.

## 알고리즘의 특징

밀러-라빈 소수 판정법의 주요 특징은 다음과 같다:

- 확률적 알고리즘이지만, 여러 번 반복하면 매우 높은 정확도를 얻을 수 있다
- 시간 복잡도는 O(k log³ n)이다 (k는 테스트 횟수)

## 구현

```python
basic_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41]

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

primes = []
for n in range(1, int(4e6)):
    if isPrime(n):
        primes.append(n)

print(primes)
```
