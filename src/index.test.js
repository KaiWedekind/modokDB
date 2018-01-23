/* eslint-env mocha */
const chai = require('chai');
const sinon = require('sinon');
const EventEmitter = require('events').EventEmitter;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const Modok = require('./index');

let db = null;

const fs = require('fs');
const path = require('path');

function rimraf(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((entry) => {
      const entryPath = path.join(dirPath, entry);
      if (fs.lstatSync(entryPath).isDirectory()) {
        rimraf(entryPath);
      } else {
        fs.unlinkSync(entryPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

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
