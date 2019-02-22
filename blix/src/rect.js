export default class Rect {
  constructor(a, b, c, d) {
    this.left = a;
    this.top = b;
    this.wid = c;
    this.hei = d;
    this.right = a + c, this.bottom = b + d;
  }

  contains(x, y) {
    return (x >= this.left && x <= this.right &&
      y >= this.top && y <= this.bottom);
  }
}