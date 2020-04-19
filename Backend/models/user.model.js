const Sequelize = require('sequelize');
const db = require('./index');

const User = db.define('user', {
    Nom: {
        type: Sequelize.STRING
    },
    Prenom: {
        type: Sequelize.STRING
    },
    Email: {
        type: Sequelize.STRING,
        unique: true
    },
    Login: {
        type: Sequelize.STRING
    },
    MPasse: {
        type: Sequelize.STRING
    },
    Role: {
        type: Sequelize.ENUM('admin', 'user')
    }
});

module.exports = User;