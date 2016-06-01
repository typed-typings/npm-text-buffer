
declare interface ScanInRangeFunction {
  (regex: RegExp, range: Range, iterator: (match: any, matchText: string, range: Range, stop: Function, replace: (value: string) => void) => void): void;
}

export = ScanInRangeFunction;
