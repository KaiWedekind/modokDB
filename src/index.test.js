/* eslint-env mocha */
const { expect } = require('chai');
const Modok = require('./index');

describe('modokDB', () => {
  it('should have a constructor to be a object', () => {
    const db = new Modok('users');
    expect(db).to.be.an('object');
  });

  it('should store the collection name', () => {
    const db = new Modok('users');
    expect(db.name).to.equal('users');
  });
});
