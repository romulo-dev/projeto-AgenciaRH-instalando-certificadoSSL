const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser')
const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const https = require('https')
const fs = require('fs')
var options = {
    //key: fs.readFileSync('./certs/server/my-server.key.pem'),
    //cert: fs.readFileSync('./certs/tmp/my-server.csr.pem')
    key: fs.readFileSync('./keys/server.key'),
    cert: fs.readFileSync('./keys/server.cert')
  }
require('./config/auth')(passport)
const path = require('path')
require('./models/Candidato')
const Candidato = mongoose.model('candidatos')

const usuarios = require('./routes/usuarios')

// configurando o mongoose
mongoose.Promise = global.Promise // para evitar erros
const mongoDB = 'mongodb://localhost/agencia'
mongoose.connect(mongoDB, { useNewUrlParser: true }, {useUnifiedTopology: true},
    {useMongoClient: true}).then(() => {
    console.log('Mongodb conectado com sucesso')
})
.catch(err => {
    console.log('Houve um erro ao se conectar ao mongodb: '+ err)
})
// fim configurando o mongoose

// configurando a sessão
app.use(session({
    secret: 'chaveSessao',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
// middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})
// body-parser
app.use(bodyParser.urlencoded({ extended: true }))
// comando que diz para o node onde estão os arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')))
// configurando a template engine
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
var hbs = require('hbs')


// rotas
    
app.get('/', (req, res) => {
    //res.send('/cadastrarCliente.html')
    res.render('index')  
})

app.get('/listarCandidatos', (req, res) => {
    // o lean() serve para evitar erros
    Candidato.find().lean().then((candidatos) => {
        res.render('index', { candidatos: candidatos
            //.map(candidatos => candidatos.toJSON()) 
        })
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar os candidatos')
        res.redirect('/')
    })
      
})

app.get('/cadastroCandidato', (req, res) => {
    res.render('cadastrarCandidato')  
})

app.post('/CandidatoAdd', (req, res) => { 
    const novoCandidato = {
        nome: req.body.nome,
        CPF: req.body.CPF,
        email: req.body.email,
        telefone: req.body.telefone
    }
    new Candidato(novoCandidato).save().then(() => {
        console.log('Candidato salvo com sucesso')
        req.flash('success_msg', 'Candidato cadastrado com sucesso')
    }).catch((err) => {
        console.log('Houve um erro ao salvar o candidato')
    })
    req.flash('success_msg', 'Candidato cadastrado com sucesso')
    res.render('cadastrarCandidato')
})





app.use('/usuarios', usuarios)

// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(3000, () => {
    console.log('Olá mundo')
})

/* app.listen(3000, function() {
    console.log('Olá mundo')
}) */