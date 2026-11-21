---
title: "EGZ 구성적 재귀"
permalink: /study/algorithms/math/egz-guseongjeog-jaegwi/
math: true
toc: true
---

[상위 페이지 · Math](/study/algorithms/math/)

## 선행지식

- [`Erdős-Ginzburg-Ziv`](/study/algorithms/math/erdos-ginzburg-ziv/)
- 합동식과 모듈러 연산
- 소인수분해
- 덱/배열 기반 인덱스 관리

---

## 기본 개념

- EGZ 정리 자체 설명은 [`Erdős-Ginzburg-Ziv`](/study/algorithms/math/erdos-ginzburg-ziv/) 문서를 전제로 한다.
- Erdős-Ginzburg-Ziv 정리는 길이 2N-1 정수열에서 합이 N의 배수인 N개 부분수열이 항상 존재함을 보장한다.
- 구성적 풀이에서는 N을 합성수로 분해해서 작은 모듈러 문제를 두 번 푸는 방식으로 실제 해를 만든다.
- 핵심은 N=a*b일 때, 먼저 a에 대한 배수 조건을 맞춘 그룹을 만든 뒤 b에 대한 배수 조건으로 그룹을 다시 선택하는 구조다.

<aside markdown="1">
💡

**핵심 직관**

- 큰 모듈러 N을 한 번에 맞추지 않고 a와 b로 나눠서 맞춘다.
- 그룹 합이 모두 a의 배수라면, 각 그룹 합을 a로 나눈 값들만 보면 b 모듈러 문제로 줄어든다.
</aside>

---

## 성립 조건 / 정리

### 조건

- 현재 다루는 값은 모두 $$0..N-1$$ 범위의 정수이거나 그와 동치인 모듈러 값이다.
- N=a*b에서 a는 N의 소인수, b=N/a로 둔다.

### 정리/성질

- EGZ 정리: 길이 2m-1 수열에는 합이 m의 배수인 m개 부분수열이 항상 존재한다.
- 몫 리프팅: 각 그룹 합이 a의 배수이면, 그룹 합 $$S_i$$를 $$T_i=(S_i/a)\ mod\ b$$로 바꿔 b 모듈러 문제로 내릴 수 있다.

$$
\sum_{i \in I} S_i \equiv 0 \pmod{ab},\quad S_i = a\cdot t_i
\Longleftrightarrow
\sum_{i \in I} t_i \equiv 0 \pmod b
$$

---

## 동작 원리

### 전체 흐름

1. 2a-1개를 뽑아 그중 a개 합이 a의 배수이도록 선택한다.
2. 이를 2b-1개의 그룹에 대해 반복해서 그룹 배열을 만든다.
3. 그룹 값 $$T_i=(S_i/a)\ mod\ b$$에 대해 다시 같은 문제를 풀어 b개 그룹을 고르면 전체 ab=N개가 완성된다.

### 불변식

- 각 그룹은 항상 정확히 a개 원소를 가진다.
- 각 그룹 합은 항상 a의 배수다.
- 매 반복에서 사용 가능한 인덱스 풀의 크기는 다음 반복에 맞게 2a-1개를 보장한다.

### 왜 맞는가

- 1단계에서 각 그룹 합이 a의 배수라는 사실이 확보된다.
- 2단계에서 그룹의 몫 합을 b의 배수로 만들면, 원래 합은 a*b=N의 배수가 된다.
- 따라서 선택된 그룹들의 원소를 합치면 정확히 N개이고 합은 N으로 나누어떨어진다.

---

## 절차

1. solve(n, arr) 재귀를 둔다.
2. n이 합성수면 x=spf[n], y=n/x로 두고 위 그룹화 과정을 실행한다.
3. 그룹별 carry=(group_sum/x) % y를 만들어 solve(y, carry)를 호출한다.
4. 선택된 그룹 인덱스를 원래 인덱스로 복원해 반환한다.

<aside markdown="1">
💡

자주 틀리는 지점

- 선택하지 않은 x-1개를 덱 앞에 되돌릴 때 순서를 반대로 넣지 않으면 다음 2x-1 묶음이 깨진다.
- group_sum/x를 정수 나눗셈으로 취하기 전에 group_sum % x == 0 성질이 유지되는지 확인해야 한다.
</aside>

---

## 복잡도

- 시간복잡도: $$T(n)= (2n/p-1) * T(p) + T(n/p) + O(n)$$ 꼴(분해 기준), 보통 소수 케이스가 병목
- 공간복잡도: O(n)
- 병목 구간: 소수 p를 처리하는 subset sum mod p 단계

---

## 실패/반례 패턴

- 덱 복원 순서 오류 -> 다음 블록이 엉켜 재귀 가정이 깨짐 -> 되돌릴 때 역순 push_front
- 그룹 값 계산 실수 -> carry가 잘못되어 상위 재귀 정당성 붕괴 -> (sum/x) % y 형태 고정

---

## 예시 워크스루

- 예시 입력: N=6
- 중간 상태 변화:
    1. 6=2*3으로 분해
    2. 길이 2*2-1=3 블록에서 2개씩 뽑아 2의 배수 그룹 5개 생성
    3. 각 그룹 합/2 값을 길이 5 수열로 보고 3개 그룹 선택
- 최종 결과: 선택된 3개 그룹의 원소 6개를 합치면 6의 배수

---

## 구현

```cpp
vector<int> solve_rec(int n, const vector<int>& a) {
    if (n == 1) return {0};
    if (is_prime(n)) return solve_prime(n, a);

    int x = spf[n], y = n / x;
    deque<int> pool;
    for (int i = 0; i < (int)a.size(); ++i) pool.push_back(i);

    vector<vector<int>> groups;
    vector<int> carry;

    for (int it = 0; it < 2 * y - 1; ++it) {
        vector<int> pack(2 * x - 1), small(2 * x - 1);
        for (int i = 0; i < 2 * x - 1; ++i) {
            pack[i] = pool.front();
            pool.pop_front();
            small[i] = a[pack[i]] % x;
        }

        vector<int> pick = solve_rec(x, small);
        vector<char> mk(2 * x - 1, 0);
        for (int id : pick) mk[id] = 1;

        vector<int> keep, grp;
        long long s = 0;
        for (int i = 0; i < 2 * x - 1; ++i) {
            if (mk[i]) {
                grp.push_back(pack[i]);
                s += a[pack[i]];
            } else keep.push_back(pack[i]);
        }

        for (int i = (int)keep.size() - 1; i >= 0; --i) pool.push_front(keep[i]);
        groups.push_back(grp);
        carry.push_back((int)((s / x) % y));
    }

    vector<int> take_group = solve_rec(y, carry);
    vector<int> ans;
    for (int g : take_group) {
        for (int idx : groups[g]) ans.push_back(idx);
    }
    return ans;
}
```

---

## 참고 자료

- [Erdős–Ginzburg–Ziv theorem (Wikipedia)](https://en.wikipedia.org/wiki/Erd%C5%91s%E2%80%93Ginzburg%E2%80%93Ziv_theorem) - 정리 진술과 배경 확인
- [A combinatorial proof of the Erdős-Ginzburg-Ziv theorem (Noga Alon, Michael Dubiner)](https://www.tau.ac.il/~nogaa/PDFS/egz.pdf) - 구성 관점 참고
