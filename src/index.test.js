/* eslint-env mocha */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const Modok = require('./index');

let db = null;

describe('modokDB', () => {
  describe('Create instance without file storage', () => {
    beforeEach(() => {
      db = new Modok('users');
    });

    afterEach(() => {
      db = null;
    });

    describe('Check db instance', () => {
      it('should have a constructor to be a object', () => {
        expect(db).to.be.an('object');
      });

      it('should have the property name', () => {
        expect(db).to.have.property('name');
      });

      it('should store the collection name', () => {
        expect(db.name).to.equal('users');
      });
    });

    describe('has / $has', () => {
      it('should return false for db.has(<index>) when index is not created yet', () => {
        expect(db.has(0)).to.equal(false);
      });

      it('should return true for db.has(<index>) after creating the index', () => {
        db.insert({ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 });
        expect(db.has(0)).to.equal(true);
      });

      it('should return false for db.$has(<index>) when index is not created yet', () => {
        expect(db.$has(0)).to.eventually.equal(false);
      });

      it('should return true for db.$has(<index>) after creating the index', () => {
        db.insert({ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 });
        expect(db.$has(0)).to.eventually.equal(true);
      });
    });

    describe('insert / $insert', () => {
      it('should add a single entry with db.insert to the database and return the object', () => {
        expect(db.insert({ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 })).to.be.an('object');
      });

      it('should add multiple entries with db.insert to the database and return the objects in an array', () => {
        expect(db.insert([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 },
        { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }])).to.be.an('array');
      });

      it('should add a single entry with db.$insert to the database and return the object', () => {
        expect(db.$insert({ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 })).to.eventually.be.an('object');
      });

      it('should add multiple entries with db.$insert to the database and return the objects in an array', () => {
        expect(db.$insert([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 },
        { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }])).to.eventually.be.an('array');
      });
    });

    describe('insertOne / $insertOne', () => {
      it('should add a single entry with db.insertOne to the database and return the object', () => {
        expect(db.insertOne({ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 })).to.be.an('object');
      });

      it('should return null when trying to insert an array with db.insertOne', () => {
        expect(db.insertOne([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 },
        { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }])).to.be.equal(null);
      });

      it('should add a single entry with db.$insertOne to the database and return the object', () => {
        expect(db.$insertOne({ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 })).to.eventually.be.an('object');
      });

      it('should return null when trying to insert an array with db.$insertOne', () => {
        expect(db.$insertOne([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 },
        { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }])).to.eventually.be.equal(null);
      });
    });

    describe('insertMany / $insertMany', () => {
      it('should add a single entry with db.insertMany to the database and return the object', () => {
        expect(db.insertMany([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 },
        { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }])).to.be.an('array');
      });

      it('should return null when trying to insert an object with db.insertMany', () => {
        expect(db.insertMany({ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 })).to.be.equal(null);
      });

      it('should add a single entry with db.$insertMany to the database and return the object', () => {
        expect(db.$insertMany([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 },
        { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }])).to.eventually.be.an('array');
      });

      it('should return null when trying to insert an object with db.$insertMany', () => {
        expect(db.$insertMany({ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 })).to.eventually.be.equal(null);
      });
    });
  });
});
