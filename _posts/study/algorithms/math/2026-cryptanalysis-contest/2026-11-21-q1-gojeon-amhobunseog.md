---
title: "Q1. 고전 암호분석"
permalink: /study/algorithms/math/2026-cryptanalysis-contest/q1-gojeon-amhobunseog/
math: true
toc: true
excerpt: "로 정의한다. 그러면 비제네르 암호의 암호화 함수와 복호 함수"
categories: ["알고리즘"]
tags: ["수학", "암호학"]
---

[상위 페이지 · Math](/study/algorithms/math/)

## **1. 시저 암호와 비제네르 암호의 원리 및 차이**

## **1-가. 암호화 방법**

### 시저 암호

알파벳 집합을

$$
\Sigma := \{A,B,\dots,Z\}
$$

로 두고, 문자와 잉여류환 $$\mathbb{Z}_{26}$$ 사이의 식별을

$$
\phi : \Sigma \to \mathbb{Z}_{26}, \qquad \phi(A)=0,\ \phi(B)=1,\ \dots,\ \phi(Z)=25
$$

로 정의한다. 이하에서는 표기의 간결성을 위해 각 문자를 그에 대응하는 $$\mathbb{Z}_{26}$$의 원소와 동일시한다. 길이 $$N$$의 평문과 암호문은 각각

$$
P=(P_0,\dots,P_{N-1}) \in \mathbb{Z}_{26}^{N}
$$

$$
C=(C_0,\dots,C_{N-1}) \in \mathbb{Z}_{26}^{N}
$$

의 원소로 본다.

시저 암호의 키 공간은

$$
\mathcal{K}_{\mathrm{Caesar}} := \mathbb{Z}_{26}
$$

이다. 각 키 $$k \in \mathcal{K}_{\mathrm{Caesar}}$$에 대하여 암호화 함수와 복호 함수

$$
E_k : \mathbb{Z}_{26}^{N} \to \mathbb{Z}_{26}^{N}, \qquad D_k : \mathbb{Z}_{26}^{N} \to \mathbb{Z}_{26}^{N}
$$

를 다음과 같이 정의한다.

$$
\bigl(E_k(P)\bigr)_i = P_i + k \pmod{26}, \qquad \bigl(D_k(C)\bigr)_i = C_i - k \pmod{26}
$$

여기서 $$i=0,1,\dots,N-1$$이다. 즉, 시저 암호는 모든 위치에 동일한 잉여류 $$k$$를 더하는 연산으로 정의되며, 하나의 키가 하나의 전역 치환을 결정한다. 따라서 시저 암호는 단일치환 암호이다.

또한 모든 $$P \in \mathbb{Z}_{26}^{N}$$에 대하여

$$
D_k(E_k(P)) = P, \qquad E_k(D_k(P)) = P
$$

가 성립하므로 $$D_k = E_k^{-1}$$이다. 따라서 시저 암호의 키 공간 크기는 $$\lvert\mathcal{K}_{\mathrm{Caesar}}\rvert = 26$$이다.

### 비제네르 암호

양의 정수 $$t \in \mathbb{N}$$를 키 길이라 하자. 비제네르 암호의 키 공간은

$$
\mathcal{K}_{\mathrm{Vigen\grave{e}re}}^{(t)} := \mathbb{Z}_{26}^{t}
$$

이다. 임의의 키 $$K=(k_0,\dots,k_{t-1}) \in \mathcal{K}_{\mathrm{Vigen\grave{e}re}}^{(t)}$$에 대하여 주기적 키열 $$K^\ast=(K_0,K_1,\dots)$$를

$$
K_i := k_{i \bmod t}, \qquad i \ge 0
$$

로 정의한다. 그러면 비제네르 암호의 암호화 함수와 복호 함수

$$
E_K : \mathbb{Z}_{26}^{N} \to \mathbb{Z}_{26}^{N}, \qquad D_K : \mathbb{Z}_{26}^{N} \to \mathbb{Z}_{26}^{N}
$$

는 각 위치 $$i=0,1,\dots,N-1$$에 대하여

$$
\bigl(E_K(P)\bigr)_i = P_i + K_i = P_i + k_{i \bmod t} \pmod{26}
\\
\bigl(D_K(C)\bigr)_i = C_i - K_i = C_i - k_{i \bmod t} \pmod{26}
$$

로 정의된다. 마찬가지로 모든 $$P \in \mathbb{Z}_{26}^{N}$$에 대하여 $$D_K(E_K(P))=P$$가 성립하므로 $$D_K = E_K^{-1}$$이다.

시저 암호와의 본질적 차이는 암호화에 사용되는 시프트 값이 위치에 따라 변할 수 있다는 점이다. 즉, 비제네르 암호에서는 동일한 평문 기호 $$P_i=P_j$$가 주어지더라도 일반적으로 $$i \not\equiv j \pmod t$$이면 서로 다른 시프트가 적용되므로 $$C_i$$와 $$C_j$$가 달라질 수 있다. 따라서 비제네르 암호는 키 길이 $$t$$개의 치환을 주기적으로 순환 사용하는 다중치환 암호이며, 키 길이 $$t$$가 고정되었을 때 키 공간의 크기는

$$
\bigl\lvert\mathcal{K}_{\mathrm{Vigen\grave{e}re}}^{(t)}\bigr\rvert = 26^{t}
$$

이다.

## **1-나. 알파벳 빈도 분포 차이**

### 시저 암호의 빈도 분포

평문 $$P=(P_0,\dots,P_{N-1}) \in \mathbb{Z}_{26}^{N}$$에 대하여, 각 $$x \in \mathbb{Z}_{26}$$의 출현 횟수를

$$
n_x(P) := \bigl\lvert\{\, i \in \{0,\dots,N-1\} : P_i = x \,\}\bigr\rvert
$$

로 정의한다. 또한 빈도벡터를

$$
\mathbf{n}(P) := \bigl(n_0(P), n_1(P), \dots, n_{25}(P)\bigr)^\top \in \mathbb{N}^{26}
$$

로 둔다. 시저 암호문 $$C=E_k(P)$$에 대하여는 각 $$x \in \mathbb{Z}_{26}$$에 대해

$$
n_x(C) = n_{x-k}(P)
$$

가 성립한다. 여기서 뺄셈은 $$\mathbb{Z}_{26}$$에서의 연산이다. 따라서 어떤 $$26 \times 26$$ 순열행렬 $$\Pi_k$$가 존재하여

$$
\mathbf{n}(C) = \Pi_k\,\mathbf{n}(P)
$$

를 만족한다. 즉, 시저 암호는 평문의 전역 빈도벡터에 단지 순환 순열만 가할 뿐, 빈도 다중집합 자체는 변형하지 않는다. 그러므로 다음 성질이 즉시 따라온다.

1. 가장 빈번한 문자, 두 번째로 빈번한 문자 등 빈도의 상대적 순서 구조는 단지 문자 이름만 바뀐 채 보존된다.
2. 빈도 성분들의 순열에 대해 불변인 통계량은 모두 보존된다.

특히 일치지수

$$
IC(P) := \frac{1}{N(N-1)} \sum_{x \in \mathbb{Z}_{26}} n_x(P)\bigl(n_x(P)-1\bigr)
$$

에 대하여

$$
\sum_{x \in \mathbb{Z}_{26}} n_x(C)\bigl(n_x(C)-1\bigr)
\\= \sum_{x \in \mathbb{Z}_{26}} n_{x-k}(P)\bigl(n_{x-k}(P)-1\bigr)
\\= \sum_{x \in \mathbb{Z}_{26}} n_x(P)\bigl(n_x(P)-1\bigr)
$$

가 성립하므로

$$
IC(C) = IC(P)
$$

이다. 

따라서 시저 암호문은 기존의 평문 알파벳 빈도 분포를 순열 보존한다.

### 비제네르 암호의 빈도 분포

이제 키 길이가 $$t$$인 비제네르 암호를 고려하자. 각 $$r \in \{0,\dots,t-1\}$$에 대하여 위치 집합

$$
I_r := \{\, i \in \{0,\dots,N-1\} : i \equiv r \pmod t \,\}
$$

를 정의하면, 평문과 암호문은 각각 $$t$$개의 부분열로 분해된다. 즉,

$$
P^{(r)} := (P_i)_{i \in I_r}, \qquad C^{(r)} := (C_i)_{i \in I_r}
$$

로 두면, 비제네르 암호의 정의에 의해 각 $$r$$에 대해

$$
C^{(r)} = E_{k_r}\bigl(P^{(r)}\bigr)
$$

가 성립한다. 따라서 각 부분열만 따로 보면 하나의 시저 암호문이다.

각 부분열의 빈도벡터를 $$\mathbf{n}^{(r)}(P),\ \mathbf{n}^{(r)}(C) \in \mathbb{N}^{26}$$로 두면, 어떤 순열행렬 $$\Pi_{k_r}$$에 대하여

$$
\mathbf{n}^{(r)}(C) = \Pi_{k_r}\,\mathbf{n}^{(r)}(P)
$$

가 성립한다. 그러나 전체 암호문의 빈도벡터는 하나의 순열행렬을 전역 빈도벡터에 곱한 형태가 아니라

$$
\mathbf{n}(C)
= \sum_{r=0}^{t-1} \mathbf{n}^{(r)}(C)
= \sum_{r=0}^{t-1} \Pi_{k_r}\,\mathbf{n}^{(r)}(P)
$$

의 형태를 가진다. 

즉, 비제네르 암호에서는 서로 다른 부분열의 빈도벡터가 서로 다른 시프트를 거친 뒤 합산된다. $$k_0,\dots,k_{t-1}$$가 모두 같다면 이는 시저 암호와 동일하지만, 일반적으로는 서로 다른 위치의 빈도 피크가 서로 다른 방향으로 이동한 뒤 합쳐지므로 전체 빈도 분포는 평탄화된다.

이 차이는 일치지수에도 반영된다. 두 위치를 균일하게 무작위로 선택하였을 때, 두 위치가 같은 부분열 $$I_r$$에 속하면 동일한 시프트 $$k_r$$가 적용되므로 충돌 확률은 해당 부분열의 자연어적 분포에 의해 결정된다. 반면 서로 다른 부분열 $$I_r$$, $$I_s$$에 속하면 일반적으로 서로 다른 시프트가 적용되므로, 두 문자 사이의 상관은 크게 약화된다.

이를 정량화하기 위해 각 $$\lvert I_r\rvert$$가 거의 $$N/t$$와 같고, 각 부분열이 충분히 길어 부분열 내부의 충돌 확률이 영어 자연어의 IC인 $$IC_{\mathrm{Eng}}$$에 가깝다고 가정하자. 또한 서로 다른 부분열 사이의 교차 충돌 확률은 거의 균등분포 수준인 $$1/26$$에 가깝다고 근사하면,

$$
IC_{\mathrm{Vigen\grave{e}re}} \approx \frac{1}{t} IC_{\mathrm{Eng}} + \frac{t-1}{t}\cdot \frac{1}{26}
$$

을 얻는다. 여기서 $$IC_{\mathrm{Eng}} \approx 0.066$$이고 $$1/26 \approx 0.03846$$이므로, $$t \ge 2$$인 비제네르 암호의 전체 IC는 시저 암호의 IC보다 작아지는 경향을 가진다.

### 결론

결론적으로 시저 암호는 전역 빈도벡터에 순열만 가하므로 자연어의 빈도 구조를 유지하는 반면, 비제네르 암호는 여러 부분열의 순열된 빈도벡터를 합성하므로 전역 빈도 구조를 분산시키고 자연어적 편향을 약화시킨다. 이후의 빈도 분석과 일치지수 분석은 바로 이 차이를 이용한다.

## **2. 일치지수 계산 및 암호 방식 판별**

## **2-가. 일치지수의 정의 및 계산**

길이 $$N$$의 문자열 $$X=(X_0,\dots,X_{N-1}) \in \mathbb{Z}_{26}^N$$에 대하여, 각 $$x \in \mathbb{Z}_{26}$$의 출현 횟수를 $$n_x(X)$$라 하자. 일치지수는 두 위치를 복원추출 없이 임의로 선택하였을 때 두 문자가 일치할 확률로 정의되며,

$$
IC(X):=\frac{1}{N(N-1)}\sum_{x \in \mathbb{Z}_{26}} n_x(X)\bigl(n_x(X)-1\bigr)
$$

로 주어진다. 문제의 두 암호문을 각각 $$C^{(1)}$$, $$C^{(2)}$$라 하자. 두 파일의 길이는 동일하게

$$
\lvert C^{(1)}\rvert = \lvert C^{(2)}\rvert = 19897
$$

이며, 소수 넷째 자리에서 반올림한 결과는 다음과 같다.

- ciphertexts1.txt: $$IC \approx 0.068$$
- ciphertexts2.txt: $$IC \approx 0.044$$

## **2-나. IC를 이용한 암호 방식 판별**

1번에서 이미 보였듯이 시저 암호는 전역 빈도벡터에 순열만 가하므로 IC를 정확히 보존한다. 따라서 평문이 영어 자연어일 경우 시저 암호문의 IC는 영어 자연어의 IC와 거의 동일한 값을 가져야 한다. 반면 비제네르 암호는 여러 부분열의 순열된 빈도벡터를 합성하므로 전체 IC가 작아지는 경향을 가진다.

영어 자연어의 IC는 통상적으로 $$0.066$$ 내외이며, 균등분포의 IC는

$$
\frac{1}{26} \approx 0.03846
$$

이다. 따라서 위 계산값에 대하여 다음이 성립한다.

1. $$IC(C^{(1)}) \approx 0.068$$은 영어 자연어의 IC와 사실상 동일한 수준이다.
2. 이는 $$C^{(1)}$$가 시저 암호문일 때 기대되는 이론적 거동과 정확히 일치한다.
3. $$IC(C^{(2)}) \approx 0.044$$은 영어 자연어의 IC보다 유의하게 작고, 균등분포 쪽으로 이동해 있다.
4. 이는 $$C^{(2)}$$가 다중치환 구조를 가지는 비제네르 암호문일 때 기대되는 현상과 일치한다.

따라서

- ciphertexts1.txt는 시저 암호문이다.
- ciphertexts2.txt는 비제네르 암호문이다.

## **3. 시저 암호문 복호**

## **3-가. 모든 키에 대한 복호 및 알파벳 빈도**

2번에서 ciphertexts1.txt가 시저 암호문임을 확인하였으므로, 이를 $$C \in \mathbb{Z}_{26}^N$$이라 두자. 시저 암호의 키 공간은 유한집합

$$
\mathcal{K}_{\mathrm{Caesar}} = \mathbb{Z}_{26}
$$

이므로, 가능한 모든 후보 키는 $$k \in \{0,1,\dots,25\}$$의 26개뿐이다. 따라서 올바른 키는 전수조사를 통해 반드시 찾아낼 수 있다.

각 키 $$k \in \mathcal{K}_{\mathrm{Caesar}}$$에 대하여 복호 후보를

$$
P^{(k)} := D_k(C)
$$

로 정의하고, 각 문자 $$x \in \mathbb{Z}_{26}$$의 관측빈도를

$$
O_x^{(k)} := n_x\bigl(P^{(k)}\bigr)
$$

로 둔다. 그러면 각 키마다 하나의 관측빈도벡터

$$
\mathbf{O}^{(k)} := \bigl(O_0^{(k)}, O_1^{(k)}, \dots, O_{25}^{(k)}\bigr)^\top
$$

를 얻는다. 문제 3-가에서 요구한 “가능한 모든 키 값에 대한 복호 결과 및 알파벳 빈도”는 바로 이 집합

$$
\bigl\{\, \bigl(P^{(k)}, \mathbf{O}^{(k)}\bigr) : k \in \mathcal{K}_{\mathrm{Caesar}} \,\bigr\}
$$

을 구성하는 과정에 해당한다. 전 키에 대한 전수조사 결과는 제출물의 caesar_key_analysis.csv 파일로 정리하였다.

## **3-나. 카이제곱 검정에 의한 키 추정**

문제의 영어 알파벳 빈도표에서 주어진 각 문자 $$x \in \mathbb{Z}_{26}$$의 이론적 출현 확률을 $$p_x$$라 하자. 길이 $$N$$의 문자열에 대한 기대빈도는

$$
E_x := N p_x
$$

로 주어진다. 각 후보 키 $$k$$에 대해, 복호문 $$P^{(k)}$$의 관측빈도 $$O_x^{(k)}$$와 기대빈도 $$E_x$$의 차이를 측정하기 위하여 카이제곱 통계량

$$
\chi^2(k):=\sum_{x \in \mathbb{Z}_{26}}\frac{\bigl(O_x^{(k)} - E_x\bigr)^2}{E_x}
$$

를 계산하였다. $$\chi^2(k)$$는 복호 결과의 빈도 분포가 영어 자연어의 빈도 분포와 얼마나 가까운지를 측정하는 통계량이므로, 올바른 키 추정치는

$$
\hat{k} := \operatorname*{arg\,min}_{k \in \mathcal{K}_{\mathrm{Caesar}}} \chi^2(k)
$$

로 정의할 수 있다. 즉, 영어 분포와 가장 잘 일치하는 복호문을 만드는 키를 선택한다.

상위 5개 결과는 다음과 같다.

| 순위 | 키 $$k$$ | $$\chi^2(k)$$ | 복호문 앞부분 |
| --- | --- | --- | --- |
| 1 | $$6$$ | $$921.544852$$ | `THECONSTITUTIONOFTHEREPUBLICOFKOREA...` |
| 2 | $$12$$ | $$68513.462104$$ | `NBYWIHMNCNONCIHIZNBYLYJOVFCWIZEI...` |
| 3 | $$19$$ | $$73448.723685$$ | `GURPBAFGVGHGVBABSGURERCHOYVPBSXB...` |
| 4 | $$17$$ | $$100815.400975$$ | `IWTRDCHIXIJIXDCDUIWTGTEJQAXRDUZD...` |
| 5 | $$22$$ | $$117261.344947$$ | `DROMYXCDSDEDSYXYPDROBOZELVSMYPUY...` |

계산 결과 $$k=6$$에서 카이제곱 값이 최소이며, 나머지 후보들과 큰 격차를 보인다. 이는 $$P^{(6)}$$의 빈도 분포가 영어 자연어 분포와 가장 잘 일치함을 뜻한다. 또한 $$P^{(6)}$$의 접두부가 자연스러운 영어 평문으로 해석되므로, 시저 키는

$$
\hat{k}=6
$$

으로 결정된다. 복호된 전체 평문은 제출물의 caesar_plaintext.txt로 정리하였으며, 시작 부분은 다음과 같다.

`THECONSTITUTIONOFTHEREPUBLICOFKOREACHAPTERGENERALPROVISIONSTHEREPUBLICOFKOREASHALLBEADEMOCRATICREPUBLIC`

## **3-다. 제시된 암호문 복호**

문제에서 별도로 제시된 암호문을 $$C^\star \in \mathbb{Z}_{26}^{N^\star}$$라 두자.

`ZNKYUBKXKOMTZEULZNKXKVAHROIULQUXKGYNGRRXKYOJKOTZNKVKUVRKGTJGRRYZGZKGAZNUXOZEYNGRRKSGTGZKLXUSZNKVKUVRK`

앞 절에서 구한 추정 키 $$\hat{k}=6$$을 적용하면,

$$
P^\star := D_{\hat{k}}(C^\star) = D_6(C^\star)
$$

이고, 그 결과는

`THESOVEREIGNTYOFTHEREPUBLICOFKOREASHALLRESIDEINTHEPEOPLEANDALLSTATEAUTHORITYSHALLEMANATEFROMTHEPEOPLE`

이 된다.

## **4. 비제네르 암호문의 키 길이, 키, 평문 복원**

## **4-가. 반복 패턴 탐색과 키 길이 추정**

2번에서 비제네르 암호문으로 분류된 ciphertexts2.txt를 $$C$$라 하자. 이 파일은 하나의 긴 문자열이 아니라 여러 줄의 암호문으로 구성되어 있으므로,

$$
C = \bigl(C^{(1)}, C^{(2)}, \dots, C^{(M)}\bigr),\qquad C^{(\ell)} \in \mathbb{Z}_{26}^{N_\ell}
$$

로 표기한다. 이 데이터에서는 각 줄마다 키 적용이 다시 시작된다고 가정한다. 따라서 키 길이가 $$t$$이고 키가

$$
K=(k_0,k_1,\dots,k_{t-1})\in (\mathbb{Z}_{26})^t
$$

라면, 각 줄 $$C^{(\ell)}$$의 암호화는 모든 $$\ell\in\{1,\dots,M\}$$ 및 $$i\in\{0,\dots,N_\ell-1\}$$에 대하여

$$
C_i^{(\ell)} \equiv P_i^{(\ell)} + k_{i\bmod t} \pmod{26}
$$

의 형태를 가진다. 따라서 같은 줄 안에서 거리가 $$t$$의 배수만큼 떨어진 위치들은 동일한 키 문자에 의해 암호화된다. 이 사실은 반복 패턴의 간격이 $$t$$의 배수로 나타난다는 Kasiski 검사의 이론적 근거가 된다.

먼저 길이 3 이상의 반복 부분문자열을 탐색하고, 동일한 문자열이 같은 줄 안에서 다시 나타나는 시작 위치 차이를 계산하였다. 위치는 각 줄의 시작을 0으로 둔 줄 내부 인덱스로 기록하였다. 실제로 길이 3 이상 반복 패턴 가운데 연속 출현 간격이 모두 5의 배수인 경우는 총 1215개 검출되었다. 다만 많은 항목은 동일한 반복 블록에서 생성되는 겹치는 부분문자열이므로, 본문에는 대표 예시만 제시한다.

| 반복 부분문자열 | 관찰된 줄 | 시작 위치 | 유도된 간격 |
| --- | --- | --- | --- |
| ZPJDUO | 4 | 50, 95 | 45 |
| QKWGPN | 12 | 19, 54 | 35 |
| CSZIO | 17 | 109, 159, 239 | 50, 80 |
| GCKEZ | 140 | 38, 73, 203 | 35, 130 |
| XPQDQRK | 61 | 74, 154, 329 | 80, 175 |
| DCZOC | 138 | 0, 105, 195 | 105, 90 |
| HAOLO | 138 | 143, 203, 278 | 60, 75 |

따라서 이 간격들의 최대공약수는

$$
\gcd(45,35,50,80,35,130,80,175,105,90,60,75)=5
$$

이고, 1차 키 길이 추정치는

$$
\hat t_{\mathrm{Kasiski}}=5
$$

가 된다. 전체 반복 패턴 목록은 제출물 vigenere_kasiski_patterns.csv에 정리하였다.

### **검증**

Kasiski 검사는 정성적 근거를 제공하지만, 이를 통계적으로 다시 확인하는 것이 바람직하다. 이를 위해 후보 길이 $$m\in\{1,2,3,4,5\}$$에 대하여 각 줄을 독립적으로 $$m$$개의 잉여류 클래스로 분해한다. 즉, 각 $$r\in\{0,\dots,m-1\}$$에 대하여

$$
C_{m,r}:=\bigoplus_{\ell=1}^{M}\bigl(C_i^{(\ell)} : i \equiv r \pmod m \bigr)
$$

를 정의한다. 여기서 $$\oplus$$는 문자열 연결을 뜻한다. 만약 $$m=t$$이면 각 $$C_{m,r}$$는 하나의 단일 시저 암호문처럼 거동하므로, 그 일치지수는 영어 자연어의 IC에 가까워져야 한다. 이에 따라 줄 단위 재시작을 반영한 평균 열 IC를

$$
\overline{IC}_{\mathrm{line}}(m):=\frac{1}{m}\sum_{r=0}^{m-1} IC(C_{m,r})
$$

로 정의하여 계산하였다. 비교를 위해 파일 전체를 단순 연결한 뒤 동일한 분해를 적용한 평균 열 IC도 함께 계산하였다.

| 후보 길이 $$m$$ | 단순 연결 평균 열 IC | 줄 단위 재시작 평균 열 IC |
| --- | --- | --- |
| 1 | 0.043972 | 0.043972 |
| 3 | 0.043998 | 0.044042 |
| 5 | 0.044363 | 0.067792 |

$$m=5$$일 때에만 $$\overline{IC}_{\mathrm{line}}(m)$$가 영어 자연어의 IC 수준으로 상승하므로, 각 부분열이 단일 시저 암호문처럼 거동함을 알 수 있다. 따라서 최종 키 길이는

$$
\hat t = 5
$$

로 결정된다.

## **4-나. 부분열별 카이제곱 검정으로 키 복원**

이제 키 길이를 $$\hat t=5$$로 고정한다. 각 $$r\in\{0,1,2,3,4\}$$에 대하여

$$
C^{[r]} := C_{\hat t,r}
$$

로 두면, 각 $$C^{[r]}$$는 동일한 키 문자 $$k_r$$만이 작용한 부분열이므로 하나의 시저 암호문으로 볼 수 있다. 각 부분열의 길이를 $$N_r:=\lvert C^{[r]}\rvert$$라 하고, 기대빈도를

$$
E_x^{(r)} := N_r p_x
$$

로 정의한다. 또한 각 시프트 $$s\in\mathbb{Z}_{26}$$에 대해 복호 후보와 관측빈도를

$$
P_r^{(s)} := D_s(C^{[r]}),\qquad O_{r,x}^{(s)}:=n_x\bigl(P_r^{(s)}\bigr)
$$

로 두면, 부분열에 대한 카이제곱 통계량

$$
\chi_r^2(s):=\sum_{x\in\mathbb{Z}_{26}}\frac{\bigl(O_{r,x}^{(s)}-E_x^{(r)}\bigr)^2}{E_x^{(r)}}
$$

을 얻는다. 따라서 각 위치의 최적 시프트는

$$
\hat s_r := \operatorname*{arg\,min}_{s\in\mathbb{Z}_{26}} \chi_r^2(s)
$$

로 정의된다. 계산 결과는 다음과 같다.

| 위치 $$r$$ | 부분열 길이 $$N_r$$ | 최적 시프트 $$\hat s_r$$ | 문자 | 최적 $$\chi^2$$ | 차선 $$\chi^2$$ |
| --- | --- | --- | --- | --- | --- |
| 0 | 4047 | 10 | K | 222.518072 | 14602.574099 |
| 2 | 3975 | 21 | V | 406.927929 | 14335.183822 |
| 4 | 3917 | 9 | J | 165.249084 | 12719.077163 |

각 $$r$$에 대하여 최적 후보와 차선 후보 사이의 격차가 충분히 크므로 $$\hat s_r$$는 안정적으로 결정된다. 따라서

$$
(\hat s_0,\hat s_1,\hat s_2,\hat s_3,\hat s_4)=(10,11,21,14,9)
$$

이고, 이에 대응하는 키 문자는 각각 K, L, V, O, J이므로 최종 키는

$$
\hat K = \texttt{KLVOJ}
$$

로 복원된다.

## **4-다. 제시된 비제네르 암호문 복호 및 교차 검증**

문제에서 별도로 제시된 암호문을 $$C^\dagger\in\mathbb{Z}_{26}^{N^\dagger}$$라 두자. 이 문자열은 한 줄로 주어지므로 키 위상은 처음 위치에서 다시 시작한다. 따라서 앞 절에서 복원한 키 $$\hat K=\texttt{KLVOJ}$$를 적용한 복호문은

$$
P^\dagger := D_{\hat K}(C^\dagger)
$$

이며, 성분별로는 모든 $$i\in\{0,\dots,N^\dagger-1\}$$에 대하여

$$
P_i^\dagger \equiv C_i^\dagger - \hat s_{i\bmod 5} \pmod{26}
$$

로 주어진다. 실제 암호문은

`DSZGXFPMSRQYOMXPECSAOAPPUSNJTTYCZOBRLGZAODDRNSYOVNZPJDUOLIRJVWNHJDPVICRZMWCIDCOUVPHOWKEZTAYXOVNZPJDUO`

이고, 복호 결과는

`THESOVEREIGNTYOFTHEREPUBLICOFKOREASHALLRESIDEINTHEPEOPLEANDALLSTATEAUTHORITYSHALLEMANATEFROMTHEPEOPLE`

이다.

이는 3-다에서 얻은 시저 복호 결과와 정확히 일치하므로, 두 파일이 동일한 평문을 서로 다른 고전 암호 방식으로 암호화한 것임이 재확인된다.

## **5. AI 분류기 모델 설계 및 4개 암호문 분류**

## **5-가. 지도학습 문제의 정식화**

문제 5에서는 2번에서 시저 암호문으로 분류된 파일과 비제네르 암호문으로 분류된 파일을 이용하여, 새로운 4개의 암호문이 어느 계열에 속하는지 분류해야 한다. 이를 이진분류 문제로 정식화하기 위하여 라벨 공간을

$$
\mathcal{Y} := \{0,1\}
$$

로 두고, 0은 시저 암호, 1은 비제네르 암호를 뜻하게 한다. 또한 2번의 판별 결과에 따라 시저 계열 원본 데이터를 $$C_{\mathrm{Caesar}}$$, 비제네르 계열 원본 데이터를 $$C_{\mathrm{Vig}}$$라 하자.

그러나 원본 파일 수는 계열마다 하나씩뿐이므로, 이를 그대로 학습 표본으로 사용하면 지도학습이 사실상 불가능하다. 따라서 각 줄에서 길이

$$
L \in \{60,80,100,120,140\}
$$

인 부분문자열을 stride 20으로 슬라이딩 추출하였다. 즉, 어떤 줄 문자열 S에 대하여 길이 L의 윈도우 표본은

$$
W_{S,L,a} := S[a:a+L]
$$

로 두고, a는 $$0,20,40,\dots$$ 가운데 $$a+L \le |S|$$를 만족하는 시작 위치로 제한하였다. 각 윈도우는 자신이 추출된 원본 파일의 계열 라벨을 상속한다.

이 과정을 통해 학습 표본 집합

$$
\mathcal{D}:=\{(x_j,y_j)\}_{j=1}^{4008}
$$

을 구성하였으며, 표본 수는

$$
|\mathcal{D}_{\mathrm{Caesar}}| = 2004,\qquad |\mathcal{D}_{\mathrm{Vig}}| = 2004
$$

이다. 윈도우 기반 증강은 평가 대상인 4개의 미지 암호문이 상대적으로 짧다는 점에서 타당하다. 즉, 문서 전체가 아니라 국소 구간 수준에서도 암호 계열의 구조적 특징을 학습하도록 설계한 것이다.

## **5-나. 특징 사상의 설계**

문제 5의 핵심은 분류기 종류보다 특징 사상의 선택에 있다. 시저 암호는 키가 바뀌면 문자 빈도벡터가 단순한 순열로 이동하므로, 특징이 시저 시프트에 대해 불변하지 않으면 모델은 암호 계열이 아니라 특정 키나 특정 문장 내용을 학습할 위험이 있다. 이를 확인하기 위해 두 종류의 특징 사상을 비교하였다.

먼저 길이 n의 문자열 $$x \in \mathbb{Z}_{26}^n$$에 대하여 다음 통계량들을 정의한다.

$$
f_a(x) := \frac{n_a(x)}{n}\qquad (a \in \mathbb{Z}_{26})
$$

는 문자 상대빈도이고,

$$
H(x) := -\sum_{a \in \mathbb{Z}_{26}} f_a(x)\log_2 f_a(x)
$$

는 Shannon 엔트로피이다. 또한 3번에서 사용한 시저 카이제곱 통계량을 그대로 이용하여

$$
\chi_x^2(s):=\sum_{a \in \mathbb{Z}_{26}}\frac{\bigl(n_a(D_s(x)) - n p_a\bigr)^2}{n p_a},\qquad
\chi_{\mathrm{C}}^\star(x):=\min_{s \in \mathbb{Z}_{26}} \chi_x^2(s)
$$

를 정의하고, 이 최소값을 주는 시프트를

$$
\hat{k}_{\mathrm{C}}(x):=\operatorname*{arg\,min}_{s \in \mathbb{Z}_{26}} \chi_x^2(s)
$$

라 하자. 또한 차선 후보와의 격차를

$$
\Delta_{\mathrm{C}}(x):=\chi_{x,(2)}^2 - \chi_{x,(1)}^2
$$

로 정의한다. 여기서 $$\chi_{x,(1)}^2 \le \chi_{x,(2)}^2 \le \cdots$$는 $$\{\chi_x^2(s):s \in \mathbb{Z}_{26}\}$$의 오름차순 정렬값이다.

한편 후보 주기 m에 대한 평균 열 IC는

$$
\overline{IC}_m(x):=\frac{1}{m}\sum_{r=0}^{m-1} IC(x_{m,r}),\qquad
x_{m,r} := (x_r, x_{r+m}, x_{r+2m}, \dots)
$$

로 둔다. 마지막으로 반복 trigram 간격의 합동 정보를 측정하기 위해, 문자열 x 안의 길이 3 부분문자열 g가 나타나는 위치를

$$
\operatorname{Pos}_x(g) = (p_1 < p_2 < \cdots < p_u)
$$

라 할 때, 인접 간격들 $$p_{i+1}-p_i$$ 가운데 q의 배수인 비율을

$$
\rho_q(x):=\frac{\#\{\, i : p_{i+1}-p_i \equiv 0 \pmod q \,\}}{\#\{\, i : 1 \le i < u \,\}}
$$

로 정의한다. 실제 계산에서는 q=3,5를 사용하였다. 분모가 0이면 $$\rho_q(x)=0$$으로 둔다.

이제 두 특징 사상을 정의한다.

1. 나이브 특징 사상 $$\phi_{\mathrm{raw}} : \mathbb{Z}_{26}^n \to \mathbb{R}^{37}$$

$$
\phi_{\mathrm{raw}}(x):=\bigl(f_A(x),\dots,f_Z(x),IC(x), H(x), \chi_{\mathrm{C}}^\star(x), \Delta_{\mathrm{C}}(x), \hat{k}_{\mathrm{C}}(x),\overline{IC}_2(x), \overline{IC}_3(x), \overline{IC}_4(x), \overline{IC}_5(x),\rho_3(x), \rho_5(x)\bigr).
$$

1. 시프트 불변 특징 사상 $$\phi_{\mathrm{inv}} : \mathbb{Z}_{26}^n \to \mathbb{R}^{10}$$

$$
\phi_{\mathrm{inv}}(x):=\bigl(IC(x), H(x), \chi_{\mathrm{C}}^\star(x), \Delta_{\mathrm{C}}(x),\overline{IC}_2(x), \overline{IC}_3(x), \overline{IC}_4(x), \overline{IC}_5(x),\rho_3(x), \rho_5(x)\bigr).
$$

$$\phi_{\mathrm{raw}}$$는 절대 문자 빈도와 최적 시저 키 자체를 포함하므로 시프트 불변성이 없다. 반면 $$\phi_{\mathrm{inv}}$$는 시저 시프트가 바뀌어도 유지되는 구조적 통계량만을 사용한다. 따라서 후자는 암호 계열 자체를 학습하기에 더 적합하다.

## **5-다. 분류기 학습 및 실험 비교**

실험은 scikit-learn으로 구현하였다. 각 특징 사상 $$\phi \in \{\phi_{\mathrm{raw}}, \phi_{\mathrm{inv}}\}$$에 대해 다음 세 분류기를 비교하였다.

1. 로지스틱 회귀 $$h_{\mathrm{LR}}$$
2. 선형 커널 SVM $$h_{\mathrm{SVM}}$$
3. 랜덤 포레스트 $$h_{\mathrm{RF}}$$

선형 모델 $$h_{\mathrm{LR}}$$, $$h_{\mathrm{SVM}}$$에는 입력 스케일 차이를 제거하기 위하여 StandardScaler를 포함한 pipeline을 사용하였다.

데이터셋 $$\mathcal{D}$$는 계층적(stratified) 80:20 분할을 통해

$$
\mathcal{D} = \mathcal{D}_{\mathrm{train}} \,\dot\cup\, \mathcal{D}_{\mathrm{test}}
$$

로 나누었고, 각 모델은 $$\mathcal{D}_{\mathrm{train}}$$에서 학습한 뒤 $$\mathcal{D}_{\mathrm{test}}$$에서 정확도와 혼동행렬을 평가하였다. 이후 문제의 4개 암호문에 대한 모델 출력을 비교하였다.

실험 결과는 다음과 같다.

| 특징 집합 | 모델 | 정확도 | 혼동행렬 특징 | 실전 4문장 판정 |
| --- | --- | --- | --- | --- |
| $$\phi_{\mathrm{raw}}$$ | Logistic Regression | 1.0000 | 완전 분리 | 2번, 3번을 Vigenere로 오판 |
| $$\phi_{\mathrm{raw}}$$ | Linear SVM | 1.0000 | 완전 분리 | 2번, 3번을 Vigenere로 오판 |
| $$\phi_{\mathrm{raw}}$$ | Random Forest | 1.0000 | 완전 분리 | 2번, 3번을 Vigenere로 오판 |
| $$\phi_{\mathrm{inv}}$$ | Logistic Regression | 0.9988 | Vigenere 표본 1개만 오분류 | 4개 모두 Caesar |
| $$\phi_{\mathrm{inv}}$$ | Linear SVM | 1.0000 | 완전 분리 | 4개 모두 Caesar |
| $$\phi_{\mathrm{inv}}$$ | Random Forest | 1.0000 | 완전 분리 | 4개 모두 Caesar |

$$\phi_{\mathrm{raw}}$$는 홀드아웃 정확도만 보면 1.0000이지만, 실제 미지 암호문 4개에 대해서는 2번과 3번을 비제네르로 분류하였다. 이는 모델이 암호 계열의 구조보다 특정 절대 빈도 패턴이나 키 값을 과적합하였음을 뜻한다. 반면 $$\phi_{\mathrm{inv}}$$는 시저 시프트에 대한 불변성을 만족하면서도 실전 4개 암호문에 대해 세 모델이 모두 일치된 결과를 준다. 따라서 최종 실험으로는

$$
\phi_{\mathrm{selected}} := \phi_{\mathrm{inv}}
$$

를 채택한다.

## **5-라. 4개 미지 암호문의 분류**

문제에서 제시된 4개 암호문을 $$M^{(1)}, M^{(2)}, M^{(3)}, M^{(4)}$$라 하자. 선택된 특징 사상 $$\phi_{\mathrm{selected}}$$와 세 모델에 대하여

$$
\hat{y}_m^{(j)} := h_m\bigl(\phi_{\mathrm{selected}}(M^{(j)})\bigr),\qquad
m \in \{\mathrm{LR},\mathrm{SVM},\mathrm{RF}\}
$$

를 계산하였다. 또한 각 모델의 비제네르 posterior 확률 $$\Pr_m(Y=1 \mid M^{(j)})$$도 함께 기록하였다. 결과는 다음과 같다.

| 암호문 | LR의 $$P(\mathrm{Vigenere})$$ | SVM의 $$P(\mathrm{Vigenere})$$ | RF의 $$P(\mathrm{Vigenere})$$ | 최종 판정 |
| --- | --- | --- | --- | --- |
| 1 | 0.000249 | 0.000200 | 0.000000 | Caesar |
| 2 | 0.000249 | 0.000200 | 0.000000 | Caesar |
| 3 | 0.026916 | 0.008508 | 0.012500 | Caesar |
| 4 | 0.026916 | 0.008508 | 0.012500 | Caesar |

세 모델이 4개 암호문 모두에 대해 동일하게 시저 암호를 예측하므로, ML 기반 최종 판정은 모두 시저 암호이다.

## **5-마. 직접 암호분석을 통한 판정 검증**

문제 5의 결과는 ML 출력만으로 끝내지 않고, 고전적 암호분석으로도 다시 확인할 수 있다. 우선 암호문 1과 암호문 2는 길이가 같고 모든 위치 i에 대하여

$$
M_i^{(1)} - M_i^{(2)} \equiv 22 \pmod{26}
$$

가 성립한다. 따라서 이 둘은 동일한 평문에 서로 다른 두 개의 단일 시프트를 적용한 관계이다. 마찬가지로 암호문 3과 암호문 4에 대해서도

$$
M_i^{(3)} - M_i^{(4)} \equiv 4 \pmod{26}
$$

가 모든 위치에서 성립하므로, 이 둘 또한 동일한 평문에 대한 두 개의 시저 암호문이다.

나아가 각 암호문에 대해

$$
\hat{k}_j := \operatorname*{arg\,min}_{s \in \mathbb{Z}_{26}} \chi_{M^{(j)}}^2(s)
$$

를 계산하면 다음을 얻는다.

| 암호문 | 최적 키 | 최적 $$\chi^2$$ | 차선과의 격차 | 복호 결과 |
| --- | --- | --- | --- | --- |
| 1 | 6 | 28.169689 | 234.725622 | `HELLOTHISISACLASSICALCIPHERANALYSISPROBLEMFORTHECRYPTANALYSISCOMPETITIONCONGRATULATIONSONGETTINGTHECORRECTANSWER` |
| 2 | 10 | 28.169689 | 234.725622 | `HELLOTHISISACLASSICALCIPHERANALYSISPROBLEMFORTHECRYPTANALYSISCOMPETITIONCONGRATULATIONSONGETTINGTHECORRECTANSWER` |
| 3 | 10 | 24.019527 | 137.284717 | `THANKYOUFORYOURPARTICIPATIONWEWISHYOUALLTHEBESTINYOURFUTUREENDEAVORS` |
| 4 | 6 | 24.019527 | 137.284717 | `THANKYOUFORYOURPARTICIPATIONWEWISHYOUALLTHEBESTINYOURFUTUREENDEAVORS` |

각 암호문이 단일 시저 키 하나로 자연스러운 완전한 영어 평문으로 복원되므로, 문제 5의 실제 제공 데이터는 네 개 모두 시저 암호라고 결론내릴 수 있다. 즉, ML 분류 결과와 직접 복호 결과가 서로 일치한다.
