---
title: "내적 공간과 직교성"
permalink: /study/algorithms/math/haengryeol/naejeog-gonggangwa-jiggyoseong/
math: true
toc: true
---

[상위 페이지 · 행렬](/study/algorithms/math/haengryeol/)

## 내적과 유사도

실수 벡터의 표준 내적은 다음과 같다.

$$
x^Ty=\sum_i x_i y_i
$$

내적은 두 벡터가 같은 방향을 얼마나 공유하는지 나타낸다. 벡터의 길이를 제거해 방향만 비교하면 코사인 유사도가 된다.

$$
\cos\theta=\frac{x^Ty}{\lVert x\rVert_2\lVert y\rVert_2}
$$

임베딩 검색, 문서 유사도, 추천 시스템에서 널리 사용한다.

## 노름과 거리

- L1 노름: $$\lVert x\rVert_1=\sum_i|x_i|$$
- L2 노름: $$\lVert x\rVert_2=\sqrt{\sum_i x_i^2}$$
- 최대 노름: $$\lVert x\rVert_\infty=\max_i|x_i|$$
- Frobenius 노름: $$\lVert A\rVert_F=\sqrt{\sum_{i,j}A_{ij}^2}$$

L1·L2 노름은 거리 측정뿐 아니라 Lasso·Ridge 정규화에도 사용된다.

## 직교성과 정규직교기저

$$x^Ty=0$$이면 두 벡터는 직교한다. 서로 직교하고 길이가 1인 벡터 집합을 정규직교기저라고 한다. 정규직교행렬 $$Q$$는 $$Q^TQ=I$$를 만족하고 길이와 각도를 보존한다.

Gram–Schmidt 과정은 독립인 벡터들을 정규직교기저로 바꾼다. 실제 수치 계산에서는 더 안정적인 QR 분해 알고리즘을 사용한다.

## 사영

단위벡터 $$u$$ 방향으로 $$x$$를 사영하면 다음과 같다.

$$
\operatorname{proj}_u(x)=(u^Tx)u
$$

열들이 독립인 행렬 $$A$$의 열공간으로 사영하는 행렬은

$$
P=A(A^TA)^{-1}A^T
$$

이다. 최소제곱법은 $$b$$를 $$A$$의 열공간에 사영하는 문제로 해석할 수 있다.

## 최소제곱과 정규화

선형회귀는 $$\lVert Xw-y\rVert_2^2$$를 최소화한다. 과적합을 줄이기 위해 L2 규제를 더하면 Ridge 회귀가 된다.

$$
\operatorname*{minimize}_w\ \lVert Xw-y\rVert_2^2+\lambda\lVert w\rVert_2^2
$$
