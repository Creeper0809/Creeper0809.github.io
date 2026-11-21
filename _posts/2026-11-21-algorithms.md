---
title: "알고리즘"
date: 2026-11-21 10:38:14 +0900
permalink: /study/algorithms/
excerpt: "알고리즘 이론, 자료 구조, 그래프, 정렬과 문제 풀이를 주제별로 정리했습니다."
classes: []
author_profile: true
read_time: false
comments: false
share: false
related: false
math: true
toc: true
categories: ["알고리즘"]
tags: ["알고리즘 목차"]
---

[상위 페이지 · 공부](/study/)

알고리즘은 “이론 컴퓨터 과학” 하위 분류이지만 중요도가 높다 생각하여 메인 분류로 올림.

## *******!루비 달성!*******

![image.png](/assets/images/study/algorithms/image-7e2f22dd.png)

## ****블루단 달성*****

![image.png](/assets/images/study/algorithms/image-1-61b7fbde.png)

[https://github.com/Creeper0809/Algorithm](https://github.com/Creeper0809/Algorithm)

- [알고리즘 이론](/study/algorithms/theory/)

- [스켈레톤 코드 모음](/study/algorithms/code-templates/)

- [미정리](/study/algorithms/unsorted/)

## 유형

- [Competitive Programming](/study/algorithms/competitive-programming/)

- [Data Structure](/study/algorithms/data-structure/)

- [Greedy](/study/algorithms/greedy/)

- [Graph](/study/algorithms/graph/)

- [Math](/study/algorithms/math/)

- [Implementation](/study/algorithms/implementation/)

- [Dynamic Programming](/study/algorithms/dynamic-programming/)

- [Sorting](/study/algorithms/sorting/)

- [Game Theory](/study/algorithms/game-theory/)

- [Search](/study/algorithms/search/)

- [String](/study/algorithms/string/)

- [Etc](/study/algorithms/etc/)

## 파이썬의 초당연산 횟수

파이썬의 초당연산 횟수는 약 2000만정도라고 생각하면 된다.

즉 시간제한이 1초, n이 10만일때 $$O(n^2)$$ 으로 짜게 된다면 필요연산 횟수는 총 100억번의 연산이 필요하게 됨으로 시간초과가 난다.

고로 $$O(nlogn)$$ 으로 알고리즘을 짜야한다.

## N의 범위 별 시간 복잡도 예시

**시간 제한이 1초인 문제의 경우 (파이썬)**

- N의 범위가 500: 시간 복잡도가 $$O(N³)$$ 알고리즘을 설계하면 문제를 풀 수 있다.
- N의 범위가 2,000: 시간 복잡도가 $$O(N²)$$ 알고리즘을 설계하면 문제를 풀 수 있다.
- N의 범위가 100,000: 시간 복잡도가 $$O(NlogN)$$ 알고리즘을 설계하면 문제를 풀 수 있다.
- N의 범위가 10,000,000: 시간 복잡도가 $$O(N)$$ 알고리즘을 설계하면 문제를 풀 수 있다.

**시간 제한이 1초인 문제의 경우 (Cpp 17)**

- N의 범위가 2,000: 시간 복잡도가 $$O(N³)$$ 알고리즘을 설계하면 문제를 풀 수 있다.
- N의 범위가 40,000: 시간 복잡도가 $$O(N²)$$ 알고리즘을 설계하면 문제를 풀 수 있다.
- N의 범위가 20,000,000: 시간 복잡도가 $$O(NlogN)$$ 알고리즘을 설계하면 문제를 풀 수 있다.
- N의 범위가 160,000,000: 시간 복잡도가 $$O(N)$$ 알고리즘을 설계하면 문제를 풀 수 있다.

## 실수하기 좋은 타입

- 산술 오버플로
    
    정수형 변수나 실수형 변수의 범위를 초과하는 값을 저장하려 할 때 발생하는 오류입니다. int나 long long의 범위를 잘 확인해야 합니다.
    
- 배열 범위 밖 원소 접근
    
    다른 언어는 체크해줘도 C/C++은 해당 인덱스가 배열 범위 안에 있는지 별도로 확인해주지않는다. 오류가 날 수도있지만 이런경우는 오류가 나지 않는다.
    
    ```cpp
    int array[10],t;
    ```
    
    만약 array[10]에 접근을 하면 t에 접근을 하게 될 것이다.
    
    이런 오류를 범하지 않기 위해서는 초기부터 배열의 크기를 잘 계산하여 정한다.
    
- Off-by-one 오류
    
    반복문이나 if문에서 <, >, ≤, ≥를 잘못써서 구간에 혼동이 생기는 경우이다.
    
- 상수 오타
    
    출력 실수, 1000007을 100007로 잘못 입력하는등 상수관련 오타
    
- 스택 오버플로
    
    재귀 함수의 호출 깊이가 너무 깊어지거나, 지역 변수를 너무 많이 선언하여 스택 메모리가 부족해지는 경우이다.
    
- 인덱스 순서 바꿔쓰기
    
    2차원 배열에서 행과 열의 인덱스를 반대로 쓰거나, 함수 파라미터의 순서를 잘못 입력하는 경우이다.
    
- 잘못된 비교 함수
    
    정렬이나 우선순위 큐에서 사용되는 비교 함수를 잘못 구현하여 원하는 결과가 나오지 않는 경우이다.
    
- 최소, 최대 예외 잘못 다루기
    
    최소값이나 최대값을 구할 때 초기값 설정을 잘못하거나, 예외 케이스를 고려하지 않는 경우이다.
    
- 연산자 우선 순위
    
    수식에서 연산자의 우선순위를 잘못 이해하여 괄호를 적절히 사용하지 않는 경우이다.
    
- 느린 입출력
    
    Python의 input() 대신 sys.stdin.readline()을 사용하지 않거나, C++에서 cin/cout의 동기화를 끄지 않아 시간 초과가 발생하는 경우이다.
    
- 변수 초기화
    
    전역 변수나 지역 변수를 적절히 초기화하지 않아 이전 테스트 케이스의 값이 영향을 미치는 경우이다.
    

## 공부 방법

알고리즘 문제 해결 전략

GPT

구글 서치

백준

코드포스

프로그래머스
