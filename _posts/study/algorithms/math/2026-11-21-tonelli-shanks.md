---
title: "Tonelli-Shanks"
permalink: /study/algorithms/math/tonelli-shanks/
math: true
toc: true
categories: ["알고리즘"]
tags: ["수학", "정수론", "Tonelli-Shanks"]
---

[상위 페이지 · Math](/study/algorithms/math/)

### 배경 지식

- [4. 2차 잉여](/study/algorithms/math/modyulreo-yeonsan/)

## 1. 개요

Tonelli-Shanks 알고리즘은 르장드르 기호를 통해 숫자가 소수 모듈러의 제곱근인지 결정하고, 해당 제곱근을 효율적으로 계산하는 방법이다. 이 알고리즘은 주어진 정수 a와 소수 p에 대해 합동방정식 $$x^2 \equiv a \pmod p$$의 해를 찾는다.

2가 아닌 모든 소수는 다음과 같은 합동성을 띤다.

$$
p \equiv 1 \pmod 4
\\
p \equiv 3 \pmod 4 

$$

이러한 합동성 중에서 $$p \equiv 1 \pmod 4$$의 경우에 더 일반적인 알고리즘으로 Tonelli-Shanks를 사용한다. $$p \equiv 3 \pmod 4$$인 경우는 단순히 $$x \equiv a^{(p+1)/4} \pmod p$$로 해결할 수 있지만, $$p \equiv 1 \pmod 4$$의 경우는 더 복잡한 접근이 필요하다.

Tonelli-Shanks 알고리즘의 주요 아이디어는 소수 p-1을 $$2^{k\cdot q}$$ 형태로 분해하여(q는 홀수) 2의 지수 k와 함께 사용하는 것이다. 이 알고리즘은 르장드르 기호가 1인 경우에만 작동하며, 이는 a가 p에 대한 이차잉여일 때를 의미한다.

## 2. 동작 방법

1. 먼저 르장드르 기호를 계산하여 해가 존재하는지 확인한다
    
    $$
    (\frac{n}{p}) = n^{\frac{p-1}{2}} \ mod \ p
    $$
    
    결과가 -1이라면 해가 없으므로 알고리즘을 중단한다
    
2. **$$p-1 = Q \cdot 2^S$$분해**
    
    p가 홀수 소수이므로 p-1은 다음과 같이 분해될 수 있다
    
    $$
    p-1 = Q \cdot 2^S
    $$
    
    여기서 Q는 홀수, S≥ 1이다.
    
3. **이차 비잔여  $$\mathbb{z}$$를 찾는다**
    
    <aside class="notion-callout notion-callout--with-icon" markdown="1">
    💡
    {: .notion-callout__icon aria-hidden="true"}
    
    **이차비잔여**
    
    이차 비잔여는 주어진 소수 p에 대해 제곱근이 존재하지 않는 정수를 의미한다. 즉, $$x^2 \equiv z \pmod p$$를 만족하는 정수 x가 존재하지 않는 z를 이차 비잔여라고 한다.
    
    르장드르 기호로 표현하면 $$(\frac{z}{p}) = -1$$일 때 z는 p에 대한 이차 비잔여이다. Tonelli-Shanks 알고리즘에서는 이러한 이차 비잔여를 찾아 알고리즘의 초기값 설정에 활용한다.
    
    ### 예시
    
    p = 41일 때, z = 2가 이차 비잔여인지 확인해보자.
    
    르장드르 기호를 계산하면:
    
    $$
    (\frac{2}{41}) = 2^{\frac{41-1}{2}} \equiv 2^{20} \equiv -1 \pmod{41}
    $$
    
    결과가 -1이므로 2는 41에 대한 이차 비잔여이다. 따라서 Tonelli-Shanks 알고리즘에서 z = 2를 사용할 수 있다.
    
    </aside>
    
    $$(\frac{n}{p}) = - 1$$인  $$\mathbb{z}$$를 임의로 찾는다 ( 즉  $$\mathbb{z}$$는 이차 잔여가 아님)
    
4. **초기값 설정**

$$
c \leftarrow z^Q\ mod\ p
\\
R \leftarrow n^{\frac{Q+1}{2}}\ mod\ p
\\
t \leftarrow n^Q\ mod\ p
\\
M \leftarrow S
$$

1. **반복 갱신**
    
    반복하면서 t가 1이 될 때까지 다음을 수행
    
    1. $$t\equiv 1 \pmod p$$이면 종료하고 R이 해이다
    2. 그렇지 않으면 가장 작은 0 < i < M을 찾아 $$t^{2^i}$$를 만족하게 한다
    3. 지수 b를 $$b \leftarrow c^{2^{M-i-1}}\ mod \ p$$로 정한다
    4. 변수 갱신
        
        $$
        R \leftarrow R \cdot\ mod\ p
        \\
        t \leftarrow t \cdot b^2\ mod\ p
        \\
        c \leftarrow b^2\ mod\ p
        \\
        M \leftarrow i
        $$
        
2. 위 과정이 종료되면  R이 한 해이고 p-R이 다른 해이다

## 3. 구현

```python
def tonelli_shanks(a, p):
    assert pow(a, (p - 1) // 2, p) == 1, "a is not a quadratic residue mod p"
    q = p - 1
    s = 0
    while q % 2 == 0:
        q //= 2
        s += 1
    z = 2
    while pow(z, (p - 1) // 2, p) != p - 1:
        z += 1
    m = s
    c = pow(z, q, p)
    t = pow(a, q, p)
    r = pow(a, (q + 1) // 2, p)
    while t != 1:
        i = 1
        temp = pow(t, 2, p)
        while temp != 1:
            temp = pow(temp, 2, p)
            i += 1
        b = pow(c, 1 << (m - i - 1), p)
        m = i
        c = pow(b, 2, p)
        t = (t * c) % p
        r = (r * b) % p
    return r
```
