'use strict';

var pymol = require('../pymol.js');

describe('Check pymol generation', function () {
  var fs = require('fs');
  var path = require('path');
  var pdb = fs.readFileSync(path.join(__dirname, '1O8O.pdb'), 'utf8');

  test('should work', async function () {
    let result = await pymol('aaaa', pdb);
    expect(result.length).toBeGreaterThan(28700);
  });
});
