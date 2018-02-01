<img width="150" alt="modokdb" src="https://user-images.githubusercontent.com/12070900/35472660-9595c054-0373-11e8-92c4-6452144b2ad7.png">

# modokDB

#### In-memory Database

modokDB is a small high performant in-memory database powered by JavaScript Maps (supports Node, Electron and the browser)

[![NPM](https://nodei.co/npm/modokdb.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/modokdb/)

[![Travis](https://img.shields.io/travis/KaiWedekind/modokDB.svg)]()
[![Codecov](https://img.shields.io/codecov/c/github/KaiWedekind/modokDB.svg)]()
[![Issues](https://img.shields.io/github/issues/KaiWedekind/modokDB.svg)](https://github.com/KaiWedekind/modokDB/issues)
[![Github All Releases](https://img.shields.io/npm/dt/modokdb.svg)]()
[![Forks](https://img.shields.io/github/forks/KaiWedekind/modokDB.svg)](https://github.com/KaiWedekind/modokDB/network)
[![Stars](https://img.shields.io/github/stars/KaiWedekind/modokDB.svg)](https://github.com/KaiWedekind/modokDB/stargazers)
[![License](https://img.shields.io/github/license/KaiWedekind/modokDB.svg)](https://raw.githubusercontent.com/KaiWedekind/modokDB/master/LICENSE)
[![Package](https://img.shields.io/badge/npm-5.0.3-blue.svg)](package)
[![CodeOfConduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg)]()

## The Problem
You are looking for a database that is simple and without any dependencies to install.

## The Solution
modokDB is a high performant and convenient method for storing data without setting up a database server. It is fast and excellent to be used as an embedded database.

## Installation

This module is distributed via [npm](https://www.npmjs.com/) which is bundled with [node](https://nodejs.org/) and should be installed as one of your project's `dependencies`:

```
npm install --save modokdb
```

Alternatively, if you're using <a href="https://yarnpkg.com/lang/en/">yarn</a>

```
yarn add modokdb
```

A UMD build is also available on <a href="https://unpkg.com/#/">unpkg</a> for testing and quick prototyping:

```html
<script src="https://unpkg.com/modokdb/dist/modokdb.min.js"></script>
<script>
  var db = new modokdb('users')
</script>
```

## Usage

***Without file storage:***
```javascript
const Modok = require('modokdb');
const db = new Modok('users');
```

***With file storage:***
```javascript
const Modok = require('modokdb');
const db = new Modok('users', { filepath: './data/users', filename: 'database' });

db.ready.then(() => {
  console.log('Database file is ready');
});
```

#### db.has - Synchronous (_returns true / false_)
```javascript
const isAvailable = db.has(<index>); 
```

#### db.$has - Asynchronous (_returns true / false_)
```javascript
db.$has(<index>).then((value) => {
    console.log(value);
}); 
```

#### db.insert - Synchronous (_returns database entry_)
```javascript
const user = db.insert({ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 });
console.log('User', user)
```

#### db.insert - Synchronous (_returns database entries_)
```javascript
const users = db.insert([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 }, 
                         { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }]);
console.log('Users', users)
```

#### db.$insert - Asynchronous (_returns database entry_)
```javascript
db.$insert({ _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }).then((user) => {
    console.log('User', user);
});
```

#### db.$insert - Asynchronous (_returns database entries_)
```javascript
db.$insert([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 }, 
            { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }]).then((users) => {
    console.log('Users', users);
});
```

#### db.insertOne - Synchronous (_returns database entry / entries_)
```javascript
const user = db.insertOne({ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 });
console.log('User', user)
```

#### db.$insertOne - Asynchronous (_returns database entry / entries_)
```javascript
db.$insertOne({ _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }).then((user) => {
    console.log('User', user);
});
```

#### db.insertMany - Synchronous (_returns database entry / entries_)
```javascript
const users = db.insertMany([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 }, 
                             { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }]);
console.log('Users', users)
```

#### db.$insertMany - Asynchronous (_returns database entry / entries_)
```javascript
db.$insertMany([{ _id: 0, first_name: 'John', last_name: 'Doe', age: 29 }, 
                { _id: 1, first_name: 'Jane', last_name: 'Doe', age: 27 }]).then((users) => {
    console.log('Users', users);
});
```

#### db.find - Synchronous (_returns database entry / null)
```javascript
const users = db.find({ last_name: 'Doe' });
console.log('Users', users)
```

#### db.$find - Asynchronous (_returns database entry / null)
```javascript
db.$find({ last_name: 'Doe' }).then((users) => {
    console.log('Users', users);
});
```

#### db.findOne - Synchronous (_returns database entry / null)
```javascript
const users = db.findOne({ last_name: 'Doe' });
console.log('User', users)
```

#### db.$findOne - Asynchronous (_returns database entry / null)
```javascript
db.$findOne({ last_name: 'Doe' }).then((users) => {
    console.log('User', users);
});
```

#### db.findOneAndDelete - Synchronous (_returns database entry / null)
```javascript
const users = db.findOneAndDelete({ last_name: 'Doe' });
console.log('User', users)
```

#### db.$findOneAndDelete - Asynchronous (_returns database entry / null)
```javascript
db.$findOneAndDelete({ last_name: 'Doe' }).then((users) => {
    console.log('User', users);
});
```

#### db.update - Synchronous (_returns database entry / null)
```javascript
const updatedUsers = db.update({ first_name: 'Jane' }, { age: 45, last_name: 'Mayer' });
console.log('updatedUsers', updatedUsers)
```

#### db.$update - Asynchronous (_returns database entry / null)
```javascript
db.$update({ first_name: 'Jane' }, { age: 45, last_name: 'Mayer' }).then((users) => {
    console.log('users', users);
});
```

#### db.update - upsert : true - Synchronous (_returns database entry / null)
```javascript
const updatedUsers = db.update({ first_name: 'Jane' }, { age: 45, last_name: 'Mayer' }, { upsert: true });
console.log('updatedUsers', updatedUsers)
```

#### db.$update - upsert : true - Asynchronous (_returns database entry / null)
```javascript
db.$update({ first_name: 'Jane' }, { age: 45, last_name: 'Mayer' }, { upsert: true }).then((users) => {
    console.log('users', users);
});
```

#### db.updateOne - Synchronous (_returns database entry / null)
```javascript
const updatedUser = db.updateOne({ first_name: 'Jane' }, { age: 45, last_name: 'Mayer' });
console.log('updatedUser', updatedUser)
```

#### db.$updateOne - Asynchronous (_returns database entry / null)
```javascript
db.$updateOne({ first_name: 'Jane' }, { age: 45, last_name: 'Mayer' }).then((user) => {
    console.log('user', user);
});
```

#### db.updateMany - Synchronous (_returns database entry / null)
```javascript
const updatedUsers = db.updateMany({ first_name: 'Jane' }, { age: 45, last_name: 'Mayer' });
console.log('updatedUsers', updatedUsers)
```

#### db.$updateMany - Asynchronous (_returns database entry / null)
```javascript
db.$updateMany({ first_name: 'Jane' }, { age: 45, last_name: 'Mayer' }).then((users) => {
    console.log('users', users);
});
```

#### db.count - Synchronous (_returns integer_)
```javascript
const count = db.count();
console.log('Count', count);
```

#### db.$count - Asynchronous (_returns integer_)
```javascript
db.$count().then((value) => {
  console.log('Count', value);
});
```

#### db.drop - Synchronous (_returns empty object_)
```javascript
db.drop();
```

#### db.$drop - Asynchronous (_returns empty object_)
```javascript
db.$drop().then(() => {
  
});
```

#### db.delete - Synchronous (_returns true / false_)
```javascript
db.delete({ last_name: 'Doe' });
```

#### db.$delete - Asynchronous (_returns true / false_)
```javascript
db.$delete({ last_name: 'Doe' }).then(() => {
  
});
```

#### db.deleteOne - Synchronous (_returns true / false_)
```javascript
db.deleteOne({ last_name: 'Doe' });
```

#### db.$deleteOne - Asynchronous (_returns true / false_)
```javascript
db.$deleteOne({ last_name: 'Doe' }).then(() => {
  
});
```

#### db.deleteOne - Synchronous (_returns true / false_)
```javascript
db.deleteMany({ last_name: 'Doe' });
```

#### db.$deleteOne - Asynchronous (_returns true / false_)
```javascript
db.$deleteMany({ last_name: 'Doe' }).then(() => {
  
});
```

#### db.deleteOneById - Synchronous (_returns true / false_)
```javascript
db.deleteOneById(2);
```

#### db.$deleteOne - Asynchronous (_returns true / false_)
```javascript
db.$deleteOneById(2).then(() => {
  
});
```

#### db.stats - Synchronous (_returns object_)
```javascript
const db = new Modok('users', { filepath: './data/users', filename: 'database' });
const stats = db.stats();
console.log('Stats', stats);
```

#### db.$stats - Asynchronous (_returns object_)
```javascript
const db = new Modok('users', { filepath: './data/users', filename: 'database' });

db.$stats().then((stats) => {
  console.log('Stats', stats);
});
```

### Collection Reference

```javascript
# File: 1
const db = new Modok('users', { filepath: './data/users', filename: 'database' });

# File: 2
const usersRef = Modok('users');
const results = usersRef.find({ last_name: 'Doe' });
console.log('results', results);
```

#### db.renameCollection - Synchronous (_returns collection reference_)
```javascript
const db = new Modok('users');
const newDB = db.renameCollection('accounts');
console.log('newDB', newDB);
```

#### db.$renameCollection - Asynchronous (_returns collection reference_)
```javascript
const db = new Modok('users');

db.$renameCollection('accounts').then((newDB) => {
  console.log('newDB', newDB);
});
```

## Contributors

<table>
    <tr>
        <td align="center">
            <img src="https://avatars0.githubusercontent.com/u/12070900?v=4&s=460" width="100px;"/><br />
            <sub><a href="https://www.kaiwedekind.com/" target="_blank">Kai Wedekind</a></sub>
        </td>
        <td align="center">
            <img src="https://avatars0.githubusercontent.com/u/35994116?s=96&v=4" width="100px;"/><br />
            <sub><a href="https://github.com/thomasreinecke" target="_blank">Thomas Reinecke</a></sub>
        </td>      
    <tr>
</table>



## LICENSE

MIT
