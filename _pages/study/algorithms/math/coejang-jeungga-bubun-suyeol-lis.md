---
title: "최장 증가 부분 수열(LIS)"
permalink: /study/algorithms/math/coejang-jeungga-bubun-suyeol-lis/
math: true
---

[상위 페이지 · Math](/study/algorithms/math/)

## 선행 지식

- 다이나믹 프로그래밍

## 설명

최장 증가 부분 수열(Longest Increasing Subsequence)은 주어진 수열에서 증가하는 부분 수열 중 가장 긴 것을 찾는 문제이다.

예를 들어, {10, 20, 10, 30, 40, 50}이라는 수열이 주어졌을 때, 이 수열의 최장 증가 부분 수열은 {10, 20, 30, 40, 50}이 된다.

또 다른 예로는 {1, 6, 2, 5, 3, 4}라는 수열이 주어지면 이 수열의 최장 증가 부분 수열은 {1, 2, 3, 4}가 된다.

이 문제는 [Dynamic Programming](/study/algorithms/dynamic-programming/)을 이용하여 해결할 수 있다. 각 원소를 마지막으로 하는 증가하는 부분 수열의 길이를 구한 뒤, 그중 가장 긴 것을 찾는 방식으로 구현한다.

아래는 Python으로 구현한 최장 증가 부분 수열 알고리즘의 코드이다.

```python
def LIS(arr):
    n = len(arr)
    dp = [1] * n

    for i in range(n):
        for j in range(i):
            if arr[i] > arr[j]:
                dp[i] = max(dp[i], dp[j] + 1)

    return max(dp)
```

위 코드에서 arr은 주어진 수열이며, dp는 각 원소를 마지막으로 하는 증가하는 부분 수열의 길이를 저장하는 배열이다. dp[i]는 arr[i]를 마지막으로 하는 증가하는 부분 수열의 길이를 의미한다.

이중 반복문을 사용하여 모든 arr[i]와 arr[j](0 ≤ j < i) 조합에 대해 arr[i] > arr[j]인 경우, dp[i]를 dp[j]+1과 비교하여 더 큰 값으로 갱신한다.

위 알고리즘의 시간 복잡도는 $$O(n^2)$$이다.

---

이 문제는 이분 탐색을 활용하면 더 효율적으로 해결할 수 있다. 이분 탐색을 사용하면 O(nlogn)의 시간 복잡도로 문제를 해결할 수 있다.

아래는 Python으로 구현한 최장 증가 부분 수열 알고리즘의 개선된 코드이다.

```python
def LIS(arr):
    n = len(arr)
    dp = [arr[0]]

    for i in range(1, n):
        if arr[i] > dp[-1]:
            dp.append(arr[i])
        else:
            idx = bisect_left(dp, arr[i])
            dp[idx] = arr[i]

    return len(dp)
```

위 코드에서 arr은 주어진 수열이다. dp 리스트는 길이가 i인 증가하는 부분 수열을 찾았을 때, 그 수열의 마지막 값을 dp[i-1]에 저장한다. 새로운 값을 포함하는 부분 수열을 구할 때는 이분 탐색을 사용하여 dp 리스트에서 해당 값보다 큰 값이 처음 나타나는 위치를 찾아 갱신한다.

위 알고리즘의 시간 복잡도는 $$O(nlogn)$$이다.
