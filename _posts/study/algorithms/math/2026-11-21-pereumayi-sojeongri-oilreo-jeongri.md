---
title: "페르마의 소정리/오일러 정리"
permalink: /study/algorithms/math/pereumayi-sojeongri-oilreo-jeongri/
math: true
toc: true
categories: ["알고리즘"]
tags: ["수학", "정수론", "페르마의 소정리/오일러 정리"]
---

[상위 페이지 · Math](/study/algorithms/math/)

## 페르마의 소정리

### 선행지식

- [모듈러 연산](/study/algorithms/math/modyulreo-yeonsan/)

<aside markdown="1">
💡

**정리**

임의의 정수 a와 소수 p에 대하여

$$
a^p \equiv a \pmod{p}
$$

특히 gcd(a,p)=1일 때

$$
a^{p-1} \equiv 1 \pmod{p}
$$

</aside>

### **증명 개요**

1. $$p∤a$$라 가정하고, 집합 {1,2,...,p-1}의 각 원소에 a를 곱하고 mod p를 취하면 $${a,2a,...,(p-1)a}≡{1,2,...,p-1}$$의 순열이 된다.
2. 두 집합의 곱을 비교하면

$$
1\cdot2\cdots(p-1) \equiv a\cdot2a\cdots(p-1)a = a^{p-1}(1\cdot2\cdots(p-1)) \pmod{p}
$$

1. $$gcd((p-1)!,p)=1$$이므로 양변에서 (p-1)!를 약분하여

$$
a^{p-1}\equiv1\pmod{p}
$$

1. 양변에 a를 곱해

$$
a^p\equiv a\pmod{p}
$$

### **응용**

- 모듈러 역원:

$$
a^{-1}\equiv a^{p-2}\pmod{p}
$$

- 거듭제곱 축약:

$$
a^k \bmod p = a^{k \bmod (p-1)}\bmod p,\quad(gcd(a,p)=1)
$$

**예제**

- p=7, a=12일 때

$$
12^6 = 2,985,984 \equiv 1 \pmod{7}
$$

- $$2^{1000}\bmod13$$ φ(13)=12이므로

$$
2^{1000}\equiv2^{1000\bmod12}=2^4=16\equiv3\pmod{13}
$$

---

## 오일러 정리

### 선행지식

- [오일러 피 함수](/study/algorithms/math/oilreo-pi-hamsu/)

### 설명

<aside markdown="1">
💡

**정리**

gcd(a,n)=1인 양의 정수 a,n에 대하여

$$
a^{\phi(n)}\equiv1\pmod{n}
$$

여기서 φ(n)은 [오일러 피 함수](/study/algorithms/math/oilreo-pi-hamsu/) 이다.

</aside>

**φ(n) 성질**

- 곱셈적: $$gcd(m,n)=1$$ ⟹ $$\phi(mn)=\phi(m)\phi(n)$$
- 소인수 분해:

$$
n=\prod_i p_i^{e_i} \quad\Longrightarrow\quad \phi(n) =n\prod_{p\mid n}\left(1-\frac{1}{p}\right) =\prod_i p_i^{e_i-1}(p_i-1)
$$

**증명 개요**

- $$ℤ_n^*={a\ mod\ n : gcd(a,n)=1}$$는 크기가 $$\phi(n)$$인 군이므로

$$
a^{\phi(n)}\equiv1\pmod{n}
$$

**응용**

- RSA 암호화: $$ed \equiv 1 \pmod {\phi(n)}$$
- 거듭제곱 축약:

$$
a^k\bmod n = a^{k \bmod \phi(n)}\bmod n
$$

**예제**

- n=10, $$\phi(n)$$=4, gcd(3,10)=1

$$
3^4=81\equiv1\pmod{10}
$$

- n=9, $$\phi(n)$$=6, gcd(2,9)=1

$$
2^6=64\equiv1\pmod{9}
$$

---

## 확장: Carmichael Function  $$\lambda(n)$$

- 최소 양의 정수 $$\lambda(n)$$에 대하여

$$
a^{\lambda(n)}\equiv1\pmod{n},\quad(\forall\,gcd(a,n)=1)
$$

- RSA 등에서 지수 최적화 시 사용됨.
