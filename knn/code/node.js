class Node {
  constructor(options) {
    const {
      point, // 将点转换为数组的格式 (1, 2) => [1, 2]
      dimensional, // 因此可以利用索引来代表不同维度
      parentNode = null,
      name = ''
    } = options;
    this.point = point;
    this.parentNode = parentNode;
    this.dimensional = dimensional;
    this.leftNode = null;
    this.rightNode = null;
    this.visited = false;
    this.name = name;
  }

  // 根据输入的点，走到当前节点最底部的位置
  bottom(point) {
    if (!this.leftNode && !this.rightNode) return this;

    const splitValue = this.point[this.dimensional];
    const target = point[this.dimensional];

    if (target === splitValue) return this;
    if (target < splitValue) {
      if (!this.leftNode) return this;
      return this.leftNode.bottom(point);
    }
    if (!this.rightNode) return this;
    return this.rightNode.bottom(point);
  }

  // 计算在当前节点时，目标点到当前节点分隔维度的直线距离
  // 以此来断定需不需要遍历节点的子树
  verticalDistance(point) {
    return Math.abs(this.point[this.dimensional] - point[this.dimensional]);
  }
}

export default Node;
