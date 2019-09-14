import { RegExact } from "../src/regexact";

function testingProcedure(
  { regexp,
    input,
    isExecNull,
    group, execLen,
    groupText,
    groupIndex }:
    {
      regexp: RegExp,
      input: string,
      isExecNull: boolean,
      group: number,
      execLen: number,
      groupText: string,
      groupIndex: number,
    }) {
  for (const isOptimized of [false, true]) {
    const regex = new RegExp(regexp);
    const regexExec = regex.exec(input);
    expect(regexExec === null).toBe(isExecNull);

    const regexact = new RegExact(regexp);
    const regexactExec = regexact.exec(input, isOptimized);
    expect(regexactExec === null).toBe(isExecNull);

    if (regexExec) {
      expect(regexExec.length).toBe(regexactExec.length);
      for (let i = 0; i < regexExec!.length; i++) {
        expect(regexExec[i]).toBe(regexactExec[i]);
      }
      expect(regexactExec.index).toBe(regexactExec.indexes[0]);
      expect(regexactExec.length).toBe(execLen);
      expect(regexactExec[group]).toBe(groupText);
      expect(regexactExec.indexes[group]).toBe(groupIndex);
    }
  }
}

describe("Simple regex with capturing groups on level 1.", () => {
  test.each`
      regexp                          | input                                            | isExecNull | group | execLen | groupText                  | groupIndex
      ${/quick\s(brown).+?(jumps)/gi} | ${"The Quick Brown Fox Jumps Over The Lazy Dog"} | ${false}   | ${2}  | ${3}    | ${"Jumps"}                 | ${20}
      ${/quick\s(brown).+?(jumps)/gi} | ${"The Quick Brown Fox Jumps Over The Lazy Dog"} | ${false}   | ${1}  | ${3}    | ${"Brown"}                 | ${10}
      ${/quick\s(brown).+?(jumps)/gi} | ${"The Quick Brown Fox Jumps Over The Lazy Dog"} | ${false}   | ${0}  | ${3}    | ${"Quick Brown Fox Jumps"} | ${4}
    `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple successful regex capturing groups on level 1 mixed group types and alternation .", () => {
  test.each`
  regexp              | input         | isExecNull | group | execLen | groupText | groupIndex
  ${/(?:b|a)([0-9])/} | ${"c1 b2 e3"} | ${false}   | ${1}  | ${2}    | ${"2"}    | ${4}
  ${/(?:b|a)([0-9])/} | ${"c1 b2 e3"} | ${false}   | ${0}  | ${2}    | ${"b2"}   | ${3}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple successful regex capturing groups on level 1 with named groups.", () => {
  test.each`
    regexp                                                     | input           | isExecNull | group | execLen | groupText       | groupIndex
    ${/(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/} | ${"1999-01-11"} | ${false}   | ${0}  | ${4}    | ${"1999-01-11"} | ${0}
    ${/([0-9]{4})-([0-9]{2})-([0-9]{2})/}                      | ${"1999-01-11"} | ${false}   | ${0}  | ${4}    | ${"1999-01-11"} | ${0}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple successful regex capturing groups on level 1 with backreferences.", () => {
  test.each`
    regexp                            | input              | isExecNull | group | execLen | groupText | groupIndex
    ${/(.)(.)()()()()()()()()(.)\11/} | ${"123446789ab\t"} | ${false}   | ${0}  | ${12}   | ${"2344"} | ${1}
    ${/(.)(.)\11/}                    | ${"1234\t"}        | ${false}   | ${0}  | ${3}    | ${"34\t"} | ${2}
    ${/(.)(.)\1\2/}                   | ${"123ababac"}     | ${false}   | ${0}  | ${3}    | ${"abab"} | ${3}
    ${/(.).\1\1/}                     | ${"123abaac"}      | ${false}   | ${0}  | ${2}    | ${"abaa"} | ${3}
    ${/(.).\1/}                       | ${"123aba"}        | ${false}   | ${0}  | ${2}    | ${"aba"}  | ${3}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple successful regex capturing groups on level 1 with alternation.", () => {
  test.each`
    regexp                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | input                                                         | isExecNull | group | execLen      | groupText                                                     | groupIndex
    ${/^(?:(?!ab|cd).)+$/m}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ${"This text matches because it doesn't contain them in it!"} | ${false}   | ${0}  | ${1}         | ${"This text matches because it doesn't contain them in it!"} | ${0}
    ${/#(?:[a-f\d]{3}){1,2}\b|rgb\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){2}\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)|\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%(?:\s*,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%){2})\s*\)|hsl\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2}\)|(?:rgba\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){3}|(?:\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*,){3})|hsla\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2},)\s*0*(?:1|0(?:\.\d+)?)\s*\)/} | ${"abcrgb(00010%, 0002%, 001%)"}                              | ${false}   | ${0}  | ${1}         | ${"rgb(00010%, 0002%, 001%)"}                                 | ${3}
    ${/#(?:[a-f\d]{3}){1,2}\b|rgb\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){2}\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)|\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%(?:\s*,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%){2})\s*\)|hsl\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2}\)|(?:rgba\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){3}|(?:\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*,){3})|hsla\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2},)\s*0*(?:1|0(?:\.\d+)?)\s*\)/} | ${"rgb(0,0,0)"}                                               | ${false}   | ${0}  | ${1}         | ${"rgb(0,0,0)"}                                               | ${0}
    ${/#(?:[a-f\d]{3}){1,2}\b|rgb\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){2}\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)|\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%(?:\s*,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%){2})\s*\)|hsl\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2}\)|(?:rgba\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){3}|(?:\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*,){3})|hsla\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2},)\s*0*(?:1|0(?:\.\d+)?)\s*\)/} | ${" #fff"}                                                    | ${false}   | ${0}  | ${1}         | ${"#fff"}                                                     | ${1}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${"$.20"}                                                     | ${false}   | ${14} | ${15}        | ${"20"}                                                       | ${2}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${"$.20"}                                                     | ${false}   | ${13} | ${15}        | ${"$."}                                                       | ${0}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${"$.20"}                                                     | ${false}   | ${12} | ${15}        | ${undefined}                                                  | ${undefined}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${"$.20"}                                                     | ${false}   | ${1}  | ${15}        | ${undefined}                                                  | ${undefined}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${"$.20"}                                                     | ${false}   | ${0}  | ${15}        | ${"$.20"}                                                     | ${0}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${"1213,120.00"}                                              | ${true}    | ${0}  | ${undefined} | ${undefined}                                                  | ${undefined}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${"$15,000,000.00"}                                           | ${false}   | ${5}  | ${15}        | ${undefined}                                                  | ${undefined}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${"$15,000,000.00"}                                           | ${false}   | ${4}  | ${15}        | ${".00"}                                                      | ${11}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${"$15,000,000.00"}                                           | ${false}   | ${3}  | ${15}        | ${",000"}                                                     | ${7}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${"$15,000,000.00"}                                           | ${false}   | ${2}  | ${15}        | ${"15"}                                                       | ${1}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${"$15,000,000.00"}                                           | ${false}   | ${1}  | ${15}        | ${"$"}                                                        | ${0}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${"$15,000,000.00"}                                           | ${false}   | ${0}  | ${15}        | ${"$15,000,000.00"}                                           | ${0}
    ${/^(?:(?!ab|cd).)+$/m}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ${"This text won't match because it does contain ab in it!"}  | ${true}    | ${0}  | ${undefined} | ${undefined}                                                  | ${undefined}
    ${/^(?:(?!ab|cd).)+$/m}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ${"This text matches because it doesn't contain them in it!"} | ${false}   | ${0}  | ${1}         | ${"This text matches because it doesn't contain them in it!"} | ${0}
    ${/(ab)|(cde)/}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | ${"cde"}                                                      | ${false}   | ${0}  | ${3}         | ${"cde"}                                                      | ${0}
    ${/(a|b)/}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | ${"edcba"}                                                    | ${false}   | ${0}  | ${2}         | ${"b"}                                                        | ${3}
    ${/\(./}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | ${"ab(cd"}                                                    | ${false}   | ${0}  | ${1}         | ${"(c"}                                                       | ${2}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple successful regex capturing groups on level 1 with alternation.", () => {
  test.each`
    regexp        | input    | group | isExecNull | execLen | groupText | groupIndex
    ${/ab|cd(e)/} | ${"cde"} | ${1}  | ${false}   | ${2}    | ${"e"}    | ${2}
    ${/ab|cd(e)/} | ${"cde"} | ${0}  | ${false}   | ${2}    | ${"cde"}  | ${0}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple regex capturing groups on level 1 that have undefined groups.", () => {
  test.each`
    regexp                | input           | isExecNull | group | execLen | groupText    | groupIndex
    ${/([a-z])?([1-9])?/} | ${"abcde12345"} | ${false}   | ${2}  | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])?([1-9])?/} | ${"abcde12345"} | ${false}   | ${1}  | ${3}    | ${"a"}       | ${0}
    ${/([a-z])?([1-9])?/} | ${"abcde12345"} | ${false}   | ${0}  | ${3}    | ${"a"}       | ${0}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple successful regex capturing groups on level 1 that are greedy quantified with {m,n}.", () => {
  test.each`
    regexp                   | input           | group | isExecNull | execLen      | groupText    | groupIndex
    ${/([a-z]){3,4}([1-9])/} | ${"abcde12345"} | ${2}  | ${false}   | ${3}         | ${"1"}       | ${5}
    ${/([a-z]){3,4}([1-9])/} | ${"abcde12345"} | ${1}  | ${false}   | ${3}         | ${"e"}       | ${4}
    ${/([a-z]){3,4}([1-9])/} | ${"abcde12345"} | ${0}  | ${false}   | ${3}         | ${"bcde1"}   | ${1}
    ${/([a-z]){3,4}(1)/}     | ${"a1"}         | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3,4}(1)/}         | ${"aa1"}        | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3,4}(1)/}         | ${"a1"}         | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/([a-z]){3,4}(1)/}     | ${"ab1"}        | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple successful regex capturing groups on level 1 that are greedy quantified with {m,}.", () => {
  test.each`
    regexp                  | input           | group | isExecNull | execLen      | groupText    | groupIndex
    ${/([a-z]){3,}([1-9])/} | ${"abcde12345"} | ${2}  | ${false}   | ${3}         | ${"1"}       | ${5}
    ${/([a-z]){3,}([1-9])/} | ${"abcde12345"} | ${1}  | ${false}   | ${3}         | ${"e"}       | ${4}
    ${/([a-z]){3,}([1-9])/} | ${"abcde12345"} | ${0}  | ${false}   | ${3}         | ${"abcde1"}  | ${0}
    ${/([a-z]){3,}(1)/}     | ${"a1"}         | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3,}(1)/}         | ${"aa1"}        | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3,}(1)/}         | ${"a1"}         | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/([a-z]){3,}(1)/}     | ${"ab1"}        | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple successful regex capturing groups on level 1 that are greedy quantified with {m}.", () => {
  test.each`
    regexp                 | input           | group | isExecNull | execLen      | groupText    | groupIndex
    ${/([a-z]){3}([1-9])/} | ${"abcde12345"} | ${2}  | ${false}   | ${3}         | ${"1"}       | ${5}
    ${/([a-z]){3}([1-9])/} | ${"abcde12345"} | ${1}  | ${false}   | ${3}         | ${"e"}       | ${4}
    ${/([a-z]){3}([1-9])/} | ${"abcde12345"} | ${0}  | ${false}   | ${3}         | ${"cde1"}    | ${2}
    ${/([a-z]){3}(1)/}     | ${"a1"}         | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3}(1)/}         | ${"aa1"}        | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3}(1)/}         | ${"a1"}         | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/([a-z]){3}(1)/}     | ${"ab1"}        | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple regex capturing groups on level 1 that are greedy quantified with ?.", () => {
  test.each`
    regexp               | input           | isExecNull | group | execLen | groupText | groupIndex
    ${/([a-z])?([1-9])/} | ${"abcde12345"} | ${false}   | ${2}  | ${3}    | ${"1"}    | ${5}
    ${/([a-z])?([1-9])/} | ${"abcde12345"} | ${false}   | ${1}  | ${3}    | ${"e"}    | ${4}
    ${/([a-z])?(1)/}     | ${"a1"}         | ${false}   | ${2}  | ${3}    | ${"1"}    | ${1}
    ${/([a-z])?(1)/}     | ${"a1"}         | ${false}   | ${1}  | ${3}    | ${"a"}    | ${0}
    ${/(a)?(1)/}         | ${"aa1"}        | ${false}   | ${2}  | ${3}    | ${"1"}    | ${2}
    ${/(a)?(1)/}         | ${"aa1"}        | ${false}   | ${1}  | ${3}    | ${"a"}    | ${1}
    ${/(a)?(1)/}         | ${"aa1"}        | ${false}   | ${0}  | ${3}    | ${"a1"}   | ${1}
    ${/(a)?(1)/}         | ${"a1"}         | ${false}   | ${2}  | ${3}    | ${"1"}    | ${1}
    ${/(a)?(1)/}         | ${"a1"}         | ${false}   | ${1}  | ${3}    | ${"a"}    | ${0}
    ${/([a-z])?(1)/}     | ${"ab1"}        | ${false}   | ${2}  | ${3}    | ${"1"}    | ${2}
    ${/([a-z])?(1)/}     | ${"ab1"}        | ${false}   | ${1}  | ${3}    | ${"b"}    | ${1}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple regex capturing groups on level 1 that are greedy quantified with +.", () => {
  test.each`
    regexp                | input           | isExecNull | group | execLen | groupText | groupIndex
    ${/([a-z])+([1-9])+/} | ${"abcde12345"} | ${false}   | ${2}  | ${3}    | ${"5"}    | ${9}
    ${/([a-z])+([1-9])+/} | ${"abcde12345"} | ${false}   | ${1}  | ${3}    | ${"e"}    | ${4}
    ${/([a-z])+([1-9])/}  | ${"abcde12345"} | ${false}   | ${2}  | ${3}    | ${"1"}    | ${5}
    ${/([a-z])+([1-9])/}  | ${"abcde12345"} | ${false}   | ${1}  | ${3}    | ${"e"}    | ${4}
    ${/([a-z])+(1)/}      | ${"ab1"}        | ${false}   | ${2}  | ${3}    | ${"1"}    | ${2}
    ${/([a-z])+(1)/}      | ${"ab1"}        | ${false}   | ${1}  | ${3}    | ${"b"}    | ${1}
    ${/([a-z])+(1)/}      | ${"a1"}         | ${false}   | ${2}  | ${3}    | ${"1"}    | ${1}
    ${/([a-z])+(1)/}      | ${"a1"}         | ${false}   | ${1}  | ${3}    | ${"a"}    | ${0}
    ${/(a)+(1)/}          | ${"aa1"}        | ${false}   | ${2}  | ${3}    | ${"1"}    | ${2}
    ${/(a)+(1)/}          | ${"aa1"}        | ${false}   | ${1}  | ${3}    | ${"a"}    | ${1}
    ${/(a)+(1)/}          | ${"a1"}         | ${false}   | ${2}  | ${3}    | ${"1"}    | ${1}
    ${/(a)+(1)/}          | ${"a1"}         | ${false}   | ${1}  | ${3}    | ${"a"}    | ${0}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple regex capturing groups on level 1 that are lazy quantified with *.", () => {
  test.each`
    regexp                  | input           | isExecNull | group | isExecNull | execLen | groupText    | groupIndex
    ${/([a-z])*([1-9])*?/}  | ${"abcde12345"} | ${false}   | ${2}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*([1-9])*?/}  | ${"abcde12345"} | ${false}   | ${1}  | ${false}   | ${3}    | ${"e"}       | ${4}
    ${/([a-z])*([1-9])*?/}  | ${"abcde12345"} | ${false}   | ${0}  | ${false}   | ${3}    | ${"abcde"}   | ${0}
    ${/([a-z])*?([1-9])*?/} | ${"abcde12345"} | ${false}   | ${2}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*?([1-9])*?/} | ${"abcde12345"} | ${false}   | ${1}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*?([1-9])*?/} | ${"abcde12345"} | ${false}   | ${0}  | ${false}   | ${3}    | ${""}        | ${0}
    ${/([a-z])*?([1-9])*/}  | ${"abcde12345"} | ${false}   | ${2}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*?([1-9])*/}  | ${"abcde12345"} | ${false}   | ${1}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*?([1-9])*/}  | ${"abcde12345"} | ${false}   | ${0}  | ${false}   | ${3}    | ${""}        | ${0}
    ${/([a-z])*?([1-9])/}   | ${"abcde12345"} | ${false}   | ${2}  | ${false}   | ${3}    | ${"1"}       | ${5}
    ${/([a-z])*?([1-9])/}   | ${"abcde12345"} | ${false}   | ${1}  | ${false}   | ${3}    | ${"e"}       | ${4}
    ${/([a-z])*?([1-9])/}   | ${"abcde12345"} | ${false}   | ${0}  | ${false}   | ${3}    | ${"abcde1"}  | ${0}
    ${/([a-z])*?(1)/}       | ${"ab1"}        | ${false}   | ${2}  | ${false}   | ${3}    | ${"1"}       | ${2}
    ${/([a-z])*?(1)/}       | ${"ab1"}        | ${false}   | ${1}  | ${false}   | ${3}    | ${"b"}       | ${1}
    ${/([a-z])*?(1)/}       | ${"ab1"}        | ${false}   | ${0}  | ${false}   | ${3}    | ${"ab1"}     | ${0}
    ${/([a-z])*?(1)/}       | ${"a1"}         | ${false}   | ${2}  | ${false}   | ${3}    | ${"1"}       | ${1}
    ${/([a-z])*?(1)/}       | ${"a1"}         | ${false}   | ${1}  | ${false}   | ${3}    | ${"a"}       | ${0}
    ${/([a-z])*?(1)/}       | ${"a1"}         | ${false}   | ${0}  | ${false}   | ${3}    | ${"a1"}      | ${0}
    ${/(a)*?(1)/}           | ${"aa1"}        | ${false}   | ${2}  | ${false}   | ${3}    | ${"1"}       | ${2}
    ${/(a)*?(1)/}           | ${"aa1"}        | ${false}   | ${1}  | ${false}   | ${3}    | ${"a"}       | ${1}
    ${/(a)*?(1)/}           | ${"aa1"}        | ${false}   | ${0}  | ${false}   | ${3}    | ${"aa1"}     | ${0}
    ${/(a)*?(1)/}           | ${"a1"}         | ${false}   | ${2}  | ${false}   | ${3}    | ${"1"}       | ${1}
    ${/(a)*?(1)/}           | ${"a1"}         | ${false}   | ${1}  | ${false}   | ${3}    | ${"a"}       | ${0}
    ${/(a)*?(1)/}           | ${"a1"}         | ${false}   | ${0}  | ${false}   | ${3}    | ${"a1"}      | ${0}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple regex capturing groups on level 1 that are greedy quantified with *.", () => {
  test.each`
    regexp                | input           | isExecNull | group | execLen | groupText | groupIndex
    ${/([a-z])*([1-9])*/} | ${"abcde12345"} | ${false}   | ${2}  | ${3}    | ${"5"}    | ${9}
    ${/([a-z])*([1-9])*/} | ${"abcde12345"} | ${false}   | ${1}  | ${3}    | ${"e"}    | ${4}
    ${/([a-z])*([1-9])/}  | ${"abcde12345"} | ${false}   | ${2}  | ${3}    | ${"1"}    | ${5}
    ${/([a-z])*([1-9])/}  | ${"abcde12345"} | ${false}   | ${1}  | ${3}    | ${"e"}    | ${4}
    ${/([a-z])*(1)/}      | ${"ab1"}        | ${false}   | ${2}  | ${3}    | ${"1"}    | ${2}
    ${/([a-z])*(1)/}      | ${"ab1"}        | ${false}   | ${1}  | ${3}    | ${"b"}    | ${1}
    ${/([a-z])*(1)/}      | ${"a1"}         | ${false}   | ${2}  | ${3}    | ${"1"}    | ${1}
    ${/([a-z])*(1)/}      | ${"a1"}         | ${false}   | ${1}  | ${3}    | ${"a"}    | ${0}
    ${/(a)*(1)/}          | ${"aa1"}        | ${false}   | ${2}  | ${3}    | ${"1"}    | ${2}
    ${/(a)*(1)/}          | ${"aa1"}        | ${false}   | ${1}  | ${3}    | ${"a"}    | ${1}
    ${/(a)*(1)/}          | ${"a1"}         | ${false}   | ${2}  | ${3}    | ${"1"}    | ${1}
    ${/(a)*(1)/}          | ${"a1"}         | ${false}   | ${1}  | ${3}    | ${"a"}    | ${0}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("Simple regex with capturing groups on level 1.", () => {
  test.each`
    regexp                          | input                                            | isExecNull | group | execLen | groupText                  | groupIndex
    ${/a(.*)(b)b/}                  | ${"aaaaabbbbb"}                                  | ${false}   | ${2}  | ${3}    | ${"b"}                     | ${8}
    ${/a(.*)(b)b/}                  | ${"aaaaabbbbb"}                                  | ${false}   | ${1}  | ${3}    | ${"aaaabbb"}               | ${1}
    ${/a(.*)(b)b/}                  | ${"aaaaabbbbb"}                                  | ${false}   | ${0}  | ${3}    | ${"aaaaabbbbb"}            | ${0}
    ${/a(a)b(b)b/}                  | ${"aaaaabbbbb"}                                  | ${false}   | ${2}  | ${3}    | ${"b"}                     | ${6}
    ${/a(a)b(b)b/}                  | ${"aaaaabbbbb"}                                  | ${false}   | ${1}  | ${3}    | ${"a"}                     | ${4}
    ${/a(a)b(b)b/}                  | ${"aaaaabbbbb"}                                  | ${false}   | ${0}  | ${3}    | ${"aabbb"}                 | ${3}
    ${/quick\s(brown).+?(jumps)/gi} | ${"The Quick Brown Fox Jumps Over The Lazy Dog"} | ${false}   | ${2}  | ${3}    | ${"Jumps"}                 | ${20}
    ${/quick\s(brown).+?(jumps)/gi} | ${"The Quick Brown Fox Jumps Over The Lazy Dog"} | ${false}   | ${1}  | ${3}    | ${"Brown"}                 | ${10}
    ${/quick\s(brown).+?(jumps)/gi} | ${"The Quick Brown Fox Jumps Over The Lazy Dog"} | ${false}   | ${0}  | ${3}    | ${"Quick Brown Fox Jumps"} | ${4}
    ${/a(b)(c)/}                    | ${"abc"}                                         | ${false}   | ${2}  | ${3}    | ${"c"}                     | ${2}
    ${/a(b)(c)/}                    | ${"abc"}                                         | ${false}   | ${1}  | ${3}    | ${"b"}                     | ${1}
    ${/a(b)(c)/}                    | ${"abc"}                                         | ${false}   | ${0}  | ${3}    | ${"abc"}                   | ${0}
    ${/.*(b)/}                      | ${"aaaaabbbbb"}                                  | ${false}   | ${1}  | ${2}    | ${"b"}                     | ${9}
    ${/.*(b)/}                      | ${"aaaaabbbbb"}                                  | ${false}   | ${0}  | ${2}    | ${"aaaaabbbbb"}            | ${0}
    ${/a(b)/}                       | ${"ab"}                                          | ${false}   | ${0}  | ${2}    | ${"ab"}                    | ${0}
  `(
    "$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.",
    testingProcedure,
  );
});

describe("RegExact object constructed from regex string and flags string", () => {
  test.each`
    regexpString                   | flags   | input                                            | match
    ${"quick\\s(brown).+?(jumps)"} | ${"ig"} | ${"The Quick Brown Fox Jumps Over The Lazy Dog"} | ${"Quick Brown Fox Jumps"}
  `(
    "$regexpString with flags $flags on string $input should match $match",
    ({ regexpString, flags, input, match }) => {
      const regexact = new RegExact(new RegExp(regexpString, flags));
      const result = regexact.exec(input);
      expect(result[0]).toBe(match);
    },
  );
});

describe("RegExact object constructed from RegExp object", () => {
  test.each`
    regexp                          | input                                            | match
    ${/quick\s(brown).+?(jumps)/gi} | ${"The Quick Brown Fox Jumps Over The Lazy Dog"} | ${"Quick Brown Fox Jumps"}
  `(
    "$regexp on string $input should match $match",
    ({ regexp, input, match }) => {
      const regexact = new RegExact(new RegExp(regexp));
      const result = regexact.exec(input);
      expect(result[0]).toBe(match);
    },
  );
});

describe("RegExact object constructed from regex literal", () => {
  test.each`
    regexp                          | input                                            | match
    ${/quick\s(brown).+?(jumps)/gi} | ${"The Quick Brown Fox Jumps Over The Lazy Dog"} | ${"Quick Brown Fox Jumps"}
    ${/a/gi}                        | ${"abc"}                                         | ${"a"}
  `(
    "$regexp on string $input should match $match",
    ({ regexp, input, match }) => {
      const regexact = new RegExact(regexp);
      const result = regexact.exec(input);
      expect(result[0]).toBe(match);
    },
  );
});
