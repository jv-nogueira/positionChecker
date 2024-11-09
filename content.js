let running = false; // Variável para controlar o estado do script
let index1 = 0;
let question1, question2;
let vagasStorage = []; // Armazena as vagas coletadas

document.addEventListener("keydown", function(event) {
  if (event.keyCode === 113) { // F2 para iniciar/parar
    if (!running) {
      // Inicia o script
      question1 = prompt("Quantos segundos para percorrer cada vaga?");
      question2 = prompt("Qual palavra procurar?").toLowerCase();
      if (question1 > 0) {
        running = true;
        console.log("Script iniciado.");
        loopLista1();
      }
    } else {
      // Para o script e gera o CSV
      running = false;
      console.log("Script interrompido.");
      gerarCSV(); // Gera o arquivo CSV ao interromper o script
    }
  }
});

function loopLista1() {
  if (!running) return; // Interrompe o loop se running for false
  
  var listaElementos = document.querySelectorAll('.scaffold-layout__list-container')[0].children;
  
  if (index1 < listaElementos.length) {
    var indexLista = listaElementos[index1];
    indexLista.children[0].children[0].click();
    indexLista.scrollIntoView();
    
    setTimeout(() => {
      if (!running) return; // Interrompe o loop se running for false
      
      var descriptionTrue = document.querySelectorAll(".mt4")[2].children[0].textContent.toLowerCase().includes(question2); 
      var indexURL = indexLista.querySelector('a')?.href;
      
      if (descriptionTrue && indexURL) { 
        window.open(indexURL, '_blank', `width=800,height=${screen.availHeight}`);

        // Extrair informações de título e nome da empresa
        let tituloVaga = indexLista.children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].textContent;
        let nomeEmpresa = indexLista.children[0].children[0].children[0].children[0].children[1].children[1].children[0].innerText;
        
        // Armazena os dados no array
        vagasStorage.push({ titulo: tituloVaga, empresa: nomeEmpresa, link: indexURL });
      }
      
      index1++;
      loopLista1();
    }, question1 * 1000);
  } else {
    loopLista2();
  }
}

function loopLista2() {
  if (!running) return; // Interrompe o loop se running for false
  
  var listaHorizontal = document.querySelector(".artdeco-pagination__pages--number")?.children;
  
  if (listaHorizontal && listaHorizontal.length > 0) {
    var indexButton = Array.from(listaHorizontal).findIndex(button => button.children[0].getAttribute("aria-current") === "true");
    
    if (indexButton >= 0 && indexButton + 1 < listaHorizontal.length) {
      listaHorizontal[indexButton + 1].children[0].click();
      index1 = 0;
      setTimeout(loopLista1, 2000);
    } else {
      console.log("Fim da navegação ou botão de próxima página não encontrado.");
      gerarCSV(); // Gera o arquivo CSV ao final da navegação
    }
  } else {
    console.log("Elemento de paginação não encontrado.");
    gerarCSV(); // Gera o arquivo CSV se não houver paginação
  }
}

function gerarCSV() {
  // Cria o conteúdo do CSV com cabeçalhos
  let csvContent = "\uFEFFTítulo da Vaga;Empresa;Link\n";
  
  // Preenche o conteúdo do CSV com os dados das vagas
  vagasStorage.forEach(vaga => {
    csvContent += `${vaga.titulo};${vaga.empresa};${vaga.link}\n`;
  });

  // Cria um Blob com o conteúdo do CSV
  let blob = new Blob([csvContent], { type: "text/csv" });
  
  // Cria um link para fazer o download do CSV
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "vagasStorage.csv";
  
  // Adiciona o link à página e clica automaticamente para iniciar o download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log("CSV gerado com sucesso.");
}
