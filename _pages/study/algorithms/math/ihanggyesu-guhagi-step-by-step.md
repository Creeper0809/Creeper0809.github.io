---
title: "이항계수 구하기 STEP by STEP"
permalink: /study/algorithms/math/ihanggyesu-guhagi-step-by-step/
math: true
toc: true
---

[상위 페이지 · Math](/study/algorithms/math/)

## 단순 무식(Naive Approach)

단순 무식한 방법은 이항계수의 정의를 그대로 구현하는 것이다. $$_nC_r = \frac{n!}{(r!(n-r)!)}$$의 공식을 직접 계산한다.

장점:

- 구현이 매우 간단하다
- 작은 수에 대해서는 빠르게 결과를 얻을 수 있다

단점:

- n이 커질수록 팩토리얼 계산으로 인한 시간 복잡도가 매우 증가한다 (O(n))
- 큰 수에 대해서는 오버플로우가 발생할 수 있다

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)

def combination_naive(n, r):
    if r > n:
        return 0
    if r == 0 or r == n:
        return 1
    return factorial(n) // (factorial(r) * factorial(n-r))

# 예시
print(combination_naive(5, 2))  # 10
print(combination_naive(10, 3)) # 120

```

실제 사용 예시:

n = 5, r = 2인 경우의 계산 과정

- 5! = 5 × 4 × 3 × 2 × 1 = 120
- 2! = 2 × 1 = 2
- 3! = 3 × 2 × 1 = 6
- $$_5C_2$$ = 120 / (2 × 6) = 10

## 다이나믹 프로그래밍(Dynamic Programming)

파스칼의 삼각형 원리를 이용한 방법이다. 점화식 $$_nC_r = _{n-1}C_r + _{n-1}C_{r-1}$$을 활용하여 중복 계산을 피한다.

파스칼의 삼각형 예시:

```
		 1
    1 1
   1 2 1
  1 3 3 1
 1 4 6 4 1

```

장점:

- 중복 계산을 피할 수 있어 효율적이다
- 메모리를 활용하여 시간을 절약한다
- 모듈러 연산과 함께 사용하기 좋다

단점:

- 추가적인 메모리가 필요하다 (O(nr) 공간복잡도)

```python
def combination_dp(n, r):
    # 2차원 DP 테이블 초기화
    dp = [[0] * (r+1) for _ in range(n+1)]
    
    # 기본 값 설정: nC0 = 1
    for i in range(n+1):
        dp[i][0] = 1
        
    # DP 테이블 채우기
    for i in range(1, n+1):
        for j in range(1, min(i+1, r+1)):
            dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
            
    return dp[n][r]

# 예시
print(combination_dp(5, 2))  # 10
print(combination_dp(10, 3)) # 120

# 모듈러 연산을 포함한 버전
def combination_dp_mod(n, r, mod):
    dp = [[0] * (r+1) for _ in range(n+1)]
    
    for i in range(n+1):
        dp[i][0] = 1
    
    for i in range(1, n+1):
        for j in range(1, min(i+1, r+1)):
            dp[i][j] = (dp[i-1][j-1] + dp[i-1][j]) % mod
            
    return dp[n][r]

```

## 페르마의 소정리(Fermat's Little Theorem)

페르마의 소정리는 모듈러 연산에서 나눗셈을 곱셈으로 바꾸는 방법을 제공한다.

정리: p가 소수이고 a가 p의 배수가 아닐 때, $$a^{(p-1)} ≡ 1\ (mod\ p)$$

이를 이용한 이항계수 계산 과정:

- 기본 수식은 아래와 같다.

$$
_nC_r = \frac{n!}{(r! × (n-r)!)}
$$

- 이를 풀어 쓰면

$$
nCr = \frac{n \times (n-1) \times (n-2) \times \dots \times (n-r+1) \times (n-r) \times \dots \times 1}{[r \times (r-1) \times \dots \times 1] \times [(n-r) \times (n-r-1) \times \dots \times 1]}

$$

- 뒷부분이 공통되므로 수식을 아래와 같이 간단하게 쓸 수 있음

$$
nCr = \frac{n \times (n-1) \times \dots \times (n-r+1)}{r \times (r-1) \times \dots \times 1}
$$

- 모듈러 p에서는 나눗셈 대신 곱셈의 역원을 사용
- r!의 역원은 $$r!^{(p-2)}\ mod\ p$$

```python
def mod_pow(base, exp, mod):
    result = 1
    base %= mod
    while exp > 0:
        if exp & 1:
            result = (result * base) % mod
        base = (base * base) % mod
        exp >>= 1
    return result

def mod_inverse(a, p):
    return mod_pow(a, p-2, p)

def combination_fermat(n, r, p):
    if r > n:
        return 0
    if r == 0 or r == n:
        return 1
    
    # n! mod p 계산
    num = 1
    for i in range(n-r+1, n+1):
        num = (num * i) % p
        
    # r! mod p 계산
    den = 1
    for i in range(1, r+1):
        den = (den * i) % p
        
    # 페르마의 소정리를 이용한 나눗셈
    return (num * mod_inverse(den, p)) % p

# 예시
print(combination_fermat(10, 3, 13))  # 10C3 mod 13

```

## 뤼카 정리(Lucas' Theorem)

뤼카 정리는 이항계수를 소수로 나눈 나머지를 계산할 때 사용하는 매우 강력한 도구이다.

정리: n과 r을 p진법으로 표현했을 때,

nCr mod p = ∏(niCri mod p), 여기서 ni와 ri는 각각 n과 r의 p진법 자릿수이다.

### 예시

예시로 15C3 mod 5를 계산해보면:

먼저 15와 3을 5진법으로 표현:

```
15 = 3 0 (5진법)
     ↓ ↓
    n₁ n₀

3  = 0 3 (5진법)
     ↓ ↓
    r₁ r₀
```

따라서 뤼카 정리에 의해:

15C3 mod 5 = (3C0 mod 5) × (0C3 mod 5)

| 3C0 = 1 |
| --- |
| 0C3 = 0 |

결과: 15C3 mod 5 = 1 × 0 = 0

장점:

- 매우 큰 수의 이항계수도 계산 가능하다
- 모듈러 연산에서 특히 유용하다

단점:

- 소수에 대해서만 적용 가능하다

```python
def get_base_p_digits(n, p):
    digits = []
    while n:
        digits.append(n % p)
        n //= p
    return digits

def lucas_theorem(n, r, p):
    if r > n:
        return 0
    if r == 0:
        return 1
        
    # n과 r을 p진법으로 변환
    n_digits = get_base_p_digits(n, p)
    r_digits = get_base_p_digits(r, p)
    
    # r_digits의 길이가 n_digits보다 크면 0을 반환
    while len(r_digits) < len(n_digits):
        r_digits.append(0)
        
    result = 1
    for ni, ri in zip(n_digits, r_digits):
        if ri > ni:
            return 0
        result = (result * combination_fermat(ni, ri, p)) % p
        
    return result

# 예시
print(lucas_theorem(1000, 500, 13))  # 1000C500 mod 13

```
