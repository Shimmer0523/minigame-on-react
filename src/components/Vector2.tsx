import { Point } from "pixi.js";

class Vector2 extends Point {
  /**
   *
   * @param v 加算するベクトル
   * @returns 加算後ベクトル
   */
  plus(v: Point) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  /**
   *
   * @param v 減算するベクトル
   * @returns 減算後ベクトル
   */
  minus(v: Point) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /**
   *
   * @param s 乗算するベクトル
   * @returns 乗算後ベクトル
   */
  times(s: number) {
    return new Vector2(this.x * s, this.y * s);
  }

  /**
   *
   * @returns ベクトルのサイズ
   */
  length(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /**
   *
   * @returns (1, 0)を基準にしたベクトルのdeg角度
   */
  angle(): number {
    const [x0, y0] = [1, 0];
    const rad2deg = 180 / Math.PI;
    return Math.acos((this.x * x0 + this.y * y0) / this.length()) * rad2deg;
  }

  /**
   *
   * @param deg deg角度
   * @returns 回転後ベクトル
   */
  rotateByDeg(deg: number) {
    const rad = (Math.PI / 180.0) * deg;
    const nx = Math.cos(rad) * this.x - Math.sin(rad) * this.y;
    const ny = Math.sin(rad) * this.x + Math.cos(rad) * this.y;
    return new Vector2(nx, ny);
  }
}

export default Vector2;
