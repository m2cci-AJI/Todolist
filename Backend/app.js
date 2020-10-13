/********** importation des librairies et des frameworks ***********************************/
/*jslint es6 */
"use strict";
const express = require('express'); // importation de micro-framework express
const db = require("./models/index"); // importation de framework sequelize
const bodyparser = require('body-parser'); // importation de package permettant de transformer le corps de la requete en objet json
const cors = require('cors'); // importation de pachkage de sécurité cors
const List = require('./models/list.model'); // importation du modèle list
const Category = require('./models/category.model'); // importation du modèle catégorie
const User = require('./models/user.model'); // importation du modéle utilisateur
const app = express(); // istanciation de l'objet express afin de créer le serveur
const multer = require('./config/multer.config'); // importation du middleware de configuration de multer
const path = require('path'); // importation du module path
const fs = require('fs'); // importation du module fs pour la gestion des fichiers dans le dossier back-end
const bcrypt = require('bcrypt'); // importation du module bcrypt pour cypter les mots de passe
const jsonwebtoken = require('jsonwebtoken'); // importation du module jsonwebtoken pour cérer un token d'authentification

/************************ connexion à la base de données ***********************************/

db.sync({ force: false }); // warning: if force is true, the database will be omitted ! please, take care !!!

/****************************** test de la connexion ****************************************/
db
  .authenticate()
  .then(function() {
    console.log('Connection has been established successfully.');
  })
  .catch(function(err) {
    console.error('Unable to connect to the database:', err);
  });

/********************************** création des middlewares pour plusieurs fonctionnalités ******************/
// middleware pour la sécurité
app.use(cors());
app.options('*', cors());
// middleware pour la trasformation du corps de la requete
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ limit: '10mb', extended: true }));
console.log('kkkkkkkkkkk');

/*************************************************** API REST **************************************************/

/****************************************** API REST du modèle category*****************************************/

app.post('/api/category', multer, function(req, resp, next) {
  let category;
  if (req.file !== undefined) {
    const thingObject = JSON.parse(req.body.thing);
    category = new Category({
      ...thingObject,
      imageURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  } else {
    category = new Category({
      Nom: req.body.Nom,
      Type: req.body.Type,
      Photo: req.body.Photo,
      imageURL: undefined,
      idUser: req.body.idUser,
    });
  }
  category.save()
    .then((data) => { resp.status(201).json({ message: 'la catégorie est ajoutée avec succès !', data: data }) })
    .catch((err) => { resp.status(400).json("l'erreur est la suivante: ", err) });
}); // middleware pour traiter la requete et la réponse associées à la route post '/api/category'

app.use('/images', express.static(path.join(__dirname, 'images'))); // middleware pour télécharger l'image du serveur

app.get('/api/categories/:id', (req, res, next) => {
  Category.findAll({ where: { idUser: req.params.id } })
    .then((categories) => { res.status(200).json({ message: 'les catégories sont téléchargées avec succès !', Data: categories }) })
    .catch((err) => { res.status(400).json({ err }) });
}); // middleware pour traiter la requete et la réponse associées à la route get '/api/category'

app.delete('/api/category/:id', (req, res, next) => {
  Category.findOne({
    where: { id: req.params.id }
  }).then((category) => {
    let object = Category.destroy({ where: { id: req.params.id } })
      .then(() => { res.status(200).json({ message: 'la catégorie est supprimée avec succès !' }) })
      .catch((err) => { res.status(400).json({ err }) });
    if (category.dataValues.imageURL === null) {
      return object;
    } else {
      const filename = category.imageURL.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        return object;
      });
    }
  })
    .catch((err) => {
      res.status(500).json({ err });
    });
}); // middleware pour traiter la requete et la réponse associées à la route delete '/api/category/:id'

app.get('/api/category/:id', (req, res, next) => {
  Category.findOne({
    where: { id: req.params.id }
  })
    .then((category) => { res.status(200).json({ message: 'la catégorie est téléchargée avec succès !', Data: category }) })
    .catch((err) => { res.status(400).json({ err }) });
}); // middleware pour traiter la requete et la réponse associées à la route get '/api/category/:id'

app.put('/api/category/:id', multer, (req, res, next) => {
  Category.findOne({
    where: { id: req.params.id }
  }).then((category) => {
    let updateObject;
    if (req.file) {
      const object = Category.update({
        ...JSON.parse(req.body.thing),
        imageURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }, { where: { id: req.params.id } });
      if (category.imageURL !== undefined) {
        const filename = category.imageURL.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          updateObject = object;
        });
      } else {
        updateObject = object;
      }
    } else {
      updateObject = Category.update({ ...JSON.parse(req.body.thing) }, { where: { id: req.params.id } });
    }
    return updateObject.then(() => { res.status(200).json({ message: 'la catégorie est mise à jour avec succès !' }) })
      .catch((err) => { res.status(400).json({ err }) });
  });
}); // middleware pour traiter la requete et la réponse associées à la route put '/api/category/:id'

/****************************************** API REST du modèle list*****************************************/

app.get('/api/lists/:id', (req, res, next) => {
  List.findAll({
    where: { idUser: req.params.id }
  })
    .then((categories) => { res.status(200).json({ message: 'les taches sont téléchargées avec succès !', Data: categories }) })
    .catch((err) => { res.status(400).json({ err }) });
}); // middleware pour traiter la requete et la réponse associées à la route get '/api/list'

app.post('/api/list', (req, res, next) => {
  List.create(req.body)
    .then((data) => { res.status(201).json({ message: 'la tache est ajoutée avec succès !', data: data }) })
    .catch((err) => { res.status(400).json({ err }) });
}); // middleware pour traiter la requete et la réponse associées à la route post '/api/category'

app.delete('/api/list/:id', (req, res, next) => {
  List.findOne({
    where: { id: req.params.id }
  }).then((list) => {
    return List.destroy({ where: { id: req.params.id } })
      .then(() => { res.status(200).json({ message: 'la tache est supprimée avec succès !' }) })
      .catch((err) => { res.status(400).json({ err }) });
  })
    .catch((err) => {
      res.status(500).json({ err });
    });
}); // middleware pour traiter la requete et la réponse associées à la route delete '/api/list/:id'

app.get('/api/list/:id', (req, res, next) => {
  List.findOne({
    where: { id: req.params.id }
  })
    .then((list) => { res.status(200).json({ message: 'la tache est téléchargée avec succès !', Data: list }) })
    .catch((err) => { res.status(400).json({ err }) });
}); // middleware pour traiter la requete et la réponse associées à la route get '/api/category/:id'

app.put('/api/list/:id', (req, res, next) => {
  List.findOne({
    where: { id: req.params.id }
  })
    .then(( ) => {
      List.update({ ...req.body }, { where: { id: req.params.id } })
        .then((list) => { res.status(200).json({ message: 'la tache est mise à jour avec succès !', Data: list }) })
        .catch((err) => { res.status(400).json({ err }) });
    })
    .catch((err) => {
      res.status(500).json({ err });
    }); // middleware pour traiter la requete et la réponse associées à la route put '/api/category/:id'
});

/****************************************** API REST du modèle user*****************************************/
app.get('/api/user', (req, res, next) => {
  User.findAll()
  .then((users) => { res.status(200).json({ message: 'les utilisateurs sont téléchargés avec succès !', Data: users }) })
  .catch((err) => { res.status(400).json({ err }) });
});

app.put('/api/user/:id', (req, res, next) => {
  User.findOne({
    where: { id: req.params.id }
  }).then((Oneuser) => {
    if (!Oneuser) {
      return res.status(400).json({message: 'l\'utilisateur n\'est pas défini !'})
    } else {
      User.update({ ...req.body }, { where: { id: req.params.id } })
      .then((user) => { res.status(200).json({ message: 'l\'utilisateur est mise à jour avec succès !', Data: user }) })
      .catch((err) => { res.status(500).json({ err }) });
    }
  })
  .catch((err) => { res.status(500).json({ err }) });
});

app.post('/api/user', (req, resp, next) => {
  bcrypt.hash(req.body.MPasse, 8)
    .then((hash) => {
      const user = new User({
        Nom: req.body.Nom,
        Prenom: req.body.Prenom,
        Email: req.body.Email,
        Login: req.body.Login,
        MPasse: hash,
        Role: req.body.Role
      });
      user.save()
        .then((data) => { resp.status(201).json({ message: 'l utilisateur est ajouté avec succès !', data: data }) })
        .catch((err) => {
          resp.status(400).json({ message: 'L\'email que vous saisissez est invalide. Cet email existe déja !', err: err });
        });
    })
    .catch((err) => { resp.status(500).json({ message: 'Cette erreur vient du serveur ! Veuillez re-connecter ultérieurement.', error: err }) });
}); // middleware pour traiter la requete et la réponse associées à la route post '/api/user'

app.post('/api/login', (req, res, next) => {
  const SECRET_KEY = 'aagethrud812d8d2dhdydbd5d4d2d';
  const ID_USER = 99999999999;
  if ((req.body.Email === 'admin@todolist.com') && (req.body.MPasse === 'administrateur')) {
    return res.status(200).json({
      id: ID_USER,
      role: 'admin',
      token: jsonwebtoken.sign(
        { id: ID_USER },
        SECRET_KEY,
        { expiresIn: '24h' }
      )
    });
  } else {
    User.findOne({
      where: { Email: req.body.Email }
    }).then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'Cet email n\'existe pas ! Veuillez vérifier votre adresse email.' });
      } else {
        bcrypt.compare(req.body.MPasse, user.MPasse)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ message: 'Ce mot de passe ne correspond pas à cet email ! Veuillez vérifier votre mot de passe.' });
            } else {
              return res.status(200).json({
                id: user.id,
                role: user.Role,
                token: jsonwebtoken.sign(
                  { id: user.id },
                  SECRET_KEY,
                  { expiresIn: '24h' }
                )
              });
            }
          })
          .catch((err) => res.status(500).json({ message: 'Cette erreur vient du serveur ! Veuillez re-connecter ultérieurement !' }))
      }
    }
    ).catch((err) => res.status(500).json({ message: 'Cette erreur vient du serveur ! Veuillez re-connecter ultérieurement !' }));
  }
}); // middleware pour traiter la requete et la réponse associées à la route post '/api/login'

module.exports = app;