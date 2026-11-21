---
title: "행렬미분과 최적화"
permalink: /study/algorithms/math/haengryeol/haengryeolmibungwa-coejeoghwa/
math: true
toc: true
categories: ["알고리즘"]
tags: ["수학", "선형대수학"]
---

[상위 페이지 · 행렬](/study/algorithms/math/haengryeol/)

## 미분 결과의 형태

행렬미분에서는 입력과 출력의 shape을 먼저 확인한다.

| 함수 | 미분 대상 | 결과 |
| --- | --- | --- |
| 스칼라 $$f$$ | 스칼라 $$x$$ | 도함수 |
| 스칼라 $$f$$ | 벡터 $$x$$ | 그래디언트 $$\nabla_xf$$ |
| 벡터 $$y$$ | 벡터 $$x$$ | 야코비안 $$J$$ |
| 스칼라 $$f$$ | 벡터 $$x$$를 두 번 미분 | 헤시안 $$H$$ |

## 그래디언트

그래디언트는 함수가 가장 빠르게 증가하는 방향이다.

$$
\nabla_x f=\begin{bmatrix}\partial f/\partial x_1&\cdots&\partial f/\partial x_n\end{bmatrix}^T
$$

자주 사용하는 공식은 다음과 같다.

$$
\nabla_x(a^Tx)=a
$$

$$
\nabla_x(x^TAx)=(A+A^T)x
$$

$$A$$가 대칭이면 $$\nabla_x(x^TAx)=2Ax$$이다.

## 야코비안과 헤시안

벡터함수 $$y=f(x)$$의 야코비안은 각 출력이 각 입력에 얼마나 민감한지 나타낸다.

$$
J_{ij}=\frac{\partial y_i}{\partial x_j}
$$

헤시안은 그래디언트를 한 번 더 미분한 행렬이다.

$$
H_{ij}=\frac{\partial^2f}{\partial x_i\partial x_j}
$$

헤시안의 고유값은 최적점 주변의 곡률을 설명한다.

## 연쇄법칙과 역전파

합성함수 $$L(y(x))$$는 연쇄법칙으로 미분한다. 신경망의 역전파는 출력층에서 입력층 방향으로 국소 미분을 곱해 그래디언트를 전달하는 과정이다.

선형층 $$Z=XW+b$$에서 상류 그래디언트를 $$G=\partial L/\partial Z$$라고 하면

$$
\frac{\partial L}{\partial W}=X^TG
$$

$$
\frac{\partial L}{\partial X}=GW^T
$$

배치 차원과 행렬 shape을 확인하는 습관이 중요하다.

## 경사하강법

손실함수 $$L(\theta)$$를 최소화하기 위해 그래디언트의 반대 방향으로 이동한다.

$$
\theta_{t+1}=\theta_t-\eta\nabla_\theta L(\theta_t)
$$

- $$\eta$$: 학습률
- 너무 크면 발산하고 너무 작으면 학습이 느리다.
- SGD, Momentum, Adam은 이 갱신 규칙을 변형한 방법이다.

## 최소제곱 미분

$$
L(w)=\lVert Xw-y\rVert_2^2
$$

이면

$$
\nabla_wL=2X^T(Xw-y)
$$

그래디언트를 0으로 놓으면 정규방정식 $$X^TXw=X^Ty$$를 얻는다. 이 연결을 이해하면 선형대수와 최적화가 하나의 문제를 서로 다른 관점에서 설명한다는 것을 알 수 있다.

## 추가 학습 항목

- Softmax와 Cross-Entropy의 미분
- 브로드캐스팅된 편향 $$b$$의 그래디언트 합산
- 자동미분의 계산 그래프
- L1·L2 정규화의 그래디언트
- Gradient checking을 이용한 구현 검증
