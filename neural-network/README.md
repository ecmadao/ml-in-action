## Neural Network

### Articles

> 因为数学公式在 GitHub 下无法渲染，因此转换为 PDF

- [译文：手把手教你神经网络的反向传播](./articles/手把手教你神经网络的反向传播.pdf)

### Codes

原文中 Python 完成的源码在这里：[simple-neural-network](https://github.com/mattm/simple-neural-network/blob/master/neural-network.py)，同时我用 JavaScript 也实现了一个带有反向传播的神经网络，利用[矩阵](https://zh.wikipedia.org/wiki/%E7%9F%A9%E9%98%B5)来简化计算过程，并可自定义隐藏层数目：[train.js](./code/train.js)

```bash
# run in local
$ git clone git@github.com:ecmadao/ml-in-action.git
$ cd ml-in-action
$ npm i
$ node neural-network/code/index.js
```
