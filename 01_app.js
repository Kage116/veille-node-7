const express = require('express');
const app = express();
const fs = require('fs');
const util = require("util");
app.use(express.static('public'));

const MongoClient = require('mongodb').MongoClient // le pilote
const ObjectID = require('mongodb').ObjectID;
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');
const peupler = require("./mes_modules/peupler");

let db

MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
	if (err) return console.log(err)
	db = database.db('carnet_adresse')
	// lancement du serveur Express sur le port 8081
	app.listen(8081, () => {
		console.log('connexion à la BD et on écoute sur le port 8081')
	})
})

/* on associe le moteur de vue au module «ejs» */
app.set('view engine', 'ejs'); // générateur de template

/* La route /list permet d'afficher l'ensemble des adresses */ 
app.get('/', (req, res) => {
	let cursor = db.collection('adresse').find().toArray(function(err, resultat) {
		if (err) return console.log(err)
		// transfert du contenu vers la vue index.ejs (renders)
		// affiche le contenu de la BD
		res.render('gabarit.ejs', {adresse: resultat})
	}) 
})

app.get('/vider', (req, res) => {
	db.collection('adresse').remove({}, (err, resultat) => {
		if (err) return console.log(err)
		res.redirect('/')
	})
})

// app.get('/peupler', (req, res) => {
// 	let crit = util.inspect(peupler());

// 	db.collection('adresse').save(peupler(), (err, result) => {
// 		if (err) return console.log(err);
// 	})

//  	res.redirect('/');
// })

app.get('/peupler',function(req,res) {
	db.collection('adresse').insertMany(peupler(), (err, result) => {
		if (err) return console.log(err)
		console.log('sauvegarder dans la BD')
		res.redirect('/')
	})
})

app.post('/ajouter', (req, res) => {
	db.collection('adresse').save(req.body, (err, result) => {
		if (err) return console.log(err)
		console.log('sauvegarder dans la BD')
		res.redirect('/')
	})
})

app.post('/modifier', (req, res) => {
	console.log('util = ' + util.inspect(req.body))
	req.body._id = ObjectID(req.body._id)

	db.collection('adresse').save(req.body, (err, result) => {
		if (err) return console.log(err)
		console.log('sauvegarder dans la BD')
		res.redirect('/')
	})
})

app.get('/delete/:id', (req, res) => {
	var critere = ObjectID(req.params.id)

	db.collection('adresse').findOneAndDelete( {'_id': critere} ,(err, resultat) => {
		if (err) return res.send(500, err)
		var cursor = db.collection('adresse').find().toArray(function(err, resultat) {
			if (err) return console.log(err)
			res.render('gabarit.ejs', {adresse: resultat})
		})
	})
})

app.get('/trier/:cle/:ordre', (req, res) => {
	let cle = req.params.cle
	let ordre = (req.params.ordre == 'asc' ? 1 : -1)
	let cursor = db.collection('adresse').find().sort(cle,ordre).toArray(function(err, resultat) {
		ordre = (req.params.ordre == "asc" ? "desc" : "asc")
		res.render('gabarit.ejs', {adresse: resultat, cle, ordre})
	})
})