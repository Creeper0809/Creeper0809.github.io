---
title: "P3.정수삼각형"
permalink: /study/algorithms/dynamic-programming/gold-level-3/p3-jeongsusamgaghyeong/
toc: true
categories: ["알고리즘"]
tags: ["동적 계획법", "프로그래머스", "프로그래머스 레벨 3", "문제 풀이"]
---

[상위 페이지 · 골드/레벨 3](/study/algorithms/dynamic-programming/gold-level-3/)

![image.png](/assets/images/study/algorithms/image-432-8a5b18b7.png)

## 문제 태그

- DP

## 아이디어

1. 기본적인 점화식은 dp[i][j] = max(dp[i-1][j-1],dp[i-1][j]) + now 이다
2. 문제는 각 행의 처음과 마지막 요소
    1. 처음 요소는 자기 바로 위의 값하고 바로 덧셈
    2. 마지막 요소는 자기 -1의 위치 값하고 바로 덧셈

## 정답

```python
def solution(triangle):
    dp = [[0 for _ in range(len(triangle))] for _ in range(len(triangle))]
    dp[0][0] = triangle[0][0]
    for i in range(1,len(triangle)):
        temp_list = triangle[i]
        for j in range(len(temp_list)):
            if j == 0:
                dp[i][j] = dp[i-1][j] + temp_list[j]
                continue
            elif j == len(temp_list) - 1:
                dp[i][j] = dp[i-1][j-1] + temp_list[j]
                continue
            dp[i][j] = max(dp[i-1][j],dp[i-1][j-1]) + temp_list[j]
    return max(dp[-1])
```
