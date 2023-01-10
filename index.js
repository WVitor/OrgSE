const Express = require('express')
const app = Express()
const exphbs = require('express-handlebars')
const Controller = require('./src/Controller') 
const fs = require('fs')

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

let rotas = []
JSON.parse(fs.readFileSync("./assets/backend.json", {encoding:'utf8'})).PLANOS.forEach((valor)=>{ if(valor.PRIMEIRO) {return rotas.push(valor.URL)}})
rotas.map((rota)=>{
    app.get(`/${rota}`, Controller.mainPages)
})

app.get('/', Controller.main)

app.listen(3000, ()=>{
    console.log('rodando na porta 3000')
})