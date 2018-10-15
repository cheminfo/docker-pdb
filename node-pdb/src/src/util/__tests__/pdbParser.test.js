'use strict';

var fs = require('fs');
var path = require('path');

var pdbParser = require('../pdbParser.js');

describe('Check pdb parser of 1O80', function () {
  var pdb = fs.readFileSync(path.join(__dirname, '1O8O.pdb'), 'utf8');
  var result = pdbParser.parse(pdb);

  test('Check result', function () {
    expect(result.chain.A.nbResidues).toBe(167);
    expect(result.helices).toHaveLength(21);
    expect(result.nbResidues).toBe(501);
    expect(result.nbChains).toBe(3);
  });
});

describe('Check pdb parser of 3QK2', function () {
  var pdb = fs.readFileSync(path.join(__dirname, '3QK2.pdb'), 'utf8');
  var result = pdbParser.parse(pdb);

  it('Check result', function () {
    expect(result.nbModifiedResidues).toBe(1);
  });
});
