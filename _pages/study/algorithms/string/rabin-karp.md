---
title: "Rabin-Karp"
permalink: /study/algorithms/string/rabin-karp/
math: true
toc: true
---

[상위 페이지 · String](/study/algorithms/string/)

라빈-카프 알고리즘은 문자열에서 패턴을 찾는 알고리즘이다. 해싱(hashing)을 사용하여 효율적으로 문자열을 검색한다. 이 알고리즘의 시간 복잡도는 문자열의 길이에 비례한다.

## 작동 원리

1. 패턴 문자열의 해시값을 계산한다.
2. 검색 대상 문자열에서 패턴의 길이만큼 문자열을 잘라내어 해시값을 계산한다.
3. 패턴 문자열의 해시값과 잘라낸 문자열의 해시값이 일치하는지 확인한다.
4. 해시값이 일치하면, 잘라낸 문자열과 패턴 문자열을 비교하여 정확히 일치하는지 확인한다.
5. 일치하지 않으면, 검색 대상 문자열을 한 칸씩 이동하여 2번 과정부터 다시 시작한다.

이러한 과정을 반복하여 검색 대상 문자열에서 패턴과 일치하는 부분을 찾을 수 있다.

## 해시값 계산 방법

문자열의 길이를 n, 각 문자의 아스키 코드값을 a라고 할 때:

$$
2^n*a+2^{n-1}*a … + 2^0 + a
$$

### 예시: 'abbcaabb'의 해시값 계산

97 * 2^7 + 98 * 2^6 + 97 * 2^5 + 99 * 2^4 + 97 * 2^3 + 97 * 2^2 + 98 * 2^1 + 98 * 2^0 = 24,834

다음은 라빈-카프로 문자열을 찾는 함수이다.

```python
def rabin_karp(text, pattern):
    n = len(text)
    m = len(pattern)
    pattern_hash = sum(ord(pattern[i]) * 2**(m-i-1) for i in range(m))
    text_hash = sum(ord(text[i]) * 2**(m-i-1) for i in range(m))
    for i in range(n-m+1):
        if pattern_hash == text_hash:
            if text[i:i+m] == pattern:
                return i
        if i < n-m:
            text_hash = 2*(text_hash-ord(text[i])*2**(m-1))+ord(text[i+m])
    return -1

```

## 해시 계산의 한계와 롤링 해시

위에서 설명한 해시 계산 방법은 기본적인 방법이지만, 실제로는 몇 가지 문제점이 있다

- **오버플로우 문제:** 문자열이 길어지면 해시값이 너무 커져서 오버플로우가 발생할 수 있다.
- **연산 비용:** 매번 전체 해시값을 새로 계산하면 시간 복잡도가 O(m)이 되어 효율성이 떨어진다.
- **숫자 베이스:** 2를 밑수로 사용하면 비트 연산이 쉽지만, 해시 충돌이 발생할 가능성이 높아진다.

이러한 문제점을 해결하기 위해 '롤링 해시(Rolling Hash)' 기법을 사용한다.

### 롤링 해시(Rolling Hash) 기법

롤링 해시는 이전 해시값을 이용하여 새로운 해시값을 계산하는 방법이다. 이를 통해 문자열을 한 칸씩 이동할 때마다 O(1) 시간에 새로운 해시값을 계산할 수 있다.

### 롤링 해시의 계산 방법

현재 윈도우의 해시값이 H(i)이고, 다음 윈도우로 이동할 때의 해시값이 H(i+1)일 때:

$$
H(i+1) = (H(i) - text[i] * 2^{(m-1)}) * 2 + text[i+m]
$$

여기서:

- text[i]는 윈도우에서 제거되는 첫 번째 문자
- text[i+m]은 윈도우에 새로 추가되는 마지막 문자
- $$2^{(m-1)}$$은 첫 번째 문자의 가중치

이렇게 계산하면 전체 문자열을 다시 계산하지 않고도 새로운 해시값을 O(1) 시간에 구할 수 있다.

### 모듈러 연산을 통한 오버플로우 방지

오버플로우 문제를 해결하기 위해 큰 소수 p에 대해 모듈러 연산을 적용한다:

$$
H(i+1) = ((H(i) - text[i] * 2^{(m-1)}) * 2 + text[i+m]) \mod p
$$

일반적으로 p는 $$2^{31} - 1$$과 같은 메르센 소수를 사용한다.

```python
def rolling_hash(text, pattern):
    n = len(text)
    m = len(pattern)
    p = (1 << 31) - 1  # 큰 소수 (2^31 - 1)
    base = 256  # ASCII 문자를 위한 기수
    
    # 패턴의 해시값 계산
    pattern_hash = 0
    for i in range(m):
        pattern_hash = (pattern_hash * base + ord(pattern[i])) % p
    
    # 텍스트의 첫 m개 문자에 대한 해시값 계산
    text_hash = 0
    for i in range(m):
        text_hash = (text_hash * base + ord(text[i])) % p
    
    # 첫 문자의 가중치 계산 (base^(m-1))
    h = 1
    for i in range(m-1):
        h = (h * base) % p
    
    # 롤링 해시를 사용한 검색
    for i in range(n-m+1):
        if pattern_hash == text_hash:
            # 해시값이 일치하면 실제 문자열 비교
            if text[i:i+m] == pattern:
                return i
        
        # 다음 윈도우의 해시값 계산 (롤링 해시)
        if i < n-m:
            text_hash = (base * (text_hash - ord(text[i]) * h) + ord(text[i+m])) % p
            # 음수가 되지 않도록 조정
            if text_hash < 0:
                text_hash += p
    
    return -1  # 패턴이 발견되지 않음

```

### 라빈-카프 알고리즘의 성능

- **평균 시간 복잡도:** O(n+m), 여기서 n은 텍스트 길이, m은 패턴 길이
- **최악 시간 복잡도:** O(n*m), 해시 충돌이 많이 발생할 경우
- **공간 복잡도:** O(1), 추가 공간이 거의 필요하지 않음

롤링 해시 기법을 사용함으로써 라빈-카프 알고리즘은 효율적인 문자열 검색이 가능하며, 특히 여러 패턴을 동시에 검색할 때 유용하다.
