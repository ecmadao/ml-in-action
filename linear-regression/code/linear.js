import math from 'mathjs';
import {
  array,
  getWeights,
} from '../../utils/helper';

const LEARNING_RATE = 0.03;
let WEIGHTS = null;

// 预测值与实际值的偏差
const difference = (inputs, outputs) =>
  math.subtract(hypothesis(inputs), outputs);

const costFunc = (inputs, outputs) =>
  math.add(
    ...difference(inputs, outputs).valueOf().map(i => math.pow(i[0], 2))
  ) / (2 * outputs.length);

// 预测函数
const hypothesis = (inputs) => math.multiply(inputs, WEIGHTS);

const gradientDescent = (inputs, outputs) => {
  // 根据预测值求偏差
  const diff = difference(inputs, outputs);

  const offset = math.multiply(
    LEARNING_RATE / outputs.length,
    math.transpose(inputs),
    diff
  );
  WEIGHTS = math.subtract(WEIGHTS, offset);
  console.log(' ============= WEIGHTS ============= ');
  console.log(WEIGHTS.valueOf());
};

/*
 * inputs 为多层嵌套数组，如
 * [
 *    [1, 2, 3, 4],
 *    [2, 3, 4, 2]
 * ]
 * 其中，每个数组代表一个训练集
 * 而 outputs 形如 [1, 2]
 * 其 index 与 inputs 对应的元素则代表输出：
 * [1, 2, 3, 4] ==> 输出 1
 * [2, 3, 4, 2] ==> 输出 2
 */
const train = (options = {}) => {
  const {
    outputs = [],
    inputs = [[]],
  } = options;

  // 在每一组输入训练样本前补 1
  const filling = array(inputs.length).map(i => [1]);
  const inputVals = math.concat(filling, inputs);
  const outputVals = math.transpose([outputs]);

  /*
   * 生成 θ 参数
   * [θ0, θ1, θ2, θ3]
   */
  if (!WEIGHTS) {
    WEIGHTS = getWeights({
      min: 0,
      max: 0,
      inputCount: inputVals[0].length
    });
    console.log(' ========== initial weights ========== ')
    console.log(WEIGHTS.valueOf());
  }

  for (let i = 0; i < 10000; i += 1) {
    console.log('gradientDescent...........');
    gradientDescent(inputVals, outputVals);
    console.log(' ========== cost ========== ');
    const cost = costFunc(inputVals, outputVals)
    console.log(cost);
  }
};

train({
  inputs: [
    [6.1101],
    [5.5277],
    [8.5186],
    [7.0032],
    [5.8598],
    [8.3829],
    [7.4764],
    [8.5781]
  ],
  outputs: [
    17.592,
    9.1302,
    13.662,
    11.854,
    6.8233,
    11.886,
    4.3483,
    12
  ]
});
