const Modok = require('./dist/index.js');

const users = new Modok('users');

users.insert(1, { first_name: 'John', last_name: 'Doe' });
users.insert(2, { first_name: 'Jane', last_name: 'Doe' });

const john_doe = users.findOne(1);

console.log('john_doe', john_doe);

users.update(1, { first_name: 'Jonas', last_name: 'Doe' });

const john_does = users.find({ last_name: 'Doe' });

console.log('john_does', john_does);

console.log(users.findOne(1));
console.log(users.has(2));
console.log(users.update(1, { test: 333, hi: 123 }));
console.log(users.findOne(1));

const usersRef = Modok('users');

const results = users.find({ last_name: 'Doe' });
const resultsRef = usersRef.find({ last_name: 'Doe' });

console.log('results', results);
console.log('resultsRef', resultsRef);
