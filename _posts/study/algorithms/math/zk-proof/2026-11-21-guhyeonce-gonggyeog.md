---
title: "구현체 공격"
permalink: /study/algorithms/math/zk-proof/guhyeonce-gonggyeog/
math: true
toc: true
excerpt: "구현체 공격은 ZK 프로토콜의 이론적 설계는 안전하지만, 실제 구현 과정에서 발생하는 취약점을 악용하는 공격이다. 암호학적 프로토콜 자체의 결함이 아닌, 코드 작성, 배포, 통합 단계에서의 실수로 인해 발생한다."
---

[상위 페이지 · ZK Proof](/study/algorithms/math/zk-proof/)

구현체 공격은 ZK 프로토콜의 이론적 설계는 안전하지만, 실제 구현 과정에서 발생하는 취약점을 악용하는 공격이다. 암호학적 프로토콜 자체의 결함이 아닌, 코드 작성, 배포, 통합 단계에서의 실수로 인해 발생한다.

## Fiat-Shamir 취약점

## 원리

Fiat-Shamir 변환은 대화형 증명을 비대화형으로 변환하는 기법이다. 검증자의 랜덤 challenge를 해시 함수로 대체하는데, 이때 해시 입력에 Public Input을 포함하지 않으면 증명이 public input에 바인딩되지 않는다.

$$
c = H(\text{commitment} \parallel \text{public\_input})
$$

Public input이 누락되면:

$$
c = H(\text{commitment})
$$

## 취약한 구현 패턴

**잘못된 challenge 생성:**

```jsx
// 취약한 Fiat-Shamir 구현
function generateChallenge(commitment) {
    // Public input을 해시에 포함하지 않음!
    return hash(commitment);
}

// 올바른 구현
function generateChallenge(commitment, publicInput) {
    return hash(commitment, publicInput);
}
```

## Trusted Setup Backdoors

## 원리

Groth16과 같은 프로토콜은 신뢰 설정(Trusted Setup) 단계에서 비밀 값 τ(tau)를 사용하여 공개 파라미터를 생성한다. 이 과정에서 생성된 "독성 폐기물(Toxic Waste)" τ는 반드시 파괴되어야 한다.

$$
CRS = (g^\tau, g^{\tau^2}, \ldots, g^{\tau^d})
$$

τ 값을 알면 영지식 속성이 완전히 무너진다.

## 취약한 설정

**테스트용 파일 사용:**

```bash
# 위험! 테스트용 ptau 파일
# τ 값이 공개되어 있음
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_08.ptau

# 이 파일로 생성된 모든 증명은 위조 가능!
```

**불충분한 ceremony:**

- 단일 참여자만 참여한 MPC ceremony
- 참여자 간 담합 가능성
- Toxic waste 파괴 검증 부재

## Solidity Verifier Bugs

## 원리

ZK 증명의 온체인 검증은 Solidity 컨트랙트로 구현된다. snarkjs가 자동 생성한 verifier.sol이라도 배포/통합 과정에서 버그가 발생할 수 있다.

## 취약한 패턴

**입력 길이 검증 누락:**

```solidity
// 취약한 verifier.sol
function verifyProof(
    uint[2] memory a,
    uint[2][2] memory b,
    uint[2] memory c,
    uint[] memory input  // 가변 길이!
) public view returns (bool) {
    
    // input 길이 체크 없음
    uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    
    uint256 vk_x = 0;
    for (uint i = 0; i &lt; input.length; i++) {
        // 길이가 vk.IC.length를 초과하면?
        vk_x = addmod(vk_x, mulmod(input[i], vk.IC[i+1], snark_scalar_field), snark_scalar_field);
    }
    
    return pairing(a, b, c, vk_x);
}
```

## 구현체 공격 체크리스트

| **공격 유형** | **확인 사항** | **도구** |
| --- | --- | --- |
| **Frozen Heart** | Challenge 생성 시 public input 포함 확인 | 코드 리뷰, challenge grinding 테스트 |
| **Trusted Setup** | 프로덕션용 ptau 사용, MPC ceremony 검증 | snarkjs verify, ceremony transcript 확인 |
| **Verifier Bugs** | 입력 검증, pairing 반환값 확인 | Slither, 단위 테스트, 퍼징 |

구현체 공격은 프로토콜 설계가 안전해도 발생할 수 있으므로, 배포 전 철저한 감사가 필수적이다.

*이 페이지는 개념과 방어 관점의 설명을 담고 있습니다.*
