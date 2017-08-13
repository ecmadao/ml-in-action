import { array } from './helper';

// 随机生成权重
const random = (min = 0, max = 1) => {
  let val = 0;
  if (min === max) return min;
  if (max <= 0) return Math.random() * (max - min) + min;
  while(!val) {
    val = Math.random() * (max - min) + min;
  }
  return Number(val.toFixed(2));
};

// 生成一组随机权重
const randomWeights = (count, min, max) =>
  array(count).map(() => random(min, max));

export default randomWeights;
