import math from 'mathjs';
import { random } from '../../utils/random';
import loadData from '../../utils/data';

// 数据来源：
// Coursera Machine Learning 课程 ex7
const data = loadData('k-means2.txt');
data.outputs.forEach((val, index) => {
  data.inputs[index].push(val);
});

const randomCenters = (k, inputs = []) => {
  const result = [];

  while (result.length < 3) {
    const randomIndex = Math.floor(random(0, inputs.length));
    const point = inputs[randomIndex];
    if (!result.find(i => i === point)) {
      result.push(point);
    }
  }
  return result;
};

const distance = (pointA, pointB) =>
  math.add(
    ...math.dotPow(math.subtract(pointA, pointB), 2)
  );

const group = (centers, inputs) => {
  const result = {};
  inputs.forEach((points) => {
    const minDis = centers
      .map((center, index) => ({
        i: index,
        dis: distance(center, points)
      }))
      .sort((current, next) => current.dis - next.dis)[0];
    const { i } = minDis;
    if (!result[i]) {
      result[i] = [points];
    } else {
      result[i].push(points);
    }
  });
  return result;
};

const moveCenters = groups =>
  groups.map(points => math.divide(
    points.reduce((pre, current) =>
      math.add(pre, current), 0),
    points.length
  ));

const offset = (groups, centers) =>
  centers.reduce((pre, current, index) => {
    const centerPoint = centers[index];
    const currentGroup = groups[index];

    const totalDis = math.add(
      ...currentGroup.map(point => distance(point, centerPoint))
    ) / currentGroup.length;
    return pre + totalDis;
  }, 0);

const train = (options = {}) => {
  const {
    k = 3,
    inputs = [[]],
  } = options;

  let currentOffset = 0;

  // 初始化中心点
  let centers = randomCenters(k, inputs);
  console.log(centers);

  for (let i = 0; i < 100; i += 1) {
    const preOffset = currentOffset;

    // 根据中心聚类
    const groupResult = group(centers, inputs);

    // 计算误差
    currentOffset = offset(groupResult, centers);
    // 查看优化结果
    const optimization = preOffset - currentOffset;
    console.log(`preOffset: ${preOffset}`);
    console.log(`currentOffset: ${currentOffset}`);
    console.log(`optimization: ${optimization}`);

    // 移动中心到各类中点
    centers = moveCenters(
      Object.keys(groupResult).map(key => groupResult[key])
    );
    console.log(' ============== center ============== ');
    console.log(centers);
  }
};

train({
  ...data
});
