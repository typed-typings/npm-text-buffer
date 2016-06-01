import Point = require('./point');

declare class Range {
  start: Point;
  end: Point;
  static fromObject(object: Range | Point[], copy?: boolean): Range;
  constructor(pointA: Point, pointB: Point);
  copy(): Range;
  negate(): Range;

  static deserialize(array: any): Range;
  serialize(): any;

  isEmpty(): boolean;
  isSingleLine(): boolean;
  getRowCount(): number;
  getRows(): number[];

  freeze(): void;
  union(otherRange: Range): Range;
  translate(startDelta: Point, endDelta?: Point): Range;
  traverse(delta: Point): Range;


  compare(otherRange: Range): Range;
  isEqual(otherRange: Range): boolean;
  coversSameRows(otherRange: Range): boolean;
  intersectsWith(otherRange: Range, exclusive?: boolean): boolean;
  containsRange(otherRange: Range, exclusive?: boolean): boolean;
  containsPoint(point: Point, exclusive?: boolean): boolean;
  intersectsRow(row: number): boolean;
  intersectsRowRange(startRow: number, endRow: number): boolean;
  toString(): string;

}

export = Range;
