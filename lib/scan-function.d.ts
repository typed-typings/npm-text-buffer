
declare interface ScanFunction {
  (regex: RegExp, iterator: (match: any, matchText: string, range: Range, stop: Function, replace: (value: string) => void) => void): void;
}

export = ScanFunction;
