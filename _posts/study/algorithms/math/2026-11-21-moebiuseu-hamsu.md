---
title: "뫼비우스 함수"
permalink: /study/algorithms/math/moebiuseu-hamsu/
math: true
toc: true
excerpt: "뫼비우스 함수(Möbius function)는 정수론에서 중요하게 사용되는 산술 함수이다. 이 함수는 다음과 같이 정의된다."
---

[상위 페이지 · Math](/study/algorithms/math/)

## 선행지식

- X

## 설명

뫼비우스 함수(Möbius function)는 정수론에서 중요하게 사용되는 산술 함수이다. 이 함수는 다음과 같이 정의된다.

$\mu(n)=\begin{cases}
1,&\text{if }n=1\\
(-1)^r,&\text{if }e_1=e_2=\cdots=e_r =1 , (\text{Free SqaureNumber})\\
0,&\text{otherwise}
\end{cases}$

- n이 1일 때, μ(n) = 1
- n이 소수의 거듭제곱일 때, μ(n) = -1
- n이 서로 다른 k개의 소수의 곱일 때, μ(n) = (-1)^k
- n이 어떤 소수의 거듭제곱을 포함할 때, μ(n) = 0

## 예시

1부터 10까지의 자연수 중에서 square free인 수의 개수를 구해보자.

자연수 1부터 10까지의 뫼비우스 함수 값은 다음과 같다.

- μ(1) = 1
- μ(2) = -1
- μ(3) = -1
- μ(4) = 0
- μ(5) = -1
- μ(6) = 1
- μ(7) = -1
- μ(8) = 0
- μ(9) = 0
- μ(10) = 1

따라서 뫼비우스 함수 값이 0이 아닌 자연수는 1, 2, 3, 5, 6, 7, 10이 있으므로 정답은 7이다.

이를 포함배제 원리를 이용해서 총 개수를 구할 수 있다.

n개 중에서 Square Free Number를 구하려면 전체 n개에서 Non Square Free Number의 개수를 빼면 된다.

- μ(2) = n개 - 1 * (n//2*2)
- μ(3) = -1
- μ(4) = 0
- μ(5) = -1

…

이런 식으로 $$\sqrt{n}$$번까지 계산하면 된다.

$$\sqrt{n}$$번까지만 계산해도 되는 이유는 $$\sqrt{n}$$을 넘어가면 n//i*i가 0이 되어 의미가 없기 때문이다.

## 코드 구현

```python
def mobius(n):
    # n이 1인 경우
    if n == 1:
        return 1

    # n이 square free number가 아닌 경우
    factorization = factorize(n)
    for prime in factorization:
        if factorization[prime] > 1:
            return 0

    # 뫼비우스 함수 값을 계산
    return (-1) ** len(factorization)

def factorize(n):
    factors = {}  # 소인수분해 결과를 저장할 딕셔너리
    d = 2  # 소수를 찾을 시작점
    while d * d <= n:
        while (n % d) == 0:
            # n이 d로 나누어 떨어질 때마다, d의 지수를 1 증가시키고
            # n을 d로 나누어줌
            factors[d] = factors.get(d, 0) + 1
            n //= d
        d += 1
    if n > 1:
        factors[n] = 1
    return factors
```

위의 코드에서 factorize(n) 함수는 n을 소인수분해하여 딕셔너리 형태로 반환한다. mobius(n) 함수는 factorize(n) 함수를 사용하여 n의 소인수분해 결과를 구하고, 이를 바탕으로 뫼비우스 함수 값을 계산한다.

위 코드를 실행하면 다음과 같은 결과를 얻을 수 있다.

```
>> mobius(1)
1
>>> mobius(2)
-1
>>> mobius(30)
0
>>> mobius(84)
0
>>> mobius(120)
0
>>> mobius(2310)
-1
```

에라토스테네스의 체의 원리를 활용하여 뫼비우스 함수를 더 최적화할 수 있다.

```python
def mobius(n):
    # n이 1인 경우
    if n == 1:
        return 1

    # 소인수분해를 하면서 뫼비우스 함수 값을 계산
    factorization = {}
    for d in range(2, int(n ** 0.5) + 1):
        while n % d == 0:
            # n을 d로 나누어 떨어지게 만들기 위해 n을 d로 나누고,
            # d의 지수를 1 증가시킴
            n //= d
            factorization[d] = factorization.get(d, 0) + 1
    if n > 1:
        # 마지막으로 남은 소수도 factorization에 저장
        factorization[n] = 1

    # n이 square free number가 아닌 경우
    for prime in factorization:
        if factorization[prime] > 1:
            return 0

    # 뫼비우스 함수 값을 계산
    return (-1) ** len(factorization)
```

다음은 코드의 설명이다.

```python
# n이 1인 경우
if n == 1:
    return 1
```

n이 1인 경우, 뫼비우스 함수 값은 1이므로 바로 1을 반환한다.

```python
# 소인수분해를 하면서 뫼비우스 함수 값을 계산
factorization = {}
for d in range(2, int(n ** 0.5) + 1):
    while n % d == 0:
        # n을 d로 나누어 떨어지게 만들기 위해 n을 d로 나누고,
        # d의 지수를 1 증가시킴
        n //= d
        factorization[d] = factorization.get(d, 0) + 1
if n > 1:
    # 마지막으로 남은 소수도 factorization에 저장
    factorization[n] = 1
```

n을 소인수분해하기 위해 factorization 딕셔너리를 만든다. range 함수를 이용하여 2부터 int(n ** 0.5) + 1까지의 수 중 소수를 하나씩 가져와서, n이 그 소수로 나누어 떨어지는 경우에는 n을 그 소수로 나누고, 딕셔너리에 소수와 그 지수를 저장한다. 마지막으로, n이 1이 되지 않은 경우, 남은 소수도 factorization에 저장한다.

```python
# n이 square free number가 아닌 경우
for prime in factorization:
    if factorization[prime] > 1:
        return 0
```

factorization 딕셔너리에 저장된 소인수분해 결과를 이용하여 n이 square free number인지 판단한다. square free number란 어떤 수를 소수의 거듭제곱으로 나타낼 수 없는 수를 말한다. 따라서 factorization 딕셔너리에 저장된 값 중 2 이상인 값이 있다면, n은 square free number가 아니므로 0을 반환한다.

```python
# 뫼비우스 함수 값을 계산
return (-1) ** len(factorization)
```

n이 square free number이고 factorization 딕셔너리에 저장된 값이 모두 1인 경우, 뫼비우스 함수 값은 (-1)의 지수로 나타난다. 이 지수는 factorization 딕셔너리에 저장된 소수의 개수로 결정된다. 따라서 (-1)의 지수가 소수의 개수와 일치하도록 뫼비우스 함수 값을 반환한다.

위 코드는 factorization 딕셔너리에 소인수분해 결과를 저장하고, 소인수분해가 완료되면 뫼비우스 함수 값을 계산한다. 이 과정에서 소인수분해를 할 때 범위를 2부터 int(n ** 0.5) + 1까지로 한정하여 소수만 체크한다. 이렇게 하면 시간 복잡도가 O(n)에서 O(sqrt(n))으로 크게 개선된다.

하지만 현실적으로 매번 계산하는 것도 비효율적이므로 한 번에 구해놓는다.

```python
# 뫼비우스 함수의 값을 계산하여 mobius 리스트에 저장
mobius = [0] * n
mobius[1] = 1
for i in range(1, n):
    if mobius[i]:
        for j in range(i * 2, n, i):
            mobius[j] -= mobius[i]
```

- mobius 리스트: 0부터 n-1까지의 뫼비우스 함수 값을 저장하는 리스트
- mobius[1] = 1: 뫼비우스 함수의 초기값을 지정하는 부분. 모든 자연수의 뫼비우스 함수 값은 1, -1, 0 중 하나이므로, mobius[1]의 값을 1로 지정한다.
- if mobius[i]: mobius[i] 값이 0이 아닌 경우에만 계산을 수행한다. 이는 아직 계산되지 않은 수에 대해서만 계산하기 위함이다.
- for j in range(i * 2, n, i): i의 배수에 대해서 뫼비우스 함수 값을 계산하고 저장한다.
- mobius[j] -= mobius[i]: j의 뫼비우스 함수 값을 계산하는 부분이다. j의 뫼비우스 함수 값은 j의 소인수분해 결과에 따라 다음과 같이 결정된다.
    - j가 소수의 거듭제곱으로 나타나지 않는 경우: j의 소인수 중 k개가 서로 다른 소수이며, 각 소수의 지수가 1일 때 뫼비우스 함수 값은 (-1)^k가 된다.
    - j가 소수의 거듭제곱으로 나타나는 경우: 뫼비우스 함수 값은 -1이 된다.
    - j가 어떤 소수의 거듭제곱을 포함하는 경우: 뫼비우스 함수 값은 0이 된다.
    - 따라서 j의 뫼비우스 함수 값을 계산하려면 j의 소인수분해 결과를 알아야 한다. i의 소인수분해 결과를 이용하여 j의 소인수분해 결과를 추정할 수 있다. i가 j의 약수이므로, i의 뫼비우스 함수 값이 이미 계산되어 있다면 i의 소인수분해 결과를 이용하여 j의 뫼비우스 함수 값을 계산할 수 있다. 따라서 mobius[j] -= mobius[i] 부분은 i가 j의 약수인 경우에만 계산된다.
    - 예를 들어, i=2, j=6인 경우, i는 j의 약수이므로 2의 뫼비우스 함수 값이 이미 계산되어 있다면 6의 뫼비우스 함수 값은 다음과 같이 계산할 수 있다.
    이때 mobius[2]는 -1 혹은 1이므로, mobius[6]의 값이 결정된다.
        
        ```
        mobius[6] = mobius[6] - mobius[2]
        ```
        
    - 이러한 방법으로 1부터 n-1까지의 모든 자연수에 대한 뫼비우스 함수 값을 계산하고 mobius 리스트에 저장한다.

이 방법을 많이 사용한다.
