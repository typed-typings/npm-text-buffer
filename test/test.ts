import test = require('blue-tape');

import textBuffer = require('text-buffer');

test('reference', (t) => {
  t.plan(1);
  t.notEqual(textBuffer, undefined);
});
