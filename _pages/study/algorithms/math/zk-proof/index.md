---
title: "ZK Proof"
permalink: /study/algorithms/math/zk-proof/
math: true
toc: true
---

[상위 페이지 · Math](/study/algorithms/math/)

### 배경지식

- [3. 유한체의 기본 정리](/study/algorithms/math/gun-hwan-ce/ce/)
- [Elliptic Curve Cryptography](/study/algorithms/math/elliptic-curve-cryptography/)
- **Basic Protocols** (Schnorr, Groth16 구조)
- **준비물:** SageMath, Circom, SnarkJS, Solidity

## 1. 개요

CTF 씬은 거대한 지각 변동을 겪고 있다. 전통적인 시스템 해킹이 메모리 주소를 조작하여 **제어 흐름**을 탈취하는 싸움이었다면, 영지식 증명 해킹은 다항식과 유한체 위에서 **연산의 무결성**을 무너뜨리는 싸움이다.

**공격의 본질이 변했다:**

- **Target:** saved_rip나 heap chunk가 아니라, **Ax×Bx=Cx (R1CS)** 제약 조건 그 자체다.
- **Weapon:** 쉘코드 대신, **가짜 증명**과 **조작된 Witness**가 무기가 된다.
- **Goal:** 루트 권한 획득이 아니라 **비밀을 모르면서도 검증자를 속여 통과하는 것**이다.

이 문서는 ZK 시스템을 공격하기 위한 체계적인 방법론을 제시한다. 수학적 기반부터 회로 논리, 구현 레벨까지 전 계층을 아우르는 공격 기법을 다루며, 실전 CTF 문제 해결에 직접 적용할 수 있는 방법론을 제공한다.

## 2. Attack Surface Analysis

ZK 시스템을 공격하기 위해서는 먼저 공격 표면을 체계적으로 분석해야 한다. CTF 문제에서 제공되는 아티팩트들을 올바른 순서로 분석하고, 각 계층에서 발생할 수 있는 취약점 유형을 이해하는 것이 핵심이다.

### 2.1 아티팩트 분석 순서

CTF 문제에서는 일반적으로 다음과 같은 파일들이 제공된다. 각 파일은 서로 다른 계층의 취약점을 담고 있을 수 있으므로, 체계적인 분석 순서가 중요하다.

### 2.1.1 circuit.circom

회로의 논리적 구조와 제약 조건을 분석하여 under-constrained 변수나 논리적 허점을 찾는다.

**분석 방법:**

- **입력 검증 확인:** 모든 signal input에 대해 적절한 범위 체크나 타입 검증이 있는지 확인한다.
    - 예: age 입력이 0~150 범위인지 검증하는가?
    - 예: 비트 배열의 각 원소가 실제로 {0, 1}인지 검증하는가?
- **출력 제약 확인:** 계산된 중간 변수나 최종 출력이 <==가 아닌 ===로 제약되어 있는지 확인한다.
    - <==는 할당만 하고 검증하지 않는다.
    - ===는 R1CS 제약 조건을 생성하여 검증한다.
- **템플릿 인스턴스화 추적:** component로 생성된 하위 회로들이 올바르게 연결되어 있는지 확인한다.
    - 신호가 전달되지 않는 고립된 변수가 있는가?
    - 순환 참조나 미사용 출력이 있는가?
- **특수 케이스 테스트:** 경계값(0, p-1)이나 특수 입력(음수 표현)을 넣었을 때 회로가 예상대로 동작하는지 시뮬레이션한다.

**도구:**

- circom 컴파일러로 R1CS 생성 후 제약 조건 개수 확인
- snarkjs wtns calculate로 witness 생성 테스트
- Ecne, Picus 같은 정적 분석 도구 사용

### 2.1.2 verifier.sol (온체인 구현 분석)

Solidity로 구현된 검증자 컨트랙트에서 구현 버그나 가스 최적화로 인한 보안 허점을 찾는다.

**분석 방법:**

- **입력 검증 로직:**
    - verifyProof 함수의 파라미터 길이 체크가 있는가?
    - Public input 배열의 크기가 예상과 일치하는지 검증하는가?
    - 입력값이 필드 크기 $$p$$ 미만인지 확인하는가?
- **페어링 연산 검증:**
    - Pairing.pairing 또는 bn256Add/Mul 프리컴파일 사용이 올바른가?
    - 페어링 방정식이 수학적으로 정확한가? (Groth16: $$e(A, B) = e(\alpha, \beta) \cdot e(L, \gamma) \cdot e(C, \delta)$$)
- **가스 최적화 부작용:**
    - unchecked 블록 사용으로 인한 오버플로우 가능성
    - 인라인 어셈블리 코드의 메모리 안전성
- **재진입 공격 가능성:** 검증 후 상태 변경 로직이 있다면 CEI 패턴이 지켜지는가?

**도구:**

- Slither, Mythril 같은 Solidity 정적 분석 도구
- Foundry/Hardhat로 단위 테스트 작성
- Remix 디버거로 트랜잭션 추적

### 2.1.3 zkey/ptau (신뢰 설정 파라미터 분석)

**목적:** Trusted Setup의 안전성을 검증하고, 테스트용 파라미터 사용 여부를 확인한다.

**분석 방법:**

- **파일 메타데이터 확인:**
    - snarkjs zkey export json로 zkey 구조 확인
    - 사용된 ptau 파일의 컨트리뷰션(contribution) 개수 확인
    - 컨트리뷰터 해시가 공식 Ceremony와 일치하는가?
- **테스트 파라미터 탐지:**
    - 파일명에 "test", "dev", "unsafe" 같은 키워드가 있는가?
    - 파일 크기가 비정상적으로 작은가? (Powers of Tau $$2^{12}$$ 미만은 의심)
    - tau 값이 알려진 값인가? (예: tau = 2)
- **Toxic Waste 추출 시도:**
    - 문제 설명에 "Private Key" 같은 힌트가 있는가?
    - 파일 시스템에 *.entropy 같은 중간 파일이 남아있는가?

**Exploit 시나리오:**

만약 $$\tau$$ 값을 알게 되면, 증명 생성 과정을 역산하여 임의의 public input에 대해 유효한 증명을 위조할 수 있다. 이는 마스터 키와 같은 역할을 한다.

**도구:**

- snarkjs zkey verify로 zkey와 r1cs 일치성 확인
- SageMath로 타원곡선 점들의 이산 로그 관계 분석

### 2.2 공격 벡터 분류

ZK 시스템의 취약점은 크게 세 가지 계층으로 분류할 수 있다. 각 계층은 서로 다른 공격 기법과 도구를 요구한다.

| **계층** | **정의** | **주요 공격 유형** | **탐지/방어 방법** |
| --- | --- | --- | --- |
| **Math** | ZK 프로토콜의 수학적 기반에서 발생하는 취약점. 암호학적 안전성 자체가 무너지는 경우. | **Small Field Attack:**필드 크기 p가 작을 때 무차별 대입 가능
**Modular Wrap-around:**음수가 p-|x| 형태로 표현되어 범위 체크 우회
**Pairing Linearity Abuse:**페어링의 쌍선형성을 악용하여 증명 위조 | **탐지:**circom pragma에서 prime 크기 확인, 경계값 테스트

**방어:
-** 범위 증명
- Public input 바인딩 (Fiat-Shamir) |
| **Circuit** | Circom 회로의 논리 구조에서 제약 조건이 불충분하여 발생하는 취약점. | **Unconstrained Output:**=== 대신 <-- 사용으로 검증 누락**Missing Range Checks:**입력값 범위 검증 부재
**Type Confusion:**비트 검증 없이 Bits2Num 사용
**Trivial Zero Solution:**모든 변수를 0으로 설정하여 우회 | **탐지:**<-- vs <== 구분, .sym 파일 제약 개수 확인

**방어:**Num2Bits + LessThan, IsZero 템플릿 사용 |
| **Implementation** | 프로토콜은 수학적으로 안전하지만, Solidity/JavaScript 구현 과정에서 발생한 버그. 전통적인 스마트 컨트랙트 해킹 기법 적용. | **Frozen Heart:**해시 입력에 public input 누락
**Input Array Length Mismatch:**배열 길이 검증 부재
**Precompile Error Handling:**프리컴파일 실패 처리 미흡
**Reentrancy:**CEI 패턴 위반 | **탐지:**verifier.sol 코드 리뷰, 단위 테스트

**방어:**입력 검증, 프리컴파일 반환값 확인, CEI 패턴 준수 |

### 2.3 분석 워크플로우 요약

실전 CTF 문제를 풀 때는 다음 순서로 접근하는 것이 효율적이다:

1. **빠른 스캔:** 문제 설명과 제공된 파일 목록 확인 → 공격 벡터 예상
2. **Circuit 분석:** circuit.circom을 먼저 읽고 under-constrained 변수 찾기
3. **PoC 작성:** 로컬에서 가짜 witness 생성 → snarkjs groth16 prove 테스트
4. **Verifier 검증:** 온체인 배포된 경우 Solidity 코드 리뷰 → 구현 버그 확인
5. **수학적 공격:** 위 방법이 모두 실패하면 필드 크기, 페어링 악용 등 깊은 수준 분석

이 체계를 따르면 대부분의 ZK CTF 문제를 30분~2시간 내에 해결할 수 있다.

## 3. 공격 방법

영지식 증명 시스템을 공격하는 방법은 크게 세 가지 계층으로 나뉘며, 각각은 서로 다른 전문성과 기법을 요구한다:

- [수학적 기반 공격 ](/study/algorithms/math/zk-proof/suhagjeog-giban-gonggyeog/)

- [회로 논리 공격](/study/algorithms/math/zk-proof/hoero-nonri-gonggyeog/)

- [구현체 공격](/study/algorithms/math/zk-proof/guhyeonce-gonggyeog/)

*이 페이지는 개념과 방어 관점의 설명을 담고 있습니다.*
