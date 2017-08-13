import math from 'mathjs';
import randomWeights from './random';

// 构造指定长度的数组
export const array = (length, val = 0) => new Array(length).fill(val);

// 以逻辑回归中常用的 sigmoid 函数作为神经元的激活函数
export const sigmoid = (z) => 1 / (1 + Math.exp(-z));

/*
* 随机计算某层各神经元针对上一层输入的权重，如
* [
*   [w1, w2], // hidden unit1 weight
*   [w3, w4], // hidden unit2 weight
* ]
* 并将该数组转换为矩阵
*
* inputCount: 该层接收的输入数目
* unitCount: 该层的神经元数目
*
* 当 unitCount 为 1 时，即可看做生成线性回归、逻辑回归算法使用的参数
* [[θ1, θ2, θ3....]]
*/
export const getWeights = (options) => {
  const {
    min,
    max,
    inputCount,
    unitCount = 1,
  } = options;
  const weights = array(inputCount)
    .map((i) => randomWeights(unitCount, min, max));
  return math.matrix(weights);
};
