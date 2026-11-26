---
title: "Mersenne Twister"
permalink: /study/algorithms/math/mersenne-twister/
math: true
toc: true
excerpt: "Mersenne Twister는 1997년 마츠모토 마코토(松本眞)와 니시무라 타쿠지(西村拓士)가 개발한 의사난수 생성기(Pseudorandom Number Generator, PRNG)이다. 현재 가장 널리 사용되는 범용 난수 생성 알고리즘 중 하나로, Python의 random 모듈, Ruby, PHP, Excel, C++의 std::mt19937 등 다양한 프로그래밍 언어와 라이브러리의 기본 난수 생성기로 채택되어 있다."
categories: ["알고리즘"]
tags: ["수학", "난수 생성", "Mersenne Twister"]
---

[상위 페이지 · Math](/study/algorithms/math/)

### 배경지식

- [1. 메르센 소수](/study/algorithms/math/sosu/)

## 1. 개요

Mersenne Twister는 1997년 마츠모토 마코토(松本眞)와 니시무라 타쿠지(西村拓士)가 개발한 의사난수 생성기(Pseudorandom Number Generator, PRNG)이다. 현재 가장 널리 사용되는 범용 난수 생성 알고리즘 중 하나로, Python의 random 모듈, Ruby, PHP, Excel, C++의 std::mt19937 등 다양한 프로그래밍 언어와 라이브러리의 기본 난수 생성기로 채택되어 있다.

핵심 특징은 다음과 같다

1. **압도적인 주기 길이**
    
    Mersenne Twister의 가장 큰 특징은 메르센 소수 $$2^{19937}-1$$을 주기로 가진다는 점이다. 이는 약 $$10^{6000}$$에 해당하는 천문학적인 수치로, 실질적으로 무한에 가까운 주기를 제공한다.
    
2. **고속 연산**
    
    Mersenne Twister는 복잡한 수학 연산 대신 비트 단위 연산(XOR, Shift, AND)만을 사용한다. 이러한 연산들은 현대 CPU에서 한 사이클 내에 수행 가능하므로 매우 빠른 난수 생성 속도를 제공한다.
    
3.  **높은 차원 균등성**
    
    Mersenne Twister는 623차원 공간에서 균등 분포를 만족한다. 이는 생성된 난수 시퀀스를 623개씩 묶어 623차원 공간의 점으로 해석할 때, 이 점들이 해당 공간을 균등하게 덮는다는 의미이다.
    

## 2. 수학적 기반

## 2.1 GF(2) 상의 선형 점화식

Mersenne Twister의 핵심은 갈루아 체 GF(2) 위에서 정의된 선형 점화식이다. 이는 내부 상태를 업데이트하는 수학적 기반을 제공한다.

### 2.1.1 점화식의 정의

내부 상태 벡터 $$x_k$$에 대해 다음과 같은 점화식이 성립한다:

$$
x_{k+n} := x_{k+m} \oplus (x_k^u \vert  x_{k+1}^l) A
$$

여기서:

- $$n = 624$$: 상태 벡터의 크기
- $$m = 397$$: 중간 오프셋
- $$x_k^u$$: $$x_k$$의 상위 $$w-r = 1$$비트
- $$x_{k+1}^l$$: $$x_{k+1}$$의 하위 $$r = 31$$비트
- $$\vert $$: 비트 연결 연산자
- $$\oplus$$: XOR 연산
- $$A$$: $$32 \times 32$$ 비트 행렬

### 2.1.2 행렬 A의 구조

행렬 $$A$$는 특수한 형태를 가진다:

$$
A = \begin{bmatrix}
0 & 1 & 0 & \cdots & 0 \\
0 & 0 & 1 & \cdots & 0 \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
0 & 0 & 0 & \cdots & 1 \\
a_{31} & a_{30} & a_{29} & \cdots & a_0
\end{bmatrix}
$$

이는 shift register와 유사한 구조로, 마지막 행에만 계수 $$a = 0x9908B0DF$$의 비트들이 배치된다.

### 2.1.3 행렬 곱셈의 최적화

이론적으로는 행렬 곱셈 $$(x_k^u \vert  x_{k+1}^l) A$$를 수행해야 하지만, 실제 구현에서는 다음과 같이 비트 연산으로 대체한다:

$$
y = x_k^u \vert  x_{k+1}^l
$$

$$
x_{k+n} = x_{k+m} \oplus (y \gg 1) \oplus \begin{cases} a & \text{if } y \text{ is odd} \\ 0 & \text{if } y \text{ is even} \end{cases}
$$

즉, 행렬 곱셈이 다음의 간단한 연산들로 분해된다:

- 1비트 오른쪽 시프트 ($$y \gg 1$$)
- 조건부 XOR (최하위 비트가 1이면 $$a$$와 XOR)

이러한 비트 연산은 CPU에서 1 사이클 내에 수행 가능하므로 매우 빠르다.

### 2.1.4 선형성의 의미

이 점화식이 GF(2) 위에서 선형이라는 것은 중요한 의미를 가진다:

- **결정론적:** 초기 상태가 같으면 이후 모든 상태가 동일
- **주기성:** 유한한 상태 공간에서 반드시 순환 구조 형성
- **취약점:** 충분한 출력값을 관측하면 내부 상태 복원 가능

## 2.2 상태 공간

### 2.2.1 내부 상태 벡터

Mersenne Twister의 내부 상태는 다음과 같이 구성된다:

$$
\text{MT}[0], \text{MT}[1], \ldots, \text{MT}[623]
$$

각 원소는 32비트 부호 없는 정수이므로, 전체 상태 공간의 크기는:

$$
624 \times 32 = 19968 \text{ bits}
$$

이론적으로 가능한 상태의 개수는 $$2^{19968}$$이지만, 실제로는 특수한 구조로 인해 $$2^{19937}$$개의 서로 다른 상태만 접근 가능하다.

### 2.2.2 시드를 통한 초기화

초기 시드 값 $$s$$가 주어지면, 다음과 같은 과정으로 624개의 상태를 초기화한다:

$$
\text{MT}[0] = s
$$

나머지 원소들은 다음 점화식으로 계산:

$$
\text{MT}[i] = f \times (\text{MT}[i-1] \oplus (\text{MT}[i-1] \gg (w-2))) + i
$$

여기서:

- $$f = 1812433253$$ (초기화 승수)
- $$w = 32$$ (워드 크기)
- $$i = 1, 2, \ldots, 623$$ (인덱스)

### 2.2.3 초기화의 중요성

시드 초기화 과정은 다음과 같은 특성을 가진다:

- **확산 효과:** 단일 시드 값이 624개의 상태 전체로 퍼져나감
- **비가역성:** 현재 상태로부터 초기 시드를 역산하기는 어려움
- **취약점:** 초기화 함수 자체는 암호학적으로 안전하지 않음. 시드가 예측 가능하면 전체 난수 시퀀스가 예측 가능

## 3. 알고리즘 메커니즘

Mersenne Twister는 세 가지 핵심 단계로 동작한다: 초기화(Initialization), 트위스트(Twisting), 템퍼링(Tempering). 각 단계는 특정한 비트 연산을 통해 구현된다.

## 3.1 초기화 (Initialization)

시드 값 $$s$$를 이용해 624개의 32비트 상태 배열을 초기화하는 과정이다.

### 3.1.1 초기 시드 설정

첫 번째 상태는 시드 값으로 직접 설정한다:

```python
MT[0] = seed
```

### 3.1.2 나머지 상태 생성

```python
def initialize(seed):
    MT = [0] * 624
    MT[0] = seed & 0xffffffff  # 32비트로 제한
    
    for i in range(1, 624):
        temp = MT[i-1] ^ (MT[i-1] >> 30)
        MT[i] = (0x6C078965 * temp + i) & 0xffffffff
    
    return MT
```

나머지 623개의 상태는 다음 점화식으로 생성한다:

$$
MT[i] = f \times (MT[i-1] \oplus (MT[i-1] \gg 30)) + i
$$

여기서:

- $$f = 1812433253$$ (16진수: `0x6C078965`)
- $$\gg 30$$: 30비트 오른쪽 시프트
- $$\oplus$$: XOR 연산
- $$i$$: 배열 인덱스 (1부터 623까지)

단일 시드 값이 XOR와 곱셈 연산을 통해 624개의 상태 전체로 확산된다.

## 3.2 트위스트

상태 배열이 모두 소진되면, 전체 624개의 상태를 한 번에 갱신하는 과정이다. 이는 Mersenne Twister의 핵심 메커니즘이다.

### 3.2.1 트위스트 알고리즘

```python
def twist(MT):
    for i in range(624):
        # 상위 1비트와 하위 31비트 결합
        upper_mask = 0x80000000  # 1000...0000 (32비트)
        lower_mask = 0x7fffffff  # 0111...1111 (31비트)
        
        y = (MT[i] & upper_mask) | (MT[(i+1) % 624] & lower_mask)
        
        # 1비트 오른쪽 시프트
        y_shifted = y >> 1
        
        # 최하위 비트가 1이면 a와 XOR
        if y & 1:
            y_shifted ^= 0x9908B0DF
        
        # 397칸 떨어진 값과 XOR
        MT[i] = MT[(i + 397) % 624] ^ y_shifted
    
    return MT
```

각 상태 $$MT[i]$$는 다음 공식으로 업데이트된다:

$$
MT[i] = MT[(i + 397) \bmod 624] \oplus ((MT[i]^u \vert  MT[(i+1) \bmod 624]^l) A)
$$

여기서:

- $$397$$: 중간 오프셋 파라미터 $$m$$
- $$MT[i]^u$$: $$MT[i]$$의 상위 1비트 (최상위 비트)
- $$MT[i+1]^l$$: $$MT[i+1]$$의 하위 31비트
- $$\vert $$: 비트 연결 (32비트 워드 생성)
- $$A$$: 행렬 곱셈 (비트 연산으로 구현)

### 3.2.2 행렬 A의 구현

이론적으로 $$32 \times 32$$ 행렬 곱셈이지만, 실제로는 다음과 같이 간단한 비트 연산으로 대체된다:

$$
y = MT[i]^u \vert  MT[i+1]^l
$$

$$
MT[i] = MT[(i+397) \bmod 624] \oplus (y \gg 1) \oplus \begin{cases} a & \text{if } y \text{ is odd} \\ 0 & \text{if } y \text{ is even} \end{cases}
$$

여기서 $$a = 0x9908B0DF$$는 행렬 $$A$$의 마지막 행에 해당하는 상수이다.

## 3.3 템퍼링

트위스트로 생성된 내부 상태 $$MT[i]$$를 그대로 출력하지 않고, 추가적인 비트 뒤섞기를 통해 통계적 품질을 개선하는 과정이다. **이것이 Mersenne Twister의 핵심 특징**이다.

### 3.3.1 템퍼링의 필요성

트위스트 과정만으로는 생성된 난수가 다음과 같은 문제를 가질 수 있다:

- 비트들 간의 상관관계가 남아있을 수 있음
- 하위 비트들의 품질이 상위 비트보다 떨어질 수 있음
- 특정 통계적 테스트를 통과하지 못할 수 있음

템퍼링은 이러한 문제를 해결하여 모든 비트 위치에서 균등한 품질의 난수를 생성한다.

### 3.3.2 템퍼링 알고리즘

```python
def temper(y):
    # 1단계: 11비트 오른쪽 시프트 후 XOR
    y ^= (y >> 11)
    
    # 2단계: 7비트 왼쪽 시프트, 마스크 AND, XOR
    y ^= (y << 7) & 0x9D2C5680
    
    # 3단계: 15비트 왼쪽 시프트, 마스크 AND, XOR
    y ^= (y << 15) & 0xEFC60000
    
    # 4단계: 18비트 오른쪽 시프트 후 XOR
    y ^= (y >> 18)
    
    return y & 0xffffffff  # 32비트로 제한
```

템퍼링은 4단계의 비트 시프트와 XOR 연산으로 구성된다:

$$
y = MT[index]
$$

$$
y = y \oplus (y \gg 11)
$$

$$
y = y \oplus ((y \ll 7) \land 0x9D2C5680)
$$

$$
y = y \oplus ((y \ll 15) \land 0xEFC60000)
$$

$$
y = y \oplus (y \gg 18)
$$

### 3.3.3 각 단계의 역할

**1단계** ($$y \oplus (y \gg 11)$$):

- 상위 비트의 정보를 하위 비트로 확산
- 11비트 간격으로 비트 의존성 생성

**2단계** ($$y \oplus ((y \ll 7) \land 0x9D2C5680)$$):

- 하위 비트의 정보를 상위로 확산
- 마스크 `0x9D2C5680`는 특정 비트 패턴만 선택적으로 혼합
- 이진수: `10011101001011000101011010000000`

**3단계** ($$y \oplus ((y \ll 15) \land 0xEFC60000)$$):

- 더 넓은 범위의 비트 혼합
- 마스크 `0xEFC60000`는 주로 상위 비트에 영향
- 이진수: `11101111110001100000000000000000`

**4단계** ($$y \oplus (y \gg 18)$$):

- 최종적으로 상위 비트를 하위로 한 번 더 확산
- 모든 비트가 다른 비트들과 복잡하게 얽히도록 함

### 3.3.5 템퍼링의 특성

**전단사 함수 (Bijective):**

- 템퍼링은 1-1 대응 함수임
- 모든 32비트 입력에 대해 유일한 32비트 출력이 존재
- 따라서 역함수가 존재함 (Untempering 가능)

**선형 변환:**

- XOR과 시프트만 사용하므로 GF(2) 위에서 선형 변환
- 이는 CTF 공격의 핵심 취약점이 됨

**균등 분포 보존:**

- 입력이 균등 분포면 출력도 균등 분포
- 단, 비트들 간의 상관관계는 개선됨

### 3.3.6 전체 난수 생성 흐름

```python
class MT19937:
    def __init__(self, seed):
        self.MT = [0] * 624
        self.index = 624
        self.initialize(seed)
    
    def initialize(self, seed):
        self.MT[0] = seed & 0xffffffff
        for i in range(1, 624):
            temp = self.MT[i-1] ^ (self.MT[i-1] >> 30)
            self.MT[i] = (0x6C078965 * temp + i) & 0xffffffff
    
    def twist(self):
        for i in range(624):
            y = (self.MT[i] & 0x80000000) | (self.MT[(i+1) % 624] & 0x7fffffff)
            self.MT[i] = self.MT[(i + 397) % 624] ^ (y >> 1)
            if y & 1:
                self.MT[i] ^= 0x9908B0DF
    
    def extract_number(self):
        if self.index >= 624:
            self.twist()
            self.index = 0
        
        y = self.MT[self.index]
        self.index += 1
        
        # 템퍼링
        y ^= (y >> 11)
        y ^= (y << 7) & 0x9D2C5680
        y ^= (y << 15) & 0xEFC60000
        y ^= (y >> 18)
        
        return y & 0xffffffff
```

**동작 순서:**

1. 시드로 초기화 → 624개 상태 생성
2. 난수 요청 시 현재 인덱스의 상태를 템퍼링하여 반환
3. 624개를 모두 사용하면 트위스트로 전체 상태 갱신
4. 인덱스를 0으로 리셋하고 다시 2번부터 반복

*이 페이지는 개념과 방어 관점의 설명을 담고 있습니다.*
