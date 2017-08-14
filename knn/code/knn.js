import loadData from '../../utils/data';

// 数据来源：
// http://burakkanber.com/blog/machine-learning-in-js-k-nearest-neighbor-part-1/
const data = loadData('knn.txt', {
  outputHandler: val => val
});
// 因为数据源的输出并不是数字化的，而是诸如 apartment 这样的单词，所以我们需要进一步处理
const OUTPUT_TYPES = {};
const outputs = data.outputs.map((output) => {
  if (OUTPUT_TYPES[output]) return OUTPUT_TYPES[output];
  const type = Object.keys(OUTPUT_TYPES).length + 1;
  OUTPUT_TYPES[output] = type;
  return type;
});
data.outputs = [...outputs];


const train = (options = {}) => {
  const {
    k = 5,
    inputs = [[]],
    outputs = [],
  } = options;
  // TODO: KNN
};

train({
  ...data
});
