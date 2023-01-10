const fs = require('fs')
const axios = require('axios')

module.exports = class Controller{
    static async main(req, res, rotas){
        try {
            const planos = await axios.get('http://localhost:5000/PLANOS?PRIMEIRO=true')
            .then(function (response) {
              // handle success
              return response.data;
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            .finally(function () {
              // always executed
            })
           return res.render('pages/home', {planos: planos})
        } catch (error) {
            console.log(error)
        }
    }

    static async mainPages(req, res){
        try {
            let topicoPai = {}
            const topicosFilhos = []
            //topico pai
            await axios.get(`http://localhost:5000/PLANOS?URL=${req.path.slice(1)}`)
            .then(async function (response) {
              // handle success
                topicoPai = response.data[0];
                //topicos filhos
               return await axios.get(`http://localhost:5000/PLANOS?TOPICOPAIID=${topicoPai.id}&_sort=id&_order=asc`)
                .then(function (res) {
                  // handle success
                  return res.data.forEach(valor => {
                    topicosFilhos.push(valor)
                  });;
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })
                .finally(function () {
                  // always executed
                });
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            .finally(function () {
              // always executed
            });
            return res.render('pages/templatePage', {topicoPai: topicoPai, topicosFilhos: topicosFilhos})
            
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
            await axios.get(`http://localhost:5000/PLANOS?TOPICO=${TOPICO}`)
            .then(function (response) {
              // handle success
              if(response.data.length > 0 && response.data[0].TOPICO == TOPICO){
                topicoExists = true
              }
              return
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            .finally(function () {
              // always executed
            });

            if(!topicoExists){
                await axios.post('http://localhost:5000/PLANOS', {
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
            await axios.get(`http://localhost:5000/PLANOS?TOPICOPAIID=${TOPICOID}`)
            .then(async function (response) {
              // handle success         
                return response.data.map((valor)=>{
                    topicosFilhos.push(valor)
                })             
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            .finally(function () {
              // always executed
            });
            if(topicosFilhos.length > 0){
              for(var i = 0; i < topicosFilhos.length; i++){
                await axios.delete(`http://localhost:5000/PLANOS/${topicosFilhos[i].id}`)
              }
            }
            await axios.delete(`http://localhost:5000/PLANOS/${TOPICOID}`).then(()=>{
              return  res.redirect('/')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async criarTopicoFilho(req, res){
      try {
         let topicoExists = false
          const topicos = await axios.get(`http://localhost:5000/PLANOS?PRIMEIRO=true`).then((response)=>{
            return response.data
          }).catch(function (error){
            console.log(error)
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
          await axios.get(`http://localhost:5000/PLANOS?TOPICO=${TOPICO}`)
          .then(function (response) {
            // handle success
            if(response.data.length > 0 && response.data[0].TOPICO == TOPICO){
              topicoExists = true
            }
            return
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .finally(function () {
            // always executed
          });

          if(!topicoExists){
              await axios.post('http://localhost:5000/PLANOS', {
                  TOPICO,
                  TOPICOPAIID: TOPICOPAIID.toString(),
                  PRIMEIRO: false,
                  URL: "",
                  STATUS: false
              })
              const TOPICOPAIURL = await axios.get(`http://localhost:5000/PLANOS/${TOPICOPAIID}`).then((response)=>{
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
        const TOPICOPAIURL = await axios.get(`http://localhost:5000/PLANOS/${TOPICOID}`).then(async(response)=>{
          return await axios.get(`http://localhost:5000/PLANOS/${response.data.TOPICOPAIID}`).then((response)=>{
              return response.data.URL
          })
        })
        await axios.delete(`http://localhost:5000/PLANOS/${TOPICOID}`).then(()=>{
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
      await axios.get(`http://localhost:5000/PLANOS/${TOPICOID}`).then(async(response)=>{
        return topico = response.data
      })
      topico.STATUS = !topico.STATUS
      console.log(topico)
      
      await axios.delete(`http://localhost:5000/PLANOS/${topico.id}`)
      await axios.post("http://localhost:5000/PLANOS", topico)
      
      const TOPICOPAIURL = await axios.get(`http://localhost:5000/PLANOS/${topico.TOPICOPAIID}`).then((response)=>{
        return response.data.URL
      })
      return res.redirect(`/${TOPICOPAIURL}`)
    } catch (error) {
      console.log(error)
    }
  }
}