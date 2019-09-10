import * as ast from "./syntax-tree";

export interface IRegExactExecArray extends RegExpExecArray {
  indexes: Array<number | undefined>;
}

export class RegExact {
  private regExact: RegExp;
  private ast: ast.Root;

  constructor(public regexp: RegExp) {
    this.ast = new ast.Root(this.regexp.source);
    this.regExact = new RegExp(this.ast.toPattern(), regexp.flags);
  }

  public exec(input: string, optimization: boolean = true): IRegExactExecArray {
    const execValue = this.regExact.exec(input);
    const exactExecValue = execValue as IRegExactExecArray;
    if (exactExecValue) {
      exactExecValue.indexes = [];
      this.ast.fixResult(exactExecValue, optimization);
    }

    return exactExecValue;
  }
}
