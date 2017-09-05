const more = (a, b) => a - b > 0;

// 数组中的两个元素交换位置
const exchange = (array, indexA, indexB) => {
  const temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
};

class Heap {
  constructor(array = []) {
    this.heaps = [...array];
    if (array.length) {
      this.initial();
    }
  }

  get count() {
    return this.heaps.length;
  }

  get min() {
    return Math.min(...this.heaps.map(item => item.value));
  }

  get max() {
    return this.heaps[0].value;
  }

  initial() {
    for (let i = this.heaps.length - 1; i >= 0; i -= 1) {
      // 每一个元素作为父元素，和其子元素进行比较
      this.sortWithChild(i + 1);
    }
  }

  sortWithChild(fatherIndex) {
    if (fatherIndex < 0) return;
    const childIndexLeft = fatherIndex * 2;
    const childIndexRight = childIndexLeft + 1;

    if (childIndexLeft > this.heaps.length) return;
    // 如果子元素的大小大于父元素，则交换位置
    if (more(this.heaps[childIndexLeft - 1].value, this.heaps[fatherIndex - 1].value)) {
      exchange(this.heaps, childIndexLeft - 1, fatherIndex - 1);
    }

    if (childIndexRight > this.heaps.length) return;
    if (more(this.heaps[childIndexRight - 1].value, this.heaps[fatherIndex - 1].value)) {
      exchange(this.heaps, childIndexRight - 1, fatherIndex - 1);
    }

    // 将两个子元素作为父元素，继续和它们的子元素进行排序，直至进行到最底部
    this.sortWithChild(childIndexLeft);
    this.sortWithChild(childIndexRight);
  }

  enqueue(item) {
    this.heaps.push(item);
    this.sortWithChild(this.heaps.length);
  }

  dequeue() {
    // 首先，根部元素和底部最后一位元素交换位置
    exchange(this.heaps, 0, this.heaps.length - 1);
    // 然后，取出并从树种删除此时的最后一位元素，即原二叉堆的根元素
    const result = this.heaps.pop();
    // 最后，从根部开始排序
    this.sortWithChild(this.heaps, 1);
    return result;
  }
}

export default Heap;
