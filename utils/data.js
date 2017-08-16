import fs from 'fs';
import path from 'path';

const loadData = (filename, options = {}) => {
  const filepath = path.join(__dirname, `../data/${filename}`);
  const filelines = fs
    .readFileSync(filepath, 'utf8').split(/\n|\r/);

  const inputs = [];
  const outputs = [];
  const {
    separation = -1,
    inputHandler = val => Number(val),
    outputHandler = val => Number(val),
  } = options;

  filelines.filter(item => item).forEach((fileline) => {
    const items = fileline.split(/,|;|\s/);
    inputs.push(
      items.slice(0, separation).map(inputHandler)
    );
    outputs.push(outputHandler(items.slice(separation)[0]));
  });

  return {
    inputs,
    outputs,
  };
};

export default loadData;
