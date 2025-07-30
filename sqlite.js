const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./icecream.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conexión con la base de datos icecream.db establecida');
    }
});

module.exports = db;
