---
title: "Erdős-Ginzburg-Ziv"
permalink: /study/algorithms/math/erdos-ginzburg-ziv/
math: true
toc: true
---

[상위 페이지 · Math](/study/algorithms/math/)

## 선행지식

- 합동식, 모듈러 연산
- 부분합/부분수열 개념
- 소수/합성수 분기 전략
- (구성 풀이 시) N=a*b 분해 재귀

---

## 기본 개념

- 사용 맥락: 길이 2N-1 수열에서 합이 N의 배수인 N개 원소를 실제로 찾아야 하는 문제
- EGZ 정리는 존재성 정리다.
- 길이 2N-1 정수열이 주어지면, 합이 N의 배수인 원소 N개를 항상 고를 수 있다.
- 실전에서는 존재성만 쓰면 부족하고, 실제 인덱스를 복원하는 구성 알고리즘이 필요하다.

<aside markdown="1">
💡

**핵심 직관**

- 2N-1은 EGZ 정리의 임계 길이이며 이 길이에서 항상 해가 보장된다.
- 알고리즘은 보통 소수 모듈러 케이스와 합성수 분해 케이스를 결합해 실제 해를 만든다.
</aside>

---

## 성립 조건 / 정리

### 조건

- 입력 원소는 정수이며, 모듈러 N으로 환원해도 문제 성질이 보존된다.
- 목표는 길이 N 부분수열 S에 대해 $$sum(S) \equiv 0 \pmod n$$를 만족하는 구성이다.

### 정리/성질

- **EGZ 정리**
길이 2N-1의 임의 정수열에는 합이 N의 배수인 N개 부분수열이 존재한다.
- **합성수 리프팅(구성용)** N=a*b로 분해해서 a 조건을 맞춘 그룹을 만든 뒤, 그룹 몫으로 b 조건을 맞추면 전체 N 조건이 성립한다.

$$
\exists I,\ |I|=N,\ \sum_{i\in I}x_i \equiv 0 \pmod N
$$

---

## 동작 원리

### 전체 흐름

1. N이 소수인지 합성수인지 분기한다.
2. 소수 p면 subset sum mod p 구성으로 목표 나머지를 만든다.
3. 합성수면 N=a*b로 분해해 그룹화 재귀로 내려간다.
4. 하위 문제의 선택 결과를 역추적해 원래 인덱스를 복원한다.

### 불변식

- 각 단계에서 선택 가능한 후보 집합의 크기 조건(2m-1)이 유지된다.
- 하위 단계에서 만족한 모듈러 조건이 상위로 올릴 때 깨지지 않는다.
- 역추적 정보(parent/선택 개수)가 실제 인덱스 집합으로 복원 가능해야 한다.

### 왜 맞는가

- EGZ가 존재성을 보장한다.
- 소수/합성수 구성은 EGZ 존재성을 깨지 않는 방식으로 실제 선택 집합을 구성한다.
- 각 분기에서 만든 선택이 mod N 합 조건을 유지하므로 최종 답이 성립한다.

---

## 절차(구현 기준)

1. solve(n, arr)를 정의한다.
2. n이 소수면 소수 케이스 구성기(solve_prime)를 호출한다.
3. n이 합성수면 x=spf[n], y=n/x로 분해하고 그룹 단위 재귀를 수행한다.
4. parent/선택 정보를 역추적해 길이 n 인덱스를 반환한다.

<aside markdown="1">

**구현에서 가장 많이 틀리는 지점**

- 모듈러 음수 보정 누락 $$((v-d+n)%n)$$으로 역추적이 깨지는 경우
- 그룹 복원 순서가 틀려 다음 재귀 입력이 깨지는 경우
- 선택 개수와 실제 인덱스 개수가 불일치하는 경우
</aside>

---

## 복잡도

- 시간복잡도: 소수 케이스 구현에 의해 좌우됨 (일반적으로 비트셋 DP 또는 그 최적화)
- 공간복잡도: O(N) 수준에서 parent/비트셋/중간 버퍼 관리
- 병목 구간: 큰 소수 모듈러에서 부분합 DP 단계

---

## 실패/반례 패턴

- 존재성만 믿고 구성 절차를 생략 -> 실제 출력 인덱스를 못 만듦
- 소수 케이스를 단순 $$O(N^2)$$로 구현 -> 대입력 시간초과
- 합성수 재귀에서 그룹 합/몫 계산 실수 -> 상위 모듈러 조건 붕괴

---

## 예시 워크스루

- 예시 입력: N=6, 길이 11 배열
- 중간 상태 변화:
    1. 6=2*3 분해
    2. 길이 3 블록에서 2개씩 뽑아 mod 2 조건 그룹 생성
    3. 그룹 몫 배열로 길이 5 문제를 풀어 3개 그룹 선택
- 최종 결과: 선택 원소 6개의 합이 0 mod 6

---

## 구현

```cpp
vector<int> solve_rec(int n, const vector<int>& a) {
    if (n == 1) return {0};
    if (is_prime(n)) return solve_prime(n, a);
    int x = spf[n], y = n / x;
    vector<int> group_value;
    vector<vector<int>> group_idx;
    // group_value, group_idx를 구성
    vector<int> take_group = solve_rec(y, group_value);
    vector<int> ans;
    for (int g : take_group) {
        for (int idx : group_idx[g]) ans.push_back(idx);
    }
    return ans;
}
```

---

## 참고 자료

- [Erdős–Ginzburg–Ziv theorem (Wikipedia)](https://en.wikipedia.org/wiki/Erd%C5%91s%E2%80%93Ginzburg%E2%80%93Ziv_theorem) - 정리 진술/배경
- [A combinatorial proof of the Erdős-Ginzburg-Ziv theorem](https://www.tau.ac.il/~nogaa/PDFS/egz.pdf) - 조합론적 증명 관점
