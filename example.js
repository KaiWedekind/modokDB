const Modok = require('./dist/index.js');

const users = new Modok('users');

users.insert(1, { test: 123 });
users.insert(2, { new: 1433 });
users.insert(3, { id: 1, text: '123' });
users.insert(34, { id: 1, text: '123', new: true });

console.log(users.findOne(1));
console.log(users.has(2));
console.log(users.update(1, { test: 333, hi: 123 }));
console.log(users.findOne(1));

const usersRef = Modok('users');

const found = users.find({ id: 1, text: '123' });
const foundRef = usersRef.find({ id: 1, text: '123' });

console.log('found', found);
console.log('foundRef', foundRef);
