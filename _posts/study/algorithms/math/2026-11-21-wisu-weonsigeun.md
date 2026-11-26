---
title: "위수/원시근"
permalink: /study/algorithms/math/wisu-weonsigeun/
math: true
toc: true
categories: ["알고리즘"]
tags: ["수학", "정수론", "위수/원시근"]
---

[상위 페이지 · Math](/study/algorithms/math/)

## 선행지식

- [모듈러 연산](/study/algorithms/math/modyulreo-yeonsan/)
- [오일러 피 함수](/study/algorithms/math/oilreo-pi-hamsu/)
- [페르마의 소정리/오일러 정리](/study/algorithms/math/pereumayi-sojeongri-oilreo-jeongri/)

## 설명

<aside class="notion-callout notion-callout--with-icon" markdown="1">
💡
{: .notion-callout__icon aria-hidden="true"}

n > 1이고 gcd(a,n) = 1일 때, 어떤 정수 a가 법 n에 대해 k의 위수를 가진다는 것은 k가 $$a^k\ mod\ n \equiv 1$$ 을 만족하는 최소의 자연수

</aside>

예시)

- n = 8, a = 3, gcd(a,n) = 1일 때 오일러 정리에 의해 $$a^{\phi(n)}\ mod\ n \equiv 1$$이 성립한다. $$\phi(8) = 4$$이므로 $$3^4\ mod\ 8 = 1$$을 만족한다. 그런데 더 작은 k값인 $$3^2\ mod\ 8 = 1$$도 성립하며, 이때 2를 법 8에 대한 3의 위수라고 정의하고 기호로는 $$ord_{n}(a),\ ord_{8}(3) = 2$$라고 쓴다.

하지만 이렇게 하나하나 대입해서 찾는 방법은 매우 비효율적이다. $$\phi(n)$$이 n보다 작기는 하지만, n이 커지면 $$\phi(n)$$도 함께 커지므로 1부터 $$\phi(n)$$까지의 자연수를 일일이 대입하는 것은 현실적으로 불가능하다.

따라서 위수가 될 자연수의 후보를 줄일 필요가 있음.

<aside class="notion-callout notion-callout--with-icon" markdown="1">
💡
{: .notion-callout__icon aria-hidden="true"}

n은 자연수이고 a는 gcd(a,n)=1을 만족하는 정수일 때, 자연수 h에 대하여 $$a^h\ mod \ n \equiv 1$$을 만족할 필요충분조건은 $$ord_n(a) \vert h$$이다. 그러므로 $$ord_n(a)\ \vert \ \phi(n)$$이 성립한다.

- a|b 는 a는 정수 b의 약수
</aside>

위 정리에 따라 n=13, a=3일 때 $$\phi(13) = 12$$, 12의 양의 약수는 1, 2, 3, 4, 6, 12이므로 3의 위수는 이 6개 중 하나이다. 실제로 법 13에 대하여 $$3^1 \equiv 3 , 3^2 \equiv 9, 3^ 3 \equiv 1$$이므로 $$ord_{13}(3)=3$$이다.

그러나 $$\phi(n)$$의 모든 약수가 위수가 될 수 있는 것은 아니다.

예시)

- n = 12일 때 $$\phi(12) = 4$$이고 4의 양의 약수는 1, 2, 4이다. 하지만 12와 서로소인 수 a(1, 5, 7, 11) 중에서 위수가 4인 수는 존재하지 않는다.

$$ord_n(a) = \phi(n)$$일 때, 이를 원시근이라고 한다.

예시)

- n = 5일 때 $$\phi(5) = 4$$이고 gcd(2,5) = 1이면 다음이 성립
    
    $$
    2^1\ mod\ 5 \equiv 2 \\
    2^2\ mod\ 5 \equiv 4 \\
    2^4\ mod\ 5 \equiv 1 
    $$
    
    즉 $$ord_5(2)=\phi(5)=4$$
    

<aside class="notion-callout notion-callout--with-icon" markdown="1">
💡
{: .notion-callout__icon aria-hidden="true"}

n은 자연수이고 a는 gcd(a,n)=1을 만족하는 정수일때 정수 a가 $$ord_n(a)=\phi(n)$$을 만족하면 a를 법 n의 원시근이라고 정의함

</aside>

## 참고

[https://blog.naver.com/mindo1103/221234422971](https://blog.naver.com/mindo1103/221234422971)
