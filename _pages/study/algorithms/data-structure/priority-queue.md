---
title: "Priority Queue"
permalink: /study/algorithms/data-structure/priority-queue/
toc: true
---

[상위 페이지 · Data Structure](/study/algorithms/data-structure/)

우선순위 큐는 일반적인 큐와 달리 데이터의 삽입 순서와 상관없이 우선순위가 높은 데이터가 먼저 나오는 자료구조이다. 각 요소는 우선순위 값을 가지며, 이 값에 따라 큐에서 빠져나오는 순서가 결정된다.

## 우선순위 큐의 특징

- 가장 높은(또는 가장 낮은) 우선순위를 가진 요소가 항상 먼저 처리된다.
- 힙(Heap) 자료구조를 사용하여 효율적으로 구현할 수 있다.
- 시간 복잡도: 삽입 및 삭제 연산 모두 O(log n)이다.
- Dijkstra 알고리즘, Prim 알고리즘, 허프만 코딩 등 다양한 알고리즘에 활용된다.
- 힙큐라고도 한다.

## 우선순위 큐의 구현 방법

우선순위 큐는 다양한 방법으로 구현할 수 있지만, 가장 효율적인 방법은 이진 힙(Binary Heap)을 사용하는 것이다. 여기서는 C언어를 사용하여 최대 힙(Max Heap) 기반의 우선순위 큐를 구현해보겠다.

## C언어로 구현한 우선순위 큐

### 1. 필요한 헤더 및 구조체 정의

```c
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

// 우선순위 큐의 최대 크기 정의
#define MAX_SIZE 100

// 우선순위 큐 구조체 정의
typedef struct {
    int heap[MAX_SIZE];
    int size;
} PriorityQueue;
```

### 2. 초기화 함수 (initialize)

```c
// 우선순위 큐 초기화
void initialize(PriorityQueue* pq) {
    pq->size = 0;
}
```

우선순위 큐를 사용하기 전에 초기화하는 함수이다. 큐의 크기를 0으로 설정한다.

### 3. 힙 조정 함수 (swap, heapify)

```c
// 두 노드 값을 교환하는 함수
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// 최대 힙 속성을 유지하기 위해 힙을 재구성하는 함수
void heapifyUp(PriorityQueue* pq, int index) {
    int parent = (index - 1) / 2;
    
    if (index > 0 && pq->heap[parent] < pq->heap[index]) {
        swap(&pq->heap[parent], &pq->heap[index]);
        heapifyUp(pq, parent);
    }
}

void heapifyDown(PriorityQueue* pq, int index) {
    int largest = index;
    int left = 2 * index + 1;
    int right = 2 * index + 2;
    
    if (left < pq->size && pq->heap[left] > pq->heap[largest]) {
        largest = left;
    }
    
    if (right < pq->size && pq->heap[right] > pq->heap[largest]) {
        largest = right;
    }
    
    if (largest != index) {
        swap(&pq->heap[index], &pq->heap[largest]);
        heapifyDown(pq, largest);
    }
}
```

heapifyUp은 요소가 삽입된 후 그 요소가 부모 노드보다 우선순위가 높을 경우 위로 이동시키는 함수이다.

heapifyDown은 루트 노드가 제거된 후 마지막 요소가 루트로 이동했을 때, 이를 적절한 위치로 내려보내는 함수이다.

### 4. 삽입 함수 (enqueue)

```c
// 우선순위 큐에 요소 삽입
int enqueue(PriorityQueue* pq, int value) {
    if (pq->size >= MAX_SIZE) {
        printf("Error: 우선순위 큐가 가득 찼습니다.\n");
        return -1;
    }
    
    // 힙의 마지막에 새 요소 추가
    pq->heap[pq->size] = value;
    // 힙 속성 유지를 위해 위로 재구성
    heapifyUp(pq, pq->size);
    pq->size++;
    
    return 0;
}
```

우선순위 큐에 새로운 요소를 삽입하는 함수이다. 요소는 힙의 마지막에 추가되고, 힙의 속성을 유지하기 위해 필요한 경우 위로 이동한다.

### 5. 삭제 함수 (dequeue)

```c
// 우선순위 큐에서 최대 우선순위 요소 제거 및 반환
int dequeue(PriorityQueue* pq) {
    if (pq->size <= 0) {
        printf("Error: 우선순위 큐가 비어있습니다.\n");
        return INT_MIN;
    }
    
    // 최대 우선순위 요소 저장
    int maxItem = pq->heap[0];
    
    // 마지막 요소를 루트로 이동
    pq->heap[0] = pq->heap[pq->size - 1];
    pq->size--;
    
    // 힙 속성 유지를 위해 아래로 재구성
    heapifyDown(pq, 0);
    
    return maxItem;
}
```

우선순위 큐에서 가장 높은 우선순위를 가진 요소(루트 노드)를 제거하고 반환하는 함수이다. 마지막 요소가 루트로 이동한 후 힙 속성을 유지하기 위해 아래로 이동한다.

### 6. 피크 함수 (peek)

```c
// 우선순위 큐의 최대 우선순위 요소 확인 (제거하지 않음)
int peek(PriorityQueue* pq) {
    if (pq->size <= 0) {
        printf("Error: 우선순위 큐가 비어있습니다.\n");
        return INT_MIN;
    }
    
    return pq->heap[0];
}
```

우선순위 큐의 최상위 요소(가장 높은 우선순위를 가진 요소)를 제거하지 않고 확인하는 함수이다.

### 7. 크기 및 비어있는지 확인 함수

```c
// 우선순위 큐의 크기 반환
int getSize(PriorityQueue* pq) {
    return pq->size;
}

// 우선순위 큐가 비어있는지 확인
int isEmpty(PriorityQueue* pq) {
    return pq->size == 0;
}
```

getSize는 우선순위 큐의 현재 크기를 반환하는 함수이다.

isEmpty는 우선순위 큐가 비어있는지 확인하는 함수이다.

### 8. 전체 요소 출력 함수

```c
// 우선순위 큐의 모든 요소 출력
void printQueue(PriorityQueue* pq) {
    printf("우선순위 큐 내용: ");
    for (int i = 0; i < pq->size; i++) {
        printf("%d ", pq->heap[i]);
    }
    printf("\n");
}
```

우선순위 큐의 모든 요소를 출력하는 함수이다. 이는 디버깅 목적으로 유용하게 사용된다.

## 우선순위 큐 사용 예제

```c
int main() {
    PriorityQueue pq;
    initialize(&pq);
    
    enqueue(&pq, 10);
    enqueue(&pq, 30);
    enqueue(&pq, 20);
    enqueue(&pq, 5);
    enqueue(&pq, 1);
    
    printf("큐 크기: %d\n", getSize(&pq));
    printQueue(&pq);
    
    printf("최대 우선순위 요소: %d\n", peek(&pq));
    
    printf("제거된 요소: %d\n", dequeue(&pq));
    printf("제거된 요소: %d\n", dequeue(&pq));
    
    printf("큐 크기: %d\n", getSize(&pq));
    printQueue(&pq);
    
    return 0;
}
```

## 우선순위 큐의 복잡도 분석

### 시간 복잡도

| **연산** | **시간 복잡도** | **설명** |
| --- | --- | --- |
| 삽입 연산(Enqueue) | O(log n) | 힙에서 요소를 추가하고 힙을 조정하는 시간 |
| 삭제 연산(Dequeue) | O(log n) | 최대(또는 최소) 우선순위 요소를 제거하고 힙을 재구성하는 시간 |
| 피크 연산(Peek) | O(1) | 최상위 요소에 직접 접근 |
| isEmpty, getSize 연산 | O(1) | 변수에 직접 접근 |

### 공간 복잡도

| **복잡도** | **설명** |
| --- | --- |
| O(n) | n개의 요소를 저장하기 위한 배열 공간 |
