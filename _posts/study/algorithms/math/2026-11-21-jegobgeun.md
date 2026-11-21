---
title: "제곱근"
permalink: /study/algorithms/math/jegobgeun/
math: true
toc: true
excerpt: "제곱의 결과를 제곱수 라고 부른다. 양수든 음수든 제곱하면 항상 0 이상의 수가 된다."
---

[상위 페이지 · Math](/study/algorithms/math/)

## 제곱이란 무엇인가?

제곱은 어떤 수를 두 번 곱하는 것이다.

$$
a^2 = a \times a
$$

예를 들어:

$$
3^2 = 3 \times 3 = 9
$$

$$
5^2 = 5 \times 5 = 25
$$

$$
(-4)^2 = (-4) \times (-4) = 16
$$

제곱의 결과를 **제곱수**라고 부른다. 양수든 음수든 제곱하면 항상 0 이상의 수가 된다.

## 제곱근이란 무엇인가?

제곱근은 제곱의 역연산이다. 어떤 수 a를 제곱하여 b가 되었을 때, a를 b의 제곱근이라고 한다.

$$
a^2 = b \text{일 때, } a = \pm\sqrt{b}
$$

예를 들어:

- 9의 제곱근은 3과 -3이다. 왜냐하면
    
    $$
    3^2 = 9, \quad (-3)^2 = 9
    $$
    
- 25의 제곱근은 5와 -5이다. 왜냐하면
    
    $$
    5^2 = 25, \quad (-5)^2 = 25
    $$
    
- 16의 제곱근은 4와 -4이다. 왜냐하면
    
    $$
    4^2 = 16, \quad (-4)^2 = 16
    $$
    

제곱근 기호 √를 사용하여 나타낼 때는 다음과 같이 표현한다:

$$
\sqrt{9} = 3 \quad (\text{양의 제곱근})
$$

$$
-\sqrt{9} = -3 \quad (\text{음의 제곱근})
$$

**중요한 점:**

- $$\sqrt{}$$기호는 근호라고 읽는다
- $$\sqrt{}$$기호는 항상 양의 제곱근을 나타낸다
- 모든 양수는 두 개의 제곱근을 가진다 (하나는 양수, 하나는 음수)
- 0의 제곱근은 0 하나뿐이다
- 음수의 제곱근은 실수 범위에서 존재하지 않는다

## 제곱근의 성질

### **1. 곱셈 공식**

$$
\sqrt{a} \times \sqrt{b} = \sqrt{a \times b}
$$

예: 

$$
\sqrt{4} \times \sqrt{9} = \sqrt{36} = 6
$$

### **2. 나눗셈 공식**

$$
\frac{\sqrt{a}}{\sqrt{b}} = \sqrt{\frac{a}{b}} \quad (b \neq 0)
$$

예: 

$$
\frac{\sqrt{16}}{\sqrt{4}} = \sqrt{\frac{16}{4}} = \sqrt{4} = 2
$$

### **3. 제곱근의 제곱**

$$
(\sqrt{a})^2 = a \quad (a \geq 0)
$$

예: 

$$
(\sqrt{5})^2 = 5
$$

### **4. 제곱의 제곱근**

$$
\sqrt{a^2} = |a|
$$

예: 

$$
\sqrt{(-3)^2} = \sqrt{9} = 3 = |-3|
$$

### **5. 분배 법칙의 제한**

제곱근은 덧셈이나 뺄셈에 대해 분배되지 않는다:

$$
\sqrt{a + b} \neq \sqrt{a} + \sqrt{b}
$$

$$
\sqrt{a - b} \neq \sqrt{a} - \sqrt{b}
$$

### **6. 근호 안의 인수분해**

$$
\sqrt{a^2 \times b} = a\sqrt{b} \quad (a \geq 0)
$$

예: 

$$
\sqrt{18} = \sqrt{9 \times 2} = \sqrt{9} \times \sqrt{2} = 3\sqrt{2}
$$

## 제곱근의 대소 관계

a > 0, b > 0일 때, 제곱근의 대소 관계는 다음과 같다:

$$
a > b \text{이면 } \sqrt{a} > \sqrt{b}
$$

$$
a < b \text{이면 } \sqrt{a} < \sqrt{b}
$$

$$
a = b \text{이면 } \sqrt{a} = \sqrt{b}
$$

즉, 양수에서는 **수가 클수록 그 제곱근도 크다.**

예를 들어:

- 4 < 9이므로, $$\sqrt4$$ < $$\sqrt9$$, 즉 2 < 3이다
- 25 > 16이므로, $$\sqrt{25} > \sqrt{16}$$, 즉 5 > 4이다
- 100 > 81이므로, $$\sqrt{100}> \sqrt{81}$$, 즉 10 > 9이다

**제곱근의 대소 비교 방법:**

1. 두 제곱근의 크기를 비교할 때는 양변을 제곱하여 비교한다
    
    $$
    \sqrt{a} \text{와 } \sqrt{b}\text{를 비교할 때 } a \text{와 } b\text{를 비교한다}
    $$
    
2. 근호가 있는 수와 없는 수를 비교할 때는 근호가 없는 수를 제곱하거나, 근호가 있는 수를 제곱한다
    
    예: 3과 √10을 비교할 때
    
    $$
    3^2 = 9, \quad (\sqrt{10})^2 = 10
    $$
    
    $$
    9 < 10 \text{이므로 } 3 < \sqrt{10}
    $$
    
3. 계수가 있는 제곱근을 비교할 때는 근호 안을 통일한다
    
    예: $$2\sqrt3$$과 $$3\sqrt2$$를 비교할 때
    
    $$
    2\sqrt{3} = \sqrt{4 \times 3} = \sqrt{12}
    $$
    
    $$
    3\sqrt{2} = \sqrt{9 \times 2} = \sqrt{18}
    $$
    
    $$
    12 < 18 \text{이므로 } 2\sqrt{3} < 3\sqrt{2}
    $$
    

## 분모의 유리화

분모의 유리화란 분모에 있는 무리수(제곱근)를 없애고 유리수로 만드는 과정이다. 이는 계산을 더 쉽게 하고 표현을 간단하게 만들기 위해 사용된다.

### **1. 분모가 단일 제곱근인 경우**

분모와 분자에 같은 제곱근을 곱한다:

$$
\frac{a}{\sqrt{b}} = \frac{a}{\sqrt{b}} \times \frac{\sqrt{b}}{\sqrt{b}} = \frac{a\sqrt{b}}{b}
$$

예:

$$
\frac{1}{\sqrt{2}} = \frac{1}{\sqrt{2}} \times \frac{\sqrt{2}}{\sqrt{2}} = \frac{\sqrt{2}}{2}
$$

$$
\frac{3}{\sqrt{5}} = \frac{3}{\sqrt{5}} \times \frac{\sqrt{5}}{\sqrt{5}} = \frac{3\sqrt{5}}{5}
$$

### **2. 분모가 제곱근을 포함한 합 또는 차인 경우**

분모의 켤레식을 이용하여 유리화한다. 켤레식이란 부호만 반대로 바꾼 식을 말한다.

$$
(a + \sqrt{b})(a - \sqrt{b}) = a^2 - b
$$

분모가 

$$
a + \sqrt{b}
$$

일 때, 분모와 분자에 

$$
a - \sqrt{b}
$$

를 곱한다:

$$
\frac{c}{a + \sqrt{b}} = \frac{c}{a + \sqrt{b}} \times \frac{a - \sqrt{b}}{a - \sqrt{b}} = \frac{c(a - \sqrt{b})}{a^2 - b}
$$

예:

$$
\frac{1}{2 + \sqrt{3}} = \frac{1}{2 + \sqrt{3}} \times \frac{2 - \sqrt{3}}{2 - \sqrt{3}} = \frac{2 - \sqrt{3}}{4 - 3} = 2 - \sqrt{3}
$$

$$
\frac{6}{3 - \sqrt{5}} = \frac{6}{3 - \sqrt{5}} \times \frac{3 + \sqrt{5}}{3 + \sqrt{5}} = \frac{6(3 + \sqrt{5})}{9 - 5} = \frac{6(3 + \sqrt{5})}{4} = \frac{3(3 + \sqrt{5})}{2}
$$

### **3. 분모가 두 제곱근의 합 또는 차인 경우**

마찬가지로 켤레식을 이용한다:

$$
\frac{c}{\sqrt{a} + \sqrt{b}} = \frac{c}{\sqrt{a} + \sqrt{b}} \times \frac{\sqrt{a} - \sqrt{b}}{\sqrt{a} - \sqrt{b}} = \frac{c(\sqrt{a} - \sqrt{b})}{a - b}
$$

예:

$$
\frac{1}{\sqrt{5} + \sqrt{2}} = \frac{1}{\sqrt{5} + \sqrt{2}} \times \frac{\sqrt{5} - \sqrt{2}}{\sqrt{5} - \sqrt{2}} = \frac{\sqrt{5} - \sqrt{2}}{5 - 2} = \frac{\sqrt{5} - \sqrt{2}}{3}
$$

**분모의 유리화를 하는 이유:**

- 계산을 더 쉽게 만든다
- 수의 크기를 비교하기 쉽다
- 표준적인 수학 표기법으로 인정된다
- 근삿값을 구할 때 편리하다
