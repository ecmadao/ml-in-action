import fs from 'fs';
import path from 'path';

const loadData = (filename) => {
  const filepath = path.join(__dirname, `../../data/${filename}`);
  const filelines = fs
    .readFileSync(filepath, 'utf8').split(/\n|\r/);

  const inputs = [];
  const outputs = [];

  filelines.filter(item => item).forEach((fileline) => {
    const items = fileline.split(',');
    inputs.push(items.slice(0, -1));
    outputs.push(items.slice(-1)[0]);
  });

  return {
    inputs,
    outputs
  };
};

export default loadData;
