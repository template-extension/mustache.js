require('./helper');

// A map of templates to their expected token output. Tokens are in the format:
// [type, value, startIndex, endIndex, subTokens].
var expectations = {
  ''                                          : [],
  '{hi}'                                      : [ [ 'name', 'hi', 0, 4 ] ],
  '{hi.world}'                                : [ [ 'name', 'hi.world', 0, 10 ] ],
  '{hi . world}'                              : [ [ 'name', 'hi . world', 0, 12 ] ],
  '{ hi}'                                     : [ [ 'name', 'hi', 0, 5 ] ],
  '{hi }'                                     : [ [ 'name', 'hi', 0, 5 ] ],
  '{ hi }'                                    : [ [ 'name', 'hi', 0, 6 ] ],
  '{{hi}}'                                    : [ [ '&', 'hi', 0, 6 ] ],
  '{!hi}'                                     : [ [ '!', 'hi', 0, 5 ] ],
  '{! hi}'                                    : [ [ '!', 'hi', 0, 6 ] ],
  '{! hi }'                                   : [ [ '!', 'hi', 0, 7 ] ],
  '{ !hi}'                                    : [ [ '!', 'hi', 0, 6 ] ],
  '{ ! hi}'                                   : [ [ '!', 'hi', 0, 7 ] ],
  '{ ! hi }'                                  : [ [ '!', 'hi', 0, 8 ] ],
  'a\n b'                                     : [ [ 'text', 'a\n b', 0, 4 ] ],
  'a{hi}'                                     : [ [ 'text', 'a', 0, 1 ], [ 'name', 'hi', 1, 5 ] ],
  'a {hi}'                                    : [ [ 'text', 'a ', 0, 2 ], [ 'name', 'hi', 2, 6 ] ],
  ' a{hi}'                                    : [ [ 'text', ' a', 0, 2 ], [ 'name', 'hi', 2, 6 ] ],
  ' a {hi}'                                   : [ [ 'text', ' a ', 0, 3 ], [ 'name', 'hi', 3, 7 ] ],
  'a{hi}b'                                    : [ [ 'text', 'a', 0, 1 ], [ 'name', 'hi', 1, 5 ], [ 'text', 'b', 5, 6 ] ],
  'a{hi} b'                                   : [ [ 'text', 'a', 0, 1 ], [ 'name', 'hi', 1, 5 ], [ 'text', ' b', 5, 7 ] ],
  'a{hi}b '                                   : [ [ 'text', 'a', 0, 1 ], [ 'name', 'hi', 1, 5 ], [ 'text', 'b ', 5, 7 ] ],
  'a\n{hi} b \n'                              : [ [ 'text', 'a\n', 0, 2 ], [ 'name', 'hi', 2, 6 ], [ 'text', ' b \n', 6, 10 ] ],
  'a\n {hi} \nb'                              : [ [ 'text', 'a\n ', 0, 3 ], [ 'name', 'hi', 3, 7 ], [ 'text', ' \nb', 7, 10 ] ],
  'a\n {!hi} \nb'                             : [ [ 'text', 'a\n', 0, 2 ], [ '!', 'hi', 3, 8 ], [ 'text', 'b', 10, 11 ] ],
  'a\n{#a}{/a}\nb'                            : [ [ 'text', 'a\n', 0, 2 ], [ '#', 'a', 2, 6, [], 6 ], [ 'text', 'b', 11, 12 ] ],
  'a\n {#a}{/a}\nb'                           : [ [ 'text', 'a\n', 0, 2 ], [ '#', 'a', 3, 7, [], 7 ], [ 'text', 'b', 12, 13 ] ],
  'a\n {#a}{/a} \nb'                          : [ [ 'text', 'a\n', 0, 2 ], [ '#', 'a', 3, 7, [], 7 ], [ 'text', 'b', 13, 14 ] ],
  'a\n{#a}\n{/a}\nb'                          : [ [ 'text', 'a\n', 0, 2 ], [ '#', 'a', 2, 6, [], 7 ], [ 'text', 'b', 12, 13 ] ],
  'a\n {#a}\n{/a}\nb'                         : [ [ 'text', 'a\n', 0, 2 ], [ '#', 'a', 3, 7, [], 8 ], [ 'text', 'b', 13, 14 ] ],
  'a\n {#a}\n{/a} \nb'                        : [ [ 'text', 'a\n', 0, 2 ], [ '#', 'a', 3, 7, [], 8 ], [ 'text', 'b', 14, 15 ] ],
  'a\n{#a}\n{/a}\n{#b}\n{/b}\nb'              : [ [ 'text', 'a\n', 0, 2 ], [ '#', 'a', 2, 6, [], 7 ], [ '#', 'b', 12, 16, [], 17 ], [ 'text', 'b', 22, 23 ] ],
  'a\n {#a}\n{/a}\n{#b}\n{/b}\nb'             : [ [ 'text', 'a\n', 0, 2 ], [ '#', 'a', 3, 7, [], 8 ], [ '#', 'b', 13, 17, [], 18 ], [ 'text', 'b', 23, 24 ] ],
  'a\n {#a}\n{/a}\n{#b}\n{/b} \nb'            : [ [ 'text', 'a\n', 0, 2 ], [ '#', 'a', 3, 7, [], 8 ], [ '#', 'b', 13, 17, [], 18 ], [ 'text', 'b', 24, 25 ] ],
  'a\n{#a}\n{#b}\n{/b}\n{/a}\nb'              : [ [ 'text', 'a\n', 0, 2 ], [ '#', 'a', 2, 6, [ [ '#', 'b', 7, 11, [], 12 ] ], 17 ], [ 'text', 'b', 22, 23 ] ],
  'a\n {#a}\n{#b}\n{/b}\n{/a}\nb'             : [ [ 'text', 'a\n', 0, 2 ], [ '#', 'a', 3, 7, [ [ '#', 'b', 8, 12, [], 13 ] ], 18 ], [ 'text', 'b', 23, 24 ] ],
  'a\n {#a}\n{#b}\n{/b}\n{/a} \nb'            : [ [ 'text', 'a\n', 0, 2 ], [ '#', 'a', 3, 7, [ [ '#', 'b', 8, 12, [], 13 ] ], 18 ], [ 'text', 'b', 24, 25 ] ],
  '{>abc}'                                    : [ [ '>', 'abc', 0, 6 ] ],
  '{> abc }'                                  : [ [ '>', 'abc', 0, 8 ] ],
  '{ > abc }'                                 : [ [ '>', 'abc', 0, 9 ] ],
  '{=<% %>=}'                                 : [ [ '=', '<% %>', 0, 9 ] ],
  '{= <% %> =}'                               : [ [ '=', '<% %>', 0, 11 ] ],
  '{=<% %>=}<%={ }=%>'                        : [ [ '=', '<% %>', 0, 9 ], [ '=', '{ }', 9, 18 ] ],
  '{=<% %>=}<%hi%>'                           : [ [ '=', '<% %>', 0, 9 ], [ 'name', 'hi', 9, 15 ] ],
  '{#a}{/a}hi{#b}{/b}\n'                      : [ [ '#', 'a', 0, 4, [], 4 ], [ 'text', 'hi', 8, 10 ], [ '#', 'b', 10, 14, [], 14 ], [ 'text', '\n', 18, 19 ] ],
  '{a}\n{b}\n\n{#c}\n{/c}\n'                  : [ [ 'name', 'a', 0, 3 ], [ 'text', '\n', 3, 4 ], [ 'name', 'b', 4, 7 ], [ 'text', '\n\n', 7, 9 ], [ '#', 'c', 9, 13, [], 14 ] ],
  '{#foo}\n  {#a}\n    {b}\n  {/a}\n{/foo}\n' : [ [ '#', 'foo', 0, 6, [ [ '#', 'a', 9, 13, [ [ 'text', '    ', 14, 18 ], [ 'name', 'b', 18, 21 ], [ 'text', '\n', 21, 22 ] ], 24 ] ], 29 ] ]
};

describe('Mustache.parse', function () {

  for (var template in expectations) {
    (function (template, tokens) {
      it('knows how to parse ' + JSON.stringify(template), function () {
        assert.deepEqual(Mustache.parse(template), tokens);
      });
    })(template, expectations[template]);
  }

  describe('when there is an unclosed tag', function () {
    it('throws an error', function () {
      assert.throws(function () {
        Mustache.parse('My name is {name');
      }, /unclosed tag at 16/i);
    });
  });

  describe('when there is an unclosed section', function () {
    it('throws an error', function () {
      assert.throws(function () {
        Mustache.parse('A list: {#people}{name}');
      }, /unclosed section "people" at 23/i);
    });
  });

  describe('when there is an unopened section', function () {
    it('throws an error', function () {
      assert.throws(function () {
        Mustache.parse('The end of the list! {/people}');
      }, /unopened section "people" at 21/i);
    });
  });

  describe('when invalid tags are given as an argument', function () {
    it('throws an error', function () {
      assert.throws(function () {
        Mustache.parse('A template <% name %>', [ '<%' ]);
      }, /invalid tags/i);
    });
  });

  describe('when the template contains invalid tags', function () {
    it('throws an error', function () {
      assert.throws(function () {
        Mustache.parse('A template {=<%=}');
      }, /invalid tags/i);
    });
  });

});
