// 构造指定长度的数组
export const array = (length) => new Array(length).fill(0);

// 以逻辑回归中常用的 sigmoid 函数作为神经元的激活函数
export const sigmoid = (z) => 1 / (1 + Math.exp(-z));