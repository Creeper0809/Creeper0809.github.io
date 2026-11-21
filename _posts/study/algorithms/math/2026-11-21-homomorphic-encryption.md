---
title: "Homomorphic Encryption"
permalink: /study/algorithms/math/homomorphic-encryption/
excerpt: "암호문으로 계산한 결과를 복호화하면 어떤 값이 나오는지, 합산 예제로 동형 암호를 설명한다."
categories: ["알고리즘"]
tags: ["수학", "암호학", "Homomorphic Encryption"]
---

[상위 페이지 · Math](/study/algorithms/math/)

동형 암호는 데이터를 암호화한 상태로 계산할 수 있게 해 준다. 암호문에 대응하는 연산을 하고 그 결과를 복호화하면, 원래 데이터에 원하는 연산을 한 결과를 얻는다.

## 암호화된 값 더하기

예를 들어 같은 공개키로 암호화한 `7`과 `12`를 서버에 보낸다. 덧셈을 지원하는 방식이라면 서버는 두 암호문으로부터 합계를 담은 새 암호문을 만들 수 있다. 비밀키를 가진 사람이 그 결과를 복호화하면 `19`가 나온다. 서버는 두 입력을 복호화할 키 없이 계산을 맡을 수 있다.

## 지원하는 연산과 계산 비용

어떤 연산을 할 수 있는지는 암호 방식에 따라 다르다. 합계만 필요하면 덧셈을 지원하는 방식으로 충분하다. 완전 동형 암호(FHE)는 기본 연산을 조합해 주어진 계산을 회로로 표현하고, 그 회로를 암호문 위에서 실행할 수 있게 한다.

잡음을 이용하는 방식에서는 연산을 거듭하면 잡음이 커져 복호화가 어려워질 수 있다. 부트스트래핑은 같은 값을 담은 암호문을 갱신해 계산을 이어 갈 수 있게 해 주지만, 그만큼 계산 비용이 든다. [Craig Gentry, Computing Arbitrary Functions of Encrypted Data](https://crypto.stanford.edu/craig/easy-fhe.pdf)

## 배경지식

격자 기반 방식을 읽을 때는 모듈러 연산과 다항식환에서 연산 결과를 어떻게 다루는지 먼저 보면 좋다. Learning With Error는 여러 격자 기반 암호 방식의 안전성을 설명할 때 등장하는 문제다.

- [3.4 다항식환](/study/algorithms/math/gun-hwan-ce/hwan/)
- [5.3 몫환](/study/algorithms/math/gun-hwan-ce/hwan/)
- [모듈러 연산](/study/algorithms/math/modyulreo-yeonsan/)
- [Fast Fourier Transform](/study/algorithms/math/fast-fourier-transform/)
- [Chinese Remainder Theorem](/study/algorithms/math/chinese-remainder-theorem/)
- [Learning With Error](/study/algorithms/math/learning-with-error/)
