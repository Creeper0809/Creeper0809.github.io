---
title: "회로 논리 공격"
permalink: /study/algorithms/math/zk-proof/hoero-nonri-gonggyeog/
math: true
toc: true
excerpt: "회로 논리 공격은 영지식 증명 시스템에서 회로 설계의 논리적 결함을 악용하는 공격 기법이다."
categories: ["알고리즘"]
tags: ["수학", "영지식 증명", "암호학"]
---

[상위 페이지 · ZK Proof](/study/algorithms/math/zk-proof/)

회로 논리 공격은 영지식 증명 시스템에서 회로 설계의 논리적 결함을 악용하는 공격 기법이다.

## Under-constrained Circuits

## 원리

Circom 컴파일러가 코드를 R1CS(Rank-1 Constraint System)로 변환할 때, 필요한 제약 조건이 누락되어 증명자가 임의의 값을 사용할 수 있게 되는 취약점이다.

## 취약한 회로 패턴

**패턴 1: Type Mismatch**

signal input으로 선언된 변수에 대해 비트 범위나 타입 제약이 없는 경우:

```jsx
template Vulnerable() {
    signal input age;  // 제약 없음!
    signal output isValid;
    
    isValid <-- age >= 18 ? 1 : 0;  // <-- 연산자는 제약 생성 안 함
}
```

**패턴 2: Unconstrained Output**

계산은 수행하지만 <== 또는 ===로 제약을 생성하지 않은 변수:

```jsx
template UnconstrainedCalc() {
    signal input a;
    signal input b;
    signal output result;
    
    result <-- a * b;  // 계산만 하고 제약 없음!
    // result <== a * b;  // 올바른 방법
}
```

## Input Aliasing (입력 충돌 공격)

## 원리

유한체에서 서로 다른 입력 $$x \neq y$$가 같은 출력 $$f(x) = f(y)$$를 생성하는 수학적 특성을 악용한다. 특히 제곱 연산에서:

$$
x^2 \equiv (-x)^2 \equiv (p-x)^2 \pmod{p}
$$

## 취약한 회로 패턴

```jsx
template VulnerableSquare() {
    signal input secret;
    signal output hash;
    
    hash <== secret * secret;  // x^2 = (-x)^2
}
```

## Bit-level Manipulation (비트 조작 공격)

## 원리

Bits2Num 같은 비트 변환 회로를 사용할 때, 각 비트가 실제로 $$\{0, 1\}$$에 속하는지 검증하지 않으면 임의의 필드 원소를 비트 자리에 넣을 수 있다.

## 취약한 회로 패턴

```jsx
template VulnerableBits2Num(n) {
    signal input bits[n];
    signal output num;
    
    var sum = 0;
    for (var i = 0; i < n; i++) {
        sum += bits[i] * (2 ** i);  // bits[i]가 0/1인지 미검증!
    }
    num <== sum;
}
```

## Trivial Solution Injection (자명해 주입 공격)

## 원리

곱셈 제약 $$A \times B = C$$에서 $$A = 0$$ 또는 $$B = 0$$을 넣으면 $$C$$의 값과 무관하게 제약이 항상 만족된다.

$$
0 \times B = 0 \quad \text{(항상 참)}
$$

## 취약한 회로 패턴

```jsx
template VulnerableNullifier() {
    signal input secret;
    signal input epoch;
    signal output nullifier;
    
    // secret이 0이면 epoch가 무엇이든 nullifier는 항상 0
    nullifier <== secret * epoch;
}
```

## 회로 논리 공격 체크리스트

Circom 회로 감사 시 다음 항목들을 확인한다:

| **공격 유형** | **확인 사항** | **방어 기법** |
| --- | --- | --- |
| **Under-constrained** | 모든 signal에 제약 존재 | <==,===사용,<--금지 |
| **Input Aliasing** | 동일 출력 생성 가능성 | 범위 제한, 단조 함수 사용 |
| **Bit Manipulation** | 비트 값 {0,1} 검증 | Num2Bits+ 범위 체크 |
| **Trivial Solution** | 0 입력 허용 여부 | NonZero 제약, 범위 제한 |

이러한 회로 논리 공격들은 컴파일러와 프로그래머의 가정 불일치에서 발생하므로, 모든 신호에 대한 명시적 제약이 필수적이다.

*이 페이지는 개념과 방어 관점의 설명을 담고 있습니다.*
