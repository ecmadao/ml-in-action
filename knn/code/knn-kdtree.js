import math from 'mathjs';
import loadData from '../../utils/data';
import Heap from './heap';
import Node from './node';

// 数据来源：
// http://burakkanber.com/blog/machine-learning-in-js-k-nearest-neighbor-part-1/
const data = loadData('knn.txt', {
  outputHandler: val => val
});

// 计算方差
const getVariance = (array) => {
  const avg = array.reduce((pre, next) => pre + next, 0) / array.length;
  return array.reduce((pre, next) => Math.pow(next - avg, 2) + pre, 0) / array.length;
};

// 获取中位数所在的索引
// TODO: 使用算法来优化这一过程
const getCentralIndex = (dataset, dimensional) => {
  if (dataset.length <= 1) return 0;
  dataset.sort((pre, current) => pre[dimensional] - current[dimensional]);
  return Math.floor(dataset.length / 2);
};

// 通过最大方差来获取分隔的维度
// TODO: 使用算法来优化这一过程
const getDimensional = (dataset) => {
  const point = dataset[0];
  let dimensional = null;
  let maxVariance = null;

  // i means current dimensional
  for (let i = 0; i < point.length; i += 1) {
    const datas = dataset.map(p => p[i]);
    const variance = getVariance(datas);
    if (!maxVariance || variance > maxVariance) {
      maxVariance = variance;
      dimensional = i;
    }
  }
  return dimensional;
};

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

// 构造 kd-tree
const build = (options) => {
  const {
    dataset,
    outputs,
    parentNode = null
  } = options;
  if (!dataset.length) return null;
  const dimensional = getDimensional(dataset);
  const centralIndex = getCentralIndex(dataset, dimensional);
  const left = dataset.slice(0, centralIndex);
  const right = dataset.slice(centralIndex + 1);
  const leftOutputs = outputs.slice(0, centralIndex);
  const rightOutputs = outputs.slice(centralIndex + 1);

  const node = new Node({
    point: dataset[centralIndex],
    name: outputs[centralIndex],
    dimensional,
    parentNode
  });

  const leftNode = build({
    dataset: left,
    parentNode: node,
    outputs: leftOutputs
  });
  const rightNode = build({
    dataset: right,
    parentNode: node,
    outputs: rightOutputs
  });

  node.leftNode = leftNode;
  node.rightNode = rightNode;
  return node;
};

const train = (options) => {
  const {
    k = 5,
    input = [],
    inputs = [
      [] // 代表一个点
    ],
    outputs = [],
  } = options;

  console.log(`k: ${k}`);

  const ranges = getRanges(inputs);
  const distance = similarity(ranges);

  const kdTree = build({
    outputs,
    dataset: inputs,
  });
  const nearbyPoints = new Heap();
  const bottomPoint = kdTree.bottom(input);

  const backpropagation = (node) => {
    if (node.visited) return;
    node.visited = true;
    const dis = distance(input, node.point);
    // 如果还没填充满，则继续填充
    if (nearbyPoints.count < k) {
      nearbyPoints.enqueue({
        value: dis,
        point: node.point,
        name: node.name,
      });
    } else if (nearbyPoints.max > distance) {
      // 如果当前节点和目标点的距离小于已存距离的最大值，则将最大值出堆
      // 然后把新的点填充进去
      nearbyPoints.heaps[0] = {
        value: distance,
        point: node.point,
        name: node.name,
      };
      nearbyPoints.sortWithChild(1);
    }

    // 如果目标点到当前节点分割线的距离小于最大值，
    // 则当前节点的另一个区域还有可能存在距离更小的值，值得遍历。
    if (node.verticalDistance(input) < nearbyPoints.max) {
      if (node.leftNode && !node.leftNode.visited) {
        backpropagation(node.leftNode.bottom(input));
      }
      if (node.rightNode && !node.rightNode.visited) {
        backpropagation(node.rightNode.bottom(input));
      }
    }
    if (!node.parentNode) return;
    backpropagation(node.parentNode);
  };

  backpropagation(bottomPoint);
  nearbyPoints.heaps.map(item => console.log(`${item.name}: ${item.point}, ${item.value}`));
};

train({
  ...data,
  k: 7,
  input: [5, 600]
});
