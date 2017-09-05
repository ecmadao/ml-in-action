import math from 'mathjs';
import loadData from '../../utils/data';

// 数据来源：
// http://burakkanber.com/blog/machine-learning-in-js-k-nearest-neighbor-part-1/
const data = loadData('knn.txt', {
  outputHandler: val => val
});

// vector = [1, 2, 3, 4, 5]
const vectorLength = vector => math.sqrt(math.add(...math.dotPow(vector, 2)));

/*
 * 两向量上各个对应位置上的数值相减，
 * 然后除以对应位置上元素的取值范围（归一化）
 * 最后求它到原点距离，即可看做是这两个向量的距离
 *
 * normalized = (每个位置上的值 - 该位置上的最小值) / (该位置上的最大值 - 该位置上的最小值)
*/
const similarity = ranges => (input, target) => {
  const {
    min,
    max,
  } = ranges;
  const rawDiff = math.subtract(input, target);
  const normalized = math.dotDivide(math.subtract(rawDiff, min), math.subtract(max, min));
  return vectorLength(normalized);
};

const getRanges = (inputs) => {
  const transpose = math.transpose(inputs);
  // 获得各种值的取值范围
  const min = [];
  const max = [];
  transpose.forEach((values) => {
    min.push(
      Math.min(...values)
    );
    max.push(
      Math.max(...values)
    );
  });
  return {
    min,
    max,
  };
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

  const ranges = getRanges(inputs);
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
