---
title: "체"
permalink: /study/algorithms/math/gun-hwan-ce/ce/
toc: true
---

[상위 페이지 · 군/환/체](/study/algorithms/math/gun-hwan-ce/)

## 1. 체의 엄밀한 정의 (Formal Definition of a Field)

- **1.1 체의 공리 (Field Axioms):**
    - 집합 F와 두 개의 이항 연산 (+ , ·)에 대하여 다음을 만족하는 구조.
    - **덧셈에 대한 성질:** 닫힘, 결합법칙, 교환법칙, 항등원(0), 역원(−a).
    - **곱셈에 대한 성질:** 닫힘, 결합법칙, 교환법칙, 항등원(1), 0이 아닌 원소의 역원(a⁻¹).
    - **분배법칙:** a·(b+c)=a·b+a·c.
- **1.2 체의 표수 (Characteristic):**
    - 1을 n번 더해서 0이 되는 가장 작은 양의 정수 n. (존재하지 않으면 표수는 0).
    - **정리:** 체의 표수는 0이거나 소수 p이다.

## 2. 체의 분류 (Classification)

- **2.1 무한체 (Infinite Fields):**
    - 표수가 0인 체.
    - 예: 유리수체 ℚ, 실수체 ℝ, 복소수체 ℂ.
- **2.2 유한체 (Finite Fields / Galois Fields):**
    - 표수가 소수 p이고, 원소의 개수가 유한한 체.
    - 표기: 𝔽_q 또는 GF(q).

## 3. 유한체의 기본 정리

- **3.1 위수(Order)의 제약:**
    - 유한체 F의 원소의 개수 q는 반드시 소수 p의 거듭제곱 형태여야 한다. (q=p^n, n≥1)
    - 즉, 원소가 6개나 10개인 체는 존재할 수 없다.
- **3.2 존재성과 유일성:**
    - 임의의 소수 p와 양의 정수 n에 대해, 위수가 p^n인 유한체는 존재하며, 동형(Isomorphic)을 제외하고 유일하다.

## 4. 체의 구성 (Construction of Fields)

- **4.1 소수체 (Prime Field, 𝔽_p):**
    - n=1인 경우.
    - 정수환 ℤ를 소수 p로 나눈 잉여류 체 ℤ/pℤ와 동형이다.
- **4.2 확대체 (Extension Field, 𝔽_(p^n)):**
    - n>1인 경우.
    - 소수체 𝔽_p 위에서의 n차원 벡터 공간(Vector Space)으로 볼 수 있다.
    - 기약 다항식(Irreducible Polynomial) P(x)을 이용한 몫(Quotient) 구조로 정의된다.
    - 𝔽_(p^n) ≅ 𝔽_p[x]/⟨P(x)⟩.

## 5. 체의 대수적 성질 (Algebraic Properties)

- **5.1 프로베니우스 사상 (Frobenius Automorphism):**
    - 표수가 p인 유한체에서 성립하는 성질: (a+b)^p=a^p+b^p.
- **5.2 곱셈군 구조 (Multiplicative Group):**
    - 체 F에서 0을 제외한 집합 F*는 곱셈에 대해 순환군(Cyclic Group)을 이룬다.
    - 즉, F*=⟨g⟩를 만족하는 생성원(Primitive Element) g가 반드시 존재한다.
- **5.3 부분체 (Subfields):**
    - 𝔽_(p^m)이 𝔽_(p^n)의 부분체일 필요충분조건은 m이 n의 약수일 때이다.
