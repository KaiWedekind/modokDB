const Brainstack = {};

const Brain = function Brain(name) {
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
    Brainstack[name] = this;
  }

  return this;
};

Brain.prototype.has = function has(index) {
  return this.store.get(index) !== undefined;
};

Brain.prototype.update = function update(index, fields) {
  if (!index || !this.store.get(index)) {
    return 'Index not found';
  }

  if (!fields) {
    return 'fields not found';
  }

  let value = this.store.get(index);
  value = Object.assign(value, fields);
  this.store.set(index, value);

  return value;
};

Brain.prototype.insert = function insert(index, value) {
  return this.store.set(index, value);
};

Brain.prototype.findOne = function findOne(index) {
  return this.store.get(index);
};

Brain.prototype.find = function find(object) {
  const keys = Object.keys(object);
  const values = Object.values(object);
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

  return found;
};

const main = Brain;

export default main;
module.exports = main; // for CommonJS compatibility
