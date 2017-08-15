import math from 'mathjs';
import loadData from '../../utils/data';

// 数据来源：
// http://burakkanber.com/blog/machine-learning-in-js-k-nearest-neighbor-part-1/
const data = loadData('knn.txt', {
  outputHandler: val => val
});

// vector = [1, 2, 3, 4, 5]
const vectorLength = vector => math.sqrt(math.add(...math.dotPow(vector, 2)));

const similarity = ranges => (input, target) => {
  const rawDiff = math.subtract(input, target);
  const diff = math.dotDivide(rawDiff, ranges);
  return vectorLength(diff);
};

const train = (options = {}) => {
  const {
    k = 5,
    input = [],
    inputs = [
      [] // 代表一个点
    ],
    outputs = [],
  } = options;

  const transpose = math.transpose(inputs);
  // 获得各种值的取值范围
  const ranges = transpose.map(values => Math.max(...values));
  const distance = similarity(ranges);

  const distances = inputs
    .map((target, index) => ({
      output: outputs[index],
      dis: distance(input, target)
    }))
    .sort((current, next) => current.dis - next.dis)
    .slice(0, k + 1);

  // 临近 K 个点的分布
  const resultCount = {};
  distances.forEach((item) => {
    const { output } = item;
    if (!resultCount[output]) {
      resultCount[output] = 1;
    } else {
      resultCount[output] += 1;
    }
  });
  console.log(resultCount);

  // 最终分类结果
  const result = Object.keys(resultCount)
    .map(key => ({
      output: key,
      count: resultCount[key]
    }))
    .sort((current, next) => next.count - current.count)[0];
  console.log(result.output);
};

train({
  ...data,
  k: 7,
  input: [5, 600]
});
