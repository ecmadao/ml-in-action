import math from 'mathjs';

const LEARNING_RATE = 0.5; // 梯度下降时的学习速率
const WEIGHTS = {}; // 储存各层神经元的权重
const OUTPUTS = {}; // 储存各层神经元的输出

// 构造指定长度的数组
const array = (length) => new Array(length).fill(0);

// 随机生成一个大于 0 且小于 1 的权重
const random = () => {
  let val = 0;
  while(!val) {
    val = Math.random();
  }
  return Number(val.toFixed(2));
};
// 生成一组随机权重
const randomWeights = (count) =>
  array(count).map(() => random());

// 以逻辑回归中常用的 sigmoid 函数作为神经元的激活函数
const sigmoid = (z) => 1 / (1 + Math.exp(-z));

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
*/
const getWeights = (inputCount, unitCount) => {
  const weights = array(inputCount)
    .map((i) => randomWeights(unitCount));
  return math.matrix(weights);
};

// o * (1 - o)
const derivativeOfSigmoid = (outputs) => {
  const subtract = math.add(outputs, -1);
  return math.map(outputs, (val, i) => -1 * val * subtract.get(i));
};

// δk = (ok - tk) * ok * (1 - ok)
const deltaK = (outputs, targets) => {
  const val = math.subtract(outputs, targets);
  const derivative = derivativeOfSigmoid(outputs);

  return math.map(val, (v, i) => v * derivative.get(i));
};

/*
 * 正向传播，计算最终输出的预测值
 * 用激活函数、上一层的输入、权重来计算该层的输出，
 * 并储存在 OUTPUS 中以便在反向传播时使用
 */
const forward = (inputs) => {
  let net = math.matrix(inputs);
  let output = null;
  Object.keys(WEIGHTS).forEach((key) => {
    const weights = WEIGHTS[key];
    net = math.multiply(net, weights);
    output = math.map(net, val => sigmoid(val));
    OUTPUTS[key] = output;
  });
  console.log(output.valueOf());
};

/*
 * 反向传播
 * 需要区分 “最后一个隐藏层 -> 输出层” 和 其他层
 * 算出各层权重的误差以后，利用 LEARNING_RATE 来更新权重
 * LEARNING_RATE 的大小决定了我们的学习速率，但过大则可能会导致梯度下降失败
 */
const backpropagation = (targets) => {
  const targetVals = math.matrix(targets);
  const weightKeys = Object.keys(WEIGHTS);
  const lastWeights = WEIGHTS[weightKeys.slice(-1)[0]];
  const lastOutputs = OUTPUTS[weightKeys.slice(-1)[0]];

  const delta = deltaK(lastOutputs, targetVals);

  weightKeys.reverse().forEach((key, i) => {
    const outputs = OUTPUTS[key];
    const weights = WEIGHTS[key];
    const outputsPre = OUTPUTS[Number(key) - 1];
    let values = null;

    if (i === 0) {
      values = delta;
    } else {
      const derivative = derivativeOfSigmoid(outputs);
      const sumErrorOfOutputLayer = math.add(
        ...lastWeights.valueOf().map(weight => math.multiply(weight, delta))
      );
      values = math.multiply(sumErrorOfOutputLayer, derivative);
    }

    const offsets = math.multiply(
      math.transpose(math.matrix([outputsPre.valueOf()])),
      math.matrix([values.valueOf()])
    );
    WEIGHTS[key] = math.subtract(
      weights,
      math.multiply(offsets, LEARNING_RATE)
    );
  });
};

const train = (options = {}) => {
  const {
    // 输入为 [i1, i2, i3...]
    inputs = [],
    outputs = [],
    // hiddenLayers 数组的长度代表隐藏层的层数，而具体的数组则改变该层的神经元数目
    hiddenLayers = [2],
  } = options;

  OUTPUTS['0'] = math.matrix(inputs); // inputs 本质上是第一层的输出

  // 初始化全部神经元的权重
  array(hiddenLayers.length + 1).forEach((v, i) => {
    // i + 1 代表第几层隐藏神经元
    if (!WEIGHTS[i + 1]) {
      // 计算上一层向当前第 i 层输入的个数。
      // 当 i = 0 时，输入个数即为训练集的 inputs 个数；否则为上一层隐藏神经元的个数
      const inputCount = i === 0
        ? inputs.length
        : hiddenLayers[i - 1];

      // 计算第 i 层神经元的个数。在最后一层隐藏层的时候，输出个数为最终 output 的数目
      const unitCount = i === hiddenLayers.length
        ? outputs.length
        : hiddenLayers[i];
      const weights = getWeights(inputCount, unitCount);

      // 看一下这一层的权重长什么样
      console.log(` ===== [weights of hidden layer ${i + 1}] ===== `);
      console.log(weights.valueOf());
      WEIGHTS[i + 1] = weights;
    }
  });

  console.log(' ============= forward ============= ');
  forward(inputs);

  console.log('Working on backpropagation....');
  backpropagation(outputs);

  console.log(' ============= forward ============= ');
  forward(inputs);
};

/*
 * 在计算 10000 次以后，将会输出 [ 0.010764211878949714, 0.9902824176718917 ]
 * 这已经很接近我们的期望值了！
 */
for (let i = 0; i < 10000; i += 1) {
  train({
    inputs: [0.05, 0.1],
    outputs: [0.01, 0.99],
    hiddenLayers: [3, 3],
  });
}
