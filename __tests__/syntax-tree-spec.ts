import * as ast from '../src/syntax-tree';

describe('Reference AST.', () => {
  test.each`
    pattern          | nodePath | nodeType  | nodeChilds | expression   | toPattern
    ${'(.).\\1.\\1'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((.)))(.(\\4(.(\\4))))))'}
    ${'(.).\\1\\1'}  | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((.)))(.(\\4(\\4)))))'}
    ${'(.).\\1'}     | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((.)))(.(\\4))))'}
    ${'(.(.))\\2'}   | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((.)(((.)))))(\\7)))'}
    ${'(.)\\1'}      | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((.)))(\\4)))'}
  `(
    'Pattern $pattern should produce AST such that the node $nodePath has type $nodeType, has $nodeChilds children and produces pattern $toPattern.',
    ({ pattern, nodePath, nodeType, nodeChilds, expression, toPattern }) => {
      let node: ast.SyntaxTree = new ast.Root(pattern);
      for (let level = 1; level < nodePath.length; level++) {
        node = (node as any).children[nodePath[level]];
      }
      expect((node as any).type).toBe(nodeType);
      expect((node as any).children.length).toBe(nodeChilds);
      expect((node as any).expression).toBe(expression);
      if (node.type === 'Root') {
        expect((node as ast.Root).toPattern()).toBe(toPattern);
      } else {
        expect(node.toPattern(new ast.GroupsMapper())).toBe(toPattern);
      }
    }
  );
});

describe('Nested QuantifiedGroup AST.', () => {
  test.each`
    pattern    | nodePath | nodeType  | nodeChilds | expression   | toPattern
    ${'(())g'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((((()))))(g)))'}
    ${'(()a)'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((((()))(a)))))'}
    ${'((d))'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((((d)))))))'}
    ${'(a())'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)((()))))))'}
    ${'a(())'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((a)((((()))))))'}
    ${'(())'}  | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((((()))))))'}
  `(
    'Pattern $pattern should produce AST such that the node $nodePath has type $nodeType, has $nodeChilds children and produces pattern $toPattern.',
    ({ pattern, nodePath, nodeType, nodeChilds, expression, toPattern }) => {
      let node: ast.SyntaxTree = new ast.Root(pattern);
      for (let level = 1; level < nodePath.length; level++) {
        node = (node as any).children[nodePath[level]];
      }
      expect((node as any).type).toBe(nodeType);
      expect((node as any).children.length).toBe(nodeChilds);
      expect((node as any).expression).toBe(expression);
      if (node.type === 'Root') {
        expect((node as ast.Root).toPattern()).toBe(toPattern);
      } else {
        expect(node.toPattern(new ast.GroupsMapper())).toBe(toPattern);
      }
    }
  );
});

describe('QuantifiedGroup AST with.', () => {
  test.each`
    pattern   | nodePath        | nodeType             | nodeChilds | expression   | groupType    | toPattern
    ${'(?:)'} | ${[0, 0, 0, 0]} | ${'QuantifiedGroup'} | ${1}       | ${undefined} | ${'?:'}      | ${'((?:()))'}
    ${'(?:)'} | ${[0]}          | ${'Root'}            | ${1}       | ${undefined} | ${undefined} | ${'((((?:()))))'}
  `(
    'Pattern $pattern should produce AST such that the node $nodePath has type $nodeType, has $nodeChilds children and produces pattern $toPattern.',
    ({ pattern, nodePath, nodeType, nodeChilds, expression, toPattern }) => {
      let node: ast.SyntaxTree = new ast.Root(pattern);
      for (let level = 1; level < nodePath.length; level++) {
        node = (node as any).children[nodePath[level]];
      }
      expect((node as any).type).toBe(nodeType);
      expect((node as any).children.length).toBe(nodeChilds);
      expect((node as any).expression).toBe(expression);
      if (node.type === 'Root') {
        expect((node as ast.Root).toPattern()).toBe(toPattern);
      } else {
        expect(node.toPattern(new ast.GroupsMapper())).toBe(toPattern);
      }
    }
  );
});

describe('QuantifiedGroup AST.', () => {
  test.each`
    pattern         | nodePath | nodeType  | nodeChilds | expression   | toPattern
    ${'(a)*'}       | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a))*)))'}
    ${'(a)b*'}      | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)))(b*)))'}
    ${'(a)*c'}      | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a))*)(c)))'}
    ${'(a)+'}       | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a))+)))'}
    ${'(a)b+'}      | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)))(b+)))'}
    ${'(a)+c'}      | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a))+)(c)))'}
    ${'(a)?'}       | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a))?)))'}
    ${'(a)b?'}      | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)))(b?)))'}
    ${'(a)?c'}      | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a))?)(c)))'}
    ${'(a){3}'}     | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)){3})))'}
    ${'(a)b{3}'}    | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)))(b{3})))'}
    ${'(a){3}c'}    | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)){3})(c)))'}
    ${'(a){3,}'}    | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)){3,})))'}
    ${'(a)b{3,}'}   | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)))(b{3,})))'}
    ${'(a){3,}c'}   | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)){3,})(c)))'}
    ${'(a){3,5}'}   | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)){3,5})))'}
    ${'(a)b{3,5}'}  | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)))(b{3,5})))'}
    ${'(a){3,5}c'}  | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)){3,5})(c)))'}
    ${'(a)*?'}      | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a))*?)))'}
    ${'(a)b*?'}     | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)))(b*?)))'}
    ${'(a)*?c'}     | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a))*?)(c)))'}
    ${'(a)+?'}      | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a))+?)))'}
    ${'(a)b+?'}     | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)))(b+?)))'}
    ${'(a)+?c'}     | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a))+?)(c)))'}
    ${'(a)??'}      | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a))??)))'}
    ${'(a)b??'}     | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)))(b??)))'}
    ${'(a)??c'}     | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a))??)(c)))'}
    ${'(a){3}?'}    | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)){3}?)))'}
    ${'(a)b{3}?'}   | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)))(b{3}?)))'}
    ${'(a){3}?c'}   | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)){3}?)(c)))'}
    ${'(a){3,}?'}   | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)){3,}?)))'}
    ${'(a)b{3,}?'}  | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)))(b{3,}?)))'}
    ${'(a){3,}?c'}  | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)){3,}?)(c)))'}
    ${'(a){3,5}?'}  | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)){3,5}?)))'}
    ${'(a)b{3,5}?'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)))(b{3,5}?)))'}
    ${'(a){3,5}?c'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)){3,5}?)(c)))'}
  `(
    'Pattern $pattern should produce AST such that the node $nodePath has type $nodeType, has $nodeChilds children and produces pattern $toPattern.',
    ({ pattern, nodePath, nodeType, nodeChilds, expression, toPattern }) => {
      let node: ast.SyntaxTree = new ast.Root(pattern);
      for (let level = 1; level < nodePath.length; level++) {
        node = (node as any).children[nodePath[level]];
      }
      expect((node as any).type).toBe(nodeType);
      expect((node as any).children.length).toBe(nodeChilds);
      expect((node as any).expression).toBe(expression);
      if (node.type === 'Root') {
        expect((node as ast.Root).toPattern()).toBe(toPattern);
      } else {
        expect(node.toPattern(new ast.GroupsMapper())).toBe(toPattern);
      }
    }
  );
});

describe('Basic mixed AST.', () => {
  test.each`
    pattern   | nodePath | nodeType  | nodeChilds | expression   | toPattern
    ${'()|a'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((()))|(a)))'}
    ${'()a|'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((()))(a)|()))'}
    ${'(a)|'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)))|()))'}
    ${'a()|'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((a)((()))|()))'}
    ${'(|)a'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((()|()))(a)))'}
    ${'(|a)'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((()|(a)))))'}
    ${'(a|)'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((a)|()))))'}
    ${'a(|)'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((a)((()|()))))'}
    ${'|()a'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((()|((()))(a)))'}
    ${'|(a)'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((()|(((a)))))'}
    ${'|a()'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((()|(a)((()))))'}
    ${'a|()'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((a)|((()))))'}
    ${'()|'}  | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((()))|()))'}
    ${'(|)'}  | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((()|()))))'}
    ${'|()'}  | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((()|((()))))'}
  `(
    'Pattern $pattern should produce AST such that the node $nodePath has type $nodeType, has $nodeChilds children and produces pattern $toPattern.',
    ({ pattern, nodePath, nodeType, nodeChilds, expression, toPattern }) => {
      let node: ast.SyntaxTree = new ast.Root(pattern);
      for (let level = 1; level < nodePath.length; level++) {
        node = (node as any).children[nodePath[level]];
      }
      expect((node as any).type).toBe(nodeType);
      expect((node as any).children.length).toBe(nodeChilds);
      expect((node as any).expression).toBe(expression);
      if (node.type === 'Root') {
        expect((node as ast.Root).toPattern()).toBe(toPattern);
      } else {
        expect(node.toPattern(new ast.GroupsMapper())).toBe(toPattern);
      }
    }
  );
});

describe('Basic QuantifiedGroup AST.', () => {
  test.each`
    pattern    | nodePath | nodeType  | nodeChilds | expression   | toPattern
    ${'()()e'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((()))((()))(e)))'}
    ${'()(d)'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((()))(((d)))))'}
    ${'()c()'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((()))(c)((()))))'}
    ${'(b)()'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((b)))((()))))'}
    ${'a()()'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((a)((()))((()))))'}
    ${'()()'}  | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((()))((()))))'}
    ${'a(d)'}  | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((a)(((d)))))'}
    ${'(d)g'}  | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((d)))(g)))'}
    ${'()ghi'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((()))(ghi)))'}
    ${'()g'}   | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((()))(g)))'}
    ${'(def)'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((def)))))'}
    ${'(d)'}   | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((((d)))))'}
    ${'abc()'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((abc)((()))))'}
    ${'a()'}   | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((a)((()))))'}
    ${'()'}    | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((((()))))'}
  `(
    'Pattern $pattern should produce AST such that the node $nodePath has type $nodeType, has $nodeChilds children and produces pattern $toPattern.',
    ({ pattern, nodePath, nodeType, nodeChilds, expression, toPattern }) => {
      let node: ast.SyntaxTree = new ast.Root(pattern);
      for (let level = 1; level < nodePath.length; level++) {
        node = (node as any).children[nodePath[level]];
      }
      expect((node as any).type).toBe(nodeType);
      expect((node as any).children.length).toBe(nodeChilds);
      expect((node as any).expression).toBe(expression);
      if (node.type === 'Root') {
        expect((node as ast.Root).toPattern()).toBe(toPattern);
      } else {
        expect(node.toPattern(new ast.GroupsMapper())).toBe(toPattern);
      }
    }
  );
});

describe('Disjunction AST.', () => {
  test.each`
    pattern      | nodePath | nodeType  | nodeChilds | expression   | toPattern
    ${'a|b|c'}   | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((a)|(b)|(c)))'}
    ${'abc|def'} | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((abc)|(def)))'}
    ${'a|b'}     | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((a)|(b)))'}
    ${'|def'}    | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((()|(def)))'}
    ${'|d'}      | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((()|(d)))'}
    ${'abc|'}    | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((abc)|()))'}
    ${'a|'}      | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'(((a)|()))'}
    ${'|'}       | ${[0]}   | ${'Root'} | ${1}       | ${undefined} | ${'((()|()))'}
  `(
    'Pattern $pattern should produce AST such that the node $nodePath has type $nodeType, has $nodeChilds children and produces pattern $toPattern.',
    ({ pattern, nodePath, nodeType, nodeChilds, expression, toPattern }) => {
      let node: ast.SyntaxTree = new ast.Root(pattern);
      for (let level = 1; level < nodePath.length; level++) {
        node = (node as any).children[nodePath[level]];
      }
      expect((node as any).type).toBe(nodeType);
      expect((node as any).children.length).toBe(nodeChilds);
      expect((node as any).expression).toBe(expression);
      if (node.type === 'Root') {
        expect((node as ast.Root).toPattern()).toBe(toPattern);
      } else {
        expect(node.toPattern(new ast.GroupsMapper())).toBe(toPattern);
      }
    }
  );
});

describe('Simple AST.', () => {
  test.each`
    pattern  | nodePath           | nodeType         | nodeChilds | expression   | toPattern
    ${''}    | ${[0]}             | ${'Root'}        | ${1}       | ${undefined} | ${'((()))'}
    ${'abc'} | ${[0]}             | ${'Root'}        | ${1}       | ${undefined} | ${'(((abc)))'}
    ${'ab'}  | ${[0]}             | ${'Root'}        | ${1}       | ${undefined} | ${'(((ab)))'}
    ${'a'}   | ${[0, 0, 0, 0, 0]} | ${'Text'}        | ${0}       | ${'a'}       | ${'a'}
    ${'a'}   | ${[0, 0, 0, 0]}    | ${'Simple'}      | ${1}       | ${undefined} | ${'(a)'}
    ${'a'}   | ${[0, 0, 0]}       | ${'Alternative'} | ${1}       | ${undefined} | ${'(a)'}
    ${'a'}   | ${[0, 0]}          | ${'Disjunction'} | ${1}       | ${undefined} | ${'(a)'}
    ${'a'}   | ${[0]}             | ${'Root'}        | ${1}       | ${undefined} | ${'(((a)))'}
    ${''}    | ${[0, 0, 0, 0, 0]} | ${'Text'}        | ${0}       | ${''}        | ${''}
    ${''}    | ${[0, 0, 0, 0]}    | ${'Simple'}      | ${1}       | ${undefined} | ${'()'}
    ${''}    | ${[0, 0, 0]}       | ${'Alternative'} | ${1}       | ${undefined} | ${'()'}
    ${''}    | ${[0, 0]}          | ${'Disjunction'} | ${1}       | ${undefined} | ${'()'}
    ${''}    | ${[0]}             | ${'Root'}        | ${1}       | ${undefined} | ${'((()))'}
  `(
    'Pattern $pattern should produce AST such that the node $nodePath has type $nodeType, has $nodeChilds children and produces pattern $toPattern.',
    ({ pattern, nodePath, nodeType, nodeChilds, expression, toPattern }) => {
      let node: ast.SyntaxTree = new ast.Root(pattern);
      for (let level = 1; level < nodePath.length; level++) {
        node = (node as any).children[nodePath[level]];
      }
      expect((node as any).type).toBe(nodeType);
      expect((node as any).children.length).toBe(nodeChilds);
      expect((node as any).expression).toBe(expression);
      if (node.type === 'Root') {
        expect((node as ast.Root).toPattern()).toBe(toPattern);
      } else {
        expect(node.toPattern(new ast.GroupsMapper())).toBe(toPattern);
      }
    }
  );
});
