import math from 'mathjs';
import randomWeights from '../../utils/random';
import {
  array,
  sigmoid
} from '../../utils/helper';

const LEARNING_RATE = 0.5; // 梯度下降时的学习速率
const WEIGHTS = {}; // 储存各层神经元的权重
const OUTPUTS = {}; // 储存各层神经元的输出

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
  // outputs 上的每一位元素都 -1
  const subtract = math.add(outputs, -1);
  // 将两个矩阵 outputs 和 subtract 位置对于的元素相乘
  return math.dotMultiply(math.multiply(-1, outputs), subtract);
};

// δk = (ok - tk) * ok * (1 - ok)
const deltaK = (outputs, targets) => {
  // 矩阵相减
  const val = math.subtract(outputs, targets);

  const derivative = derivativeOfSigmoid(outputs);
  return math.dotMultiply(val, derivative);
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
  console.log(' ============= forward result ============= ');
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
    // hiddenLayers 数组的长度代表隐藏层的层数，而具体的数字则代表该层的神经元数目
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

  forward(inputs);

  console.log('Working on backpropagation....');
  backpropagation(outputs);

  // 瞅一瞅反向传播优化的结果
  forward(inputs);
};

/*
 * 在计算 10000 次以后，将会输出 [ 0.010764211878949714, 0.9902824176718917 ]
 * 这已经很接近我们的期望值了！
 * (PS: 每次运行输出的结果都不一样，因为我们一开始是随机生成的权重)
 */
for (let i = 0; i < 10000; i += 1) {
  train({
    inputs: [0.05, 0.1],
    outputs: [0.01, 0.99],
    hiddenLayers: [4, 4],
  });
}
