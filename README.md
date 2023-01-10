# OrgSE

- [Introdução](#introdução)
- [Sobre](#sobre)
- [Instaslação e configuração](#instalação-e-configuração)
  - [Configuração do node] (#configuração-do-node
  - [Variaveis de ambiente](#variaveis-de-ambiente)
- [Running](#running)

## Introdução

`OrgSE' Organize seus estudos é um sistema para ajudar estudantes a focar nos esutdos.

## Sobre
OrgSE é um sistema simples desenvolvido em nodejs ultilizando ferramentas como express, axios e json-server, que tem seu objetivo ajudar qualquer pessoa que precise de ajuda e estimulo para por em pratica seus estudos atravez de uma plataforma simples de se usar, sua programação foi feita em baixo nivel para que pessoas leigas em programação possam altera-lo caso seja necessario para suas necessidades.

### Instalação e configuração
para instalar um projeto basta apenas:
  - Baixar ou clonar este repositorio.
  - Ter o nodejs instalado em sua maquina
  ## Configuração do node
    - Execute o camando ```sh $ npm install``` via terminal dentro da pasta do projeto.
  ## Variaveis de ambiente
    - Criar o um arquivo chamado '.env' dentro da pasta do projeto.
    - Criar a variavel de ambiente chamada 'PORTA=3000'. 
    - Criar a variavel de ambiente chamada 'API_URL=http://localhost:5000/PLANOS'. 
      
### Running
Para executar o sistema é necessario estar com a porta 3000 e porta 5000 desocupadas, se necessario elas podem ser alteradas manualmente no arquivo 'packege.json' e '.env'
abrir dois terminais dentro da pasta do projeto.
 - no primeiro terminal execute o comando ```sh $ npm run backend``` para executar o backend do serviço.
 - no segundo terminal execute o comando ```sh $ npm start``` ou ```sh $ npm run dev``` para executar o sistema.
