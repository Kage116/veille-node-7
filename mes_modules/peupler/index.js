"use strict";

const tableaux = require("./tableaux.js");

console.log(tableaux.tabNom);
console.log(tableaux.tabPrenom);
console.log(tableaux.tabTelephone);
console.log(tableaux.tabCourriel);

const maxNom = tableaux.tabNom.length;
const maxPrenom = tableaux.tabPrenom.length;
const maxTelephone = tableaux.tabTelephone.length;
const maxCourriel = tableaux.tabCourriel.length;

const peupler = () => {
	// console.log('Ok');
	let tabPerso = [];
	let Membre;
	for (var i = 0; i < 10; i++) {
		let position = Math.floor(Math.random() * maxNom);
		let nom = tableaux.tabNom[position];

		position = Math.floor(Math.random() * maxPrenom);
		let prenom = tableaux.tabPrenom[position];

		position = Math.floor(Math.random() * maxTelephone);
		let telephone = tableaux.tabTelephone[position];
		
		position = Math.floor(Math.random() * maxCourriel);
		let courriel = tableaux.tabCourriel[position];

		Membre = {
			"nom" : nom,
			"prenom" : prenom,
			"telephone" : telephone,
			"courriel" : courriel
		}

		tabPerso.push(Membre);
	}

	return tabPerso
}

module.exports = peupler;