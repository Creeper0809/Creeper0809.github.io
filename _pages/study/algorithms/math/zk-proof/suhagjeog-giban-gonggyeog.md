---
title: "수학적 기반 공격"
permalink: /study/algorithms/math/zk-proof/suhagjeog-giban-gonggyeog/
math: true
toc: true
---

[상위 페이지 · ZK Proof](/study/algorithms/math/zk-proof/)

ZK 프로토콜의 수학적 기반에서 발생하는 취약점을 다룬다. 암호학적 안전성 자체가 무너지는 경우로, 필드 연산의 특성이나 페어링의 수학적 성질을 악용한다.

## Modular Wrap-around

### 원리

유한체 $$F_p$$에서 모든 연산은 소수 $$p$$로 나눈 나머지로 표현된다. 음수 $$-1$$은 $$p-1$$과 합동이므로, 범위 체크가 없으면 거대한 양수로 인식될 수 있다.

$$
-1 \equiv p - 1 \pmod{p}
$$

예를 들어 BN254 곡선($$p = 21888242871839275222246405745257275088548364400416034343698204186575808495617$$)에서:

$$
-1 \equiv 21888242871839275222246405745257275088548364400416034343698204186575808495616 \pmod{p}
$$

## 취약한 회로 패턴

**미흡한 범위 검증:**

```
template VulnerableAgeCheck() {
    signal input age;
    signal output isAdult;
    
    // age >= 18 체크
    component gte = GreaterEqThan(32);
    gte.in[0] <== age;
    gte.in[1] <== 18;
    isAdult <== gte.out;
}
```

이 회로는 age가 음수가 아니라는 것을 보장하지 않는다.

## Small Field Attack

### 원리

Schwartz-Zippel 보조정리에 따르면, 0이 아닌 $$d$$차 다항식이 무작위로 선택된 점에서 0이 될 확률은 최대 $$d/|F|$$이다.

$$
\Pr[P(r) = 0 \mid P \neq 0] \leq \frac{d}{|F|}
$$

필드 크기 $$|F| = p$$가 작으면 이 확률이 커져서, 무작위 시도만으로 유효한 증명을 생성할 수 있다.

## 취약한 설정

**예시: 16비트 필드**

```
pragma circom 2.0.0;
pragma custom_templates;

// 취약! 필드 크기 = 2^16 = 65536
prime = 65521;
```

10차 다항식의 경우 무작위 입력이 제약을 만족할 확률:

$$
\Pr[\text{success}] = \frac{10}{65521} \approx 0.015\% = \frac{1}{6552}
$$

약 6,500번 시도하면 유효한 witness를 찾을 수 있다.

## **Fake Proof via Pairing Linearity**

## 페어링의 수학적 정의

타원곡선 페어링은 두 그룹 $$G_1, G_2$$에서 목표 그룹 $$G_T$$로의 쌍선형 사상이다:

$$
e: G_1 \times G_2 \rightarrow G_T
$$

**쌍선형성(Bilinearity):**

$$
e(aP, bQ) = e(P, Q)^{ab}
$$

$$
e(P_1 + P_2, Q) = e(P_1, Q) \cdot e(P_2, Q)
$$

$$
e(P, Q_1 + Q_2) = e(P, Q_1) \cdot e(P, Q_2)
$$

## Groth16 검증 방정식

Groth16 증명은 세 개의 타원곡선 점 $$(A, B, C)$$로 구성되며, 다음 페어링 방정식으로 검증된다:

$$
e(A, B) = e(\alpha, \beta) \cdot e(L, \gamma) \cdot e(C, \delta)
$$

여기서:

- $$\alpha, \beta, \gamma, \delta$$: 신뢰 설정에서 생성된 공개 파라미터
- $$L$$: Public input으로 계산된 선형 조합
- $$A, B, C$$: 증명자가 제공한 증명 점

## 취약점: Public Input Binding 부재

Public input이 페어링 방정식에 제대로 바인딩되지 않은 경우

잘못된 구현 예시:

```solidity
// 취약한 verifier.sol
function verify(
    uint[2] memory a,
    uint[2][2] memory b,
    uint[2] memory c,
    uint[1] memory input  // public input
) public view returns (bool) {
    
    // L 계산에서 input을 사용하지 않음!
    uint[2] memory vk_x = vk.IC[0];
    
    // 페어링 체크 (input과 무관)
    return pairing(
        a, b,
        negate(vk.alpha), vk.beta,
        vk_x, vk.gamma,
        c, vk.delta
    );
}
```

## 수학적 공격 체크리스트

ZK 시스템 분석 시 다음 항목들을 확인한다:

| **공격 유형** | **확인 사항** | **도구** |
| --- | --- | --- |
| **Modular Wrap** | 음수/범위 체크 존재 여부 | circom 코드 리뷰, Num2Bits 사용 확인 |
| **Small Field** | 필드 크기$$\geq 2^{128}$$확인 | snarkjs r1cs info, pragma 확인 |
| **Pairing Abuse** | Public input 바인딩 검증 | verifier.sol 코드 리뷰, 재사용 테스트 |

이러한 수학적 공격들은 프로토콜 설계 단계의 결함이므로, 발견 시 근본적인 수정이 필요하다.

*이 페이지는 개념과 방어 관점의 설명을 담고 있습니다.*
