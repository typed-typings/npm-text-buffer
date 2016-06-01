declare class Point {
  static fromObject(object: Point | number[], copy?: boolean): Point;
  static min(point1: Point, point2: Point): Point;
  row: number;
  column: number;
  constructor(row: number, column: number);
  copy(): Point;
  negate(): Point;

  compare(other: Point): Point;
  isEqual(other: Point): boolean;
  isLessThan(other: Point): boolean;
  isLessThanOrEqual(other: Point): boolean;
  isGreaterThan(other: Point): boolean;
  isGreaterThanOrEqual(other: Point): boolean;
  freeze(): void;
  translate(other: Point): Point;
  traverse(other: Point): Point;
  toArray(): number[];
  serialize(): number[];
  toString(): string;
}

export = Point;
