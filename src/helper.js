/* eslint no-underscore-dangle: 0 */
/* eslint no-unneeded-ternary: 0 */

const fs = require('fs');
const path = require('path');

String.prototype.lengthInUtf8 = function lengthInUtf8() {
  const asciiLength = this.match(/[\u0000-\u007f]/g) ? this.match(/[\u0000-\u007f]/g).length : 0;
  const multiByteLength = encodeURI(this.replace(/[\u0000-\u007f]/g)).match(/%/g) ? encodeURI(this.replace(/[\u0000-\u007f]/g, '')).match(/%/g).length : 0;
  return asciiLength + multiByteLength;
};

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

function uuid() {
  return Math.random().toString(26).slice(2);
}

function getMemoryStats(store) {
  const values = Array.from(store.values());
  const valuesString = JSON.stringify(values);
  return {
    size: valuesString.lengthInUtf8(),
  };
}

function newDatabaseFile(filePath, fileName) {
  return new Promise((resolve, reject) => {
    const filePathChunks = filePath.split('/');

    let breadcrumb = '';
    for (let i = 0; i < filePathChunks.length; i += 1) {
      if (filePathChunks[i]) {
        breadcrumb += `/${filePathChunks[i]}`;
        if (!fs.existsSync(breadcrumb)) {
          fs.mkdirSync(breadcrumb);
        }
      }
    }

    fs.writeFile(`${filePath}/${fileName}.json`, JSON.stringify({}), 'utf8', (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function readDatabaseFile(filePath, fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${filePath}/${fileName}.json`, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

function writeDatabaseFile(filePath, fileName, content) {
  return new Promise((resolve, reject) => {
    if (filePath && fileName && fs.existsSync(`${filePath}/${fileName}.json`)) {
      fs.writeFile(`${filePath}/${fileName}.json`, JSON.stringify(content), 'utf8', (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.stringify(content));
      });
    } else {
      reject({ message: 'No file write' });
    }
  }).then(null, () => {});
}

function readDatabaseStats(store, filePath, fileName) {
  return new Promise((resolve, reject) => {
    if (filePath && fileName) {
      fs.open(`${filePath}/${fileName}.json`, 'r', (err, fd) => {
        if (err) {
          return reject(err);
        }

        if (fd) {
          fs.fstat(fd, (_err, stats) => {
            if (_err) {
              return reject(_err);
            }
            return resolve(stats);
          });
        }
        return reject('No file descriptor found');
      });
    }
    return resolve(getMemoryStats(store));
  });
}

function readDatabaseStatsSync(store, filePath, fileName) {
  if (!filePath || !fileName) {
    return getMemoryStats(store);
  }

  const fd = fs.openSync(`${filePath}/${fileName}.json`, 'r');
  return fs.fstatSync(fd);
}

function resolveData(object) {
  let id = (object) ? object._id : null;
  if (id === undefined || id === null) {
    id = uuid();
  }
  const data = (object) ? object : {};
  data._id = id;
  data.created_at = new Date();
  this.store.set(id, data);

  writeDatabaseFile(this.filePath, this.fileName, Array.from(this.store.values()));
  return this.store.get(id);
}

function isObject(item) {
  return (!!item) && (item.constructor === Object);
}

function isArray(item) {
  return (!!item) && (item.constructor === Array);
}

module.exports = {
  rimraf,
  uuid,
  getMemoryStats,
  newDatabaseFile,
  readDatabaseFile,
  writeDatabaseFile,
  readDatabaseStats,
  readDatabaseStatsSync,
  resolveData,
  isObject,
  isArray,
};
