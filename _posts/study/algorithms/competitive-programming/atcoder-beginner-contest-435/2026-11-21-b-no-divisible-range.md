---
title: "B - No-Divisible Range"
permalink: /study/algorithms/competitive-programming/atcoder-beginner-contest-435/b-no-divisible-range/
math: true
toc: true
categories: ["알고리즘"]
tags: ["알고리즘 대회", "AtCoder", "AtCoder Beginner Contest 435", "문제 풀이", "수학", "구현"]
---

[상위 페이지 · AtCoder Beginner Contest 435](/study/algorithms/competitive-programming/atcoder-beginner-contest-435/)

![image.png](/assets/images/study/algorithms/image-160-6999db0e.png)

![image.png](/assets/images/study/algorithms/image-161-e14cef91.png)

## 문제 태그

- 수학
- 구현

## 아이디어

- N이 50으로 매우 작아 브루트포스를 시행한다
- 브루트포스는 위에서 요구하는 조건 그대로 l~r합산에 대해 $$A_i$$가 약수가 아닌지 확인한다

## 정답

```cpp
#include <bits/stdc++.h>

using namespace std;

using ll = long long;
using pii = pair<int, int>;
using vi = vector<int>;
using vll = vector<ll>;
using vpii = vector<pii>;

#define all(x) (x).begin(), (x).end()
#define rall(x) (x).rbegin(), (x).rend()
#define F first
#define S second
#define pb push_back
#define mp make_pair
#define lb lower_bound
#define ub upper_bound

#ifndef ONLINE_JUDGE
template<typename A, typename B>
ostream& operator<<(ostream& os, const pair<A, B>& p) {
    return os << "{" << p.first << ", " << p.second << "}";
}
template<typename T>
ostream& operator<<(ostream& os, const vector<T>& v) {
    os << "[";
    for (size_t i = 0; i < v.size(); ++i) {
        os << v[i];
        if (i != v.size() - 1) os << ", ";
    }
    return os << "]";
}

#define debug(...) cerr << "[DEBUG] " << #__VA_ARGS__ << ": ", DBG(__VA_ARGS__)
template<typename T> void DBG(const T& v) { cerr << v << endl; }
template<typename T, typename... Args> void DBG(const T& v, const Args&... args) { cerr << v << ", "; DBG(args...); }
#else
#define debug(...)
#endif

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    
    int N;
    cin >> N;

    vll A(N);
    for(int i = 0; i < N; ++i) {
        cin >> A[i];
    }

    int ans = 0;

    for(int l = 0; l < N; ++l) {
        ll current_sum = 0;
        for(int r = l; r < N; ++r) {
            current_sum += A[r];

            bool ok = true;
            for(int k = l; k <= r; ++k) {
                if(current_sum % A[k] == 0) {
                    ok = false;
                    break; 
                }
            }

            if(ok) {
                ans++;
            }
        }
    }

    cout << ans << '\n';
    
    return 0;
}
```
