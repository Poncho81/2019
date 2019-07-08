export default class Point {
  constructor(x = 0, y = 0) {
    this.x;
    this.y;
    this.set(x, y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(pt) {
    return pt.x === this.x && pt.y === this.y;
  }

  dist(pt) {
    let a = pt.x - this.x,
      b = pt.y - this.y;
    return Math.sqrt(a * a + b * b);
  }

  copy() {
    return new Point(this.x, this.y);
  }
}