const fs = require('fs')
const axios = require('axios')
const API_URL = process.env.API_URL
module.exports = class Controller{
    static async main(req, res, rotas){
        try {
            const planos = await axios.get(`${API_URL}?PRIMEIRO=true`)
            .then(function (response) {
              // handle success
              return response.data;
            })
           return res.render('pages/home', {planos: planos})
        } catch (error) {
            console.log(error)
        }
    }

    static async mainPages(req, res){
        try {
            const topicosFilhos = []
            //topico pai
            let topicoPai = await axios.get(`${API_URL}?URL=${req.path.slice(1)}`)
            .then(async function (response) {
              // handle success
                return response.data[0];
                //topicos filhos
               
            })
            if(topicoPai){
               await axios.get(`${API_URL}?TOPICOPAIID=${topicoPai.id}&_sort=id&_order=asc`)
                .then(function (res) {
                  // handle success
                  return res.data.forEach(valor => {
                    topicosFilhos.push(valor)
                  });;
                })
                return res.render('pages/templatePage', {topicoPai: topicoPai, topicosFilhos: topicosFilhos})
            }else{
              return res.redirect('/')
            }

            
            
        } catch (error) {
            console.log(error)
        }
    }

    static async criarPlanoDeEstudos(req, res){
        try {
           let topicoExists = false

           return res.render('pages/criarPlanoDeEstudos', {topicoExists})
        } catch (error) {
            console.log(error)
        }
    }

    static async criarPlanoDeEstudosPost(req, res){
        try {
            const TOPICO = req.body.topico
            let topicoExists = false
            await axios.get(`${API_URL}?TOPICO=${TOPICO}`)
            .then(function (response) {
              // handle success
              if(response.data.length > 0 && response.data[0].TOPICO == TOPICO){
                topicoExists = true
              }
              return
            })

            if(!topicoExists){
                await axios.post(API_URL, {
                    TOPICO,
                    TOPICOPAIID: "0",
                    PRIMEIRO: true,
                    URL: TOPICO.toLowerCase().split(" ").join("-"),
                    STATUS: false
                })
                return res.redirect('/')
            }
            else{
                return res.render('pages/criarPlanoDeEstudos', {topicoExists})
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async excluirPlanoDeEstudos(req, res){
        try {
            const TOPICOID = req.body.id
            const topicosFilhos = [] 
            await axios.get(`${API_URL}?TOPICOPAIID=${TOPICOID}`)
            .then(async function (response) {
              // handle success         
                return response.data.map((valor)=>{
                    topicosFilhos.push(valor)
                })             
            })
            if(topicosFilhos.length > 0){
              for(var i = 0; i < topicosFilhos.length; i++){
                await axios.delete(`${API_URL}/${topicosFilhos[i].id}`)
              }
            }
            await axios.delete(`${API_URL}/${TOPICOID}`).then(()=>{
              return  res.redirect('/')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async criarTopicoFilho(req, res){
      try {
         let topicoExists = false
          const topicos = await axios.get(`${API_URL}?PRIMEIRO=true`).then((response)=>{
            return response.data
          })
         return res.render('pages/criarTopicoFilho', {topicoExists, topicos})
      } catch (error) {
          console.log(error)
      }
  }

  static async criarTopicoFilhoPost(req, res){
      try {
          const TOPICO = req.body.topico
          const TOPICOPAIID = req.body.topicoPaiId
          let topicoExists = false
          await axios.get(`${API_URL}?TOPICO=${TOPICO}`)
          .then(function (response) {
            // handle success
            if(response.data.length > 0 && response.data[0].TOPICO == TOPICO){
              topicoExists = true
            }
            return
          })

          if(!topicoExists){
              await axios.post(API_URL, {
                  TOPICO,
                  TOPICOPAIID: TOPICOPAIID.toString(),
                  PRIMEIRO: false,
                  URL: "",
                  STATUS: false
              })
              const TOPICOPAIURL = await axios.get(`${API_URL}/${TOPICOPAIID}`).then((response)=>{
                return response.data.URL
              })
              return res.redirect(`/${TOPICOPAIURL}`)
          }
          else{
              return res.render('pages/criarTopicoFilho', {topicoExists})
          }
      } catch (error) {
          console.log(error)
      }
  }

  static async excluirTopicoFilho(req, res){
    try {
        const TOPICOID = req.body.id
        const TOPICOPAIURL = await axios.get(`${API_URL}/${TOPICOID}`).then(async(response)=>{
          return await axios.get(`${API_URL}/${response.data.TOPICOPAIID}`).then((response)=>{
              return response.data.URL
          })
        })
        await axios.delete(`${API_URL}/${TOPICOID}`).then(()=>{
          return  res.redirect(`/${TOPICOPAIURL}`)
        })
    } catch (error) {
        console.log(error)
    }
  }

  static async alterarStatus(req, res){
    try {
      const TOPICOID = req.body.id
      let topico = {}
      await axios.get(`${API_URL}/${TOPICOID}`).then(async(response)=>{
        return topico = response.data
      })
      topico.STATUS = !topico.STATUS
      
      await axios.delete(`${API_URL}/${topico.id}`)
      await axios.post(API_URL, topico)
      
      const TOPICOPAIURL = await axios.get(`${API_URL}/${topico.TOPICOPAIID}`).then((response)=>{
        return response.data.URL
      })
      return res.redirect(`/${TOPICOPAIURL}`)
    } catch (error) {
      console.log(error)
    }
  }
}