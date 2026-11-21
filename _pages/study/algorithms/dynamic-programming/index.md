---
title: "Dynamic Programming"
permalink: /study/algorithms/dynamic-programming/
math: true
toc: true
---

[상위 페이지 · 알고리즘](/study/algorithms/)

## 동적 계획법이란?

동적 계획법(DP)은 컴퓨터 프로그래밍에서 최적화 문제를 해결하기 위한 알고리즘이다. 동적 계획법은 부분 문제들을 풀고, 그 해답을 저장함으로써 전체 문제를 해결하는 방식이다.

예를 들어, 피보나치 수열을 계산하는 문제에서 동적 계획법을 사용할 수 있다. 피보나치 수열은 다음과 같이 정의된다.

$F(n) = \begin{cases}
     0 &\text{if } n = 0 \\
     1 &\text{if } n = 1 \\
     F(n-1) + F(n-2) &\text{if } n > 1
       \end{cases}$

이를 재귀적으로 구현하면 다음과 같이 나온다.

```python
def fibonacci(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n-1) + fibonacci(n-2)
```

하지만 이 코드는 n이 커질수록 $$O(2^N)$$ 으로 느려진다. 이를 해결하기 위해 동적 계획법을 사용할 수 있다. 동적 계획법을 사용하면 중복되는 부분 문제들을 피해 전체 문제를 해결하는 데 필요한 계산을 줄일 수 있다.

예를 들어, 다음과 같이 동적 계획법을 사용하여 피보나치 수열을 구할 수 있다.

```python
def fibonacci(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        fib = [0, 1]
        for i in range(2, n+1):
            fib.append(fib[i-1] + fib[i-2])
        return fib[n]
```

이 코드는 $$O(n)$$ 시간 내에 피보나치 수열을 계산할 수 있다.

### 예시1 : 계단 오르기

예시 1에서 다루는 계단 오르기 문제는 동적 계획법(Dynamic Programming)의 대표적인 예시 중 하나이다. 계단 오르기 문제는 n개의 계단을 오를 때, 1개 또는 2개의 계단씩 오를 수 있을 때, 계단을 오르는 방법의 수를 구하는 문제이다.

예를 들어, 3개의 계단을 오르는 방법은 다음과 같이 3가지가 있다.

- 1계단, 1계단, 1계단
- 1계단, 2계단
- 2계단, 1계단

이 문제를 동적 계획법으로 해결하면, n-1번째 계단에서 1개의 계단을 오르거나, n-2번째 계단에서 2개의 계단을 오르는 방법을 더한 값이 n번째 계단을 오르는 방법의 수가 된다.

아래 코드는 위와 같은 방법으로 계단 오르기 문제를 해결하는 동적 계획법 코드이다.

```python
def climbStairs(n: int) -> int:
    if n == 1:
        return 1
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
```

위 코드에서,

- 입력값 n이 1일 경우 1을 반환한다.
- dp라는 길이가 n+1인 배열을 만든다. 이 배열은 계단을 오르는 방법의 수를 저장한다다.
- dp[1]은 계단이 1개일 경우 1이므로 1로 초기화한다다.
- dp[2]는 계단이 2개일 경우 2가지 방법(1계단, 1계단 또는 2계단)이 있으므로 2로 초기화한다.
- i가 3부터 n까지 반복하면서, dp[i]를 dp[i-1]과 dp[i-2]를 더한 값으로 갱신한다. 이때 dp[i-1]은 n-1번째 계단을 오르는 방법의 수를, dp[i-2]는 n-2번째 계단을 오르는 방법의 수를 나타낸다.
- 마지막으로, dp[n]을 반환한다.

이 코드의 시간 복잡도는 $$O(n)$$ 이다.

### 예시 2: 최대 부분 배열

최대 부분 배열 문제는 주어진 배열에서 가장 큰 합을 가지는 연속 부분 배열을 찾는 문제이다. 예를 들어, 배열 [-2, 1, -3, 4, -1, 2, 1, -5, 4]에서 최대 부분 배열은 [4, -1, 2, 1]이다.

이 문제를 해결하기 위해 다음과 같은 동적 계획법 알고리즘을 사용할 수 있다.

```python
def maxSubArray(nums: List[int]) -> int:
    dp = [0] * len(nums)
    dp[0] = nums[0]
    for i in range(1, len(nums)):
        dp[i] = max(nums[i], nums[i] + dp[i-1])
    return max(dp)
```

1. 배열 dp를 생성한다. dp[i]는 배열 nums의 i번째 수까지 포함한 최대 부분 배열의 합이다.
2. dp[0]를 nums[0]으로 초기화한다.
3. 반복문을 이용해 dp[i]를 계산한다. dp[i]는 nums[i]와 dp[i-1] + nums[i] 중 큰 값을 선택한다. 이때, dp[i-1]은 이전까지의 최대 부분 배열의 합이다.
4. dp 배열에서 가장 큰 값을 반환한다.

위 코드에서 dp[i]는 반드시 nums[i]를 포함하는 최대 부분 배열의 합이 아니다. dp[i]는 nums[i]를 포함할 수도 있고, 포함하지 않을 수도 있다. 이는 dp[i-1] + nums[i]와 nums[i] 중 큰 값을 선택하기 때문이다.

예시 코드에서 dp 배열의 크기는 nums 배열과 동일하다. 이는 dp[i]가 nums[i]를 포함하는 최대 부분 배열의 합임을 나타내게 된다.

시간 복잡도는 $$O(n)$$ 이다.

### 예시 3: 배낭 문제

예시 3에서 다루는 배낭 문제는 동적 계획법(Dynamic Programming)의 대표적인 예시 중 하나이다. 배낭 문제는 정해진 용량을 가진 배낭에 물건을 넣을 때, 가치의 합이 최대가 되도록 물건을 선택하는 문제이다. 예를 들어, 배낭의 용량이 50이고 물건의 가치와 무게가 다음과 같을 때,

| 물건 | 가치 | 무게 |
| --- | --- | --- |
| 1 | 60 | 10 |
| 2 | 100 | 20 |
| 3 | 120 | 30 |

최대 가치는 220이다.

이 문제를 해결하기 위해 다음과 같은 동적 계획법 알고리즘을 사용할 수 있다.

```python
def knapsack(W: int, wt: List[int], val: List[int], n: int) -> int:
    dp = [[0 for x in range(W + 1)] for x in range(n + 1)]

    for i in range(n + 1):
        for j in range(W + 1):
            if i == 0 or j == 0:
                dp[i][j] = 0
            elif wt[i-1] <= j:
                dp[i][j] = max(val[i-1] + dp[i-1][j-wt[i-1]],  dp[i-1][j])
            else:
                dp[i][j] = dp[i-1][j]
    return dp[n][W]
```

위 코드에서,

- W는 배낭의 용량, wt는 물건의 무게, val은 물건의 가치, n은 물건의 개수이다.
- dp라는 n+1행 W+1열의 2차원 배열을 만든다. 이 배열은 물건을 선택할 때마다 가치의 합을 저장한다.
- dp[0][j]는 배낭의 용량이 0일 때 가치의 합이므로 0으로 초기화한다.
- dp[i][0]는 물건을 선택하지 않을 때 가치의 합이므로 0으로 초기화한다.
- wt[i-1] <= j일 때, 즉 배낭의 용량이 물건의 무게보다 크거나 같을 때, dp[i][j]는 다음과 같이 갱신된다.
    
    dp[i][j] = max(val[i-1] + dp[i-1][j-wt[i-1]],  dp[i-1][j])
    
    - val[i-1] + dp[i-1][j-wt[i-1]]는 물건을 선택한 경우, 즉 물건의 가치와 배낭의 용량에서 물건의 무게를 뺀 나머지 용량을 가지고 이전에 선택된 물건들의 가치의 합을 더한 값이다.
    - dp[i-1][j]는 물건을 선택하지 않은 경우, 즉 이전에 선택된 물건들의 가치의 합이다.
    - 두 값을 비교하여 더 큰 값을 dp[i][j]에 저장한다.
- wt[i-1] > j일 때, 즉 배낭의 용량이 물건의 무게보다 작을 때, dp[i][j]는 다음과 같이 갱신된다.
    
    dp[i][j] = dp[i-1][j]
    
    - 이전에 선택된 물건들의 가치의 합을 그대로 dp[i][j]에 저장한다.
- 마지막으로, dp[n][W]를 반환한다.

이 코드의 시간 복잡도는 $$O(nW)$$ 이다.

## 팁

메모이제이션으로 사용되는 리스트의 인덱스는 각 상태일 가능성이 높다

예)

계단 오르기에서 dp[계단 칸수]

가방문제에서는 dp[물건의 개수][물건의 용량] = 가치

동적계획법은 매우 어려운 알고리즘임으로 많은 훈련이 필요하다.

## 최적화 기법

- [소수 모듈러 Subset Sum 최적화](/study/algorithms/dynamic-programming/sosu-modyulreo-subset-sum-coejeoghwa/)

## 문제 해결

- [루비](/study/algorithms/dynamic-programming/ruby/)

- [다이아](/study/algorithms/dynamic-programming/diamond/)

- [플레티넘](/study/algorithms/dynamic-programming/platinum/)

- [골드/레벨 3](/study/algorithms/dynamic-programming/gold-level-3/)

- [실버](/study/algorithms/dynamic-programming/silver/)
