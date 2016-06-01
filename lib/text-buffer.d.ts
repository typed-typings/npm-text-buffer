import EventKit = require('event-kit');

declare namespace TextBuffer {
  class Point {
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

  class Range {
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

  class Marker {
    constructor(id, layer, range: Range, params: Object);
    onDidDestroy: EventKit.EventHandler;
    onDidChange(callback: (event: {
      oldHeadBufferPosition: Point;
      newHeadBufferPosition: Point;
      oldTailBufferPosition: Point;
      newTailBufferPosition: Point;
      oldHeadScreenPosition: Point;
      newHeadScreenPosition: Point;
      oldTailScreenPosition: Point;
      newTailScreenPosition: Point;
      wasValid: boolean;
      isValid: boolean;
      hadTail: boolean;
      hasTail: boolean;
      oldProperties: Object;
      newProperties: Object;
      textChanged: boolean;
    }) => void): EventKit.Disposable;
    getRange(): Range;
    setRange(range: Range, params?: { reversed?: boolean, exclusive?: boolean }): void;
    getHeadPosition(): Position;
    setHeadPosition(position: Position): void;
    getTailPosition(): Position;
    setTailPosition(position: Position): void;
    getStartPosition(): Position;
    getEndPosition(): Position;
    clearTail(): void;
    plantTail(): void;
    isReversed(): boolean;
    hasTail(): boolean;
    isValid(): boolean;
    isDestroyed(): boolean;
    isExclusive(): boolean;
    isEqual(other: Marker): boolean;
    getInvalidationStrategy(): string;
    getProperties(): Object;
    setProperties(properties: Object): void;
    copy(option?: Object): Marker;
    destroy(): void;
    compare(other: Marker): boolean;
  }
  class MarkerLayer {
    // Lifecycle
    copy(): void;
    destroy(): void;
    isDestroyed(): boolean;
    // Querying
    getMarker(): Marker;
    getMarkers(): Marker[];
    getMarkerCount(): number;
    /**
     * @params params A hash of key-value pairs constraining the set of returned markers.
     * You can query against custom marker properties by listing the desired key-value pairs here.
     * In addition, the following keys are reserved and have special semantics:
     *    startPosition	Only include markers that start at the given Point.
     *    endPosition Only include markers that end at the given Point.
     *    containsPoint Only include markers that contain the given Point, inclusive.
     *    containsRange	Only include markers that contain the given Range, inclusive.
     *    startRow Only include markers that start at the given row Number.
     *    endRow Only include markers that end at the given row Number.
     *    intersectsRow Only include markers that intersect the given row Number.
     */
    findMarkers(params: {
      startPosition?: Point,
      endPosition?: Point,
      containsPoint?: Point,
      containsRange?: Range,
      startRow?: number,
      endRow?: number;
      intersectsRow?: number
    }): Marker[];
    // Marker creation
    markRange(range: Range | Point[], properties: {
      reversed?: boolean,
      persistent?: boolean,
      invalidate?: 'never' | 'surround' | 'overlap' | 'inside' | 'touch'
    }): Marker;
    markPosition(position: Point | number[], properties: {
      reversed?: boolean,
      persistent?: boolean,
      invalidate?: 'never' | 'surround' | 'overlap' | 'inside' | 'touch'
    }): Marker;
    // Event subscription

    onDidUpdate: EventKit.EventHandler;
    onDidCreateMarker: EventKit.EventHandler;
    onDidDestroy(): EventKit.Disposable;
  }
  interface ScanFunction {
    (regex: RegExp, iterator: (match: any, matchText: string, range: Range, stop: Function, replace: (value: string) => void) => void): void;
  }
  interface ScanInRangeFunction {
    (regex: RegExp, range: Range, iterator: (match: any, matchText: string, range: Range, stop: Function, replace: (value: string) => void) => void): void;
  }
}

declare class TextBuffer {
  constructor(params: string | { load: boolean, text: string });
  onWillChange(callback: (event: {
    oldRange: Range,
    newRange: Range,
    oldText: string,
    newText: string
  }) => void): EventKit.Disposable;
  onDidChange(callback: (event: {
    oldRange: Range,
    newRange: Range,
    oldText: string,
    newText: string
  }) => void): EventKit.Disposable;
  onDidStopChanging: EventKit.EventHandler;
  onDidConflict: EventKit.EventHandler;
  onDidChangeModified(callback: (modified: boolean) => void): EventKit.Disposable;
  onDidUpdateMarkers: EventKit.EventHandler;
  onDidCreateMarker(callback: (marker: TextBuffer.Marker) => void): EventKit.Disposable;
  onDidChangePath(callback: (path: string) => void): EventKit.Disposable;
  onDidChangeEncoding(callback: (encoding: string) => void): EventKit.Disposable;
  onWillSave: EventKit.EventHandler;
  onDidSave(callback: (event: { path: string }) => void): EventKit.Disposable;
  onDidDelete: EventKit.EventHandler;
  onWillReload: EventKit.EventHandler;
  onDidReload: EventKit.EventHandler;
  onDidDestroy: EventKit.EventHandler;
  onWillThrowWatchError(callback: (errorObject: {
    error: Object,
    handle(): void
  }) => void): EventKit.Disposable;
  getStoppedChangingDelay(): number;
  isModified(): boolean;
  isInConflict(): boolean;
  getPath(): string;
  setPath(filePath: string): void;
  setEncoding(encoding: string): void;
  getEncoding(): string;
  getUri(): string;
  isEmpty(): boolean;
  getText(): string;
  getTextInRange(range: Range): string;
  getLines(): string[];
  getLastLine(): string;
  lineForRow(row: number): string;
  lineEndingForRow(row: number): '\n' | '\r' | '\r\n' | '';
  lineLengthForRow(row: number): number;
  isRowBlank(row: number): boolean;
  previousNonBlankRow(startRow: number): number;
  nextNonBlankRow(startRow: number): number;
  setText(text: string): Range;
  setTextViaDiff(text: string): any;
  setTextInRange(range: Range, text: string, options?: { normalizeLineEndings?: boolean, undo?: 'skip' }): Range;
  insert(position: TextBuffer.Point, text: string, options?: { normalizeLineEndings?: boolean, undo?: 'skip' }): Range;
  append(text: string, options?: { normalizeLineEndings?: boolean, undo?: 'skip' }): Range;
  delete(range: Range): Range;
  deleteRow(row: number): Range;
  deleteRows(startRow: number, endRow: number): Range;
  addMarkerLayer(options: { maintainHistory: boolean }): TextBuffer.MarkerLayer;
  getMarkerLayer(id: any): TextBuffer.MarkerLayer;
  markRange(range: Range | TextBuffer.Point[], properties: {
    reversed?: boolean,
    persistent?: boolean,
    invalidate?: 'never' | 'surround' | 'overlap' | 'inside' | 'touch'
  }): TextBuffer.Marker;
  markPosition(position: TextBuffer.Point | number[], properties: {
    reversed?: boolean,
    persistent?: boolean,
    invalidate?: 'never' | 'surround' | 'overlap' | 'inside' | 'touch'
  }): TextBuffer.Marker;
  getMarkers(): TextBuffer.Marker[];
  getMarker(id: number): TextBuffer.Marker;
  /**
   * @params params A hash of key-value pairs constraining the set of returned markers.
   * You can query against custom marker properties by listing the desired key-value pairs here.
   * In addition, the following keys are reserved and have special semantics:
   *    startPosition	Only include markers that start at the given Point.
   *    endPosition Only include markers that end at the given Point.
   *    containsPoint Only include markers that contain the given Point, inclusive.
   *    containsRange	Only include markers that contain the given Range, inclusive.
   *    startRow Only include markers that start at the given row Number.
   *    endRow Only include markers that end at the given row Number.
   *    intersectsRow Only include markers that intersect the given row Number.
   */
  findMarkers(params: {
    startPosition?: TextBuffer.Point,
    endPosition?: TextBuffer.Point,
    containsPoint?: TextBuffer.Point,
    containsRange?: Range,
    startRow?: number,
    endRow?: number;
    intersectsRow?: number
  }): TextBuffer.Marker[];
  getMarkerCount(): number;
  undo(): void;
  redo(): void;
  transact(fn: () => void): void;
  transact(groupingInterval: number, fn: () => void): void;
  clearUndoStack(): void;
  createCheckpoint(): any;
  revertToCheckpoint(): boolean;
  groupChangesSinceCheckpoint(): boolean;
  scan: TextBuffer.ScanFunction;
  backwardsScan: TextBuffer.ScanFunction;
  scanInRange: TextBuffer.ScanInRangeFunction;
  backwardsScanInRange: TextBuffer.ScanInRangeFunction;
  replace(regex: RegExp, replacementText: string): number;
  getRange(): Range;
  getLineCount(): number;
  getLastRow(): number;

  getFirstPosition(): TextBuffer.Point;
  getEndPosition(): TextBuffer.Point;
  getMaxCharacterIndex(): number;
  rangeForRow(row: number, includeNewline: boolean): Range;
  characterIndexForPosition(position: TextBuffer.Point): number;
  positionForCharacterIndex(offset: number): TextBuffer.Point;
  clipRange(range: Range): Range;
  clipPosition(position: TextBuffer.Point): TextBuffer.Point;
  save(): void;
  saveAs(filePath: string): void;
  reload(): void;
}

export = TextBuffer;
