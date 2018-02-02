/* eslint no-underscore-dangle: 0 */
/* eslint no-unneeded-ternary: 0 */

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const ModokEmitter = new EventEmitter();

/* Helper */

const {
  newDatabaseFile,
  readDatabaseFile,
  readDatabaseStats,
  readDatabaseStatsSync,
  resolveData,
  isObject,
  isArray,
} = require('./helper');

/* Core */

const Brainstack = {};

const Brain = function Brain(name, config) {
  if (config && isObject(config)) {
    this.filePath = typeof config.filepath === 'string' ? path.resolve(config.filepath) : null;
    this.fileName = config.filename ? config.filename : name;
    this.writeToFile = fs && isObject(fs) && !this.filePath;

    if (this.filePath && this.fileName) {
      if (!fs.existsSync(`${this.filePath}/${this.fileName}.json`)) {
        newDatabaseFile(this.filePath, this.fileName).then(() => {
          ModokEmitter.emit('ready');
        });
      } else {
        readDatabaseFile(this.filePath, this.fileName).then((content) => {
          this.$insertMany(JSON.parse(content)).then(() => {
            ModokEmitter.emit('ready');
          });
        });
      }
    } else {
      ModokEmitter.emit('ready');
    }
  } else {
    ModokEmitter.emit('ready');
  }

  if (!name) {
    throw Error('Name is required');
  }

  if (!this) {
    if (!Brainstack[name]) {
      throw Error(`No database with name ${name} found`);
    } else {
      return Brainstack[name];
    }
  } else {
    this.store = new Map();
    this.name = name;
    Brainstack[name] = this;
  }

  return this;
};

/**
 * ready
 * Returns a promise.
 */

Brain.prototype.ready = (function ready() {
  return new Promise((resolve) => {
    ModokEmitter.on('ready', () => resolve());
  });
}());

/**
 * has / $has
 * Returns a boolean asserting whether a value has been
 * associated to the index in the database or not.
 */

// Synchronous
Brain.prototype.has = function has(_id) {
  return this.store.has(_id);
};

// Asynchronous
Brain.prototype.$has = function $has(_id) {
  return new Promise((resolve) => {
    resolve(this.store.has(_id));
  });
};

/**
 * insert / $insert
 * Inserts a document or documents into a collection.
 * _id: If the document does not specify an _id field,
 * then modokDB will add the _id field and assign a
 * unique id for the document before inserting.
 * If the document contains an _id field, the _id value
 * must be unique within the collection to avoid overwrites.
 */

// Synchronous
Brain.prototype.insert = function insert(object) {
  if (object && Array.isArray(object)) {
    const list = [];
    for (let i = 0; i < object.length; i += 1) {
      list.push(resolveData.call(this, object[i]));
    }
    return list;
  }
  return resolveData.call(this, object);
};

// Asynchronous
Brain.prototype.$insert = function $insert(object) {
  return new Promise((resolve) => {
    resolve(this.insert(object));
  });
};

/**
 * insertOne / $insertOne
 * Inserts a document into a collection.
 * _id: If the document does not specify an _id field,
 * then modokDB will add the _id field and assign a
 * unique id for the document before inserting.
 * If the document contains an _id field, the _id value
 * must be unique within the collection to avoid overwrites.
 */

// Synchronous
Brain.prototype.insertOne = function insertOne(object) {
  if (isObject(object)) {
    return this.insert(object);
  }

  return null;
};

// Asynchronous
Brain.prototype.$insertOne = function $insertOne(object) {
  return new Promise((resolve) => {
    if (isObject(object)) {
      return resolve(this.insert(object));
    }
    return resolve(null);
  });
};

/**
 * insertMany / $insertMany
 * Inserts multiple documents into a collection.
 * _id: If the document does not specify an _id field,
 * then modokDB will add the _id field and assign a
 * unique id for the document before inserting.
 * If the document contains an _id field, the _id value
 * must be unique within the collection to avoid overwrites.
 */

// Synchronous
Brain.prototype.insertMany = function insertMany(object) {
  if (isArray(object)) {
    return this.insert(object);
  }

  return null;
};

// Asynchronous
Brain.prototype.$insertMany = function $insertMany(object) {
  return new Promise((resolve) => {
    if (isArray(object)) {
      return resolve(this.insert(object));
    }
    return resolve(null);
  });
};


/**
 * find / $find
 * Selects documents in a collection or view and returns a cursor to the selected documents.
 */

// Synchronous
Brain.prototype.find = function find(object) {
  if (isObject(object)) {
    const keys = Object.keys(object);
    const values = Object.values(object);
    let foundById = null;
    let countById = 0;

    if (object && object._id !== undefined) {
      const document = this.store.get(object._id);

      if (document) {
        for (let i = 0; i < keys.length; i += 1) {
          if (document[keys[i]] === values[i]) {
            countById += 1;
          }
        }

        if (countById === keys.length) {
          foundById = document;
        }
      }

      return foundById;
    }

    const found = [];
    this.store.forEach((value) => {
      let count = 0;

      for (let i = 0; i < keys.length; i += 1) {
        if (value[keys[i]] === values[i]) {
          count += 1;
        }
      }

      if (count === keys.length) {
        found.push(value);
      }
    }, this.store);
    return (found && found.length > 0) ? found : null;
  } else if (object === undefined) {
    return Array.from(this.store.values());
  }

  return null;
};

// Asynchronous
Brain.prototype.$find = function $find(object) {
  return new Promise((resolve) => {
    resolve(this.find(object));
  });
};

/**
 * findOne / $findOne
 * Returns one document that satisfies the specified query criteria on the collection or view.
 * If multiple documents satisfy the query, this method returns the first document according to
 * the natural order which reflects the order of documents on the disk. In capped collections,
 * natural order is the same as insertion order. If no document satisfies the query,
 * the method returns null.
 */

// Synchronous
Brain.prototype.findOne = function findOne(object) {
  if (isObject(object)) {
    const keys = Object.keys(object);
    const values = Object.values(object);
    let foundById = null;
    let countById = 0;

    if (object._id) {
      const document = this.store.get(object._id);

      if (document) {
        for (let i = 0; i < keys.length; i += 1) {
          if (document[keys[i]] === values[i]) {
            countById += 1;
          }
        }

        if (countById === keys.length) {
          foundById = document;
        }
      }

      return foundById;
    }

    const found = [];
    this.store.forEach((value) => {
      let count = 0;

      for (let i = 0; i < keys.length; i += 1) {
        if (value[keys[i]] === values[i]) {
          count += 1;
        }
      }

      if (count === keys.length && found.length < 1) {
        found.push(value);
      }
    }, this.store);

    return (found && found.length > 0) ? found[0] : {};
  } else if (object === undefined) {
    return Array.from(this.store.values())[0] || null;
  }

  return null;
};

// Asynchronous
Brain.prototype.$findOne = function $findOne(object) {
  return new Promise((resolve) => {
    resolve(this.findOne(object));
  });
};


/**
 * findOneAndDelete / $findOneAndDelete
 * Returns one document that satisfies the specified query criteria on the collection or view.
 * If multiple documents satisfy the query, this method returns the first document according to
 * the natural order which reflects the order of documents on the disk. In capped collections,
 * natural order is the same as insertion order. If no document satisfies the query,
 * the method returns null.
 * The Document that was found gets deleted out of the collection or view.
 */

// Synchronous
Brain.prototype.findOneAndDelete = function findOneAndDelete(object) {
  if (isObject(object)) {
    const result = this.findOne(object);
    if (result != null) this.deleteOneById(result._id);
    return result;
  }
  return null;
};

// Asynchronous
Brain.prototype.$findOneAndDelete = function $findOneAndDelete(object) {
  return new Promise((resolve) => {
    resolve(this.findOneAndDelete(object));
  });
};


/**
 * update / $update
 * Modifies an existing document or documents in a collection.
 * The method can modify specific fields of an existing document or
 * documents or replace an existing document entirely, depending on the update parameter.
 */

// Synchronous
Brain.prototype.update = function update(_query, _update, _config) {
  const MergedDocuments = [];
  const documents = this.find(_query);
  if (documents && isArray(documents) && documents.length > 0) {
    for (let i = 0; i < documents.length; i += 1) {
      MergedDocuments.push(Object.assign(documents[i], _update));
    }
    return this.insert(MergedDocuments);
  } else if (documents && isObject(documents)) {
    return this.insert(Object.assign(documents, _update));
  } else if (_config && isObject(_config) && _config.upsert === true) {
    return this.insert(Object.assign(_query, _update));
  }
  return null;
};

// Asynchronous
Brain.prototype.$update = function $update(_query, _update, _config) {
  return new Promise((resolve) => {
    this.$find(_query).then((documents) => {
      if (documents && isArray(documents) && documents.length > 0) {
        const MergedDocuments = [];
        for (let i = 0; i < documents.length; i += 1) {
          MergedDocuments.push(Object.assign(documents[i], _update));
        }
        resolve(this.$insert(MergedDocuments));
      } else if (documents && isObject(documents)) {
        resolve(this.$insert(Object.assign(documents, _update)));
      } else if (_config && isObject(_config) && _config.upsert === true) {
        resolve(this.$insert(Object.assign(_query, _update)));
      }
    });
  });
};

/**
 * updateOne / $updateOne
 * Modifies a single existing document in a collection.
 * The method can modify specific fields of an existing document or
 * replace an existing document entirely, depending on the update parameter.
 */

// Synchronous
Brain.prototype.updateOne = function updateOne(_query, _update, _config) {
  const documents = this.find(_query);
  if (documents && isArray(documents) && documents.length > 0) {
    return this.insert(Object.assign(documents[0], _update));
  } else if (documents && isObject(documents)) {
    return this.insert(Object.assign(documents, _update));
  } else if (_config && isObject(_config) && _config.upsert === true) {
    return this.insert(Object.assign(_query, _update));
  }
  return null;
};

// Asynchronous
Brain.prototype.$updateOne = function $updateOne(_query, _update, _config) {
  return new Promise((resolve) => {
    this.$find(_query).then((documents) => {
      if (documents && isArray(documents) && documents.length > 0) {
        return resolve(this.$insert(Object.assign(documents[0], _update)));
      } else if (documents && isObject(documents)) {
        return resolve(this.$insert(Object.assign(documents, _update)));
      } else if (_config && isObject(_config) && _config.upsert === true) {
        return resolve(this.$insert(Object.assign(_query, _update)));
      }
      return resolve(null);
    });
  });
};

/**
 * updateMany / $updateMany
 * Modifies an existing document or documents in a collection.
 * The method can modify specific fields of an existing document or
 * documents or replace an existing document entirely, depending on the update parameter.
 */

// Synchronous
Brain.prototype.updateMany = Brain.prototype.update;

// Asynchronous
Brain.prototype.$updateMany = Brain.prototype.$update;

// Synchronous
Brain.prototype.count = function count() {
  return this.store.size;
};

// Asynchronous
Brain.prototype.$count = function $count() {
  return new Promise((resolve) => {
    resolve(this.store.size);
  });
};

/**
 * drop / $drop
 * Removes a collection from the database.
 */

// Synchronous
Brain.prototype.drop = function drop() {
  this.store.clear();
  return this.store;
};

// Asynchronous
Brain.prototype.$drop = function $drop() {
  return new Promise((resolve) => {
    this.store.clear();
    resolve(this.store);
  });
};

/**
 * stats / $stats
 * Returns statistics about the collection.
 */

// Synchronous
Brain.prototype.stats = function stats() {
  const store = this.store;
  return readDatabaseStatsSync(store, this.filePath, this.fileName);
};

// Asynchronous
Brain.prototype.$stats = function $stats() {
  const store = this.store;
  return new Promise((resolve) => {
    resolve(readDatabaseStats(store, this.filePath, this.fileName));
  });
};

/**
 * renameCollection / $renameCollection
 * Renames a collection.
 */

// Synchronous
Brain.prototype.renameCollection = function renameCollection(name) {
  delete Brainstack[this.name];
  this.name = name;
  Brainstack[name] = this;
  return this;
};

// Asynchronous
Brain.prototype.$renameCollection = function $renameCollection(name) {
  const that = this;
  return new Promise((resolve) => {
    delete Brainstack[that.name];
    that.name = name;
    Brainstack[name] = that;
    resolve(that);
  });
};

/**
 * deleteOne / $deleteOne
 * Deletes the first document that matches the query.
 * Use a field that is part of a unique index such as _id for precise deletions.
 */

// Synchronous
Brain.prototype.deleteOne = function deleteOne(object) {
  if (isObject(object)) {
    const keys = Object.keys(object);
    const values = Object.values(object);
    let foundById = null;
    let countById = 0;

    if (object._id) {
      const document = this.store.get(object._id);

      if (document) {
        for (let i = 0; i < keys.length; i += 1) {
          if (document[keys[i]] === values[i]) {
            countById += 1;
          }
        }

        if (countById === keys.length) {
          foundById = document;
        }
      }

      if (foundById && foundById._id) {
        return this.store.delete(foundById._id);
      }

      return false;
    }

    const found = [];
    this.store.forEach((value) => {
      let count = 0;

      for (let i = 0; i < keys.length; i += 1) {
        if (value[keys[i]] === values[i]) {
          count += 1;
        }
      }

      if (count === keys.length && found.length < 1) {
        found.push(value);
      }
    }, this.store);

    if (found && found.length > 0) {
      return this.store.delete(found[0]._id);
    }

    return false;
  }

  return false;
};

// Asynchronous
Brain.prototype.$deleteOne = function $deleteOne(object) {
  return new Promise((resolve) => {
    const value = this.deleteOne(object);
    resolve(value);
  });
};

/**
 * Removes all documents that match the filter from a collection.
 */
Brain.prototype.deleteMany = function deleteMany(object) {
  if (isObject(object)) {
    const keys = Object.keys(object);
    const values = Object.values(object);
    if (object._id) {
      return this.deleteOne(object);
    }

    const found = [];
    this.store.forEach((value) => {
      for (let i = 0; i < keys.length; i += 1) {
        if (value[keys[i]] === values[i]) {
          found.push(value);
        }
      }
    }, this.store);

    if (found && found.length > 0) {
      for (let i = 0; i < found.length; i += 1) {
        this.store.delete(found[i]._id);
      }
      return true;
    }

    return false;
  }

  return false;
};

Brain.prototype.$deleteMany = function $deleteMany(object) {
  return new Promise((resolve) => {
    resolve(this.deleteMany(object));
  });
};

Brain.prototype.delete = Brain.prototype.deleteMany;
Brain.prototype.$delete = Brain.prototype.$deleteMany;

Brain.prototype.deleteOneById = function deleteOne(index) {
  return this.store.delete(index);
};

Brain.prototype.$deleteOneById = function $deleteOne(index) {
  return new Promise((resolve) => {
    resolve(this.deleteOneById(index));
  });
};


// TODO //

/*

Brain.prototype.findAndModify = function findAndModify(object) {
  return object;
};


Brain.prototype.findOneAndReplace = function findOneAndReplace(object) {
  return object;
};

Brain.prototype.findOneAndUpdate = function findOneAndUpdate(object) {
  return object;
};

Brain.prototype.getIndexes = function getIndexes() {
  return Array.from(this.store.keys());
};
*/

const main = Brain;
export default main;
module.exports = main; // for CommonJS compatibility
