"use strict";
const app = require('./app');

app.listen(process.env.PORT || 4000, function () {
    console.log('le serveur est démarré !');
    console.log('oooooooooooooops');
});