---
title: "오일러 피 함수"
permalink: /study/algorithms/math/oilreo-pi-hamsu/
math: true
toc: true
excerpt: "한마디로 이 오일러의 피 함수를 이용하여 x의 서로소 개수를 구하는 것이다"
categories: ["알고리즘"]
tags: ["수학", "정수론", "오일러 피 함수"]
---

[상위 페이지 · Math](/study/algorithms/math/)

## 정의

$$\phi(x)$$라고 쓰며 phi라고 읽는다.

$$\phi(x)$$는 x와 서로소이며 0≤k<x인 숫자의 집합 개수이다 이를 수식적으로 나타내면 다음과 같다.

$$
\phi(x) = \|\{k \in \mathbb{Z^+} : k < x\ and\ gcd (x,k) = 1\}\|
$$

- $$\mathbb{Z^+}$$ : 양의 정수 범위
- ||집합|| : 집합의 개수
- $$a\in b$$ : a는 b 집합의 포함 관계
- gcd(x,k) = n : x,k의 최대공약수가 n

한마디로 이 오일러의 피 함수를 이용하여 x의 서로소 개수를 구하는 것이다

- $$\phi(4) = 1,2,3\ 중\ 4와\ 서로소는\ 1,3 = 2$$
- $$\phi(7) = 1,2,3,4,5,6은\ 7과\ 모두\ 서로소이기에 = 6$$

## STEP 1 간단하게 구하기

간단하게 구하는것은 아주 쉽다.

1. 1~N까지 모두 N과 gcd해보며 그 값이 1인것을 찾으면 된다

```python
import math

N = int(input())
count = 0
for i in range(1,N):
    if math.gcd(N,i) == 1:
        count+=1
print(count)
```

하지만 이러한 방법은 시간복잡도가 NlogN이며 1e10 이상의 값도 다루는 정수론에 적합하진 않다.

## STEP 2 오일러 피 함수 성질

**성질 1. 오일러 피 함수는 곱셈적이다 ab = a * b로 나타낼 수 있다는것이다**

$$
\phi(\alpha \beta) = \phi(\alpha)\phi(\beta)
$$

**성질 2.  소수 p의 거듭제곱에 대한 성질**

$$
\phi(p^a) = p^a - p^{a-1}
$$

1.  p가 소수(prime)이면, $$p^a$$ 와 서로소가 아닌(즉, 공약수가 1이 아닌) 자연수는 오직p를 인수로 갖는 수뿐이다.
    1. 예 p = 2, a = 3일때 $$p^a$$= 8 이때 8과 서로소가 아닌 수는 2의 배수 2 4 6이다.
2. 1부터 $$p^a$$  까지 중에서 p의 배수는 몇 개?
    - 가장 작은 배수는 p이고, 가장 큰 배수는 $$p^a$$ 이며 공차가 p인 등차수열임으로 배수의 개수는 $$\frac{p^a}{p} = p^{a-1}$$개이다.
3. 고로 전체개수 $$p^a$$ 에서 $$p^{a-1}$$ 을 빼주면 서로소의 개수가 된다.

예시

- p = 2, a = 3
    - $$\phi(8 =2^3) = (2^3) - 2^{3-1} = 8-4 = 4$$
- p = 3, a = 2
    - $$\phi(9 =3^2) = (3^2) - 3^{2-1} = 9-3 = 6$$

**성질 3. 소수 p에 대한 오일러 피 함수 값은 p-1**

이는 p가 소수이기에 자신을 제외한 모든 수와 서로소이기 때문

$$
\phi(p) = p -1
$$

예시

- p = 7
    - $$\phi(7) = 7-1$$
- p = 11
    - $$\phi(11) = 11-1$$

위 성질에 대한 증명은 [여기](https://m.blog.naver.com/yyhjin12/222864062441)

## STEP 3 최적화

**방법 1. 위 성질과 소인수 분해의 특성을 이용하면 최적화가 가능하다**

x를 소인수분해 하면 아래와 같이 표현이 가능하다

$$
x = (p_1^{a_1})(p_2^{a_2})(p_3^{a_3}) ...(p_k^{a_k})
$$

여기서 p는 소수임으로 각각의 p끼리는 서로소이다. 그러므로 성질 1을 이용해 다음과 같이 표현할 수 있다.

$$
\phi(x) = \phi(p_1^{a_1})\phi(p_2^{a_2})\phi(p_3^{a_3}) ...\phi(p_k^{a_k})
$$

여기서 각각의 오일러 피 함수의 값은 성질2,3을 이용해 구할 수 있다

예시

- $$\phi(12) = \phi(2^2)  \phi(3) = (2^2-2^{2-1}) * (3-1) = (4-2)*2 = 4$$

**방법2. 비율을 이용하여 오일러 피 함수를 구하는 방법도 있다.**

$$
\phi(x) = x\prod_{p(단\ p는\ x의\ 소인수)|x}(1-\frac{1}{p})
$$

예시

- $$\phi(12) = 12 *(1-\frac{1}{2})*(1-\frac{1}{3})$$
- $$\phi(15) = 15 * (1-\frac{1}{3}) * (1-\frac{1}{5})$$

## STEP 4 구현

방법 1을 이용한 구현

```python
def phi(n):
    # 에라토스테네스의 체를 이용한 소수 구하기
    prime = [True] * (n + 1)
    prime[0] = prime[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if prime[i]:
            for j in range(i * i, n + 1, i):
                prime[j] = False
    
    result = 1
    for i in range(2,n):
	    if not prime[i] : coninue
		  cnt = 0
		  while not N%i:
			  cnt += 1
			  N =// i
			if cnt == 1: result *= i-1
			else result *= int(pow(i,cnt))-int(pow(i,cnt-1))
    if N != 1:
	    result *= N-1
    return result
```

방법 2를 이용한 구현

```python
answer = n
# 2부터 n의 제곱근까지의 모든 수 확인
# phi(x) = phi(a)phi(b)꼴로 나타내질때 a,b중 하나는 root(x)이어야함
for i in range(2, int(math.sqrt(n)) + 1):
    if n % i == 0:
        # n에서 i를 나눌 수 있는 만큼 나눠줌, p^a꼴로 나올때 중복하여 계산하지 않기 위함
        while n % i == 0:
            n //= i
        # 오일러 피 함수: (1 - 1/i)
        answer = answer * (1 - 1/i)
# 자기 자신이 소수임 
if n > 1:
    answer = answer * (1 - 1/n)
print(int(answer))
```

## STEP 5 고급 기술 (폴라드 로 알고리즘)

[**Pollard's rho**](/study/algorithms/math/pollard-s-rho/) 알고리즘을 이용해서 소인수 분해를 하면 더 빠르게 오일러 피 값을 구할 수 있다.

```python
import math
import random

# 기본 소수 목록은 밀러-라빈 판정에 사용될 베이스 값들이다.
# 64비트 정수 범위 내에서는 이 목록으로 충분히 높은 정확도를 보장한다.
BASIC_PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]

# 모듈러 거듭제곱 (a^b % m)
# (a * b) % m = ((a % m) * (b % m)) % m 성질을 이용해
# 큰 수의 거듭제곱도 오버플로우 없이 빠르게 계산하는 함수이다.
def power(x, y, p):
    res = 1
    x = x % p
    while y > 0:
        if y % 2 == 1:
            res = (res * x) % p
        y = y >> 1  # y //= 2
        x = (x * x) % p
    return res

# 밀러-라빈 소수 판정법
# 페르마 소정리를 기반으로 한 확률적 소수 판정 알고리즘이다.
# 큰 수가 소수인지 아닌지를 매우 빠르고 정확하게 판별할 수 있다.
def miller_rabin(n, a):
    if a % n == 0:
        return True
        
    k = n - 1
    while True:
        x = power(a, k, n)
        if x == n - 1:
            return True
        if k % 2 == 1:
            return (x == 1 or x == n - 1)
        k //= 2

# is_prime은 밀러-라빈 테스트를 여러 번 수행하여 판정의 정확도를 높이는 함수이다.
def is_prime(n):
    if n < 2:
        return False
    if n in BASIC_PRIMES:
        return True
    if n % 2 == 0:
        return False
        
    for a in BASIC_PRIMES:
        if not miller_rabin(n, a):
            return False
    return True

# 폴라드 로 소인수분해 알고리즘
# 임의의 수 N의 소인수 하나를 찾는 확률적 알고리즘이다.
# 사이클 탐지 기법을 이용하여 효율적으로 약수를 찾는다.
def pollards_ro(n):
    if is_prime(n):
        return n
    if n % 2 == 0:
        return 2
    
    # f(x) = (x^2 + c) % n 형태의 함수를 사용한다.
    # x와 y는 서로 다른 속도로 움직이는 포인터이다.
    x = random.randrange(2, n)
    y = x
    c = random.randrange(1, n)
    g = 1

    f = lambda val: (val**2 + c) % n

    while g == 1:
        x = f(x)
        y = f(f(y))
        # abs(x-y)와 n의 최대공약수가 1이 아니면 약수를 찾은 것이다.
        g = math.gcd(abs(x - y), n)

    if g == n:
        # 실패한 경우, 다른 랜덤 값으로 다시 시도하는 것이다.
        return pollards_ro(n)
    
    # 찾은 약수 g가 소수가 아닐 수 있으므로, g를 다시 소인수분해한다.
    return pollards_ro(g)

# 오일러 피 함수 (Euler's Totient Function)
# phi(n)은 n에 모든 서로 다른 소인수 p에 대해 (1 - 1/p)를 곱한 값과 같으며,
# 이는 정수 연산으로 result -= result // p 가 되는 것이다.
def euler_phi(n):
    if n == 1:
        return 1

    result = n
    temp_n = n
    
    # temp_n이 1이 될 때까지 소인수를 계속 찾고 나누는 과정이다.
    while temp_n > 1:
        # 폴라드 로 알고리즘으로 소인수 p 하나를 찾는다.
        p = pollards_ro(temp_n)
        
        # 찾은 소인수 p로 오일러 피 함수 값을 갱신한다.
        result -= result // p
        
        # temp_n에서 p를 모두 제거한다.
        while temp_n % p == 0:
            temp_n //= p
            
    return result

if __name__ == "__main__":
    # --- 예시 출력 ---
    print("--- 오일러 피 함수 계산 예시 ---")
    
    # 예시: 소수 (p) -> phi(p) = p - 1
    n1 = 13
    print(f"phi({n1}) = {euler_phi(n1)}") # 예상 결과: 12
    
    # 예시: 소수의 거듭제곱 (p^k) -> phi(p^k) = p^k - p^(k-1)
    n2 = 8 # 2^3
    print(f"phi({n2}) = {euler_phi(n2)}") # 예상 결과: 4
    
    # 예시: 두 소수의 곱 (p1 * p2)
    n3 = 77 # 7 * 11
    print(f"phi({n3}) = {euler_phi(n3)}") # 예상 결과: (7-1)*(11-1) = 60
    
    # 예시: 일반적인 합성수
    n4 = 100 # 2^2 * 5^2
    print(f"phi({n4}) = {euler_phi(n4)}") # 예상 결과: 40
```
