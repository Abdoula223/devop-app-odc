// backend/models/smartphone.js
const mongoose = require('mongoose');

const smartphoneSchema = new mongoose.Schema({
    id: { type: Number, unique: true },      
    nom: { type: String, required: true },   
    marque: { type: String, required: true },
    prix: { type: Number, required: true },
    description: { type: String },

    // Sous-document pour les caractéristiques
    caracteristiques: {
        ram: { type: String },    
        rom: { type: String },    
        ecran: { type: String }    
    },

    photos: { type: [String] },   // tableau d’images
    couleurs: { type: [String] }  // couleurs disponibles
});

module.exports = mongoose.model('Smartphone', smartphoneSchema);
