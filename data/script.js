//Lê um arquivo qualquer
//caminhoArquivo é o parâmetro que você deve usar para informar o nome do arquivo.
const loadFile = function (caminhoArquivo, done) {
  var xhr = new XMLHttpRequest()
  xhr.onload = function () { return done(this.responseText) }
  xhr.open("GET", caminhoArquivo, true)
  xhr.send()
}

//Objeto contendo os dados do usuário que serão carregados do JSON
let dadosUsuario = {}
//Objeto contendo os dados dos items que serão carregados do JSON
let dadosProdutos = {}

//Coleção de items que foram comprados
var carrinho = []


//Carrega os dados contidos nos arquivos JSON dos items e do usuário
//JSONFile: Nome do arquivo contendo os dados dos items. Ex: dados.json
//userFile: Nome do arquivo contendo os dados do usuário. Ex: usuário.json
//func: Função a ser chamada depois que os dados dos arquivos JSON forem carregados
//Retorna o valor 1 para indicar que o carregamento foi bem sucedido
const carregaJSON = function (JSONFile, userFile, func) {
  console.log("Carregando JSON com os items do site ...");
  loadFile(JSONFile, function (responseText) {
    dadosProdutos = JSON.parse(responseText)
    console.log("OK dados produtos")
    console.log("Carregando dados do usuário ...");
    loadFile(userFile, function (responseText) {
      dadosUsuario = JSON.parse(responseText)
      console.log("OK dados usuario")
      func()
      return 1
    })
  })
}

//A função setup é chamada após os dados do JSON dos items e do usuário terem sido carregadas em seus respectivos objetos. Todas as outras funcionalidades a serem feitas após o carregamento dos arquivos devem estar dentro da função setup.
//Sem parâmetros
//Retorna 1  para mostrar que o carregamento foi bem sucedido
const setup = function(){
  //Chama a função para criar os elementos HTML a partir de um array de items  
  criaProdutosNoHTML("containerProdutos",dadosProdutos.produtos, "Todos os produtos")
  document.getElementById("nome").innerHTML = "Olá "+dadosUsuario.usuario.nome+"! "
  document.getElementById("local").innerHTML = "Localização: "+dadosUsuario.usuario.local
  return 1
}

//A função init é chamada automaticamente ao término do carregamento dos elementos do body no HTML
//Sem parâmetros
//Sem retorno
const init = function () {
  carregaJSON("./data/data.json","./data/usuario.json", setup);
}

//A função comprarItemClick é atribuida a todos os botões "comprar" de todos os items. Para diferenciar qual item está sendo selecionado utilizaremos o ID do próprio botão, que é igual ao ID do produto no JSON ...
//Sem parâmetros
//Sem retorno
const comprarItemClick = function(){
  console.log("Comprando item ", this.id)
  let id = this.id
  let resultado = dadosProdutos.produtos.filter(
    produto => produto.id == id
  )
  carrinho.push(resultado[0])
  console.log(carrinho)
}

const removerItemClick = function(){
  console.log("Comprando item ", this.id)
  let id = this.id
  let indice = carrinho.findIndex(
    relogio => relogio.id == id
  )
  carrinho.splice(indice,1)
  console.log(carrinho)
  carregaCarrinho()
}


const favoritarItemClick = function(){
    console.log("Favoritar item ", this.id)
    let index = dadosProdutos.produtos.findIndex(
      produto => produto.id == this.id
    )
    console.log(index)
    dadosProdutos.produtos[index].favorito = ! (dadosProdutos.produtos[index].favorito)
    if (dadosProdutos.produtos[index].favorito == true)
    {
      this.src = "fav.png"
    }
    else{
      this.src = "notfav.png"
    }
  }

//A função criaProdutosNoHTML vai gerar, a partir de um array de items, os elementos HTML que apresentam um determinado item (titulo, imagem, descricao, botão de compra)
//container: String que contém o ID da div no HTML onde os elementos ficarão ancorados
//dadosProdutos: Array contendo os items a serem apresentados
//categoria: String contendo o título a ser apresentado na div (na prática é um H1)
//Sem retorno
function criaProdutosNoHTML(container, dadosProdutos, categoria) {
  let containerCategoria = document.getElementById(container)

  let child = containerCategoria.lastElementChild
  while (child) {
    containerCategoria.removeChild(child)
    child = containerCategoria.lastElementChild
  }

  //Cria o título da categoria dentro do container
  let titulo = document.createElement('h1')
  //Substituir pela classe que você criou para o seu título de produto
  titulo['className'] = "card-title"
  titulo.textContent = categoria
  containerCategoria.appendChild(titulo)

  //Carrega todos os produtos no container (div)
  let containerProdutos = document.getElementById(container)

  child = containerProdutos.lastElementChild
  while (child) {
    containerProdutos.removeChild(child)
    child = containerProdutos.lastElementChild
  }

  let contador = 0
  //Percorre todos os produtos para criar cada card dos items
  for (let produto of dadosProdutos) {
    if (contador % 4 == 0) {
      var row = document.createElement('div')
      row['className'] = "row gx-2"
      containerProdutos.appendChild(row);
    }
    //Cria a div card para o produto
    let novaDiv = document.createElement('div')
    //Substituir pela classe que você criou para o seu título de produto
    novaDiv['className'] = "col-lg-3 col-md-6"
    row.appendChild(novaDiv);

    //cria a imagem dentro da div do card
    let img = document.createElement('img')
    img['src'] = produto.img
    img['className'] = "img-fluid"
    img['style'] = "aspect-ratio: 1 / 1;"
    img['alt'] = produto.alt
    novaDiv.appendChild(img)

    //Cria a categoria do produto na div   
    let nH5 = document.createElement('h5');
    nH5.textContent = produto.categoria
    novaDiv.appendChild(nH5)

    //Cria o modelo do produto na div   
    let nH4 = document.createElement('h4');
    nH4['className'] = "card-title"
    nH4.textContent = produto.modelo
    novaDiv.appendChild(nH4)

    //Cria o preco da loja online   
    let pAdd = document.createElement('p')
    pAdd.textContent = produto.add
    novaDiv.appendChild(pAdd)

    //Cria o preco   
    let pPreco = document.createElement('p')
    pPreco.textContent = "R$"+produto.preco
    novaDiv.appendChild(pPreco)

    //Cria o botão    
    let pComprar = document.createElement('p')
    novaDiv.appendChild(pComprar)
    let bBotao = document.createElement('button')
    bBotao['className'] = "btn btn-dark"
    bBotao['id'] = produto.id
    bBotao.onclick = comprarItemClick
    bBotao.textContent = "COMPRAR"
    pComprar.appendChild(bBotao)
    
    //Cria o favoritar          
       let bFav = document.createElement('img')
       bFav['id'] = produto.id
       if (produto.favorito == true) {
         bFav['src'] = "fav.png"
       }
       else{
         bFav['src'] = "notfav.png"

       }
       bFav['style'] = "max-width: 100px; max-height:100px; cursor: pointer;"
       bFav['className'] = ""
       bFav.onclick = favoritarItemClick       
       novaDiv.appendChild(bFav)

    contador++
  }
}

const filtroTodas = function(){
  console.log("Todas")
  let reloTodas = dadosProdutos.produtos.filter(
    relo => relo.preco > 0
  )
  criaProdutosNoHTML("containerProdutos", reloTodas, "preco > 0")
}

const filtroGshock = function(){
  console.log("Filtrando por G-SHOCK")
  let reloGshock = dadosProdutos.produtos.filter(
    relo => relo.categoria == "G-SHOCK"
  )
  criaProdutosNoHTML("containerProdutos", reloGshock, "categoria: G-SHOCKK")
}

const filtroBabyg = function(){
  console.log("Filtrando por BABY-G")
  let reloBabyg = dadosProdutos.produtos.filter(
    relo => relo.categoria == "BABY-G"
  )
  criaProdutosNoHTML("containerProdutos", reloBabyg, "categoria: BABY-G")
}

const filtroEdifice = function(){
  console.log("Filtrando por EDIFICE")
  let reloEdifice = dadosProdutos.produtos.filter(
    relo => relo.categoria == "EDIFICE"
  )
  criaProdutosNoHTML("containerProdutos", reloEdifice, "categoria: EDIFICE")
}

const favoritosClick = function () {
  console.log("Filtrando por Favoritos")
  let relosFavoritos = dadosProdutos.produtos.filter(
    relo => relo.favorito == true
  )
  
  
  criaProdutosNoHTML("containerProdutos", relosFavoritos, "Relógios Favoritos")
}

function criaProdutosNoCarrinho(container, dadosProdutos, categoria) {
  let containerCategoria = document.getElementById(container)

  let child = containerCategoria.lastElementChild
  while (child) {
    containerCategoria.removeChild(child)
    child = containerCategoria.lastElementChild
  }

  //Cria o título da categoria dentro do container
  let titulo = document.createElement('h1')
  //Substituir pela classe que você criou para o seu título de produto
  titulo['className'] = "card-title"
  titulo.textContent = categoria
  containerCategoria.appendChild(titulo)

  //Carrega todos os produtos no container (div)
  let containerProdutos = document.getElementById(container)

  child = containerProdutos.lastElementChild
  while (child) {
    containerProdutos.removeChild(child)
    child = containerProdutos.lastElementChild
  }

  let contador = 0
  //Percorre todos os produtos para criar cada card dos items
  for (let produto of dadosProdutos) {
    if (contador % 4 == 0) {
      var row = document.createElement('div')
      row['className'] = "row gx-2"
      containerProdutos.appendChild(row);
    }
    //Cria a div card para o produto
    let novaDiv = document.createElement('div')
    //Substituir pela classe que você criou para o seu título de produto
    novaDiv['className'] = "col"
    row.appendChild(novaDiv);

    //cria a imagem dentro da div do card
    let img = document.createElement('img')
    img['src'] = produto.img
    img['className'] = "img-fluid"
    novaDiv.appendChild(img)

    //Cria a categoria do produto na div   
    let nH5 = document.createElement('h5');
    nH5.textContent = produto.categoria
    novaDiv.appendChild(nH5)

    //Cria o modelo do produto na div   
    let nH4 = document.createElement('h4');
    nH4['className'] = "card-title"
    nH4.textContent = produto.modelo
    novaDiv.appendChild(nH4)

    //Cria o preco da loja online   
    let pAdd = document.createElement('p')
    pAdd['className'] = "SUA CLASSE CSS"
    pAdd.textContent = produto.add
    novaDiv.appendChild(pAdd)

    //Cria o preco   
    let pPreco = document.createElement('p')
    pPreco['className'] = "SUA CLASSE CSS"
    pPreco.textContent = "R$"+produto.preco
    novaDiv.appendChild(pPreco)

    //Cria o botão    
    let pRemover = document.createElement('p')
    novaDiv.appendChild(pRemover)
    let bRemover = document.createElement('button')
    bRemover['className'] = "btn btn-dark"
    bRemover['id'] = produto.id
    bRemover.onclick = removerItemClick
    bRemover.textContent = "REMOVER"
    pRemover.appendChild(bRemover)

    
    
    contador++
  }
}

const carregaCarrinho = function(){
  
  let totalCompra = carrinho.reduce(somador,0)
  criaProdutosNoCarrinho("containerProdutos", carrinho, "Carrinho")
  let quantidade = carrinho.length
  let quant = document.createElement('h2')
  quant.textContent = "Itens no carrinho: "+quantidade
  let qp = document.getElementById("containerProdutos")
  qp.prepend(quant)
  
  let carrinhoTitulo = document.createElement('h1')
  carrinhoTitulo.textContent = "Total do carrinho: R$"+totalCompra

  let cp = document.getElementById("containerProdutos")
  cp.prepend(carrinhoTitulo)

  //Cria o botão    
  let bRemover = document.createElement('button')
  bRemover['type'] = "button"
  bRemover['className'] = "limparCarrinho "  
  bRemover['class'] = "text-center"
  bRemover['id'] = "limparCarrinho"
  bRemover.onclick = limpaCarrinho
  bRemover.style.width="20%";
  bRemover.style.height="20%";
  bRemover.textContent = "Limpar Carrinho"
  cp.appendChild(bRemover)

  //Cria o botão
  let bFinalizar = document.createElement('a')
  bFinalizar['role'] = "button"
  bFinalizar['href'] = "finalizar.html"
  bFinalizar['className'] = "FinalizarCompra "  
  bFinalizar['class'] = "text-center"
  bFinalizar['id'] = "FinalizarCompra"
  bFinalizar.onclick = limpaCarrinho
  bFinalizar.style.width="20%";
  bFinalizar.style.height="20%";
  bFinalizar.textContent = "Finalizar Compra"
  cp.appendChild(bFinalizar)


}
  


const pesquisar = function(){
  termoPesquisa = document.getElementById("search").value

  let resultadoBusca = dadosProdutos.produtos.filter(
    relogio => relogio.modelo.includes(termoPesquisa) || relogio.categoria.includes(termoPesquisa) || relogio.preco == termoPesquisa
  )

  
  console.log(resultadoBusca)
  criaProdutosNoHTML("containerProdutos", resultadoBusca, "Busca por :"+termoPesquisa)
}



const filtroFavoritos = function(){
  console.log("Filtrando por Favoritos")
  let reloFavorito = dadosProdutos.produtos.filter(
    relo => relo.favorito == true
  )
  criaProdutosNoHTML("containerProdutos", reloFavorito, "favorito: true")
  
}

function scrolltop(){ 
  window.scrollTo({ 
    top:0,
    behavior: 'smooth'
})
}

const somador = function (acumulador, valor) {
  return acumulador + valor.preco
}

const limpaCarrinho = function (){
  console.log("limpando carrinho");
  carrinho = [];
  carregaCarrinho()
}

const ordenarBarato = function (){
  dadosProdutos.produtos.sort(maisBarato)
  criaProdutosNoHTML("containerProdutos", dadosProdutos.produtos, "Todos os produtos")
}

const maisBarato = function (a, b){
  if (a.preco - b.preco > 0){
    return 1
  }
  else{
    return -1
  }
}

const ordenarCaro = function (){
  dadosProdutos.produtos.sort(maisCaro)
  criaProdutosNoHTML("containerProdutos", dadosProdutos.produtos, "Todos os produtos")
}

const maisCaro = function (a, b){
  if (a.preco - b.preco < 0){
    return 1
  }
  else{
    return -1
  }
}

const ordenarRecente = function (){
  dadosProdutos.produtos.sort(maisRecente)
  criaProdutosNoHTML("containerProdutos", dadosProdutos.produtos, "Todos os produtos")
}

const maisRecente = function (a, b){
  if (a.id > b.id){
    return 1
  }
  else{
    return -1
  }
}

