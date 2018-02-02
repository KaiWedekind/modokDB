/* eslint-env mocha */
/* eslint no-unused-vars: 0 */

const fs = require('fs');
const chai = require('chai');
const sinon = require('sinon');
const EventEmitter = require('events').EventEmitter;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const Modok = require('./index');

/* Helper */

const {
  uuid,
  newDatabaseFile,
  readDatabaseFile,
  readDatabaseStats,
  readDatabaseStatsSync,
  resolveData,
  isObject,
  isArray,
  rimraf,
} = require('./helper');

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

      it('should thow an error if no collection name', () => {
        expect(() => new Modok()).to.throw('Name is required');
      });
    });

    describe('Check ready event', () => {
      it('should emit the ready event', () => {
        const spy = sinon.spy();
        const emitter = new EventEmitter();
        emitter.on('ready', spy);
        emitter.emit('ready');
        sinon.assert.calledOnce(spy);
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

        it('should return first document with db.findOne() if more documents found', () => {
          expect(db.findOne({ last_name: 'Doe' })).to.be.an('object');
          expect(db.findOne({ last_name: 'Doe' }).first_name).to.be.equal('John');
        });

        it('should return first document with db.$findOne() if more documents found', () => {
          expect(db.$findOne({ last_name: 'Doe' })).to.eventually.be.an('object');
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

    describe('findOneAndDelete / $findOneAndDelete', () => {
      beforeEach(() => {
        db.insertMany([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 },
          { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }]);
      });

      it('should find and delete the object found by given first_name with db.findOneAndDelete()', () => {
        db.findOneAndDelete({ first_name: 'John' });
        expect(db.find({}).length).to.be.equal(1);
      });

      it('should find and delete the object found by given first_name with db.$findOneAndDelete()', async () => {
        await db.$findOneAndDelete({ first_name: 'John' });
        expect(db.find({}).length).to.be.equal(1);
      });

      it('should find only "Jane" when "John" was found and deleted with db.findOneAndDelete()', () => {
        db.findOneAndDelete({ first_name: 'John' });
        expect(db.find({ _id: 0 })).to.be.equal(null);
      });

      it('should find only "Jane" when "John" was found and deleted with db.$findOneAndDelete()', async () => {
        await db.$findOneAndDelete({ first_name: 'John' });
        expect(db.find({ _id: 0 })).to.be.equal(null);
      });
    });

    describe('update / $update', () => {
      beforeEach(() => {
        db.insertMany([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 },
          { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }]);
      });

      it('should update the last_name with db.update()', () => {
        db.update({ first_name: 'Jane' }, { last_name: 'Mayer' });
        expect(db.findOne({ first_name: 'Jane' }).last_name).to.be.equal('Mayer');
      });

      it('should update the last_name with db.$update()', async () => {
        await db.$update({ first_name: 'Jane' }, { last_name: 'Mayer' });
        expect(db.findOne({ first_name: 'Jane' }).last_name).to.be.equal('Mayer');
      });

      it('should update and return the object found for db.update()', () => {
        db.update({ _id: 0 }, { age: 60, first_name: 'Jon', last_name: 'Smith' });
        expect(db.findOne({ _id: 0 }).last_name).to.be.equal('Smith');
        expect(db.findOne({ _id: 0 }).first_name).to.be.equal('Jon');
      });

      it('should update and return the object found for db.$update()', async () => {
        await db.$update({ _id: 0 }, { age: 60, first_name: 'Jon', last_name: 'Smith' });
        expect(db.findOne({ _id: 0 }).last_name).to.be.equal('Smith');
        expect(db.findOne({ _id: 0 }).first_name).to.be.equal('Jon');
      });

      it('should return null for db.update()', () => {
        db.update({ _id: 2580 }, { age: 60, first_name: 'Jon', last_name: 'Smith' }, { upsert: false });
        expect(db.findOne({ _id: 2580 })).to.be.equal(null);
      });

      it('should insert a new entry for db.update() with upsert: true', async () => {
        db.update({ _id: 2569 }, { age: 60, first_name: 'Jon', last_name: 'Smith' }, { upsert: true });
        expect(db.findOne({ _id: 2569 }).last_name).to.be.equal('Smith');
        expect(db.findOne({ _id: 2569 }).first_name).to.be.equal('Jon');
      });

      it('should insert a new entry for db.$update() with upsert: true', async () => {
        await db.$update({ _id: 2569 }, { age: 60, first_name: 'Jon', last_name: 'Smith' }, { upsert: true });
        expect(db.findOne({ _id: 2569 }).last_name).to.be.equal('Smith');
        expect(db.findOne({ _id: 2569 }).first_name).to.be.equal('Jon');
      });
    });

    describe('updateOne / $updateOne', () => {
      beforeEach(() => {
        db.insertMany([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 },
          { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }]);
      });

      it('should update the last_name with db.updateOne()', () => {
        db.updateOne({ last_name: 'Doe' }, { last_name: 'Mayer' });
        expect(db.findOne({ _id: 0 }).last_name).to.be.equal('Mayer');
      });

      it('should update the last_name with db.$updateOne()', async () => {
        await db.$updateOne({ last_name: 'Doe' }, { last_name: 'Mayer' });
        expect(db.findOne({ _id: 0 }).last_name).to.be.equal('Mayer');
      });

      it('should insert a new entry for db.updateOne() with upsert: true', () => {
        db.updateOne({ _id: 2570 }, { age: 60, first_name: 'Jon', last_name: 'Smith' }, { upsert: true });
        expect(db.findOne({ _id: 2570 }).last_name).to.be.equal('Smith');
        expect(db.findOne({ _id: 2570 }).first_name).to.be.equal('Jon');
      });

      it('should insert a new entry for db.$updateOne() with upsert: true', async () => {
        await db.$updateOne({ _id: 2570 }, { age: 60, first_name: 'Jon', last_name: 'Smith' }, { upsert: true });
        expect(db.findOne({ _id: 2570 }).last_name).to.be.equal('Smith');
        expect(db.findOne({ _id: 2570 }).first_name).to.be.equal('Jon');
      });

      it('should return null for db.updateOne() if not upsert: true', () => {
        db.updateOne({ _id: 2580 }, { age: 60, first_name: 'Jon', last_name: 'Smith' }, { upsert: false });
        expect(db.findOne({ _id: 2580 })).to.be.equal(null);
      });

      it('should return null for db.$updateOne() if not upsert: true', async () => {
        await db.$updateOne({ _id: 2580 }, { age: 60, first_name: 'Jon', last_name: 'Smith' }, { upsert: false });
        expect(db.findOne({ _id: 2580 })).to.be.equal(null);
      });

      it('should update and return the first object found for db.updateOne()', () => {
        db.updateOne({ _id: 0 }, { age: 60, first_name: 'Jon', last_name: 'Smith' });
        expect(db.findOne({ _id: 0 }).last_name).to.be.equal('Smith');
        expect(db.findOne({ _id: 0 }).first_name).to.be.equal('Jon');
      });

      it('should update and return the first object found for db.$updateOne()', async () => {
        await db.$updateOne({ _id: 0 }, { age: 60, first_name: 'Jon', last_name: 'Smith' });
        expect(db.findOne({ _id: 0 }).last_name).to.be.equal('Smith');
        expect(db.findOne({ _id: 0 }).first_name).to.be.equal('Jon');
      });
    });

    describe('updateMany / $updateMany', () => {
      beforeEach(() => {
        db.insertMany([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 },
          { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }]);
      });

      it('should update all last_name\'s with db.updateMany()', () => {
        db.updateMany({ last_name: 'Doe' }, { last_name: 'Smith' });
        expect(db.findOne({ _id: 0 }).last_name).to.be.equal('Smith');
        expect(db.findOne({ _id: 1 }).last_name).to.be.equal('Smith');
      });

      it('should update all last_name\'s with db.$updateMany()', async () => {
        await db.$updateMany({ last_name: 'Doe' }, { last_name: 'Smith' });
        expect(db.findOne({ _id: 0 }).last_name).to.be.equal('Smith');
        expect(db.findOne({ _id: 1 }).last_name).to.be.equal('Smith');
      });
    });

    describe('count / $count', () => {
      beforeEach(() => {
        db.insertMany([
          { _id: 0, first_name: 'John' },
          { _id: 1, first_name: 'Jane' },
          { _id: 2, first_name: 'Joe' },
        ]);
      });

      it('should return 3 with db.count()', () => {
        expect(db.count()).to.be.equal(3);
      });

      it('should return 3 with db.$count()', () => {
        expect(db.$count()).to.eventually.be.equal(3);
      });
    });

    describe('stats / $stats', () => {
      beforeEach(() => {
        db.insertMany([
          { _id: 0, first_name: 'John' },
          { _id: 1, first_name: 'Jane' },
          { _id: 2, first_name: 'Joe' },
        ]);
      });

      it('should return an object for db.stats() with no file storage', () => {
        expect(db.stats()).to.be.an('object');
      });

      it('should return an object with property size for db.stats() with no file storage', () => {
        expect(db.stats()).to.have.property('size');
      });

      it('should return an object for db.$stats() with no file storage', () => {
        expect(db.$stats()).to.eventually.be.an('object');
      });

      it('should return an object with property size for db.$stats() with no file storage', () => {
        expect(db.$stats()).to.eventually.have.property('size');
      });
    });

    describe('drop / $drop', () => {
      beforeEach(() => {
        db.insertMany([
          { _id: 0, first_name: 'John' },
          { _id: 1, first_name: 'Jane' },
          { _id: 2, first_name: 'Joe' },
        ]);
      });

      it('should remove the collection with db.drop()', () => {
        expect(db.count()).to.be.equal(3);
        db.drop();
        expect(db.count()).to.be.equal(0);
      });

      it('should remove the collection with db.$drop()', async () => {
        expect(db.$count()).to.eventually.be.equal(3);
        await db.$drop();
        expect(db.$count()).to.eventually.be.equal(0);
      });
    });

    describe('Check deleteOne / $deleteOne', () => {
      beforeEach(() => {
        db.insertMany([
          { _id: 0, first_name: 'John' },
          { _id: 1, first_name: 'Jane' },
          { _id: 2, first_name: 'Joe' },
        ]);
      });

      it('should delete an object with db.deleteOne(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.deleteOne({ _id: 1 })).to.be.equal(true);
        expect(db.count()).to.be.equal(2);
      });

      it('should delete an object with db.$deleteOne(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$deleteOne({ _id: 1 })).to.eventually.be.equal(true);
        expect(db.count()).to.be.equal(2);
      });

      it('should delete an object with db.deleteOne(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.deleteOne({ first_name: 'Jane' })).to.be.equal(true);
        expect(db.count()).to.be.equal(2);
      });

      it('should delete an object with db.$deleteOne(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$deleteOne({ first_name: 'Jane' })).to.eventually.be.equal(true);
        expect(db.count()).to.be.equal(2);
      });

      it('should return false when no document found for db.deleteOne(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.deleteOne({ _id: 4 })).to.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false when no document found for db.$deleteOne(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$deleteOne({ _id: 4 })).to.eventually.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return null when no valid query for db.deleteOne(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.deleteOne('<query>')).to.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return null when no valid query for db.$deleteOne(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$deleteOne('<query>')).to.eventually.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return null when no document found for db.deleteOne(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.deleteOne({ first_name: 'Jason' })).to.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return null when no document found for db.$deleteOne(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$deleteOne({ first_name: 'Jason' })).to.eventually.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });
    });

    describe('Check delete / $delete', () => {
      beforeEach(() => {
        db.insertMany([
          { _id: 0, first_name: 'John', last_name: 'Smith' },
          { _id: 1, first_name: 'Jane', last_name: 'Doe' },
          { _id: 2, first_name: 'Joe', last_name: 'Doe' },
        ]);
      });

      it('should delete an object with db.delete(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.delete({ last_name: 'Doe' })).to.be.equal(true);
        expect(db.count()).to.be.equal(1);
      });

      it('should delete an object with db.$delete(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$delete({ last_name: 'Doe' })).to.eventually.be.equal(true);
        expect(db.count()).to.be.equal(1);
      });

      it('should delete an object with db.delete(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.delete({ _id: 1 })).to.be.equal(true);
        expect(db.count()).to.be.equal(2);
      });

      it('should delete an object with db.$delete(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$delete({ _id: 1 })).to.eventually.be.equal(true);
        expect(db.count()).to.be.equal(2);
      });

      it('should return false with db.delete(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.delete({ _id: 4 })).to.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false with db.$delete(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$delete({ _id: 4 })).to.eventually.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false when no document found for db.delete(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.delete({ first_name: 'Jason' })).to.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false when no document found for db.$delete(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$delete({ first_name: 'Jason' })).to.eventually.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false when no document found for db.delete(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.delete({ last_name: 'Taylor' })).to.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false when no document found for db.$delete(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$delete({ last_name: 'Taylor' })).to.eventually.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false when no valid query for db.delete(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.delete('<query>')).to.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false when no valid query for db.$delete(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$delete('<query>')).to.eventually.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });
    });

    describe('Check deleteMany / $deleteMany', () => {
      beforeEach(() => {
        db.insertMany([
          { _id: 0, first_name: 'John', last_name: 'Smith' },
          { _id: 1, first_name: 'Jane', last_name: 'Doe' },
          { _id: 2, first_name: 'Joe', last_name: 'Doe' },
        ]);
      });

      it('should delete an object with db.deleteMany(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.deleteMany({ last_name: 'Doe' })).to.be.equal(true);
        expect(db.count()).to.be.equal(1);
      });

      it('should delete an object with db.$deleteMany(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$deleteMany({ last_name: 'Doe' })).to.eventually.be.equal(true);
        expect(db.count()).to.be.equal(1);
      });

      it('should delete an object with db.deleteMany(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.deleteMany({ _id: 1 })).to.be.equal(true);
        expect(db.count()).to.be.equal(2);
      });

      it('should delete an object with db.$deleteMany(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$deleteMany({ _id: 1 })).to.eventually.be.equal(true);
        expect(db.count()).to.be.equal(2);
      });

      it('should return false with db.deleteMany(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.deleteMany({ _id: 4 })).to.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false with db.$deleteMany(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$deleteMany({ _id: 4 })).to.eventually.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false when no document found for db.deleteMany(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.deleteMany({ first_name: 'Jason' })).to.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false when no document found for db.$deleteMany(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$deleteMany({ first_name: 'Jason' })).to.eventually.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false when no document found for db.deleteMany(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.deleteMany({ last_name: 'Taylor' })).to.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false when no document found for db.$deleteMany(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$deleteMany({ last_name: 'Taylor' })).to.eventually.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false when no valid query for db.deleteMany(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.deleteMany('<query>')).to.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });

      it('should return false when no valid query for db.$deleteMany(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$deleteMany('<query>')).to.eventually.be.equal(false);
        expect(db.count()).to.be.equal(3);
      });
    });

    describe('Check deleteOneById / $deleteOneById', () => {
      beforeEach(() => {
        db.insertMany([
          { _id: 0, first_name: 'John' },
          { _id: 1, first_name: 'Jane' },
          { _id: 2, first_name: 'Joe' },
        ]);
      });

      it('should delete an object with db.deleteOneById(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        expect(db.deleteOneById(1)).to.be.equal(true);
        expect(db.count()).to.be.equal(2);
      });

      it('should delete an object with db.$deleteOneById(<query>)', async () => {
        expect(db.count()).to.be.equal(3);
        await expect(db.$deleteOneById(2)).to.eventually.be.equal(true);
        expect(db.count()).to.be.equal(2);
      });
    });

    describe('Collection Reference', () => {
      it('should return collection reference', () => {
        expect(Modok('users')).to.be.an('object');
      });

      it('should have the property name', () => {
        expect(Modok('users')).to.have.property('name');
      });

      it('should store the collection name', () => {
        expect(Modok('users').name).to.equal('users');
      });

      it('should thow an error if collection unknown', () => {
        expect(() => Modok('posts')).to.throw('No database with name posts found');
      });
    });

    describe('Check renameCollection / $renameCollection', () => {
      it('should change the collection name with db.renameCollection(<name>)', () => {
        expect(Modok('users').renameCollection('accounts').name).to.equal('accounts');
      });

      it('should change the collection name with db.$renameCollection(<name>)', () => {
        expect(Modok('users').$renameCollection('accounts')).to.eventually.to.have.property('name');
      });
    });
  });

  describe('Create instance with file storage', () => {
    beforeEach(() => {
      db = new Modok('users', { filepath: './data/users', filename: 'database' });
    });

    afterEach(() => {
      db = null;
      rimraf('./data');
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

      it('should thow an error if no collection name', () => {
        expect(() => new Modok()).to.throw('Name is required');
      });
    });
  });
});

describe('Helper', () => {
  beforeEach(() => {
    db = new Modok('users');
  });

  afterEach(() => {
    db = null;
  });

  describe('Check newDatabaseFile', () => {

  });

  describe('Check readDatabaseFile', () => {

  });

  describe('Check readDatabaseStats', () => {

  });

  describe('Check readDatabaseStatsSync', () => {
    it('should call fs.openSync', () => {
      const openSync = sinon.stub(fs, 'openSync').returns(0);
      const filePath = './data';
      const fileName = 'users';
      readDatabaseStatsSync(db, filePath, fileName);
      openSync.restore();
      sinon.assert.called(openSync);
    });

    it('should call fs.openSync with args', () => {
      const openSync = sinon.stub(fs, 'openSync').returns(0);
      const filePath = './data';
      const fileName = 'users';
      readDatabaseStatsSync(db, filePath, fileName);
      openSync.restore();
      sinon.assert.calledWith(openSync, `${filePath}/${fileName}.json`, 'r');
    });
  });

  describe('Check rimraf', () => {
    it('should call fs.existsSync', () => {
      const existsSync = sinon.stub(fs, 'existsSync');
      const dirPath = './data';
      rimraf(dirPath);
      existsSync.restore();
      sinon.assert.called(existsSync);
    });

    it('should call fs.existsSync with dir path', () => {
      const existsSync = sinon.stub(fs, 'existsSync');
      const dirPath = './data';
      rimraf(dirPath);
      existsSync.restore();
      sinon.assert.calledWith(existsSync, dirPath);
    });
  });

  describe('Check uuid', () => {

  });

  describe('Check resolveData', () => {

  });

  describe('Check isObject', () => {
    it('should return true', () => {
      expect(isObject({})).to.be.an('boolean');
      expect(isObject({})).to.be.equal(true);
      expect(isObject({ first_name: 'John' })).to.be.equal(true);
      expect(isObject({ first_name: 'John', last_name: 'Doe' })).to.be.equal(true);
    });

    it('should return false', () => {
      expect(isObject([])).to.be.an('boolean');
      expect(isObject([])).to.be.equal(false);
      expect(isObject(null)).to.be.equal(false);
      expect(isObject('String')).to.be.equal(false);
      expect(isObject(123)).to.be.equal(false);
    });
  });

  describe('Check isArray', () => {
    it('should return true', () => {
      expect(isArray([])).to.be.an('boolean');
      expect(isArray([])).to.be.equal(true);
      expect(isArray([{}])).to.be.equal(true);
      expect(isArray([{}, {}])).to.be.equal(true);
    });

    it('should return false', () => {
      expect(isArray({})).to.be.an('boolean');
      expect(isArray({})).to.be.equal(false);
      expect(isArray(null)).to.be.equal(false);
      expect(isArray('String')).to.be.equal(false);
      expect(isArray(123)).to.be.equal(false);
    });
  });
});

