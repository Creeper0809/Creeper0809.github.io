---
title: "C - 2x2 Placing"
permalink: /study/algorithms/competitive-programming/atcoder-beginner-contest-436/c-2x2-placing/
math: true
toc: true
---

[상위 페이지 · AtCoder Beginner Contest 436](/study/algorithms/competitive-programming/atcoder-beginner-contest-436/)

![image.png](/assets/images/study/algorithms/image-174-8ea13b12.png)

![image.png](/assets/images/study/algorithms/image-175-b64c6c6b.png)

## 문제 태그

- 자료구조
- 구현

## 아이디어

1. 격자의 크가 $$10^9$$로 매우 큼
2. 격자를 직접 만들어서 구현하면 메모리가 초과 됨
3. set을 이용하여 좌표만을 관리한다

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
    
    ll N;
    int M;
    cin >> N >> M;

    set<pii> pos;
    int ans = 0;

    for (int i = 0; i < M; ++i) {
        int r, c;
        cin >> r >> c;
        vector<pii> q = {
            {r, c},
            {r + 1, c},
            {r, c + 1},
            {r + 1, c + 1}
        };

        bool is_possible = true;

        for (const auto& cell : q) {
            if (pos.count(cell)) {
                is_possible = false;
                break;
            }
        }

        if (is_possible) {
            ans++;
            for (const auto& cell : q) {
                pos.insert(cell);
            }
        }
    }

    cout << ans << "\n";

    return 0;
}
```
