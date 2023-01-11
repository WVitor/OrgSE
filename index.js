require('dotenv').config({path:'./.env'})
const Express = require('express')
const app = Express()
const exphbs = require('express-handlebars')
const Controller = require('./src/Controller') 

app.use(Express.urlencoded({extended: true}))
app.use(Express.json())
app.use(Express.static(`${__dirname}/public`))
app.use('*/css', Express.static(`${__dirname}/public/css`))
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.get('/criar-estudo', Controller.criarPlanoDeEstudos)
app.post('/criar-estudo', Controller.criarPlanoDeEstudosPost)
app.post('/excluir-estudo', Controller.excluirPlanoDeEstudos)

app.get('/criar-topico-filho', Controller.criarTopicoFilho)
app.post('/criar-topico-filho', Controller.criarTopicoFilhoPost)
app.post('/excluir-topico-filho', Controller.excluirTopicoFilho)
app.post('/alterar-status', Controller.alterarStatus)

app.get('/', Controller.main)
app.get('/*', Controller.mainPages)

app.listen(process.env.PORTA, ()=>{
    console.log(`rodando na porta ${process.env.PORTA}`)
})