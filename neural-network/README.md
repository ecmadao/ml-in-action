## Neural Network

### Articles

> 因为数学公式在 GitHub 下无法渲染，因此转换为 PDF

- [译文：手把手教你神经网络的反向传播](./articles/手把手教你神经网络的反向传播.pdf)

### Codes

原文中 Python 完成的源码在这里：[simple-neural-network](https://github.com/mattm/simple-neural-network/blob/master/neural-network.py)，同时我用 JavaScript 也实现了一个带有反向传播的神经网络，利用[矩阵](https://zh.wikipedia.org/wiki/%E7%9F%A9%E9%98%B5)来简化计算过程，并可自定义隐藏层数目：[nn.js](./code/nn.js)

在 [nn.js](./code/nn.js) 中，我们训练集为：输入 `[0.05, 0.1]`，输出 `[0.01, 0.99]`。

一开始完全随机生成神经元的权重，经过两层隐藏层（每层 3 个神经元）和 10000 次训练之后，输出为 `[0.010764211878949714, 0.9902824176718917]`，基本接近我们的期望；而当隐藏层神经元的数目改为 4 个或者更多后，训练结果精度将进一步提升。

注：并不保证每次运行的输出都一样，因为初始化权重在每次重新运行的时候都是随机生成的。

```bash
# run in local
$ git clone git@github.com:ecmadao/ml-in-action.git
$ cd ml-in-action
$ npm i
$ node neural-network/code/index.js
```

如果想尝试不同输入、隐藏层配置的情况，则可以修改 [nn.js](./code/nn.js) 中的输出化输入：

```javascript
train({
  inputs: [0.05, 0.1], // 输入
  outputs: [0.01, 0.99], // 期待的输出
  // 隐藏层。数组的长度代表隐藏层的层数，而某一位上具体的数字则代表该层的神经元数目
  hiddenLayers: [4, 4, 5, 4, 3],
});
```

### Recommended

- [反向传播算法入门资源索引](http://www.52nlp.cn/反向传播算法入门资源索引)
