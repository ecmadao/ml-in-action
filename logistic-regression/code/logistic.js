import math from 'mathjs';
import {
  array,
  sigmoid,
  getWeights,
} from '../../utils/helper';
import loadData from '../../utils/data';

// 数据源：Coursera Machine Learning 课程 ex2
const data = loadData('logistic1.txt');
const LEARNING_RATE = 0.001;
let WEIGHTS = null;

// 预测函数，使用了 sigmoid 函数
const hypothesis = inputs =>
  math.map(math.multiply(inputs, WEIGHTS), val => sigmoid(val));

// 预测值与实际值的偏差：h(x) - y
const difference = (inputs, outputs) =>
  math.subtract(hypothesis(inputs), outputs);

// 代价函数
const costFunc = (inputs, outputs) => {
  const h = hypothesis(inputs);
  const y = math.matrix(outputs);
  const yt = math.transpose(y);

  const a = math.multiply(yt, math.log(h));
  const b = math.multiply(
    math.add(math.multiply(yt, -1), 1),
    math.log(math.add(math.multiply(h, -1), 1))
  );

  const totalCost = (-1 / outputs.length) * math.add(a, b).get([0, 0]);
  return totalCost;
};

const gradientDescent = (inputs, outputs) => {
  const diff = difference(inputs, outputs);
  const offset = math.multiply(
    LEARNING_RATE / outputs.length,
    math.transpose(inputs),
    diff
  );
  console.log(' ========== offset ========== ');
  console.log(offset.valueOf());

  if (isNaN(offset.get([0, 0]))) {
    return false;
  }
  WEIGHTS = math.subtract(WEIGHTS, offset);
  console.log(' ============= WEIGHTS ============= ');
  console.log(WEIGHTS.valueOf());
  return WEIGHTS.valueOf();
};

const train = (options) => {
  const {
    inputs = [[]],
    outputs = [],
    weights = null
  } = options;

  WEIGHTS = weights ? math.matrix(weights) : null;

  // 在每一组输入训练样本前补 1
  const filling = array(inputs.length, [1]);
  const inputVals = math.concat(filling, inputs);
  const outputVals = math.transpose([outputs]);

  /*
   * 生成 θ 参数
   * [θ0, θ1, θ2, θ3]
   */
  if (!WEIGHTS) {
    WEIGHTS = getWeights({
      inputCount: inputVals[0].length
    });
    console.log(' ========== initial weights ========== ');
    console.log(WEIGHTS.valueOf());
  }

  for (let i = 0; i < 100; i += 1) {
    console.log(' ========== cost ========== ');
    const cost = costFunc(inputVals, outputVals);
    if (isNaN(cost)) break;
    console.log(cost);
    console.log('gradientDescent...........');
    const result = gradientDescent(inputVals, outputVals);
    if (!result) break;
  }
};

train({
  ...data,
  weights: [
    [-24], [0.2], [0.2]
  ]
});
