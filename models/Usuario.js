const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema fields

const Usuario = new Schema({
	nome:{
		type: String,
		required: true
	},
    senha:{
		type: String,
		required: true
    },
	eAdmin:{
		type: Number,
		default: 0
	},
	date: {
		type: Date,
		default: Date.now
	}
})

mongoose.model('usuarios', Usuario)