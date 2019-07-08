import * as Const from "./const.js";
import Tile from "./tile.js";
import Game from "./game.js";

class Match extends Game {
  constructor() {
    super();
    this.selected = this.tile1 = this.tile2 = null;
    this.state = Const.MOVE_DOWN;
    this.board = Array(Const.GEM_CNT).fill(0).map(() => Array(Const.GEM_CNT).fill(0));

    this.inBounds = (x, y) => {
      return !(x < 0 || x >= Const.GEM_CNT || y < 0 || y >= Const.GEM_CNT);
    }
    this.getTile = (x, y) => {
      return this.inBounds(x, y) ? this.board[x][y] : null;
    };
    this.setTile = (x, y, t) => {
      this.inBounds(x, y) && (this.board[x][y] = t);
    };
    this.rand = (a, b) => {
      return Math.floor(Math.random() * (b - a) + a);
    };
    this.isNeighbour = (tile) => {
      return Math.abs(tile.gridPos.x - this.selected.gridPos.x) + Math.abs(tile.gridPos.y - this.selected.gridPos.y) === 1;
    };
    this.select = (t) => {
      this.selected = t;
      this.selected.select(true);
    };
    this.unselect = () => {
      this.selected && this.selected.select(false);
      this.selected = null;
    };
    this.canvas.addEventListener("click", (e) => {
      this.click(e)
    });
    this.canvas.addEventListener("touchstart", (e) => {
      this.click(e)
    });
    this.res.loadImages([
      "01.png", "02.png", "03.png", "04.png", "05.png", "06.png", "07.png",
      "11.png", "12.png", "13.png", "14.png", "15.png", "16.png", "17.png",
      "21.png", "22.png", "23.png", "24.png", "25.png", "26.png", "27.png",
      "00.gif"
    ], () => {
      this.buildBoard();
      this.loop(0);
    });
  }

  click(e) {
    if (this.state != Const.WAIT_CLICK) return;
    let x, y;
    if (e.type === "touchstart") {
      x = Math.floor((e.touches[0].clientX - e.srcElement.offsetLeft) / (Const.SIZE));
      y = Math.floor((e.touches[0].clientY - e.srcElement.offsetTop) / (Const.SIZE));
      e.preventDefault();
    } else {
      x = Math.floor((e.clientX - 8 - e.srcElement.offsetLeft) / (Const.SIZE));
      y = Math.floor((e.clientY - 8 - e.srcElement.offsetTop) / (Const.SIZE));
      e.preventDefault();
    }
    if (x === null || y === null || !this.inBounds(x, y)) return;

    const tl = this.getTile(x, y);
    if (!tl.blocked) {
      if (!this.selected) {
        this.select(tl);
        return;
      } else {
        if (this.isNeighbour(tl)) {
          this.tile1 = this.selected;
          this.tile2 = tl;
          const vx = (this.tile2.pixelPos.x - this.tile1.pixelPos.x) * .01,
            vy = (this.tile2.pixelPos.y - this.tile1.pixelPos.y) * .01;
          this.tile1.moveTo(this.tile2.pixelPos.x, this.tile2.pixelPos.y, vx, vy);
          this.tile2.moveTo(this.tile1.pixelPos.x, this.tile1.pixelPos.y, -vx, -vy);
          this.state = Const.SWAP;
        }
      }
    }
    this.unselect();
  }

  animateTiles(dt) {
    let f = false;
    for (const r of this.board) {
      for (const t of r) {
        if (t.update(dt)) f = true;
      }
    }
    return f;
  }

  update(dt) {
    switch (this.state) {
      case Const.HAS_MOVE:
        this.state = this.hasMoves() ? Const.WAIT_CLICK : Const.GAME_OVER;
        break;
      case Const.GAME_OVER:
        // to do!
        break;
      case Const.SWAP:
        if (!(this.tile1.update(dt) | this.tile2.update(dt))) {
          this.swap(this.tile1, this.tile2);
          if (!this.checkCombo()) {
            this.tile1.moveTo(this.tile2.pixelPos.x, this.tile2.pixelPos.y, -this.tile1.vel.x, -this.tile1.vel.y);
            this.tile2.moveTo(this.tile1.pixelPos.x, this.tile1.pixelPos.y, -this.tile2.vel.x, -this.tile2.vel.y);
            this.state = Const.UNSWAP;
          } else {
            this.state = Const.REMOVE;
          }
        }
        break;
      case Const.UNSWAP:
        if (!(this.tile1.update(dt) | this.tile2.update(dt))) {
          this.swap(this.tile1, this.tile2);
          this.state = Const.HAS_MOVE;
        }
        break;
      case Const.REMOVE:
        this.state = this.animateTiles(dt) ? this.state : this.removeTiles() || Const.REFILL;
        break;
      case Const.NO_MATCH:
        break;
      case Const.MOVE_DOWN:
        this.state = this.animateTiles(dt) ? this.state : Const.HAS_MOVE;
        break;
      case Const.REFILL:
        this.state = this.animateTiles(dt) ? this.state : this.checkCombo() ? Const.REMOVE : Const.HAS_MOVE;
        break;
    }
  }

  removeTiles() {
    let moved;
    do {
      moved = false;
      for (let y = Const.GEM_CNT - 2; y > -1; y--) {
        for (let x = 0; x < Const.GEM_CNT; x++) {
          const t1 = this.getTile(x, y),
            t2 = this.getTile(x, y + 1);
          if (t1.alive && !t2.alive) {
            this.swap(t1, t2);
            t1.moveTo(t1.pixelPos.x, t1.gridPos.y * 38 + 25, 0, 1.3);
            t2.pixelPos.set(t1.pixelPos.x, t1.pixelPos.y);
            moved = true;
          }
        }
      }
    } while (moved);

    let row = 0,
      lastY = -1;
    for (let y = Const.GEM_CNT - 1; y > -1; y--) {
      for (let x = 0; x < Const.GEM_CNT; x++) {
        if (!this.getTile(x, y).alive) {
          this.setTile(x, y, null);
          if (lastY !== y) {
            lastY = y;
            row++;
          }
          this.addOneTile(x, y, Const.SIZE * row + Const.GAP * row);
        }
      }
    }
  }

  draw() {
    for (let r of this.board) {
      for (let t of r) {
        if (!t || !t.alive) continue;
        t.selected && this.ctx.drawImage(this.res.images[Const.SEL], t.left, t.top, Const.SIZE, Const.SIZE);
        this.ctx.globalAlpha = t.alpha;
        const gfx = t.flash ? this.res.images[t.type + 7] : t.blocked ? this.res.images[t.type + 14] : this.res.images[t.type];
        this.ctx.drawImage(gfx, t.left, t.top, Const.SIZE, Const.SIZE);
      }
    }
  }

  has3Match(x, y, c) {
    const t1 = this.getTile(x - 1, y),
      t2 = this.getTile(x - 2, y),
      t3 = this.getTile(x, y - 1),
      t4 = this.getTile(x, y - 2);
    return (t1 && t1.type) === (t2 && t2.type) && (t2 && t2.type) === c ||
      (t3 && t3.type) === (t4 && t4.type) && (t4 && t4.type) === c;
  }

  addOneTile(x, y, brd) {
    let c;
    const xx = x * Const.SIZE + Const.HSIZE + Const.GAP,
      yy = y * Const.SIZE + Const.HSIZE + Const.GAP,
      ty = yy - brd - (Const.GEM_CNT - y) * Const.GAP + this.rand(0, Const.GAP),
      t = new Tile(0, xx, ty, x, y);
    do {
      c = this.rand(0, 7);
    } while (this.has3Match(x, y, c));
    t.type = c;
    t.moveTo(xx, yy, 0, 1.3);
    this.setTile(x, y, t);
  }

  buildBoard() {
    for (let y = 0; y < Const.GEM_CNT; y++) {
      for (let x = 0; x < Const.GEM_CNT; x++) {
        this.addOneTile(x, y, Const.BRD_SIZE);
        if (Math.random() < .015) this.getTile(x, y).blocked = true;
      }
    }
  }

  swap(t1, t2) {
    const a = t1.gridPos.x,
      b = t1.gridPos.y,
      c = t2.gridPos.x,
      d = t2.gridPos.y;
    this.setTile(a, b, t2);
    this.setTile(c, d, t1);
    t1.gridPos.set(c, d);
    t2.gridPos.set(a, b);
  }

  hasMoves() {
    // to do!
    return true;
  }

  checkCombo() {
    let chainLen, tl, flash, ret = false;
    for (let y = 0; y < Const.GEM_CNT; y++) {
      for (let x = 0; x < Const.GEM_CNT; x++) {
        const tile = this.getTile(x, y);
        flash = false;
        chainLen = 1;
        while (x + chainLen < Const.GEM_CNT && tile.type === this.getTile(x + chainLen, y).type) {
          chainLen++;
        }
        if (chainLen > 2) {
          ret = true;
          if (chainLen > 3) flash = true;
          while (chainLen) {
            tl = this.getTile(x + chainLen - 1, y);
            tl.hiding = true;
            if (tl.flash) {
              this.deleteFlash(tl);
            }
            if (tl.blocked) {
              tl.hiding = false;
              tl.blocked = false;
            }
            chainLen--;
          }
          if (flash) {
            tile.hiding = false;
            tile.flash = true;
          }
        }

        flash = false;
        chainLen = 1;
        while (y + chainLen < Const.GEM_CNT && tile.type === this.getTile(x, y + chainLen).type) {
          chainLen++;
        }
        if (chainLen > 2) {
          ret = true;
          if (chainLen > 3) flash = true;
          while (chainLen) {
            tl = this.getTile(x, y + chainLen - 1);
            tl.hiding = true;
            if (tl.flash) {
              this.deleteFlash(tl);
            }
            if (tl.blocked) {
              tl.hiding = false;
              tl.blocked = false;
            }
            chainLen--;
          }
          if (flash) {
            tile.hiding = false;
            tile.flash = true;
          }
        }
      }
    }
    return ret;
  }

  deleteFlash(ft) {
    for (let a = 0; a < Const.GEM_CNT; a++) {
      this.getTile(a, ft.gridPos.y).hiding = true;
      this.getTile(ft.gridPos.x, a).hiding = true;
    }
  }
}

new Match();