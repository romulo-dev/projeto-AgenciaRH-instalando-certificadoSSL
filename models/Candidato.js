const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Candidato= new Schema({
    nome: {
        type: String,
        required: true
    },
    CPF: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    telefone: {
        type: String,
        required: true
    }
    
})
// O primeiro parâmetro é o nome da coleção
module.exports = mongoose.model('candidatos', Candidato)