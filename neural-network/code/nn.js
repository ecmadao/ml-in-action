import math from 'mathjs';
import {
  array,
  sigmoid,
  getWeights,
} from '../../utils/helper';

const LEARNING_RATE = 0.5; // 梯度下降时的学习速率
const WEIGHTS = {}; // 储存各层神经元的权重
const OUTPUTS = {}; // 储存各层神经元的输出

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
  let net = inputs;
  let output = null;
  Object.keys(WEIGHTS).forEach((key) => {
    const weights = WEIGHTS[key];
    net = math.multiply(net, weights);
    output = math.map(net, val => sigmoid(val));
    OUTPUTS[key] = output;
  });
  console.log(' ============= forward result ============= ');
  console.log(output.valueOf());
  return output.valueOf();
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
  const dataGroupCount = targets.length;

  const delta = deltaK(lastOutputs, targetVals);

  for (let i = weightKeys.length - 1; i >= 0; i -= 1) {
    const key = weightKeys[i];
    let values = null;
    const outputsPre = OUTPUTS[Number(key) - 1];
    const weights = WEIGHTS[key];

    if (i === weightKeys.length - 1) {
      values = delta;
    } else {
      const outputs = OUTPUTS[key];
      const derivative = derivativeOfSigmoid(outputs);

      const multiply = math.multiply(lastWeights, math.transpose(delta));
      const matrixToSum = math.matrix([
        new Array(multiply.size()[0]).fill(1)
      ]);
      const sumErrorOfOutputLayer = math.multiply(
        matrixToSum,
        multiply
      );

      values = derivative.valueOf().map(
        (row, index) => math.multiply(sumErrorOfOutputLayer.get([0, index]), row)
      );
    }

    const offsets = math.divide(
      math.multiply(
        math.transpose(outputsPre),
        values
      ),
      dataGroupCount
    );
    WEIGHTS[key] = math.subtract(
      weights,
      math.multiply(offsets, LEARNING_RATE)
    );
  }
};

const train = (options = {}) => {
  const {
    // 输入为 [dataGroup1, dataGroup2...]
    inputs = [
      // data group
      [] // [feature1, feature2...]
    ],
    outputs = [
      []
    ],
    // hiddenLayers 数组的长度代表隐藏层的层数，而具体的数字则代表该层的神经元数目
    hiddenLayers = [2],
  } = options;

  const matrixInputs = math.matrix(inputs);
  OUTPUTS['0'] = matrixInputs; // inputs 本质上是第一层的输出

  // 初始化全部神经元的权重
  array(hiddenLayers.length + 1).forEach((v, i) => {
    // i + 1 代表第几层隐藏神经元
    if (!WEIGHTS[i + 1]) {
      // 计算上一层向当前第 i 层输入的个数。
      // 当 i = 0 时，输入个数即为训练集的 inputs 个数；否则为上一层隐藏神经元的个数
      const inputCount = i === 0
        ? inputs[0].length
        : hiddenLayers[i - 1];

      // 计算第 i 层神经元的个数。在最后一层隐藏层的时候，输出个数为最终 output 的数目
      const unitCount = i === hiddenLayers.length
        ? outputs[0].length
        : hiddenLayers[i];
      const weights = getWeights({
        inputCount,
        unitCount
      });

      // 看一下这一层的权重长什么样
      console.log(` ===== [weights of hidden layer ${i + 1}] ===== `);
      console.log(weights.valueOf());
      WEIGHTS[i + 1] = weights;
    }
  });

  forward(matrixInputs);

  console.log('Working on backpropagation....');
  backpropagation(outputs);

  // 瞅一瞅反向传播优化的结果
  forward(matrixInputs);
};

/*
 * 在计算 10000 次以后，将会输出很接近我们的期望值的结果
 * (PS: 每次运行输出的结果都不一样，因为我们一开始是随机生成的权重)
 */
for (let i = 0; i < 10000; i += 1) {
  train({
    inputs: [
      // [feature1, feature2]
      [0.05, 0.1], // dataGroup1
      [0.03, 0.08], // dataGroup2
      [0.06, 0.11] // dataGroup3
    ],
    outputs: [
      [0.01, 0.99], // output1
      [0.01, 0.98], // output2
      [0.011, 0.998] // output3
    ],
    hiddenLayers: [4, 4],
  });
}
