const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs")
const passport = require('passport')
const mongoose = require('mongoose')

require('../models/Usuario')
const Usuario = mongoose.model('usuarios')


router.get('/registro', (req, res) => {
	res.render('./usuarios/registro')
})

router.post('/registro', (req, res) => {
	let errors = [];

    if(!req.body.nome || typeof req.body.nome== undefined || req.body.nome == null){
        errors.push({texto: "Nome inválido"})
    }
    if(!req.body.senha || typeof req.body.senha== undefined || req.body.senha == null){
        errors.push({texto: "Sennha inválida"})
    }

	if(req.body.senha != req.body.senha2){
		errors.push({texto: "As senhas são diferentes"})
	}

	if(req.body.senha.length < 8){
		errors.push({texto: "A senha eh muito pequena"})
	}

    if(errors.length > 0){
		res.render('usuarios/registro', {
			errors: errors,
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		});	
	}else{
		Usuario.findOne({nome: req.body.nome}).then((usuario) => {
			if(usuario){
				req.flash("error_msg", "Já existe um usuário com esse nome")
				req.redirect('/usuarios/registro')
			}
			else{
				const novoUsuario = new Usuario({
					nome: req.body.nome,
					senha: req.body.senha
				})
				// para encriptar a senha
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
						if(erro){
							req.flash("error_msg", "Houve um erro durante o salvamento do usuário")
							res.redirect("/")
						}
						novoUsuario.senha = hash
						novoUsuario.save().then(()  => {
							req.flash("success_msg", "Usuário criado com sucesso")
							res.redirect("/")
						}).catch((err) => {
							req.flash("error_msg", "Houve um erro ao criar o usuário")
							res.redirect("/usuarios/registro")
						})
					})
				})

			}
		}).catch(error => {
			req.flash("error_msg", "Houve um erro interno")
			res.redirect("/")
		})
	}
})


router.get('/login', (req, res) => {
	res.render('./usuarios/login')
})
router.post("/login", (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: './login',
		failureFlash: true
	})(req, res, next)
})

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg','Deslogado')
	res.redirect('/usuarios/login')
})
module.exports = router