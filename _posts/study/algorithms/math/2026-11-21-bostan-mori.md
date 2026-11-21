---
title: "Bostan-Mori"
permalink: /study/algorithms/math/bostan-mori/
math: true
toc: true
excerpt: "Bostan-Mori 알고리즘의 핵심은 유리 함수의 계수를 구하는 문제를 반복적으로 절반씩 줄여나가는 분할 정복 기법이다. 이 과정에서 분모 다항식의 홀수 차수 항과 짝수 차수 항을 분리하는 독창적인 아이디어를 사용한다."
categories: ["알고리즘"]
tags: ["수학", "Bostan-Mori"]
---

[상위 페이지 · Math](/study/algorithms/math/)

### 배경지식

- [유리 함수 형태의 생성함수](/study/algorithms/math/saengseong-hamsu/)
- [Fast Fourier Transform](/study/algorithms/math/fast-fourier-transform/)

## 1. 개요

Bostan-Mori 알고리즘은 유리 함수 형태의 생성함수 $$F(x) = \frac{P(x)}{Q(x)}$$에서 $$[x^n]F(x)$$ (즉, $$n$$번째 계수)를 $$O(M(n) \log n)$$ 시간에 계산하는 알고리즘이다. 여기서 $$M(n)$$은 $$n$$차 다항식 곱셈의 시간 복잡도로, FFT를 사용하면 $$O(n \log n)$$이다.

선형 점화식을 만족하는 수열의 $$n$$번째 항을 계산하거나, 조합론적 생성함수의 계수를 구하는 등 다양한 문제에 응용된다.

## 2. 핵심 원리 및 유도

Bostan-Mori 알고리즘의 핵심은 유리 함수의 계수를 구하는 문제를 반복적으로 절반씩 줄여나가는 분할 정복 기법이다. 이 과정에서 분모 다항식의 홀수 차수 항과 짝수 차수 항을 분리하는 독창적인 아이디어를 사용한다.

## 2.1 문제의 재정의

유리 함수 $$F(x) = \frac{P(x)}{Q(x)}$$가 주어졌을 때, $$[x^n]F(x)$$를 효율적으로 계산한다.

**기본 관찰:**

테일러 급수 전개를 생각하면, $$F(x) = \sum_{i=0}^{\infty} a_i x^i$$로 쓸 수 있고, 우리가 구하고자 하는 값은 $$a_n$$이다.

직접 계산하면 $$P(x) = Q(x) \cdot F(x)$$이므로:

$$
\sum_{i=0}^{\deg P} p_i x^i = \left(\sum_{i=0}^{\deg Q} q_i x^i\right) \left(\sum_{i=0}^{\infty} a_i x^i\right)
$$

양변의 $$x^n$$ 계수를 비교하면 선형 점화식을 얻을 수 있지만, 이를 직접 풀면 $$O(n \deg Q)$$ 시간이 걸린다. Bostan-Mori는 이를 $$O(M(n) \log n)$$으로 개선한다.

## 2.2 분모의 홀짝 분리

**핵심 관찰:** 다항식 $$Q(x)$$를 짝수 차수 항과 홀수 차수 항으로 분리할 수 있다.

$$
Q(x) = Q_{\text{even}}(x^2) + x \cdot Q_{\text{odd}}(x^2)
$$

여기서:

- $$Q_{\text{even}}(x^2)$$는 $$Q(x)$$의 짝수 차수 항들만 모은 것
- $$Q_{\text{odd}}(x^2)$$는 $$Q(x)$$의 홀수 차수 항들의 계수만 모은 것

**예시:**

$$Q(x) = 2 + 3x + 5x^2 + 7x^3$$이면:

- $$Q_{\text{even}}(x^2) = 2 + 5x^2$$
- $$Q_{\text{odd}}(x^2) = 3 + 7x^2$$
- $$Q(x) = (2 + 5x^2) + x(3 + 7x^2)$$

**음수 대입의 의미:**

$$x$$ 대신 $$-x$$를 대입하면:

$$
Q(-x) = Q_{\text{even}}(x^2) - x \cdot Q_{\text{odd}}(x^2)
$$

따라서:

$$
Q(x) \cdot Q(-x) = Q_{\text{even}}(x^2)^2 - x^2 \cdot Q_{\text{odd}}(x^2)^2
$$

이는 $$x^2$$에 대한 다항식이 되며, 홀수 차수 항이 모두 소거된다

## 2.3 차수 축소 과정

**단계 1: 분자 변환**

분자 $$P(x)$$에도 같은 작업을 수행한다:

$$
P(x) \cdot Q(-x) = \underbrace{P(x) Q(-x)}_{\text{새로운 분자}}
$$

**단계 2: 핵심 등식**

다음 두 유리 함수를 고려하자:

$$
F(x) = \frac{P(x)}{Q(x)}, \quad F(-x) = \frac{P(-x)}{Q(-x)}
$$

그러면:

$$
\frac{P(x)Q(-x) + P(-x)Q(x)}{Q(x)Q(-x)} = F(x) + F(-x)
$$

$$
\frac{P(x)Q(-x) - P(-x)Q(x)}{Q(x)Q(-x)} = F(x) - F(-x)
$$

**단계 3: 짝수/홀수 계수 추출**

중요한 관찰:

- $$F(x) + F(-x) = 2\sum_{i=0}^{\infty} a_{2i} x^{2i}$$ (짝수 계수만 남음)
- $$F(x) - F(-x) = 2\sum_{i=0}^{\infty} a_{2i+1} x^{2i+1}$$ (홀수 계수만 남음)

따라서:

- $$n$$이 짝수이면:
    
    $$
    [x^n]F(x) = [x^n](F(x) + F(-x))/2 = [x^{n/2}]\frac{P(x)Q(-x) + P(-x)Q(x)}{2Q(x)Q(-x)}
    $$
    
- $$n$$이 홀수이면:
    
    $$
    [x^n]F(x) = [x^{n-1}](F(x) - F(-x))/(2x) = [x^{(n-1)/2}]\frac{P(x)Q(-x) - P(-x)Q(x)}{2xQ(x)Q(-x)}
    $$
    

**단계 4: 재귀 구조**

핵심은 $$Q(x)Q(-x)$$가 $$x^2$$에 대한 다항식이라는 점이다:

$$
Q(x)Q(-x) = R(x^2)
$$

따라서 원래 문제 $$[x^n]\frac{P(x)}{Q(x)}$$가 다음으로 축소된다:

- $$n$$이 짝수: $$[x^{n/2}]\frac{P'(x)}{R(x)}$$ (문제 크기가 절반으로)
- $$n$$이 홀수: $$[x^{(n-1)/2}]\frac{P'(x)}{R(x)}$$ (문제 크기가 절반으로)

여기서 $$P'(x)$$는 $$n$$의 홀짝성에 따라 적절히 계산된 새로운 분자이다.

**시간 복잡도 분석:**

매 단계에서:

- 다항식 곱셈 $$P(x)Q(-x)$$ 등: $$O(M(n))$$
- 문제 크기가 절반으로: $$n \to n/2$$

재귀 관계식:

$$
T(n) = T(n/2) + O(M(n))
$$

$$M(n) = O(n \log n)$$ (FFT 사용 시)이면:

$$
T(n) = O(n \log n) + O(n/2 \cdot \log(n/2)) + \cdots = O(n \log^2 n)
$$

이는 직접 계산하는 $$O(n \deg Q)$$보다 훨씬 빠르며, 행렬 거듭제곱의 $$O(k^3 \log n)$$ (여기서 $$k = \deg Q$$)보다도 우수하다.

## 3. 알고리즘 상세

## 3.1 입력 및 출력

**입력:**

- 분자 다항식 $$P(x) = p_0 + p_1x + \cdots + p_mx^m$$ (계수 리스트 $$[p_0, p_1, \ldots, p_m]$$)
- 분모 다항식 $$Q(x) = q_0 + q_1x + \cdots + q_dx^d$$ (계수 리스트 $$[q_0, q_1, \ldots, q_d]$$)
- 구하고자 하는 계수의 인덱스 $$n$$

**출력:**

- $$[x^n]\frac{P(x)}{Q(x)}$$ (즉, 생성함수의 $$n$$번째 계수)

**전제 조건:**

- $$Q(0) \neq 0$$ (분모가 0에서 역수를 가져야 한다)
- $$\deg P < \deg Q$$ (일반적인 경우, 그렇지 않으면 다항식 나눗셈을 먼저 수행한다)

## 3.2 핵심 서브루틴: 다항식 연산

Bostan-Mori 알고리즘은 다음 다항식 연산들을 기반으로 동작한다:

### 3.2.1 다항식 곱셈

```python
def poly_mul(A, B):
    """
    두 다항식의 곱셈을 FFT를 이용하여 O(n log n)에 계산한다.
    A(x) * B(x)를 반환한다.
    """
    if not A or not B:
        return [0]
    
    # FFT를 사용한 고속 곱셈
    from numpy.fft import fft, ifft
    
    n = len(A) + len(B) - 1
    size = 1
    while size < n:
        size <<= 1
    
    A_padded = A + [0] * (size - len(A))
    B_padded = B + [0] * (size - len(B))
    
    fft_A = fft(A_padded)
    fft_B = fft(B_padded)
    fft_C = fft_A * fft_B
    
    C = ifft(fft_C).real[:n]
    return [round(c) for c in C]  # 정수 계수인 경우

```

**시간 복잡도:** $$O(n \log n)$$ (FFT 사용 시)

### 3.2.2 다항식의 홀짝 분리

```python
def poly_split(P):
    """
    P(x)를 짝수 차수 항과 홀수 차수 항으로 분리한다.
    P(x) = P_even(x^2) + x * P_odd(x^2)
    
    반환: (P_even, P_odd)
    """
    P_even = [P[i] for i in range(0, len(P), 2)]  # 짝수 인덱스
    P_odd = [P[i] for i in range(1, len(P), 2)]   # 홀수 인덱스
    
    return P_even, P_odd

```

**예시:**

$$P(x) = 1 + 2x + 3x^2 + 4x^3 + 5x^4$$일 때:

- $$P_{\text{even}} = [1, 3, 5]$$ → $$1 + 3x^2 + 5x^4 = P_{\text{even}}(x^2)$$
- $$P_{\text{odd}} = [2, 4]$$ → $$2 + 4x^2 = P_{\text{odd}}(x^2)$$

### 3.2.3 다항식의 음수 대입

```python
def poly_negate(P):
    """
    P(-x)를 계산한다.
    홀수 차수 항의 부호를 반전한다.
    """
    return [P[i] if i % 2 == 0 else -P[i] for i in range(len(P))]

```

 $$P(x) = \sum_{i=0}^{d} p_i x^i$$일 때, $$P(-x) = \sum_{i=0}^{d} p_i (-x)^i = \sum_{i=0}^{d} p_i (-1)^i x^i$$이다.

## 3.3 메인 알고리즘: 재귀 구조

### 3.3.1 알고리즘 개요

Bostan-Mori 알고리즘은 다음과 같은 재귀 관계를 반복 적용한다:

$$
[x^n]\frac{P(x)}{Q(x)} = \begin{cases}
[x^{n/2}]\frac{P(x)Q(-x) + P(-x)Q(x)}{2Q(x)Q(-x)} & \text{if } n \text{ is even} \\
[x^{(n-1)/2}]\frac{P(x)Q(-x) - P(-x)Q(x)}{2xQ(x)Q(-x)} & \text{if } n \text{ is odd}
\end{cases}
$$

### 3.3.2 전체 구현

```python
def bostan_mori(P, Q, n):
    """
    [x^n](P(x)/Q(x))를 O(M(n) log n) 시간에 계산한다.
    
    Args:
        P: 분자 다항식의 계수 리스트 [p_0, p_1, ..., p_m]
        Q: 분모 다항식의 계수 리스트 [q_0, q_1, ..., q_d]
        n: 구하고자 하는 계수의 인덱스
    
    Returns:
        [x^n](P(x)/Q(x))
    """
    # 기저 사례: n = 0
    if n == 0:
        return P[0] / Q[0]
    
    # Step 1: Q(-x) 계산
    Q_neg = poly_negate(Q)
    
    # Step 2: 새로운 분자와 분모 계산
    # 분자: P(x)Q(-x) ± P(-x)Q(x)
    # 분모: Q(x)Q(-x)
    
    P_neg = poly_negate(P)
    
    # P(x) * Q(-x) 계산
    PQ_neg = poly_mul(P, Q_neg)
    
    # P(-x) * Q(x) 계산
    P_negQ = poly_mul(P_neg, Q)
    
    # 분모: Q(x) * Q(-x)
    QQ_neg = poly_mul(Q, Q_neg)
    
    # Step 3: n의 홀짝성에 따라 분기
    if n % 2 == 0:
        # n이 짝수: 분자 = P(x)Q(-x) + P(-x)Q(x)
        numerator = [PQ_neg[i] + P_negQ[i] for i in range(len(PQ_neg))]
        
        # 짝수 계수만 추출 (x^2의 계수로 변환)
        numerator_new = [numerator[i] for i in range(0, len(numerator), 2)]
    else:
        # n이 홀수: 분자 = (P(x)Q(-x) - P(-x)Q(x)) / x
        numerator = [PQ_neg[i] - P_negQ[i] for i in range(len(PQ_neg))]
        
        # x로 나누기 = 계수를 한 칸씩 앞으로
        numerator = numerator[1:]
        
        # 홀수 계수만 추출 (x^2의 계수로 변환)
        numerator_new = [numerator[i] for i in range(0, len(numerator), 2)]
    
    # 분모의 짝수 계수만 추출
    denominator_new = [QQ_neg[i] for i in range(0, len(QQ_neg), 2)]
    
    # Step 4: 재귀 호출
    return bostan_mori(numerator_new, denominator_new, n // 2)

```

### 3.3.3 단계별 분석

**Step 1: 음수 대입**

$$Q(-x)$$를 $$O(d)$$ 시간에 계산한다 (여기서 $$d = \deg Q$$).

**Step 2: 분자/분모 변환**

- $$P(x) \cdot Q(-x)$$ 계산: $$O(M(n))$$
- $$P(-x) \cdot Q(x)$$ 계산: $$O(M(n))$$
- $$Q(x) \cdot Q(-x)$$ 계산: $$O(M(n))$$

**Step 3: 홀짝성 분기**

$$n$$이 짝수인 경우:

- 분자 = $$P(x)Q(-x) + P(-x)Q(x)$$
- 이는 짝수 차수 항만 가지므로 $$x^2$$에 대한 다항식이다
- 짝수 인덱스 계수만 추출하여 새로운 분자를 구성한다

$$n$$이 홀수인 경우:

- 분자 = $$(P(x)Q(-x) - P(-x)Q(x)) / x$$
- $$x$$로 나누면 홀수 차수 항이 짝수 차수로 변환된다
- 원래 홀수 인덱스였던 계수들이 새로운 짝수 인덱스가 된다

**Step 4: 재귀 호출**

문제가 $$[x^{n/2}]\frac{P'(x)}{Q'(x)}$$ 형태로 변환되어 크기가 절반으로 축소된다.
