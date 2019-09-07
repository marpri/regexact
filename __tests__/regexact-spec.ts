import { RegExact } from '../src/regexact';

describe('Simple successful regex capturing groups on level 1 with alternation.', () => {
  test.each`
    regexp                                                     | input           | optimization | group | isExecNull | execLen | groupText       | groupIndex
    ${/(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/} | ${'1999-01-11'} | ${true}      | ${0}  | ${false}   | ${4}    | ${'1999-01-11'} | ${0}
    ${/([0-9]{4})-([0-9]{2})-([0-9]{2})/}                      | ${'1999-01-11'} | ${true}      | ${0}  | ${false}   | ${4}    | ${'1999-01-11'} | ${0}
    ${/(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/} | ${'1999-01-11'} | ${false}     | ${0}  | ${false}   | ${4}    | ${'1999-01-11'} | ${0}
    ${/([0-9]{4})-([0-9]{2})-([0-9]{2})/}                      | ${'1999-01-11'} | ${false}     | ${0}  | ${false}   | ${4}    | ${'1999-01-11'} | ${0}
  `(
    '$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.',
    ({ regexp, input, optimization, isExecNull, group, execLen, groupText, groupIndex }) => {
      const regex = new RegExp(regexp);
      const regExact = new RegExact(regexp);
      const regexRetVal = regex.exec(input);
      const exactExecValue = regExact.exec(input, optimization);
      expect(exactExecValue === null).toBe(isExecNull);
      if (regexRetVal) {
        for (let i = 0; i < regexRetVal!.length; i++) {
          expect(regexRetVal[i]).toBe(exactExecValue[i]);
        }
        expect(exactExecValue.index).toBe(exactExecValue.indexes[0]);
        expect(exactExecValue.length).toBe(execLen);
        expect(exactExecValue[group]).toBe(groupText);
        expect(exactExecValue.indexes[group]).toBe(groupIndex);
      }
    }
  );
});

describe('Simple successful regex capturing groups on level 1 with alternation.', () => {
  test.each`
    regexp                            | input              | optimization | group | isExecNull | execLen | groupText | groupIndex
    ${/(.)(.)()()()()()()()()(.)\11/} | ${'123446789ab\t'} | ${true}      | ${0}  | ${false}   | ${12}   | ${'2344'} | ${1}
    ${/(.)(.)\11/}                    | ${'1234\t'}        | ${true}      | ${0}  | ${false}   | ${3}    | ${'34\t'} | ${2}
    ${/(.)(.)\1\2/}                   | ${'123ababac'}     | ${true}      | ${0}  | ${false}   | ${3}    | ${'abab'} | ${3}
    ${/(.).\1\1/}                     | ${'123abaac'}      | ${true}      | ${0}  | ${false}   | ${2}    | ${'abaa'} | ${3}
    ${/(.).\1/}                       | ${'123aba'}        | ${true}      | ${0}  | ${false}   | ${2}    | ${'aba'}  | ${3}
    ${/(.)(.)()()()()()()()()(.)\11/} | ${'123446789ab\t'} | ${false}     | ${0}  | ${false}   | ${12}   | ${'2344'} | ${1}
    ${/(.)(.)\11/}                    | ${'1234\t'}        | ${false}     | ${0}  | ${false}   | ${3}    | ${'34\t'} | ${2}
    ${/(.)(.)\1\2/}                   | ${'123ababac'}     | ${false}     | ${0}  | ${false}   | ${3}    | ${'abab'} | ${3}
    ${/(.).\1\1/}                     | ${'123abaac'}      | ${false}     | ${0}  | ${false}   | ${2}    | ${'abaa'} | ${3}
    ${/(.).\1/}                       | ${'123aba'}        | ${false}     | ${0}  | ${false}   | ${2}    | ${'aba'}  | ${3}
  `(
    '$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.',
    ({ regexp, input, optimization, isExecNull, group, execLen, groupText, groupIndex }) => {
      const regex = new RegExp(regexp);
      const regExact = new RegExact(regexp);
      const regexRetVal = regex.exec(input);
      const exactExecValue = regExact.exec(input, optimization);
      expect(exactExecValue === null).toBe(isExecNull);
      if (regexRetVal) {
        for (let i = 0; i < regexRetVal!.length; i++) {
          expect(regexRetVal[i]).toBe(exactExecValue[i]);
        }
        expect(exactExecValue.index).toBe(exactExecValue.indexes[0]);
        expect(exactExecValue.length).toBe(execLen);
        expect(exactExecValue[group]).toBe(groupText);
        expect(exactExecValue.indexes[group]).toBe(groupIndex);
      }
    }
  );
});

describe('Simple successful regex capturing groups on level 1 with alternation.', () => {
  test.each`
    regexp                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | input                                                         | optimization | group | isExecNull | execLen      | groupText                                                     | groupIndex
    ${/^(?:(?!ab|cd).)+$/m}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ${"This text matches because it doesn't contain them in it!"} | ${true}      | ${0}  | ${false}   | ${1}         | ${"This text matches because it doesn't contain them in it!"} | ${0}
    ${/#(?:[a-f\d]{3}){1,2}\b|rgb\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){2}\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)|\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%(?:\s*,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%){2})\s*\)|hsl\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2}\)|(?:rgba\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){3}|(?:\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*,){3})|hsla\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2},)\s*0*(?:1|0(?:\.\d+)?)\s*\)/} | ${'abcrgb(00010%, 0002%, 001%)'}                              | ${true}      | ${0}  | ${false}   | ${1}         | ${'rgb(00010%, 0002%, 001%)'}                                 | ${3}
    ${/#(?:[a-f\d]{3}){1,2}\b|rgb\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){2}\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)|\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%(?:\s*,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%){2})\s*\)|hsl\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2}\)|(?:rgba\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){3}|(?:\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*,){3})|hsla\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2},)\s*0*(?:1|0(?:\.\d+)?)\s*\)/} | ${'rgb(0,0,0)'}                                               | ${true}      | ${0}  | ${false}   | ${1}         | ${'rgb(0,0,0)'}                                               | ${0}
    ${/#(?:[a-f\d]{3}){1,2}\b|rgb\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){2}\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)|\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%(?:\s*,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%){2})\s*\)|hsl\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2}\)|(?:rgba\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){3}|(?:\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*,){3})|hsla\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2},)\s*0*(?:1|0(?:\.\d+)?)\s*\)/} | ${' #fff'}                                                    | ${true}      | ${0}  | ${false}   | ${1}         | ${'#fff'}                                                     | ${1}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$.20'}                                                     | ${true}      | ${14} | ${false}   | ${15}        | ${'20'}                                                       | ${2}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$.20'}                                                     | ${true}      | ${13} | ${false}   | ${15}        | ${'$.'}                                                       | ${0}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$.20'}                                                     | ${true}      | ${12} | ${false}   | ${15}        | ${undefined}                                                  | ${undefined}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$.20'}                                                     | ${true}      | ${1}  | ${false}   | ${15}        | ${undefined}                                                  | ${undefined}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$.20'}                                                     | ${true}      | ${0}  | ${false}   | ${15}        | ${'$.20'}                                                     | ${0}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'1213,120.00'}                                              | ${true}      | ${0}  | ${true}    | ${undefined} | ${undefined}                                                  | ${undefined}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$15,000,000.00'}                                           | ${true}      | ${5}  | ${false}   | ${15}        | ${undefined}                                                  | ${undefined}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$15,000,000.00'}                                           | ${true}      | ${4}  | ${false}   | ${15}        | ${'.00'}                                                      | ${11}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$15,000,000.00'}                                           | ${true}      | ${3}  | ${false}   | ${15}        | ${',000'}                                                     | ${7}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$15,000,000.00'}                                           | ${true}      | ${2}  | ${false}   | ${15}        | ${'15'}                                                       | ${1}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$15,000,000.00'}                                           | ${true}      | ${1}  | ${false}   | ${15}        | ${'$'}                                                        | ${0}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$15,000,000.00'}                                           | ${true}      | ${0}  | ${false}   | ${15}        | ${'$15,000,000.00'}                                           | ${0}
    ${/^(?:(?!ab|cd).)+$/m}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ${"This text won't match because it does contain ab in it!"}  | ${true}      | ${0}  | ${true}    | ${undefined} | ${undefined}                                                  | ${undefined}
    ${/^(?:(?!ab|cd).)+$/m}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ${"This text matches because it doesn't contain them in it!"} | ${true}      | ${0}  | ${false}   | ${1}         | ${"This text matches because it doesn't contain them in it!"} | ${0}
    ${/(ab)|(cde)/}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | ${'cde'}                                                      | ${true}      | ${0}  | ${false}   | ${3}         | ${'cde'}                                                      | ${0}
    ${/(a|b)/}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | ${'edcba'}                                                    | ${true}      | ${0}  | ${false}   | ${2}         | ${'b'}                                                        | ${3}
    ${/\(./}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | ${'ab(cd'}                                                    | ${true}      | ${0}  | ${false}   | ${1}         | ${'(c'}                                                       | ${2}
    ${/^(?:(?!ab|cd).)+$/m}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ${"This text matches because it doesn't contain them in it!"} | ${false}     | ${0}  | ${false}   | ${1}         | ${"This text matches because it doesn't contain them in it!"} | ${0}
    ${/#(?:[a-f\d]{3}){1,2}\b|rgb\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){2}\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)|\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%(?:\s*,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%){2})\s*\)|hsl\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2}\)|(?:rgba\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){3}|(?:\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*,){3})|hsla\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2},)\s*0*(?:1|0(?:\.\d+)?)\s*\)/} | ${'abcrgb(00010%, 0002%, 001%)'}                              | ${false}     | ${0}  | ${false}   | ${1}         | ${'rgb(00010%, 0002%, 001%)'}                                 | ${3}
    ${/#(?:[a-f\d]{3}){1,2}\b|rgb\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){2}\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)|\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%(?:\s*,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%){2})\s*\)|hsl\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2}\)|(?:rgba\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){3}|(?:\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*,){3})|hsla\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2},)\s*0*(?:1|0(?:\.\d+)?)\s*\)/} | ${'rgb(0,0,0)'}                                               | ${false}     | ${0}  | ${false}   | ${1}         | ${'rgb(0,0,0)'}                                               | ${0}
    ${/#(?:[a-f\d]{3}){1,2}\b|rgb\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){2}\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)|\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%(?:\s*,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%){2})\s*\)|hsl\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2}\)|(?:rgba\((?:(?:\s*0*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,){3}|(?:\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*,){3})|hsla\(\s*0*(?:360|3[0-5]\d|[12]?\d?\d)\s*(?:,\s*0*(?:100(?:\.0+)?|\d?\d(?:\.\d+)?)%\s*){2},)\s*0*(?:1|0(?:\.\d+)?)\s*\)/} | ${' #fff'}                                                    | ${false}     | ${0}  | ${false}   | ${1}         | ${'#fff'}                                                     | ${1}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$.20'}                                                     | ${false}     | ${14} | ${false}   | ${15}        | ${'20'}                                                       | ${2}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$.20'}                                                     | ${false}     | ${13} | ${false}   | ${15}        | ${'$.'}                                                       | ${0}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$.20'}                                                     | ${false}     | ${12} | ${false}   | ${15}        | ${undefined}                                                  | ${undefined}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$.20'}                                                     | ${false}     | ${1}  | ${false}   | ${15}        | ${undefined}                                                  | ${undefined}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$.20'}                                                     | ${false}     | ${0}  | ${false}   | ${15}        | ${'$.20'}                                                     | ${0}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'1213,120.00'}                                              | ${false}     | ${0}  | ${true}    | ${undefined} | ${undefined}                                                  | ${undefined}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$15,000,000.00'}                                           | ${false}     | ${5}  | ${false}   | ${15}        | ${undefined}                                                  | ${undefined}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$15,000,000.00'}                                           | ${false}     | ${4}  | ${false}   | ${15}        | ${'.00'}                                                      | ${11}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$15,000,000.00'}                                           | ${false}     | ${3}  | ${false}   | ${15}        | ${',000'}                                                     | ${7}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$15,000,000.00'}                                           | ${false}     | ${2}  | ${false}   | ${15}        | ${'15'}                                                       | ${1}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$15,000,000.00'}                                           | ${false}     | ${1}  | ${false}   | ${15}        | ${'$'}                                                        | ${0}
    ${/^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/}                                                                                                                                                                                                                                                                                                                                                                                         | ${'$15,000,000.00'}                                           | ${false}     | ${0}  | ${false}   | ${15}        | ${'$15,000,000.00'}                                           | ${0}
    ${/^(?:(?!ab|cd).)+$/m}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ${"This text won't match because it does contain ab in it!"}  | ${false}     | ${0}  | ${true}    | ${undefined} | ${undefined}                                                  | ${undefined}
    ${/^(?:(?!ab|cd).)+$/m}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ${"This text matches because it doesn't contain them in it!"} | ${false}     | ${0}  | ${false}   | ${1}         | ${"This text matches because it doesn't contain them in it!"} | ${0}
    ${/(ab)|(cde)/}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | ${'cde'}                                                      | ${false}     | ${0}  | ${false}   | ${3}         | ${'cde'}                                                      | ${0}
    ${/(a|b)/}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | ${'edcba'}                                                    | ${false}     | ${0}  | ${false}   | ${2}         | ${'b'}                                                        | ${3}
    ${/\(./}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | ${'ab(cd'}                                                    | ${false}     | ${0}  | ${false}   | ${1}         | ${'(c'}                                                       | ${2}
  `(
    '$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.',
    ({ regexp, input, optimization, isExecNull, group, execLen, groupText, groupIndex }) => {
      const regex = new RegExp(regexp);
      const regExact = new RegExact(regexp);
      const regexRetVal = regex.exec(input);
      const exactExecValue = regExact.exec(input, optimization);
      expect(exactExecValue === null).toBe(isExecNull);
      if (regexRetVal) {
        for (let i = 0; i < regexRetVal!.length; i++) {
          expect(regexRetVal[i]).toBe(exactExecValue[i]);
        }
        expect(exactExecValue.index).toBe(exactExecValue.indexes[0]);
        expect(exactExecValue.length).toBe(execLen);
        expect(exactExecValue[group]).toBe(groupText);
        expect(exactExecValue.indexes[group]).toBe(groupIndex);
      }
    }
  );
});

describe('Simple successful regex capturing groups on level 1 with alternation.', () => {
  test.each`
    regexp        | input    | optimization | group | isExecNull | execLen | groupText | groupIndex
    ${/ab|cd(e)/} | ${'cde'} | ${true}      | ${1}  | ${false}   | ${2}    | ${'e'}    | ${2}
    ${/ab|cd(e)/} | ${'cde'} | ${true}      | ${0}  | ${false}   | ${2}    | ${'cde'}  | ${0}
    ${/ab|cd(e)/} | ${'cde'} | ${false}     | ${1}  | ${false}   | ${2}    | ${'e'}    | ${2}
    ${/ab|cd(e)/} | ${'cde'} | ${false}     | ${0}  | ${false}   | ${2}    | ${'cde'}  | ${0}
  `(
    '$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.',
    ({ regexp, input, optimization, isExecNull, group, execLen, groupText, groupIndex }) => {
      const regex = new RegExp(regexp);
      const regExact = new RegExact(regexp);
      const regexRetVal = regex.exec(input);
      const exactExecValue = regExact.exec(input, optimization);
      expect(exactExecValue === null).toBe(isExecNull);
      if (regexRetVal) {
        for (let i = 0; i < regexRetVal!.length; i++) {
          expect(regexRetVal[i]).toBe(exactExecValue[i]);
        }
        expect(exactExecValue.index).toBe(exactExecValue.indexes[0]);
        expect(exactExecValue.length).toBe(execLen);
        expect(exactExecValue[group]).toBe(groupText);
        expect(exactExecValue.indexes[group]).toBe(groupIndex);
      }
    }
  );
});

describe('Simple regex capturing groups on level 1 that have undefined groups.', () => {
  test.each`
    regexp                | input           | optimization | group | execLen | groupText    | groupIndex
    ${/([a-z])?([1-9])?/} | ${'abcde12345'} | ${true}      | ${2}  | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])?([1-9])?/} | ${'abcde12345'} | ${true}      | ${1}  | ${3}    | ${'a'}       | ${0}
    ${/([a-z])?([1-9])?/} | ${'abcde12345'} | ${true}      | ${0}  | ${3}    | ${'a'}       | ${0}
    ${/([a-z])?([1-9])?/} | ${'abcde12345'} | ${false}     | ${2}  | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])?([1-9])?/} | ${'abcde12345'} | ${false}     | ${1}  | ${3}    | ${'a'}       | ${0}
    ${/([a-z])?([1-9])?/} | ${'abcde12345'} | ${false}     | ${0}  | ${3}    | ${'a'}       | ${0}
  `(
    '$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.',
    ({ regexp, input, optimization, group, execLen, groupText, groupIndex }) => {
      const regex = new RegExp(regexp);
      const regExact = new RegExact(regexp);
      const regexRetVal = regex.exec(input);
      const exactExecValue = regExact.exec(input, optimization);
      for (let i = 0; i < regexRetVal!.length; i++) {
        expect(regexRetVal![i]).toBe(exactExecValue![i]);
      }
      expect(exactExecValue.index).toBe(exactExecValue.indexes[0]);
      expect(exactExecValue.length).toBe(execLen);
      expect(exactExecValue[group]).toBe(groupText);
      expect(exactExecValue.indexes[group]).toBe(groupIndex);
    }
  );
});

describe('Simple successful regex capturing groups on level 1 that are greedy quantified with {m,n}.', () => {
  test.each`
    regexp                   | input           | optimization | group | isExecNull | execLen      | groupText    | groupIndex
    ${/([a-z]){3,4}([1-9])/} | ${'abcde12345'} | ${true}      | ${2}  | ${false}   | ${3}         | ${'1'}       | ${5}
    ${/([a-z]){3,4}([1-9])/} | ${'abcde12345'} | ${true}      | ${1}  | ${false}   | ${3}         | ${'e'}       | ${4}
    ${/([a-z]){3,4}([1-9])/} | ${'abcde12345'} | ${true}      | ${0}  | ${false}   | ${3}         | ${'bcde1'}   | ${1}
    ${/([a-z]){3,4}(1)/}     | ${'a1'}         | ${true}      | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3,4}(1)/}         | ${'aa1'}        | ${true}      | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3,4}(1)/}         | ${'a1'}         | ${true}      | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/([a-z]){3,4}(1)/}     | ${'ab1'}        | ${true}      | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/([a-z]){3,4}([1-9])/} | ${'abcde12345'} | ${false}     | ${2}  | ${false}   | ${3}         | ${'1'}       | ${5}
    ${/([a-z]){3,4}([1-9])/} | ${'abcde12345'} | ${false}     | ${1}  | ${false}   | ${3}         | ${'e'}       | ${4}
    ${/([a-z]){3,4}([1-9])/} | ${'abcde12345'} | ${false}     | ${0}  | ${false}   | ${3}         | ${'bcde1'}   | ${1}
    ${/([a-z]){3,4}(1)/}     | ${'a1'}         | ${false}     | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3,4}(1)/}         | ${'aa1'}        | ${false}     | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3,4}(1)/}         | ${'a1'}         | ${false}     | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/([a-z]){3,4}(1)/}     | ${'ab1'}        | ${false}     | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
  `(
    '$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.',
    ({ regexp, input, optimization, isExecNull, group, execLen, groupText, groupIndex }) => {
      const regex = new RegExp(regexp);
      const regExact = new RegExact(regexp);
      const regexRetVal = regex.exec(input);
      const exactExecValue = regExact.exec(input, optimization);
      expect(exactExecValue === null).toBe(isExecNull);
      if (regexRetVal) {
        for (let i = 0; i < regexRetVal!.length; i++) {
          expect(regexRetVal[i]).toBe(exactExecValue[i]);
        }
        expect(exactExecValue.index).toBe(exactExecValue.indexes[0]);
        expect(exactExecValue.length).toBe(execLen);
        expect(exactExecValue[group]).toBe(groupText);
        expect(exactExecValue.indexes[group]).toBe(groupIndex);
      }
    }
  );
});

describe('Simple successful regex capturing groups on level 1 that are greedy quantified with {m,}.', () => {
  test.each`
    regexp                  | input           | optimization | group | isExecNull | execLen      | groupText    | groupIndex
    ${/([a-z]){3,}([1-9])/} | ${'abcde12345'} | ${true}      | ${2}  | ${false}   | ${3}         | ${'1'}       | ${5}
    ${/([a-z]){3,}([1-9])/} | ${'abcde12345'} | ${true}      | ${1}  | ${false}   | ${3}         | ${'e'}       | ${4}
    ${/([a-z]){3,}([1-9])/} | ${'abcde12345'} | ${true}      | ${0}  | ${false}   | ${3}         | ${'abcde1'}  | ${0}
    ${/([a-z]){3,}(1)/}     | ${'a1'}         | ${true}      | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3,}(1)/}         | ${'aa1'}        | ${true}      | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3,}(1)/}         | ${'a1'}         | ${true}      | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/([a-z]){3,}(1)/}     | ${'ab1'}        | ${true}      | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/([a-z]){3,}([1-9])/} | ${'abcde12345'} | ${false}     | ${2}  | ${false}   | ${3}         | ${'1'}       | ${5}
    ${/([a-z]){3,}([1-9])/} | ${'abcde12345'} | ${false}     | ${1}  | ${false}   | ${3}         | ${'e'}       | ${4}
    ${/([a-z]){3,}([1-9])/} | ${'abcde12345'} | ${false}     | ${0}  | ${false}   | ${3}         | ${'abcde1'}  | ${0}
    ${/([a-z]){3,}(1)/}     | ${'a1'}         | ${false}     | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3,}(1)/}         | ${'aa1'}        | ${false}     | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3,}(1)/}         | ${'a1'}         | ${false}     | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/([a-z]){3,}(1)/}     | ${'ab1'}        | ${false}     | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
  `(
    '$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.',
    ({ regexp, input, optimization, isExecNull, group, execLen, groupText, groupIndex }) => {
      const regex = new RegExp(regexp);
      const regExact = new RegExact(regexp);
      const regexRetVal = regex.exec(input);
      const exactExecValue = regExact.exec(input, optimization);
      expect(exactExecValue === null).toBe(isExecNull);
      if (regexRetVal) {
        for (let i = 0; i < regexRetVal!.length; i++) {
          expect(regexRetVal[i]).toBe(exactExecValue[i]);
        }
        expect(exactExecValue.index).toBe(exactExecValue.indexes[0]);
        expect(exactExecValue.length).toBe(execLen);
        expect(exactExecValue[group]).toBe(groupText);
        expect(exactExecValue.indexes[group]).toBe(groupIndex);
      }
    }
  );
});

describe('Simple successful regex capturing groups on level 1 that are greedy quantified with {m}.', () => {
  test.each`
    regexp                 | input           | optimization | group | isExecNull | execLen      | groupText    | groupIndex
    ${/([a-z]){3}([1-9])/} | ${'abcde12345'} | ${true}      | ${2}  | ${false}   | ${3}         | ${'1'}       | ${5}
    ${/([a-z]){3}([1-9])/} | ${'abcde12345'} | ${true}      | ${1}  | ${false}   | ${3}         | ${'e'}       | ${4}
    ${/([a-z]){3}([1-9])/} | ${'abcde12345'} | ${true}      | ${0}  | ${false}   | ${3}         | ${'cde1'}    | ${2}
    ${/([a-z]){3}(1)/}     | ${'a1'}         | ${true}      | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3}(1)/}         | ${'aa1'}        | ${true}      | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3}(1)/}         | ${'a1'}         | ${true}      | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/([a-z]){3}(1)/}     | ${'ab1'}        | ${true}      | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/([a-z]){3}([1-9])/} | ${'abcde12345'} | ${false}     | ${2}  | ${false}   | ${3}         | ${'1'}       | ${5}
    ${/([a-z]){3}([1-9])/} | ${'abcde12345'} | ${false}     | ${1}  | ${false}   | ${3}         | ${'e'}       | ${4}
    ${/([a-z]){3}([1-9])/} | ${'abcde12345'} | ${false}     | ${0}  | ${false}   | ${3}         | ${'cde1'}    | ${2}
    ${/([a-z]){3}(1)/}     | ${'a1'}         | ${false}     | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3}(1)/}         | ${'aa1'}        | ${false}     | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/(a){3}(1)/}         | ${'a1'}         | ${false}     | ${1}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
    ${/([a-z]){3}(1)/}     | ${'ab1'}        | ${false}     | ${0}  | ${true}    | ${undefined} | ${undefined} | ${undefined}
  `(
    '$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.',
    ({ regexp, input, optimization, isExecNull, group, execLen, groupText, groupIndex }) => {
      const regex = new RegExp(regexp);
      const regExact = new RegExact(regexp);
      const regexRetVal = regex.exec(input);
      const exactExecValue = regExact.exec(input, optimization);
      expect(exactExecValue === null).toBe(isExecNull);
      if (regexRetVal) {
        for (let i = 0; i < regexRetVal!.length; i++) {
          expect(regexRetVal[i]).toBe(exactExecValue[i]);
        }
        expect(exactExecValue.index).toBe(exactExecValue.indexes[0]);
        expect(exactExecValue.length).toBe(execLen);
        expect(exactExecValue[group]).toBe(groupText);
        expect(exactExecValue.indexes[group]).toBe(groupIndex);
      }
    }
  );
});

describe('Simple regex capturing groups on level 1 that are greedy quantified with ?.', () => {
  test.each`
    regexp               | input           | optimization | group | execLen | groupText | groupIndex
    ${/([a-z])?([1-9])/} | ${'abcde12345'} | ${true}      | ${2}  | ${3}    | ${'1'}    | ${5}
    ${/([a-z])?([1-9])/} | ${'abcde12345'} | ${true}      | ${1}  | ${3}    | ${'e'}    | ${4}
    ${/([a-z])?(1)/}     | ${'a1'}         | ${true}      | ${2}  | ${3}    | ${'1'}    | ${1}
    ${/([a-z])?(1)/}     | ${'a1'}         | ${true}      | ${1}  | ${3}    | ${'a'}    | ${0}
    ${/(a)?(1)/}         | ${'aa1'}        | ${true}      | ${2}  | ${3}    | ${'1'}    | ${2}
    ${/(a)?(1)/}         | ${'aa1'}        | ${true}      | ${1}  | ${3}    | ${'a'}    | ${1}
    ${/(a)?(1)/}         | ${'aa1'}        | ${true}      | ${0}  | ${3}    | ${'a1'}   | ${1}
    ${/(a)?(1)/}         | ${'a1'}         | ${true}      | ${2}  | ${3}    | ${'1'}    | ${1}
    ${/(a)?(1)/}         | ${'a1'}         | ${true}      | ${1}  | ${3}    | ${'a'}    | ${0}
    ${/([a-z])?(1)/}     | ${'ab1'}        | ${true}      | ${2}  | ${3}    | ${'1'}    | ${2}
    ${/([a-z])?(1)/}     | ${'ab1'}        | ${true}      | ${1}  | ${3}    | ${'b'}    | ${1}
    ${/([a-z])?([1-9])/} | ${'abcde12345'} | ${false}     | ${2}  | ${3}    | ${'1'}    | ${5}
    ${/([a-z])?([1-9])/} | ${'abcde12345'} | ${false}     | ${1}  | ${3}    | ${'e'}    | ${4}
    ${/([a-z])?(1)/}     | ${'a1'}         | ${false}     | ${2}  | ${3}    | ${'1'}    | ${1}
    ${/([a-z])?(1)/}     | ${'a1'}         | ${false}     | ${1}  | ${3}    | ${'a'}    | ${0}
    ${/(a)?(1)/}         | ${'aa1'}        | ${false}     | ${2}  | ${3}    | ${'1'}    | ${2}
    ${/(a)?(1)/}         | ${'aa1'}        | ${false}     | ${1}  | ${3}    | ${'a'}    | ${1}
    ${/(a)?(1)/}         | ${'aa1'}        | ${false}     | ${0}  | ${3}    | ${'a1'}   | ${1}
    ${/(a)?(1)/}         | ${'a1'}         | ${false}     | ${2}  | ${3}    | ${'1'}    | ${1}
    ${/(a)?(1)/}         | ${'a1'}         | ${false}     | ${1}  | ${3}    | ${'a'}    | ${0}
    ${/([a-z])?(1)/}     | ${'ab1'}        | ${false}     | ${2}  | ${3}    | ${'1'}    | ${2}
    ${/([a-z])?(1)/}     | ${'ab1'}        | ${false}     | ${1}  | ${3}    | ${'b'}    | ${1}
  `(
    '$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.',
    ({ regexp, input, optimization, group, execLen, groupText, groupIndex }) => {
      const regex = new RegExp(regexp);
      const regExact = new RegExact(regexp);
      const regexRetVal = regex.exec(input);
      const exactExecValue = regExact.exec(input, optimization);
      for (let i = 0; i < regexRetVal!.length; i++) {
        expect(regexRetVal![i]).toBe(exactExecValue![i]);
      }
      expect(exactExecValue.index).toBe(exactExecValue.indexes[0]);
      expect(exactExecValue.length).toBe(execLen);
      expect(exactExecValue[group]).toBe(groupText);
      expect(exactExecValue.indexes[group]).toBe(groupIndex);
    }
  );
});

describe('Simple regex capturing groups on level 1 that are greedy quantified with +.', () => {
  test.each`
    regexp                | input           | optimization | group | execLen | groupText | groupIndex
    ${/([a-z])+([1-9])+/} | ${'abcde12345'} | ${true}      | ${2}  | ${3}    | ${'5'}    | ${9}
    ${/([a-z])+([1-9])+/} | ${'abcde12345'} | ${true}      | ${1}  | ${3}    | ${'e'}    | ${4}
    ${/([a-z])+([1-9])/}  | ${'abcde12345'} | ${true}      | ${2}  | ${3}    | ${'1'}    | ${5}
    ${/([a-z])+([1-9])/}  | ${'abcde12345'} | ${true}      | ${1}  | ${3}    | ${'e'}    | ${4}
    ${/([a-z])+(1)/}      | ${'ab1'}        | ${true}      | ${2}  | ${3}    | ${'1'}    | ${2}
    ${/([a-z])+(1)/}      | ${'ab1'}        | ${true}      | ${1}  | ${3}    | ${'b'}    | ${1}
    ${/([a-z])+(1)/}      | ${'a1'}         | ${true}      | ${2}  | ${3}    | ${'1'}    | ${1}
    ${/([a-z])+(1)/}      | ${'a1'}         | ${true}      | ${1}  | ${3}    | ${'a'}    | ${0}
    ${/(a)+(1)/}          | ${'aa1'}        | ${true}      | ${2}  | ${3}    | ${'1'}    | ${2}
    ${/(a)+(1)/}          | ${'aa1'}        | ${true}      | ${1}  | ${3}    | ${'a'}    | ${1}
    ${/(a)+(1)/}          | ${'a1'}         | ${true}      | ${2}  | ${3}    | ${'1'}    | ${1}
    ${/(a)+(1)/}          | ${'a1'}         | ${true}      | ${1}  | ${3}    | ${'a'}    | ${0}
    ${/([a-z])+([1-9])+/} | ${'abcde12345'} | ${false}     | ${2}  | ${3}    | ${'5'}    | ${9}
    ${/([a-z])+([1-9])+/} | ${'abcde12345'} | ${false}     | ${1}  | ${3}    | ${'e'}    | ${4}
    ${/([a-z])+([1-9])/}  | ${'abcde12345'} | ${false}     | ${2}  | ${3}    | ${'1'}    | ${5}
    ${/([a-z])+([1-9])/}  | ${'abcde12345'} | ${false}     | ${1}  | ${3}    | ${'e'}    | ${4}
    ${/([a-z])+(1)/}      | ${'ab1'}        | ${false}     | ${2}  | ${3}    | ${'1'}    | ${2}
    ${/([a-z])+(1)/}      | ${'ab1'}        | ${false}     | ${1}  | ${3}    | ${'b'}    | ${1}
    ${/([a-z])+(1)/}      | ${'a1'}         | ${false}     | ${2}  | ${3}    | ${'1'}    | ${1}
    ${/([a-z])+(1)/}      | ${'a1'}         | ${false}     | ${1}  | ${3}    | ${'a'}    | ${0}
    ${/(a)+(1)/}          | ${'aa1'}        | ${false}     | ${2}  | ${3}    | ${'1'}    | ${2}
    ${/(a)+(1)/}          | ${'aa1'}        | ${false}     | ${1}  | ${3}    | ${'a'}    | ${1}
    ${/(a)+(1)/}          | ${'a1'}         | ${false}     | ${2}  | ${3}    | ${'1'}    | ${1}
    ${/(a)+(1)/}          | ${'a1'}         | ${false}     | ${1}  | ${3}    | ${'a'}    | ${0}
  `(
    '$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.',
    ({ regexp, input, optimization, group, execLen, groupText, groupIndex }) => {
      const regExact = new RegExact(regexp);
      const exactExecValue = regExact.exec(input, optimization);
      expect(exactExecValue.index).toBe(exactExecValue.indexes[0]);
      expect(exactExecValue.length).toBe(execLen);
      expect(exactExecValue[group]).toBe(groupText);
      expect(exactExecValue.indexes[group]).toBe(groupIndex);
    }
  );
});

describe('Simple regex capturing groups on level 1 that are lazy quantified with *.', () => {
  test.each`
    regexp                  | input           | optimization | group | isExecNull | execLen | groupText    | groupIndex
    ${/([a-z])*([1-9])*?/}  | ${'abcde12345'} | ${true}      | ${2}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*([1-9])*?/}  | ${'abcde12345'} | ${true}      | ${1}  | ${false}   | ${3}    | ${'e'}       | ${4}
    ${/([a-z])*([1-9])*?/}  | ${'abcde12345'} | ${true}      | ${0}  | ${false}   | ${3}    | ${'abcde'}   | ${0}
    ${/([a-z])*?([1-9])*?/} | ${'abcde12345'} | ${true}      | ${2}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*?([1-9])*?/} | ${'abcde12345'} | ${true}      | ${1}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*?([1-9])*?/} | ${'abcde12345'} | ${true}      | ${0}  | ${false}   | ${3}    | ${''}        | ${0}
    ${/([a-z])*?([1-9])*/}  | ${'abcde12345'} | ${true}      | ${2}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*?([1-9])*/}  | ${'abcde12345'} | ${true}      | ${1}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*?([1-9])*/}  | ${'abcde12345'} | ${true}      | ${0}  | ${false}   | ${3}    | ${''}        | ${0}
    ${/([a-z])*?([1-9])/}   | ${'abcde12345'} | ${true}      | ${2}  | ${false}   | ${3}    | ${'1'}       | ${5}
    ${/([a-z])*?([1-9])/}   | ${'abcde12345'} | ${true}      | ${1}  | ${false}   | ${3}    | ${'e'}       | ${4}
    ${/([a-z])*?([1-9])/}   | ${'abcde12345'} | ${true}      | ${0}  | ${false}   | ${3}    | ${'abcde1'}  | ${0}
    ${/([a-z])*?(1)/}       | ${'ab1'}        | ${true}      | ${2}  | ${false}   | ${3}    | ${'1'}       | ${2}
    ${/([a-z])*?(1)/}       | ${'ab1'}        | ${true}      | ${1}  | ${false}   | ${3}    | ${'b'}       | ${1}
    ${/([a-z])*?(1)/}       | ${'ab1'}        | ${true}      | ${0}  | ${false}   | ${3}    | ${'ab1'}     | ${0}
    ${/([a-z])*?(1)/}       | ${'a1'}         | ${true}      | ${2}  | ${false}   | ${3}    | ${'1'}       | ${1}
    ${/([a-z])*?(1)/}       | ${'a1'}         | ${true}      | ${1}  | ${false}   | ${3}    | ${'a'}       | ${0}
    ${/([a-z])*?(1)/}       | ${'a1'}         | ${true}      | ${0}  | ${false}   | ${3}    | ${'a1'}      | ${0}
    ${/(a)*?(1)/}           | ${'aa1'}        | ${true}      | ${2}  | ${false}   | ${3}    | ${'1'}       | ${2}
    ${/(a)*?(1)/}           | ${'aa1'}        | ${true}      | ${1}  | ${false}   | ${3}    | ${'a'}       | ${1}
    ${/(a)*?(1)/}           | ${'aa1'}        | ${true}      | ${0}  | ${false}   | ${3}    | ${'aa1'}     | ${0}
    ${/(a)*?(1)/}           | ${'a1'}         | ${true}      | ${2}  | ${false}   | ${3}    | ${'1'}       | ${1}
    ${/(a)*?(1)/}           | ${'a1'}         | ${true}      | ${1}  | ${false}   | ${3}    | ${'a'}       | ${0}
    ${/(a)*?(1)/}           | ${'a1'}         | ${true}      | ${0}  | ${false}   | ${3}    | ${'a1'}      | ${0}
    ${/([a-z])*([1-9])*?/}  | ${'abcde12345'} | ${false}     | ${2}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*([1-9])*?/}  | ${'abcde12345'} | ${false}     | ${1}  | ${false}   | ${3}    | ${'e'}       | ${4}
    ${/([a-z])*([1-9])*?/}  | ${'abcde12345'} | ${false}     | ${0}  | ${false}   | ${3}    | ${'abcde'}   | ${0}
    ${/([a-z])*?([1-9])*?/} | ${'abcde12345'} | ${false}     | ${2}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*?([1-9])*?/} | ${'abcde12345'} | ${false}     | ${1}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*?([1-9])*?/} | ${'abcde12345'} | ${false}     | ${0}  | ${false}   | ${3}    | ${''}        | ${0}
    ${/([a-z])*?([1-9])*/}  | ${'abcde12345'} | ${false}     | ${2}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*?([1-9])*/}  | ${'abcde12345'} | ${false}     | ${1}  | ${false}   | ${3}    | ${undefined} | ${undefined}
    ${/([a-z])*?([1-9])*/}  | ${'abcde12345'} | ${false}     | ${0}  | ${false}   | ${3}    | ${''}        | ${0}
    ${/([a-z])*?([1-9])/}   | ${'abcde12345'} | ${false}     | ${2}  | ${false}   | ${3}    | ${'1'}       | ${5}
    ${/([a-z])*?([1-9])/}   | ${'abcde12345'} | ${false}     | ${1}  | ${false}   | ${3}    | ${'e'}       | ${4}
    ${/([a-z])*?([1-9])/}   | ${'abcde12345'} | ${false}     | ${0}  | ${false}   | ${3}    | ${'abcde1'}  | ${0}
    ${/([a-z])*?(1)/}       | ${'ab1'}        | ${false}     | ${2}  | ${false}   | ${3}    | ${'1'}       | ${2}
    ${/([a-z])*?(1)/}       | ${'ab1'}        | ${false}     | ${1}  | ${false}   | ${3}    | ${'b'}       | ${1}
    ${/([a-z])*?(1)/}       | ${'ab1'}        | ${false}     | ${0}  | ${false}   | ${3}    | ${'ab1'}     | ${0}
    ${/([a-z])*?(1)/}       | ${'a1'}         | ${false}     | ${2}  | ${false}   | ${3}    | ${'1'}       | ${1}
    ${/([a-z])*?(1)/}       | ${'a1'}         | ${false}     | ${1}  | ${false}   | ${3}    | ${'a'}       | ${0}
    ${/([a-z])*?(1)/}       | ${'a1'}         | ${false}     | ${0}  | ${false}   | ${3}    | ${'a1'}      | ${0}
    ${/(a)*?(1)/}           | ${'aa1'}        | ${false}     | ${2}  | ${false}   | ${3}    | ${'1'}       | ${2}
    ${/(a)*?(1)/}           | ${'aa1'}        | ${false}     | ${1}  | ${false}   | ${3}    | ${'a'}       | ${1}
    ${/(a)*?(1)/}           | ${'aa1'}        | ${false}     | ${0}  | ${false}   | ${3}    | ${'aa1'}     | ${0}
    ${/(a)*?(1)/}           | ${'a1'}         | ${false}     | ${2}  | ${false}   | ${3}    | ${'1'}       | ${1}
    ${/(a)*?(1)/}           | ${'a1'}         | ${false}     | ${1}  | ${false}   | ${3}    | ${'a'}       | ${0}
    ${/(a)*?(1)/}           | ${'a1'}         | ${false}     | ${0}  | ${false}   | ${3}    | ${'a1'}      | ${0}
  `(
    '$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.',
    ({ regexp, input, optimization, isExecNull, group, execLen, groupText, groupIndex }) => {
      const regex = new RegExp(regexp);
      const regExact = new RegExact(regexp);
      const regexRetVal = regex.exec(input);
      const exactExecValue = regExact.exec(input, optimization);
      expect(exactExecValue === null).toBe(isExecNull);
      if (regexRetVal) {
        for (let i = 0; i < regexRetVal!.length; i++) {
          expect(regexRetVal[i]).toBe(exactExecValue[i]);
        }
        expect(exactExecValue.index).toBe(exactExecValue.indexes[0]);
        expect(exactExecValue.length).toBe(execLen);
        expect(exactExecValue[group]).toBe(groupText);
        expect(exactExecValue.indexes[group]).toBe(groupIndex);
      }
    }
  );
});

describe('Simple regex capturing groups on level 1 that are greedy quantified with *.', () => {
  test.each`
    regexp                | input           | optimization | group | execLen | groupText | groupIndex
    ${/([a-z])*([1-9])*/} | ${'abcde12345'} | ${true}      | ${2}  | ${3}    | ${'5'}    | ${9}
    ${/([a-z])*([1-9])*/} | ${'abcde12345'} | ${true}      | ${1}  | ${3}    | ${'e'}    | ${4}
    ${/([a-z])*([1-9])/}  | ${'abcde12345'} | ${true}      | ${2}  | ${3}    | ${'1'}    | ${5}
    ${/([a-z])*([1-9])/}  | ${'abcde12345'} | ${true}      | ${1}  | ${3}    | ${'e'}    | ${4}
    ${/([a-z])*(1)/}      | ${'ab1'}        | ${true}      | ${2}  | ${3}    | ${'1'}    | ${2}
    ${/([a-z])*(1)/}      | ${'ab1'}        | ${true}      | ${1}  | ${3}    | ${'b'}    | ${1}
    ${/([a-z])*(1)/}      | ${'a1'}         | ${true}      | ${2}  | ${3}    | ${'1'}    | ${1}
    ${/([a-z])*(1)/}      | ${'a1'}         | ${true}      | ${1}  | ${3}    | ${'a'}    | ${0}
    ${/(a)*(1)/}          | ${'aa1'}        | ${true}      | ${2}  | ${3}    | ${'1'}    | ${2}
    ${/(a)*(1)/}          | ${'aa1'}        | ${true}      | ${1}  | ${3}    | ${'a'}    | ${1}
    ${/(a)*(1)/}          | ${'a1'}         | ${true}      | ${2}  | ${3}    | ${'1'}    | ${1}
    ${/(a)*(1)/}          | ${'a1'}         | ${true}      | ${1}  | ${3}    | ${'a'}    | ${0}
    ${/([a-z])*([1-9])*/} | ${'abcde12345'} | ${false}     | ${2}  | ${3}    | ${'5'}    | ${9}
    ${/([a-z])*([1-9])*/} | ${'abcde12345'} | ${false}     | ${1}  | ${3}    | ${'e'}    | ${4}
    ${/([a-z])*([1-9])/}  | ${'abcde12345'} | ${false}     | ${2}  | ${3}    | ${'1'}    | ${5}
    ${/([a-z])*([1-9])/}  | ${'abcde12345'} | ${false}     | ${1}  | ${3}    | ${'e'}    | ${4}
    ${/([a-z])*(1)/}      | ${'ab1'}        | ${false}     | ${2}  | ${3}    | ${'1'}    | ${2}
    ${/([a-z])*(1)/}      | ${'ab1'}        | ${false}     | ${1}  | ${3}    | ${'b'}    | ${1}
    ${/([a-z])*(1)/}      | ${'a1'}         | ${false}     | ${2}  | ${3}    | ${'1'}    | ${1}
    ${/([a-z])*(1)/}      | ${'a1'}         | ${false}     | ${1}  | ${3}    | ${'a'}    | ${0}
    ${/(a)*(1)/}          | ${'aa1'}        | ${false}     | ${2}  | ${3}    | ${'1'}    | ${2}
    ${/(a)*(1)/}          | ${'aa1'}        | ${false}     | ${1}  | ${3}    | ${'a'}    | ${1}
    ${/(a)*(1)/}          | ${'a1'}         | ${false}     | ${2}  | ${3}    | ${'1'}    | ${1}
    ${/(a)*(1)/}          | ${'a1'}         | ${false}     | ${1}  | ${3}    | ${'a'}    | ${0}
  `(
    '$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.',
    ({ regexp, input, optimization, group, execLen, groupText, groupIndex }) => {
      const regExact = new RegExact(regexp);
      const exactExecValue = regExact.exec(input, optimization);
      expect(exactExecValue.index).toBe(exactExecValue.indexes[0]);
      expect(exactExecValue.length).toBe(execLen);
      expect(exactExecValue[group]).toBe(groupText);
      expect(exactExecValue.indexes[group]).toBe(groupIndex);
    }
  );
});

describe('Simple regex with capturing groups on level 1.', () => {
  test.each`
    regexp                          | input                                            | optimization | group | execLen | groupText                  | groupIndex
    ${/a(.*)(b)b/}                  | ${'aaaaabbbbb'}                                  | ${true}      | ${2}  | ${3}    | ${'b'}                     | ${8}
    ${/a(.*)(b)b/}                  | ${'aaaaabbbbb'}                                  | ${true}      | ${1}  | ${3}    | ${'aaaabbb'}               | ${1}
    ${/a(.*)(b)b/}                  | ${'aaaaabbbbb'}                                  | ${true}      | ${0}  | ${3}    | ${'aaaaabbbbb'}            | ${0}
    ${/a(a)b(b)b/}                  | ${'aaaaabbbbb'}                                  | ${true}      | ${2}  | ${3}    | ${'b'}                     | ${6}
    ${/a(a)b(b)b/}                  | ${'aaaaabbbbb'}                                  | ${true}      | ${1}  | ${3}    | ${'a'}                     | ${4}
    ${/a(a)b(b)b/}                  | ${'aaaaabbbbb'}                                  | ${true}      | ${0}  | ${3}    | ${'aabbb'}                 | ${3}
    ${/quick\s(brown).+?(jumps)/gi} | ${'The Quick Brown Fox Jumps Over The Lazy Dog'} | ${true}      | ${2}  | ${3}    | ${'Jumps'}                 | ${20}
    ${/quick\s(brown).+?(jumps)/gi} | ${'The Quick Brown Fox Jumps Over The Lazy Dog'} | ${true}      | ${1}  | ${3}    | ${'Brown'}                 | ${10}
    ${/quick\s(brown).+?(jumps)/gi} | ${'The Quick Brown Fox Jumps Over The Lazy Dog'} | ${true}      | ${0}  | ${3}    | ${'Quick Brown Fox Jumps'} | ${4}
    ${/a(b)(c)/}                    | ${'abc'}                                         | ${true}      | ${2}  | ${3}    | ${'c'}                     | ${2}
    ${/a(b)(c)/}                    | ${'abc'}                                         | ${true}      | ${1}  | ${3}    | ${'b'}                     | ${1}
    ${/a(b)(c)/}                    | ${'abc'}                                         | ${true}      | ${0}  | ${3}    | ${'abc'}                   | ${0}
    ${/.*(b)/}                      | ${'aaaaabbbbb'}                                  | ${true}      | ${1}  | ${2}    | ${'b'}                     | ${9}
    ${/.*(b)/}                      | ${'aaaaabbbbb'}                                  | ${true}      | ${0}  | ${2}    | ${'aaaaabbbbb'}            | ${0}
    ${/a(b)/}                       | ${'ab'}                                          | ${true}      | ${0}  | ${2}    | ${'ab'}                    | ${0}
    ${/a(.*)(b)b/}                  | ${'aaaaabbbbb'}                                  | ${false}     | ${2}  | ${3}    | ${'b'}                     | ${8}
    ${/a(.*)(b)b/}                  | ${'aaaaabbbbb'}                                  | ${false}     | ${1}  | ${3}    | ${'aaaabbb'}               | ${1}
    ${/a(.*)(b)b/}                  | ${'aaaaabbbbb'}                                  | ${false}     | ${0}  | ${3}    | ${'aaaaabbbbb'}            | ${0}
    ${/a(a)b(b)b/}                  | ${'aaaaabbbbb'}                                  | ${false}     | ${2}  | ${3}    | ${'b'}                     | ${6}
    ${/a(a)b(b)b/}                  | ${'aaaaabbbbb'}                                  | ${false}     | ${1}  | ${3}    | ${'a'}                     | ${4}
    ${/a(a)b(b)b/}                  | ${'aaaaabbbbb'}                                  | ${false}     | ${0}  | ${3}    | ${'aabbb'}                 | ${3}
    ${/quick\s(brown).+?(jumps)/gi} | ${'The Quick Brown Fox Jumps Over The Lazy Dog'} | ${false}     | ${2}  | ${3}    | ${'Jumps'}                 | ${20}
    ${/quick\s(brown).+?(jumps)/gi} | ${'The Quick Brown Fox Jumps Over The Lazy Dog'} | ${false}     | ${1}  | ${3}    | ${'Brown'}                 | ${10}
    ${/quick\s(brown).+?(jumps)/gi} | ${'The Quick Brown Fox Jumps Over The Lazy Dog'} | ${false}     | ${0}  | ${3}    | ${'Quick Brown Fox Jumps'} | ${4}
    ${/a(b)(c)/}                    | ${'abc'}                                         | ${false}     | ${2}  | ${3}    | ${'c'}                     | ${2}
    ${/a(b)(c)/}                    | ${'abc'}                                         | ${false}     | ${1}  | ${3}    | ${'b'}                     | ${1}
    ${/a(b)(c)/}                    | ${'abc'}                                         | ${false}     | ${0}  | ${3}    | ${'abc'}                   | ${0}
    ${/.*(b)/}                      | ${'aaaaabbbbb'}                                  | ${false}     | ${1}  | ${2}    | ${'b'}                     | ${9}
    ${/.*(b)/}                      | ${'aaaaabbbbb'}                                  | ${false}     | ${0}  | ${2}    | ${'aaaaabbbbb'}            | ${0}
    ${/a(b)/}                       | ${'ab'}                                          | ${false}     | ${0}  | ${2}    | ${'ab'}                    | ${0}
  `(
    '$regexp on string $input should have $execLen matches and the match of group $group should be $groupText at index $groupIndex.',
    ({ regexp, input, optimization, group, execLen, groupText, groupIndex }) => {
      const regExact = new RegExact(regexp);
      const exactExecValue = regExact.exec(input, optimization);
      expect(exactExecValue.index).toBe(exactExecValue.indexes[0]);
      expect(exactExecValue.length).toBe(execLen);
      expect(exactExecValue[group]).toBe(groupText);
      expect(exactExecValue.indexes[group]).toBe(groupIndex);
    }
  );
});

describe('RegExact object constructed from regex string and flags string', () => {
  test.each`
    regexpString                   | flags   | input                                            | optimization | match
    ${'quick\\s(brown).+?(jumps)'} | ${'ig'} | ${'The Quick Brown Fox Jumps Over The Lazy Dog'} | ${true}      | ${'Quick Brown Fox Jumps'}
    ${'quick\\s(brown).+?(jumps)'} | ${'ig'} | ${'The Quick Brown Fox Jumps Over The Lazy Dog'} | ${false}     | ${'Quick Brown Fox Jumps'}
  `(
    '$regexpString with flags $flags on string $input should match $match',
    ({ regexpString, flags, input, optimization, match }) => {
      const regExact = new RegExact(new RegExp(regexpString, flags));
      const result = regExact.exec(input, optimization);
      expect(result[0]).toBe(match);
    }
  );
});

describe('RegExact object constructed from regex string', () => {
  test.each`
    regexp                          | input                                            | optimization | match
    ${/quick\s(brown).+?(jumps)/gi} | ${'The Quick Brown Fox Jumps Over The Lazy Dog'} | ${true}      | ${'Quick Brown Fox Jumps'}
    ${/quick\s(brown).+?(jumps)/gi} | ${'The Quick Brown Fox Jumps Over The Lazy Dog'} | ${false}     | ${'Quick Brown Fox Jumps'}
  `(
    '$regexp on string $input should match $match',
    ({ regexp, input, optimization, match }) => {
      const regExact = new RegExact(new RegExp(regexp));
      const result = regExact.exec(input, optimization);
      expect(result[0]).toBe(match);
    }
  );
});

describe('RegExact object constructed from regex literal', () => {
  test.each`
    regexp                          | input                                            | optimization | match
    ${/quick\s(brown).+?(jumps)/gi} | ${'The Quick Brown Fox Jumps Over The Lazy Dog'} | ${true}      | ${'Quick Brown Fox Jumps'}
    ${/a/gi}                        | ${'abc'}                                         | ${true}      | ${'a'}
    ${/quick\s(brown).+?(jumps)/gi} | ${'The Quick Brown Fox Jumps Over The Lazy Dog'} | ${false}     | ${'Quick Brown Fox Jumps'}
    ${/a/gi}                        | ${'abc'}                                         | ${false}     | ${'a'}
  `(
    '$regexp on string $input should match $match',
    ({ regexp, input, optimization, match }) => {
      const regExact = new RegExact(regexp);
      const result = regExact.exec(input, optimization);
      expect(result[0]).toBe(match);
    }
  );
});
