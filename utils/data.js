import fs from 'fs';
import path from 'path';

const loadData = (filename, handlers = {}) => {
  const filepath = path.join(__dirname, `../data/${filename}`);
  const filelines = fs
    .readFileSync(filepath, 'utf8').split(/\n|\r/);

  const inputs = [];
  const outputs = [];
  const {
    inputHandler = val => Number(val),
    outputHandler = val => Number(val),
  } = handlers;

  filelines.filter(item => item).forEach((fileline) => {
    const items = fileline.split(',');
    inputs.push(
      items.slice(0, -1).map(inputHandler)
    );
    outputs.push(outputHandler(items.slice(-1)[0]));
  });

  return {
    inputs,
    outputs,
  };
};

export default loadData;
