import { array } from './helper';

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

export default randomWeights;
