![modokdb](https://vignette.wikia.nocookie.net/marveldatabase/images/5/57/D.E.A.D.P.O.O.L..jpeg/revision/latest?cb=20130911033409)

# modokDB

#### In-memory Database

modokDB is a small high performant in-memory database powered by JavaScript Maps (supports Node, Electron and the browser)

[![NPM](https://nodei.co/npm/modokdb.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/modokdb/)

[![Travis](https://img.shields.io/travis/KaiWedekind/modokDB.svg)]()
[![Codecov](https://img.shields.io/codecov/c/github/KaiWedekind/modokDB.svg)]()
[![Issues](https://img.shields.io/github/issues/KaiWedekind/modokDB.svg)](https://github.com/KaiWedekind/modokDB/issues)
[![Github All Releases](https://img.shields.io/github/downloads/KaiWedekind/modokDB/total.svg)]()
[![Forks](https://img.shields.io/github/forks/KaiWedekind/modokDB.svg)](https://github.com/KaiWedekind/modokDB/network)
[![Stars](https://img.shields.io/github/stars/KaiWedekind/modokDB.svg)](https://github.com/KaiWedekind/modokDB/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/KaiWedekind/modokDB/master/LICENSE)
[![Package](https://img.shields.io/badge/npm-5.0.3-blue.svg)](package)
[![CodeOfConduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg)]()

## The Problem
You are looking for a database that is simple and without any dependencies to install.

## The Solution
modokDB is a high performant and convenient method for storing data without setting up a database server. It is fast and excelent to be used as an embedded database.

## Installation

This module is distributed via [npm](https://www.npmjs.com/) which is bundled with [node](https://nodejs.org/) and should be installed as one of your project's `dependencies`:

```
npm install --save modokDB
```

## Usage

```javascript
const Modok = require('modokdb');

const users = new Modok('users');

users.insert(1, { first_name: 'John', last_name: 'Doe' });
users.insert(2, { first_name: 'Jane', last_name: 'Doe' });

const john_doe = users.findOne(1);

users.update(1, { first_name: 'Jonas', last_name: 'Doe'})

const john_does = users.find({ last_name: 'Doe' });

console.log(users.has(2));
console.log(users.findOne(1));

const usersRef = Modok('users');

const results = users.find({ last_name: 'Doe' });
const resultsRef = usersRef.find({ last_name: 'Doe' });

```

## Contributors

<table>
    <tr>
        <td align="center">
            <img src="https://avatars0.githubusercontent.com/u/12070900?v=4&s=460" width="100px;"/><br />
            <sub><a href="https://www.kaiwedekind.com/" target="_blank">Kai Wedekind</a></sub>
        </td>
    <tr>
</table>

## LICENSE

MIT