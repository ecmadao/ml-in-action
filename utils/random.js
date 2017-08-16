import { array } from './helper';

const roll = (min, max) => (Math.random() * (max - min)) + min;

// 随机生成权重 [min, max)
export const random = (min = 0, max = 1) => {
  let val = 0;
  if (min === max) return min;
  if (max <= 0) return roll(min, max);
  while (!val) {
    val = roll(min, max);
  }
  return Number(val.toFixed(2));
};

// 生成一组随机权重
const randomWeights = (count, min, max) =>
  array(count).map(() => random(min, max));

export default randomWeights;
