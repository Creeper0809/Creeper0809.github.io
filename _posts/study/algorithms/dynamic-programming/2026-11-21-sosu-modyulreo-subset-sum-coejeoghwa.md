---
title: "소수 모듈러 Subset Sum 최적화"
permalink: /study/algorithms/dynamic-programming/sosu-modyulreo-subset-sum-coejeoghwa/
math: true
toc: true
categories: ["알고리즘"]
tags: ["동적 계획법", "부분집합 합", "모듈러 연산", "소수 모듈러 Subset Sum 최적화"]
---

[상위 페이지 · Dynamic Programming](/study/algorithms/dynamic-programming/)

## 개념 정보

- 알고리즘/개념명: `소수 모듈러 Subset Sum 최적화 (회전 비트셋 + Critical Number)`
- 사용 맥락: `2p-1`개에서 `p`개를 골라 합을 `p`의 배수로 맞추는 소수 케이스 가속

---

## 선행지식

- 비트셋 기반 부분합 DP
- 원형 시프트(rotate)와 모듈러 인덱싱
- 가법군 `Z_p`의 부분합 집합 성질

---

## 기본 개념

- 소수 `p` 케이스는 정렬/페어링으로 `diff` 멀티셋의 `subset sum mod p` 문제로 바뀐다.
- 기본 비트셋 DP는 `reach |= rotl(reach, d)` 형태로 구현 가능하다.
- `p`가 클 때는 아이템 수를 줄여야 하므로, `diff`의 서로 다른 값 개수 `D`에 따라 분기한다.

<aside markdown="1">

💡

**핵심 직관**

- DP의 상태 수(`p`)는 못 줄여도, 아이템 수(`m`)를 줄이면 전체 비용 `O(p*m/64)`가 줄어든다.
- `D`가 크면 Critical Number로 적은 서로 다른 값만 써도 모든 나머지를 만들 수 있다.
- `D`가 작으면 중복 개수를 `binary splitting`으로 압축해 bounded DP를 돌리면 된다.

</aside>

---

## 성립 조건 / 정리

### 조건

- 모듈러가 소수 `p`여서 `Z_p` 가법군 성질을 사용한다.
- `diff` 값은 `1..p-1` 범위의 나머지로 본다.

### 정리/성질

- `Critical Number of Z_p \ {0}`:
    
    임의의 서로 다른 원소 집합 `A \subseteq Z_p\setminus\{0\}`가
    
    $$|A| ge leftlfloor 2sqrt{p-2}rightrfloor$$
    
    이면 부분합 집합 `\Sigma(A)`가 `Z_p` 전체를 덮는다.
    
- `Binary Splitting`: 개수 제한 아이템 `c`개를 `1,2,4,...` 묶음으로 분해해 0/1 아이템 `O(log c)`개로 변환 가능.

$$
\text{Time} \approx O\left(\frac{p \cdot m}{64}\right),\quad
m = \begin{cases}
\left\lfloor 2\sqrt{p-2}\right\rfloor & (D \ge C) \\
O(D\log p) & (D < C)
\end{cases}
$$

---

## 동작 원리

### 전체 흐름

1. `diff` 멀티셋과 목표 나머지 `target`을 만든다.
2. `D`를 계산하고 `D>=C`면 서로 다른 나머지 `C`개만 뽑아 0/1 DP를 수행한다.
3. `D<C`면 residue별 개수를 binary splitting한 bounded DP를 수행한다.

### 불변식(Invariant)

- `reach[r]=1`이면 현재까지 본 아이템으로 합 `r mod p`를 구성할 수 있다.
- 새 아이템 `d` 처리 후 `reach_new = reach OR rotl(reach, d)`가 성립한다.
- `parent` 배열은 처음 방문한 나머지를 기록해 역추적 시 유효한 선택 집합을 복원한다.

### 왜 맞는가

- 회전 비트셋 전이는 부분합 정의와 정확히 일치한다.
- `D>=C` 분기에서는 Critical Number 정리로 target 도달이 보장된다.
- `D<C` 분기에서는 bounded 아이템을 정확히 동일한 멀티셋으로 분해했으므로 원문제와 동치다.

---

## 절차(구현 기준)

1. `reach` 비트셋과 `parent(item, prev_mod)` 배열 초기화
2. 아이템마다 `rotl` 결과에서 새로 열린 비트만 `parent` 저장
3. `target` 도달 시 역추적으로 각 residue 사용 개수 복원
4. 복원한 사용 개수를 페어 선택 인덱스로 매핑

<aside markdown="1">

💡

**구현에서 가장 많이 틀리는 지점**

- `rotl` 마지막 워드 마스크를 안 씌우면 `p` 이상 비트가 켜져 오답이 난다.
- 역추적 시 `pre = (cur - d + p) % p` 계산을 음수 보정 없이 처리하면 깨진다.

</aside>

---

## 복잡도

- 시간복잡도: `O(p*m/64)`
- 공간복잡도: `O(p)`
- 병목 구간: 아이템 수가 큰 분기에서의 비트셋 순회

---

## 실패/반례 패턴

- `D>=C`에서 아무 검증 없이 전체 `diff`를 다 쓰는 구현 -> `O(p^2/64)`로 커져 대형 소수 TLE -> `C`개만 사용
- bounded DP에서 residue별 실제 사용 가능 개수 초과 -> 복원 불일치 -> residue별 위치 리스트로 개수 검증

---

## 예시 워크스루

- 예시 입력: `p=7`, `diff=[1,1,2,3,4,5]`, `target=6`
- 중간 상태 변화:
    1. `D=5`, `C=floor(2*sqrt(5))=4`이므로 `D>=C` 분기
    2. 서로 다른 4개를 넣고 회전 비트셋 DP 진행
    3. `target=6` 도달 후 역추적으로 사용 residue 복원
- 최종 결과: 복원한 residue 사용량에 맞춰 페어 상단/하단 선택

---

## 구현

```cpp
bool subset_mod_dp(int p, const vector<int>& item, int target, vector<int>& take) {
    int w = (p + 63) >> 6;
    vector<unsigned long long> reach(w, 0), rot(w), t1(w), t2(w);
    vector<int> par_item(p, -1), par_prev(p, -1);

    reach[0] |= 1ULL;

    for (int i = 0; i < (int)item.size(); ++i) {
        int d = item[i];
        rotl_bits(reach, rot, d, p, t1, t2);
        for (int j = 0; j < w; ++j) {
            unsigned long long nw = rot[j] & ~reach[j];
            while (nw) {
                int b = __builtin_ctzll(nw);
                int r = (j << 6) + b;
                if (r < p) {
                    par_item[r] = i;
                    par_prev[r] = (r - d + p) % p;
                }
                nw &= nw - 1;
            }
            reach[j] |= rot[j];
        }
    }

    if (!bit_get(reach, target)) return false;

    int cur = target;
    while (cur != 0) {
        int id = par_item[cur];
        take.push_back(id);
        cur = par_prev[cur];
    }
    return true;
}
```

---

## 라업 반영 가이드

- 라업의 `아이디어` 섹션에서 어떤 문장으로 참조할지: `소수 케이스는 diff subset-sum mod p로 바꾼 뒤 D 크기에 따라 critical/bounded DP로 분기한다.`
- 라업의 `참고 개념정리` 섹션 링크: `../concepts/소수_모듈러_subset_sum_최적화.md`
- 이번 문제에서 생략 가능한 부분: Critical Number 정리의 완전 증명
- 이번 문제에서 반드시 강조할 부분: `O(p^2/64)`를 피하기 위한 아이템 수 제어

---

## 참고 자료

- [Erdős–Heilbronn type results and critical numbers](https://www.sciencedirect.com/science/article/pii/009731659400017U) - `cr(Z_p\setminus\{0\})` 성질 확인
- [Subset sum with bitset optimization](https://cp-algorithms.com/dynamic_programming/knapsack.html#subset-sum-in-onw) - 비트셋 기반 전이 구현 아이디어
