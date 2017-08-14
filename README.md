## ml-in-action

> 用 JavaScript 撸一撸机器学习，不依赖于已封装好的 ml modules

### 目录

#### 监督学习

1. [神经网络](./neural-network)

2. [线性回归](./linear-regression)

3. [逻辑回归](./logistic-regression)

4. K 临近分类

#### 无监督学习

1. K 均值分类

2. SVM

#### 应用

1. 文本数据分析

2. 泰坦尼克号幸存者

### 依赖的包

#### [mathjs](http://mathjs.org/)

> 方便进行矩阵运算

```javascript
const array = [1, 2, 3, 4];

// 转为矩阵
const matrix = math.matrix([array]);
/*
 * [
 *   [1, 2, 3, 4]
 * ]
 */

matrix.size(); // => [1, 4]
matrix.valueOf(); // => [[1, 2, 3, 4]]

// 矩阵每一位上的元素都乘以、减去指定数字
math.add(matrix, -1); // 每一位 -1
// [[0, 1, 2, 3]]
math.multiply(-1, matrix); // 每一位 * -1
// [[-1, -2, -3, -4]]

// 转置矩阵
const matrixT = math.transpose(matrix);
matrixT.size(); // => [4, 1]
matrixT.valueOf(); // => [[1], [2], [3], [4]]

/* ================================================ */

const a = [[9, 5], [6, 1]];
const b = [[3, 2], [5, 2]];

// 矩阵相对应位上的元素相加
math.add(a, b); // => [[12, 7], [11, 3]]

// 矩阵相减
math.subtract(a, b); // => [[6, 3], [1, -1]]

// 矩阵相对应位上的元素相乘
math.dotMultiply(a, b); // => [[27, 10], [30, 2]]

// 矩阵相乘
math.multiply(a, b); // => [[52, 28], [23, 14]]
```
