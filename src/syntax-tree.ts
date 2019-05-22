import * as assert from 'assert';
import { IRegExactExecArray } from './regexact';

// tslint:disable-next-line: max-classes-per-file
class PatternState {
  // represents input pattern string and the current position when constructing AST
  constructor(public pattern: string, public cursor: number = 0) {}
  public get(): string {
    return this.pattern[this.cursor];
  }
  public isNotEqual(char: string) {
    return char !== this.pattern[this.cursor];
  }
}

// tslint:disable-next-line: max-classes-per-file
export class GroupsMapper {
  // represents relation between (capturing) groups indexes in extended and unextended result
  public indexToXindex: Map<number, number> = new Map();
  constructor(public index: number = 0, public xIndex: number = 0) {}
}

// tslint:disable-next-line: max-classes-per-file
class FixResultState {
  constructor(public index: number, public cursor: number) {}
}

// tslint:disable-next-line: max-classes-per-file
export class SyntaxTree {
  public type: string;
  protected children: SyntaxTree[];
  constructor() {
    this.type = (this as any).__proto__.constructor.name;
    this.children = [];
  }

  // tslint:disable-next-line: variable-name
  public toPattern(_nodesMapper: GroupsMapper): string {
    return '';
  }

  public fixResult(
    _xExecValue: IRegExactExecArray, // tslint:disable-line: variable-name
    _fixResultState: FixResultState // tslint:disable-line: variable-name
  ) {} // tslint:disable-line: no-empty
}

// tslint:disable-next-line: max-classes-per-file
class Disjunction extends SyntaxTree {
  constructor(patternState: PatternState, nodesMapper: GroupsMapper) {
    super();

    // construct ...
    this.children.push(new Alternative(patternState, nodesMapper));
    if (patternState.get() === '|') {
      patternState.cursor++; // consume alternation operator '|'
      this.children.push(new Disjunction(patternState, nodesMapper));
    }

    assert.strictEqual(patternState.get(), ')');
  }

  public toPattern(nodesMapper: GroupsMapper): string {
    switch (this.children.length) {
      case 0:
        return '';
      case 1:
        return this.children[0].toPattern(nodesMapper);
      case 2:
        return (
          this.children[0].toPattern(nodesMapper) +
          '|' +
          this.children[1].toPattern(nodesMapper)
        );
      default:
        assert.fail(new Error('Node has more than 2 children'));
        return '';
    }
  }

  public fixResult(
    xExecValue: IRegExactExecArray,
    fixResultState: FixResultState
  ) {
    // manage children and siblings
    const cursorStart = fixResultState.cursor;
    for (const child of this.children) {
      fixResultState.cursor = cursorStart;
      child.fixResult(xExecValue, fixResultState);
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
class Alternative extends SyntaxTree {
  constructor(patternState: PatternState, nodesMapper: GroupsMapper) {
    super();

    // construct ...
    if (patternState.get() === '(') {
      this.children.push(new QuantifiedGroup(patternState, nodesMapper));
    } else {
      this.children.push(new Simple(patternState, nodesMapper));
    }

    if (patternState.isNotEqual(')') && patternState.isNotEqual('|')) {
      this.children.push(new Alternative(patternState, nodesMapper));
    }
  }

  public toPattern(nodesMapper: GroupsMapper): string {
    let toPattern = '';
    for (const child of this.children) {
      toPattern = toPattern + child.toPattern(nodesMapper);
    }
    return toPattern;
  }

  public fixResult(
    xExecValue: IRegExactExecArray,
    fixResultState: FixResultState
  ) {
    // manage children and siblings
    for (const child of this.children) {
      child.fixResult(xExecValue, fixResultState);
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
class Simple extends SyntaxTree {
  constructor(patternState: PatternState, nodesMapper: GroupsMapper) {
    super();
    nodesMapper.xIndex++;

    // construct ...
    const referenceMatch = patternState.pattern
      .substr(patternState.cursor)
      .match(/^\\[1-9][0-9]*/);
    if (referenceMatch) {
      const reference = referenceMatch[0];
      this.children.push(new Reference(referenceMatch[0]));
      patternState.cursor += reference.length;
    } else {
      this.children.push(new Text(patternState));
    }

    if (
      patternState.isNotEqual('(') &&
      patternState.isNotEqual(')') &&
      patternState.isNotEqual('|')
    ) {
      this.children.push(new Simple(patternState, nodesMapper));
    }
  }

  public toPattern(nodesMapper: GroupsMapper): string {
    let toPattern = '';
    for (const child of this.children) {
      toPattern = toPattern + child.toPattern(nodesMapper);
    }
    return '(' + toPattern + ')';
  }

  public fixResult(
    xExecValue: IRegExactExecArray,
    fixResultState: FixResultState
  ) {
    // manage group
    const groupText =
      xExecValue[fixResultState.index] !== undefined &&
      xExecValue[fixResultState.index] !== null
        ? xExecValue[fixResultState.index]
        : '';
    xExecValue.splice(fixResultState.index, 1);

    // manage children and siblings
    const rightSiblingCursor = fixResultState.cursor + groupText.length;
    for (const child of this.children) {
      child.fixResult(xExecValue, fixResultState);
    }
    fixResultState.cursor = rightSiblingCursor; // correct for right sibling
  }
}

// tslint:disable-next-line: max-classes-per-file
class Text extends SyntaxTree {
  public expression: string;
  constructor(patternState: PatternState) {
    super();

    // construct ...
    for (
      const cursorStart = patternState.cursor;
      patternState.cursor < patternState.pattern.length;
      patternState.cursor++
    ) {
      // in the case no lookbehind support

      switch (patternState.get()) {
        // @ts-ignore : tslint:disable-nextLine:no-switch-case-fall-through // TODO: hope they will fix this
        case '\\':
          if (
            !patternState.pattern
              .substr(patternState.cursor)
              .match(/^\\[1-9][0-9]*/)
          ) {
            patternState.cursor++;
            break;
          }
        // falls through
        case '(':
        case ')':
        case '|':
          this.expression = patternState.pattern.substring(
            cursorStart,
            patternState.cursor
          );
          return;
      }
    }
    throw new Error('Missing ) or |.');
  }

  // tslint:disable-next-line: variable-name
  public toPattern(_nodesMapper: GroupsMapper): string {
    return this.expression;
  }
}

// tslint:disable-next-line: max-classes-per-file
class Reference extends SyntaxTree {
  public referenceText: string;
  constructor(referenceText: string) {
    super();

    this.referenceText = referenceText;
  }

  public toPattern(nodesMapper: GroupsMapper): string {
    const xReference = nodesMapper.indexToXindex.get(
      Number(this.referenceText.substr(1))
    );
    if (xReference) {
      return '\\' + xReference.toString();
    } else {
      return this.referenceText;
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
class QuantifiedGroup extends SyntaxTree {
  private quantifier: string;
  private groupType: string;
  constructor(patternState: PatternState, nodesMapper: GroupsMapper) {
    super();
    nodesMapper.xIndex += 2; // quantified group has 2 pairs of paretheses

    // construct ...
    patternState.cursor++; // consume the opening parenthesis

    // determine the group type
    const groupTypeMatch = patternState.pattern
      .substr(patternState.cursor)
      .match(/^\?(:|<{0,1}[=!])/);
    this.groupType = groupTypeMatch ? groupTypeMatch[0] : '';
    patternState.cursor += this.groupType.length;

    if (this.groupType.length === 0) {
      // capturing group
      nodesMapper.index += 1;
      nodesMapper.indexToXindex.set(nodesMapper.index, nodesMapper.xIndex); // set node mapper
    }

    this.children.push(new Disjunction(patternState, nodesMapper));
    patternState.cursor++; // consume the closing parenthesis

    const quantifierMatch = patternState.pattern
      .substr(patternState.cursor)
      .match(/^(?:[\*\+\?]\??|{\d+}\??|{\d+,\d*}\??)/);
    this.quantifier = quantifierMatch ? quantifierMatch[0] : '';
    patternState.cursor += this.quantifier.length;

    return;
  }

  public toPattern(nodesMapper: GroupsMapper): string {
    return (
      '(' +
      '(' +
      this.groupType +
      this.children[0].toPattern(nodesMapper) +
      ')' +
      this.quantifier +
      ')'
    ); // TODO: optimization: remove one parentheses pair if quantifier is empty
  }

  public fixResult(
    xExecValue: IRegExactExecArray,
    fixResultState: FixResultState
  ) {
    // manage quantified group
    const quantifiedGroupText =
      xExecValue[fixResultState.index] !== undefined &&
      xExecValue[fixResultState.index] !== null
        ? xExecValue[fixResultState.index]
        : '';
    xExecValue.splice(fixResultState.index, 1);

    const capturingGroupTextLength =
      xExecValue[fixResultState.index] === undefined
        ? 0
        : xExecValue[fixResultState.index].length;
    const capturingGroupIndex =
      xExecValue[fixResultState.index] === undefined
        ? undefined
        : fixResultState.cursor +
          quantifiedGroupText.length -
          capturingGroupTextLength;

    if (this.groupType === '') {
      // regular capturing group
      xExecValue.indexes.push(capturingGroupIndex);
      fixResultState.index++; // capturing group is not droped out
    } else {
      xExecValue.splice(fixResultState.index, 1);
    }

    // manage children and siblings
    const rightSiblingCursor =
      fixResultState.cursor + quantifiedGroupText.length;
    fixResultState.cursor +=
      quantifiedGroupText.length - capturingGroupTextLength;
    this.children[0].fixResult(xExecValue, fixResultState);
    fixResultState.cursor = rightSiblingCursor; // correct for right sibling
  }
}

// tslint:disable-next-line: max-classes-per-file
export class Root extends QuantifiedGroup {
  private nodesMapper: GroupsMapper;
  constructor(pattern: string) {
    const patternState = new PatternState('(' + pattern + ')');
    const nodesMapper = new GroupsMapper(-1, 0);
    super(patternState, nodesMapper);
    this.nodesMapper = nodesMapper;

    if (patternState.cursor < patternState.pattern.length) {
      throw new Error('Parentheses mismatch.');
    }
  }

  public toPattern(): string {
    return super.toPattern(this.nodesMapper);
    // return this.children[0].toPattern(this.nodesMapper);
  }

  public fixResult(xExecValue: IRegExactExecArray) {
    xExecValue.splice(0, 1); // remove overall result as root group represents overall result and is going to be proccessed next
    super.fixResult(xExecValue, new FixResultState(0, xExecValue.index));
  }
}
