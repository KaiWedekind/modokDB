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

    describe('find / $find', () => {
      it('should return all db entities with db.find()', () => {
        expect(db.find()).to.be.an('array');
      });

      it('should return all db entities with db.$find()', () => {
        expect(db.$find()).to.eventually.be.an('array');
      });

      it('should return all db entities with parameter of undefined for db.find()', () => {
        expect(db.find(undefined)).to.be.an('array');
      });

      it('should return all db entities with parameter of undefined for db.$find()', () => {
        expect(db.$find(undefined)).to.eventually.be.an('array');
      });

      it('should return null with parameter of string for db.find()', () => {
        expect(db.find('hello')).to.be.equal(null);
      });

      it('should return null with parameter of string for db.$find()', () => {
        expect(db.$find('hello')).to.eventually.be.equal(null);
      });

      it('should return null with parameter of number for db.$find()', () => {
        expect(db.$find(100)).to.eventually.be.equal(null);
      });

      it('should return null with parameter of null for db.find()', () => {
        expect(db.find(null)).to.be.equal(null);
      });

      it('should return null with parameter of null for db.$find()', () => {
        expect(db.$find(null)).to.eventually.be.equal(null);
      });
    });

    describe('findOne / $findOne', () => {
      describe('no entries', () => {
        it('should return null with db.findOne() when there is no entry in the database', () => {
          expect(db.findOne()).to.be.equal(null);
        });

        it('should return null with db.$findOne() when there is no entry in the database', () => {
          expect(db.$findOne()).to.eventually.be.equal(null);
        });

        it('should return null with parameter of undefined for db.findOne() when there is no entry in the database', () => {
          expect(db.findOne(undefined)).to.be.equal(null);
        });

        it('should return null with parameter of undefined for db.$findOne() when there is no entry in the database', () => {
          expect(db.$findOne(undefined)).to.eventually.be.equal(null);
        });
      });

      describe('multiple entries', () => {
        beforeEach(() => {
          db.insertMany([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 },
            { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }]);
        });

        it('should return the first object with db.findOne() when there are multiple entries in the database', () => {
          expect(db.findOne()).to.be.an('object');
        });

        it('should return the first object with params _id, first_name, last_name, age and created_at with db.findOne() when there are multiple entries in the database', () => {
          expect(db.findOne()).to.have.property('_id');
          expect(db.findOne()).to.have.property('first_name');
          expect(db.findOne()).to.have.property('last_name');
          expect(db.findOne()).to.have.property('age');
          expect(db.findOne()).to.have.property('created_at');
        });

        it('should return the first object with db.$findOne() when there are multiple entries in the database', () => {
          expect(db.$findOne()).to.eventually.be.an('object');
        });

        it('should return the first object with params _id, first_name, last_name, age and created_at with db.$findOne() when there are multiple entries in the database', () => {
          expect(db.$findOne()).to.eventually.have.property('_id');
          expect(db.$findOne()).to.eventually.have.property('first_name');
          expect(db.$findOne()).to.eventually.have.property('last_name');
          expect(db.$findOne()).to.eventually.have.property('age');
          expect(db.$findOne()).to.eventually.have.property('created_at');
        });

        it('should return the first object with parameter of undefined for db.findOne() when there are multiple entries in the database', () => {
          expect(db.findOne(undefined)).to.be.an('object');
        });

        it('should return the first object with params _id, first_name, last_name, age and created_at with parameter of undefined for db.findOne() when there are multiple entries in the database', () => {
          expect(db.findOne(undefined)).to.have.property('_id');
          expect(db.findOne(undefined)).to.have.property('first_name');
          expect(db.findOne(undefined)).to.have.property('last_name');
          expect(db.findOne(undefined)).to.have.property('age');
          expect(db.findOne(undefined)).to.have.property('created_at');
        });

        it('should return the first object with parameter of undefined for db.$findOne() when there are multiple entries in the database', () => {
          expect(db.$findOne(undefined)).to.eventually.be.an('object');
        });

        it('should return the first object with params _id, first_name, last_name, age and created_at with parameter of undefined for db.$findOne() when there are multiple entries in the database', () => {
          expect(db.$findOne(undefined)).to.eventually.have.property('_id');
          expect(db.$findOne(undefined)).to.eventually.have.property('first_name');
          expect(db.$findOne(undefined)).to.eventually.have.property('last_name');
          expect(db.$findOne(undefined)).to.eventually.have.property('age');
          expect(db.$findOne(undefined)).to.eventually.have.property('created_at');
        });
      });

      it('should return null with parameter of string for db.findOne()', () => {
        expect(db.findOne('hello')).to.be.equal(null);
      });

      it('should return null with parameter of string for db.$findOne()', () => {
        expect(db.$findOne('hello')).to.eventually.be.equal(null);
      });

      it('should return null with parameter of number for db.$findOne()', () => {
        expect(db.$findOne(100)).to.eventually.be.equal(null);
      });

      it('should return null with parameter of null for db.findOne()', () => {
        expect(db.findOne(null)).to.be.equal(null);
      });

      it('should return null with parameter of null for db.$findOne()', () => {
        expect(db.$findOne(null)).to.eventually.be.equal(null);
      });
    });
  });
});
