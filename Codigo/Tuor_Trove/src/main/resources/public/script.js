/*
resumo do codigo

o aplicativo esta semparado em 5 switch diferentes (os botoes do footer)
o que seria colocado como html esta dentro do js (em cada switch)
o arquivo html so é composto pelo header, footer e a animaçao inicial

------------------------------------------------------

para visualizar o site clicar com botao direito ir em inspecionar e colcoar
as dimencoes de um celular


*/


document.addEventListener('DOMContentLoaded', function () {
  const expos = document.querySelectorAll('.expo');
  
  
  //animacao de inicio
  expos.forEach((expo, index) => {
    setTimeout(() => {
      expo.classList.add('active');
      anime({
        targets: expo,
        bottom: '20vh',
        easing: 'easeInOutSine',
        duration: 500,
      });

      if (index < expos.length - 1) { // Verifica se não é a última imagem
        setTimeout(() => {
          anime({
            targets: expo,
            left: '100vw',
            easing: 'easeInOutSine',
            duration: 1000,
          });

          if (index === expos.length - 2) { // Verifica se é a penúltima imagem
            // Última imagem saiu
            setTimeout(() => {
              expos.forEach((expo, idx) => {
                if (idx !== expos.length - 1) {
                  expo.classList.remove('active');
                }
              });
            }, 3000); 
          }
        }, 2000);
      }
    }, 2500 * index); // Ajustar o tempo de espera para a próxima imagem
  });
});



  
  // Função para mudar a página nos botões do footer
  function changeContent(page) {
	const mainContent = document.querySelector('.circle-container');
	const footerButtons = document.querySelectorAll('.footer-button');
  
	footerButtons.forEach(button => {
	  button.classList.remove('selected');
	  button.style.transform = '';
	  button.querySelector('.button-label').style.opacity = 0;
	});
  
	const clickedButton = event.target;
	clickedButton.classList.add('selected');
	clickedButton.querySelector('.button-label').style.opacity = 1;
  
	clickedButton.style.transform = 'translateY(-30px)';
  
	switch (page) {
	  // HTML da página home
	  case 'home':
		// Inicializa as variáveis
		let nome_exposicao = '';
		let descricao_exposicao = '';
  
		mainContent.innerHTML = `
		  <div class="circle-container">
			<div class="circle1">
			  <div class="content-above-circle">${nome_exposicao}</div>
			  <div class="content-under-circle">${descricao_exposicao}</div>
			  <div class="linha"></div>
			  <div class="linha2"></div>
			  <div class="linha3"></div>
			  <div class="linha4"></div>
			  <div class="linha5"></div>
			  <div class="linha6"></div>
			  <div class="linha7"></div>
			</div>
		  </div>
		  <div class="button-container">
			<button class="button-foto1">Identificar</button>
		  </div>
		  <button class="button7"><img class="maxs" src="css/img/audio.png" alt="Audio"></button>
  
		  <div id="camera-container" style="display: none;">
			<video id="video" autoplay playsinline></video>
			<button id="capture-button">Capturar</button>
			<button id="close-camera-button">Fechar</button>
		  </div>
		`;
  
		let isTudoActive = false;
		let recognition;
		let recognitionFinished = false; //Para indicar que o reconhecimento foi concluído
		let mensagem_IA = 'Responde essa pergunta sobre a exposição';
		let pergunta_cliente = ''; // Pergunta feita pelo cliente
		let pergunta = ''; // Pergunta que vai ser mandada para a IA
		let resposta = ''; // Variável para armazenar a resposta do chatbot
		let primeiroClique = true; // Variável para rastrear o primeiro clique no círculo
		let tudoInterval;
  
		/* Função para gerar a pergunta quando o circulo está ativo */
		function iniciarReconhecimento() {
		  recognition = new webkitSpeechRecognition();
		  // Configurações do reconhecimento de fala
		  recognition.continuous = true;
		  recognition.interimResults = true;
		  recognition.lang = 'pt-BR';
  
		  recognition.onstart = () => {
			console.log('Ouvindo...'); // Início da pergunta
		  };
  
		  recognition.onend = () => {
			console.log('Parando de ouvir...'); // Fim da pergunta
			recognitionFinished = true; // Indica que o reconhecimento foi concluído
			pergunta = `${mensagem_IA}, ${nome_exposicao}: ${pergunta_cliente}?`;
			console.log('\n A pergunta que será feita para a IA: \n ', pergunta);
		  };
  
		  recognition.onresult = (event) => {
			const transcript = event.results[event.results.length - 1][0].transcript;
			pergunta_cliente = transcript; // Armazena o texto reconhecido
			console.log('Texto reconhecido:', pergunta_cliente);
		  };
  
		  recognition.onerror = (event) => {
			console.error('Erro no reconhecimento de fala:', event.error); // Caso aconteça algum erro
		  };
  
		  recognition.start();
		}
  
		function pararReconhecimento() {
		  if (recognition) {
			recognition.stop();
			recognition = null;
		  }
		}
  
		async function enviarParaCustomVision(imageData) {
		  try {
			const response = await fetch('https://reconhece.cognitiveservices.azure.com/customvision/v3.0/Prediction/1fb10b9b-2e3c-4cf0-a1dc-352875761ee2/classify/iterations/Iteration5/image', {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/octet-stream',
				'Prediction-Key':'', // Uso da chave definida
			  },
			  body: dataURItoBlob(imageData)
			});
  
			if (!response.ok) {
			  const errorText = await response.text();
			  throw new Error(errorText);
			}
  
			const result = await response.json();
			console.log('Resultado do Custom Vision:', result);
  
			if (result.predictions && result.predictions.length > 0) {
			  const topPrediction = result.predictions[0];
			  const nomeExposicaoReconhecida = topPrediction.tagName;
			  const confianca = topPrediction.probability;
  
			  if (confianca > 0.7) {
				await obterDescricaoExposicao(nomeExposicaoReconhecida);
			  } else {
				Swal.fire({
				  title: 'Aviso!',
				  text: 'Não foi possível reconhecer a exposição com confiança suficiente. Tente novamente.',
				  icon: 'warning',
				  confirmButtonText: 'OK'
				});
			  }
			} else {
				Swal.fire({
				  title: 'Aviso!',
				  text: 'Nenhuma previsão encontrada. Tente novamente.',
				  icon: 'warning',
				  confirmButtonText: 'OK'
				});
			}
		  } catch (error) {
			console.error('Erro ao enviar para Custom Vision:', error);
			Swal.fire({
			  title: 'Erro!',
			  text: 'Erro ao processar a imagem!',
			  icon: 'error',
			  confirmButtonText: 'OK'
			});
		  }
		}
  
		// Função para converter dataURL para Blob
		function dataURItoBlob(dataURI) {
		  const byteString = atob(dataURI.split(',')[1]);
		  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		  const ab = new ArrayBuffer(byteString.length);
		  const ia = new Uint8Array(ab);
		  for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		  }
		  return new Blob([ab], { type: mimeString });
		}
  
		async function obterDescricaoExposicao(nomeExposicao) {
			try {
			  const nomeCodificado = encodeURIComponent(nomeExposicao.trim());
			  const response = await fetch(`http://localhost:6790/exposicao/nome?nome=${nomeCodificado}`);
			  if (response.ok) {
				const exposicao = await response.json();
				// Atualiza as variáveis globais
				nome_exposicao = exposicao.nome;
				descricao_exposicao = exposicao.descricao;
				// Atualiza a interface com o nome e descrição da exposição
				document.querySelector('.content-above-circle').textContent = nome_exposicao;
				document.querySelector('.content-under-circle').textContent = descricao_exposicao;
			  } else {
				Swal.fire({
				  title: 'Erro!',
				  text: 'Descrição da exposição não encontrada!',
				  icon: 'error',
				  confirmButtonText: 'OK'
				});
			  }
			} catch (error) {
			  console.error('Erro ao obter a descrição da exposição:', error);
			}
		  }
  
		// Seleciona o botão "Identificar"
		const identificarButton = document.querySelector('.button-foto1');
  
		// Função para iniciar a câmera
		function iniciarCamera() {
		  const video = document.getElementById('video');
		  const cameraContainer = document.getElementById('camera-container');
  
		  // Mostra o container da câmera
		  cameraContainer.style.display = 'flex';
  
		  // Verifica se o navegador suporta getUserMedia
		  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			// Solicita acesso à câmera
			navigator.mediaDevices.getUserMedia({ video: true })
			  .then(function(stream) {
				// Exibe o stream da câmera no elemento de vídeo
				video.srcObject = stream;
				video.play();
			  })
			  .catch(function(error) {
				console.error('Erro ao acessar a câmera:', error);
				Swal.fire({
				  title: 'Aviso!',
				  text: 'Não foi possivel acessar a câmera. Verifique as permições.',
				  icon: 'warning',
				  confirmButtonText: 'OK'
				});
			  });
		  } else {
			Swal.fire({
			  title: 'Aviso!',
			  text: 'Seu navegador não suporta acesso a câmera',
			  icon: 'warning',
			  confirmButtonText: 'OK'
			});
		  }
		}
  
		// Adiciona o event listener ao botão "Identificar"
		identificarButton.addEventListener('click', iniciarCamera);
  
		const captureButton = document.getElementById('capture-button');
		const closeCameraButton = document.getElementById('close-camera-button');
  
		// Função para capturar a imagem
		function capturarImagem() {
		  const video = document.getElementById('video');
		  const canvas = document.createElement('canvas');
		  canvas.width = video.videoWidth;
		  canvas.height = video.videoHeight;
  
		  const context = canvas.getContext('2d');
		  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
		  // Converte a imagem para data URL
		  const imageData = canvas.toDataURL('image/jpeg');
  
		  // Enviar a imagem para o Azure Custom Vision
		  enviarParaCustomVision(imageData);
  
		  // Após capturar a imagem, você pode fechar a câmera
		  pararCamera();
		}
  
		// Função para parar a câmera
		function pararCamera() {
		  const video = document.getElementById('video');
		  const cameraContainer = document.getElementById('camera-container');
  
		  // Para o stream da câmera
		  if (video.srcObject) {
			const tracks = video.srcObject.getTracks();
			tracks.forEach(track => track.stop());
			video.srcObject = null;
		  }
  
		  // Oculta o container da câmera
		  cameraContainer.style.display = 'none';
		}
  
		// Eventos dos botões
		captureButton.addEventListener('click', capturarImagem);
		closeCameraButton.addEventListener('click', pararCamera);
  
		// Função para fazer as linhas girarem rápido quando o circle1 estiver ativo
		function linhas() {
		  // Seleciona todas as linhas e adiciona a classe 'rotateCircleFast'
		  const linhas = document.querySelectorAll(".linha, .linha2, .linha3, .linha4, .linha5, .linha6, .linha7");
		  linhas.forEach(linha => linha.classList.add("rotateCircleFast"));
		}
  
		// Função que vai ativar tudo, vai chamar todas as outras funções
		async function tudo() {
		  if (isTudoActive) {
			clearInterval(tudoInterval);
			isTudoActive = false;
			pararReconhecimento();
  
			// Seleciona todas as linhas e remove a classe 'rotateCircleFast'
			const linhas = document.querySelectorAll(".linha, .linha2, .linha3, .linha4, .linha5, .linha6, .linha7");
			linhas.forEach(linha => linha.classList.remove("rotateCircleFast"));
		  }
		  // Quando a pessoa clicar no circle1 essa parte vai estar ativado e as linhas vao estar rodando rapido
		  else {
			linhas();
			isTudoActive = true;
  
			// Se for o primeiro clique, iniciar o reconhecimento de fala
			if (primeiroClique) {
			  // Primeiro clique: iniciar o reconhecimento de fala
			  pergunta_cliente = ''; // Limpa a variável 'pergunta_cliente' antes de começar um novo reconhecimento
			  iniciarReconhecimento();
  
			  tudoInterval = setInterval(() => {
				if (recognitionFinished) {
				  recognitionFinished = false; // Reseta a flag para o próximo reconhecimento
				  linhas();
				  primeiroClique = false; // Define para o próximo clique ser o segundo
				}
			  }, 1000); // Ajuste o intervalo conforme necessário
  
			  // A pergunta será formulada no evento 'onend' do reconhecimento de fala
			}
			// Else depois que a pergunta está formulada
			else {
			  // Segundo clique: gera a resposta
			  const respostaDoChatGPT = await gbt(); // Assegure-se de que a função 'gbt' está definida corretamente
			  console.log('Resposta do Chat GPT:', respostaDoChatGPT);
  
			  // Aqui você pode implementar a lógica para transformar a resposta em áudio
  
			  // Defina primeiroClique para true novamente para que o próximo clique seja considerado o primeiro
			  primeiroClique = true;
			}
		  }
		}
  
		// Adiciona o event listener ao círculo
		document.querySelector(".circle1").addEventListener("click", tudo);
  
		break;
  
	
  














        //pagina de postagens
		//por enquanto n add nada
    case 'postagens':
      mainContent.innerHTML = `
        <div class="about-content">
          em breve
        </div>
      `;
      break;















      //pagina de foto (galeria e camera)
	  //tambem n add nada
    case 'fotos':
    mainContent.innerHTML = `
	<div class="fotos-content">
	         em breve
	        </div>
	      `;
    break;



	
	
	
	
	
	
	
	
	
	
	// Página do cadastro e listagem dos museus

	case 'services':
	  mainContent.innerHTML = `
	    <header>
	      <div class="top">
	        <button class="button-foto15" id="btnMuseus">Cadastrar museus</button>
	      </div>
	    </header>
	    <div id="contentAreaServices"></div>
	  `;

	  const btnMuseus = document.getElementById('btnMuseus');
	  const contentAreaServices = document.getElementById('contentAreaServices');

	  // Função para carregar automaticamente a lista de museus
	  function loadMuseumList() {
	    contentAreaServices.innerHTML = `
	      <section class="section--container__responsive">
	        <h1 class="generaltext">Museus Cadastrados</h1>
	        <div class="scrollable-container">
	          <section id="museus-list" class="listamuseus"></section>
	        </div>
	      </section>
	    `;

	    fetch('http://localhost:6790/museu') 
	      .then(async response => {
	        if (!response.ok) {
	          const text = await response.text();
	          throw new Error(text);
	        }
	        return response.json();
	      })
	      .then(data => {
	        let museusList = document.getElementById('museus-list');
	        museusList.innerHTML = "";
	        data.forEach(museu => {
	          museusList.innerHTML += `
	            <div class="museu">
	              <div style="display: flex; justify-content: space-between; align-items: center;">
	                <h3>${museu.nome}</h3>
	                <button class="btnAddExposicao" data-museu-id="${museu.id}">Ver Exposições</button>
	              </div>
	              <p>${museu.descricao}</p>
	              <p><strong>Localização:</strong> ${museu.localizacao}</p>
	            </div>
	          `;
	        });

	        // Adiciona os event listeners para os botões "Adicionar Exposição"
	        const addExposicaoButtons = document.querySelectorAll('.btnAddExposicao');
	        addExposicaoButtons.forEach(button => {
	          button.addEventListener('click', function() {
	            const museuId = this.getAttribute('data-museu-id');
	            //switchServiceSection('exposicao', museuId);
				loadExposicaoList(museuId);
	          });
	        });
	      })
	      .catch(error => {
	        console.error('Erro ao carregar a lista de museus:', error);
	      });
	  }
	  
	  function loadExposicaoList(museuId) {
	      contentAreaServices.innerHTML = `
	        <section class="section--container__responsive">
	          <h1 class="generaltext">Exposições do Museu</h1>
	          <div class="scrollable-container">
	            <section id="exposicoes-list" class="lista-exposicoes"></section>
	          </div>
	          <button id="btnAddExposicao" class="input--button">Adicionar Nova Exposição</button>
	          <button id="btnUpdateMuseu" class="input--buttonup" >Atualizar Museu</button>
	          <button id="btnDeleteMuseu" class="input--buttondel1" >Deletar Museu</button>
	        </section>
	      `;

	      fetch(`http://localhost:6790/exposicao/museu/${museuId}`)
	        .then(async response => {
	          if (!response.ok) {
	            const text = await response.text();
	            throw new Error(text);
	          }
	          return response.json();
	        })
	        .then(data => {
	          let exposicoesList = document.getElementById('exposicoes-list');
	          exposicoesList.innerHTML = "";

	          data.forEach(exposicao => {
	            exposicoesList.innerHTML += `
	              <div class="exposicao" style="display: flex; justify-content: space-between; align-items: center;">
	                <div>
	                  <h3>${exposicao.nome}</h3>
	                  <p>${exposicao.descricao}</p>
	                </div>
	                <button class="btnEditExposicao input--button1" 
	                        data-exposicao-id="${exposicao.id}" 
	                        data-exposicao-nome="${exposicao.nome}" 
	                        data-exposicao-descricao="${exposicao.descricao}"
	                        data-exposicao-id-museu="${exposicao.id_museu}">
	                        Editar
	                </button>
	                <button class="btnDeleteExposicao input--buttondel" data-exposicao-id="${exposicao.id}" data-exposicao-nome="${exposicao.nome}">
	                  Deletar
	                </button>
	              </div>
	            `;
	          });

	          // Adicionar eventos aos botões de edição e exclusão de exposições
	          document.querySelectorAll('.btnEditExposicao').forEach(button => {
	            button.addEventListener('click', function() {
	              const id = this.getAttribute('data-exposicao-id');
	              const nome = this.getAttribute('data-exposicao-nome');
	              const descricao = this.getAttribute('data-exposicao-descricao');
	              const id_museu = this.getAttribute('data-exposicao-id-museu');
	              showEditForm(id, nome, descricao, id_museu);
	            });
	          });
	          document.querySelectorAll('.btnDeleteExposicao').forEach(button => {
	            button.addEventListener('click', function() {
	              const id = this.getAttribute('data-exposicao-id');
	              const nome = this.getAttribute('data-exposicao-nome');
	              deleteExposicao(id, nome);
	            });
	          });

	        })
	        .catch(error => {
	          console.error('Erro ao carregar as exposições:', error);
			  
	        });

	      // Botão para adicionar uma nova exposição
	      document.getElementById('btnAddExposicao').addEventListener('click', function() {
	        switchServiceSection('exposicao', museuId);
	      });

	      // Evento para atualizar o museu
	      document.getElementById('btnUpdateMuseu').addEventListener('click', function() {
	        showUpdateMuseuForm(museuId);
	      });

	      // Evento para deletar o museu
	      document.getElementById('btnDeleteMuseu').addEventListener('click', function() {
	        const confirmDelete = confirm("Tem certeza que deseja deletar o museu?");
	        if (confirmDelete) {
	          deleteMuseu(museuId);
	        }
	      });
	  }

	  function showUpdateMuseuForm(museuId) {
		console.log("ID do Museu para atualização:", museuId);
	      // Solicita os dados atuais do museu antes de abrir o formulário de edição
	      fetch(`http://localhost:6790/museu/${museuId}`)
	          .then(response => {
	              if (!response.ok) {
	                  throw new Error('Erro ao buscar informações do museu');
	              }
	              return response.json();
	          })
	          .then(museu => {
	              contentAreaServices.innerHTML = `
	                  <section class="section--container__responsive">
	                      <h1 class="generaltext">Atualizar Museu</h1>
	                      <form id="formUpdateMuseu">
	                          <p>Nome:</p>
	                          <input type="text" name="nome" value="${museu.nome}" required>
	                          <p>Descrição:</p>
	                          <textarea name="descricao" required>${museu.descricao}</textarea>
							  <p>Localização:</p>
							   <input type="text" name="localizacao" value="${museu.localizacao}" required>
	                          <button type="submit" class="input--button1">Salvar Alterações</button>
	                          <button type="button" id="cancelUpdate" class="input--button">Cancelar</button>
	                      </form>
	                  </section>
	              `;

				  document.getElementById('formUpdateMuseu').addEventListener('submit', function(event) {
				      event.preventDefault();

				      // Captura os valores dos campos do formulário, incluindo 'localizacao'
				      const nome = event.target.nome.value;
				      const descricao = event.target.descricao.value;
				      const localizacao = event.target.localizacao.value; // Adiciona o campo localização

				      // Chama a função de atualização com os valores capturados
				      updateMuseu(museuId, nome, descricao, localizacao); // Certifique-se de passar a localização
				  });


	              document.getElementById('cancelUpdate').addEventListener('click', function () {
	                  loadExposicaoList(museuId); // Volta para a lista de exposições
	              });
	          })
	          .catch(error => {
	              console.error('Erro ao buscar informações do museu:', error);
				  Swal.fire({
				    title: 'Erro!',
				    text: 'Erro ao buscar informações do museu!',
				    icon: 'error',
				    confirmButtonText: 'OK'
				  });
	          });
	  }
	  
	 	  function updateMuseu(museuId, nome, descricao, localizacao) {
	      fetch(`http://localhost:6790/museu/${museuId}`, {
	          method: 'PUT',
	          headers: {
	              'Content-Type': 'application/json'
	          },
	          body: JSON.stringify({ nome, descricao, localizacao }) // Inclui localização aqui
	      })
	      .then(response => {
	          if (!response.ok) {
	              return response.text().then(text => { throw new Error(text); });
	          }
			  Swal.fire({
			    title: 'Sucesso!',
			    text: 'Museu atualizado com sucesso!',
			    icon: 'success',
			    confirmButtonText: 'OK'
			  });
	          loadMuseumList(); // Recarrega a lista de museus após a atualização
	      })
	      .catch(error => {
	          console.error('Erro ao atualizar museu:', error);
			  Swal.fire({
			    title: 'Erro!',
			    text: 'Erro ao atualizar museu!',
			    icon: 'error',
			    confirmButtonText: 'OK'
			  });
	      });
	  }


	  function showEditForm(id, nome, descricao, id_museu) {
	      console.log("Abrindo o formulário de edição para:", { id, nome, descricao, id_museu });
	      contentAreaServices.innerHTML = `
	          <section class="section--container__responsive">
	              <h1 class="generaltext">Editar Exposição</h1>
	              <form id="formEditExposicao">
	                  <p>Nome:</p>
	                  <input type="text" name="nome" value="${nome}" required>
	                  <p>Descrição:</p>
	                  <textarea name="descricao" required>${descricao}</textarea>
	                  <input type="hidden" name="id_museu" value="${id_museu}">
	                  <button type="submit" class="input--button">Salvar Alterações</button>
	                  <button type="button" id="cancelEdit" class="input--button">Cancelar</button>
	              </form>
	          </section>
	      `;

	      // Event listener para enviar o formulário e atualizar a exposição
	      document.getElementById('formEditExposicao').addEventListener('submit', function (event) {
	          event.preventDefault();
	          const novoNome = event.target.nome.value;
	          const novaDescricao = event.target.descricao.value;
	          const idMuseu = event.target.id_museu.value;

	          updateExposicao(id, novoNome, novaDescricao, idMuseu);
	      });

	      // Event listener para o botão cancelar, que retorna à lista de exposições
	      document.getElementById('cancelEdit').addEventListener('click', function () {
	          loadExposicaoList(id_museu); // Volta para a lista de exposições
	      });
	  }

	  function updateExposicao(id, nome, descricao, id_museu) {
	      fetch(`http://localhost:6790/exposicao/${id}`, {
	          method: 'PUT',
	          headers: {
	              'Content-Type': 'application/json'
	          },
	          body: JSON.stringify({ nome, descricao, id_museu })
	      })
	      .then(response => {
	          if (!response.ok) {
	              return response.text().then(text => { throw new Error(text); });
	          }
			  Swal.fire({
			    title: 'Sucesso!',
			    text: 'Exposição atualizada com sucesso!',
			    icon: 'success',
			    confirmButtonText: 'OK'
			  });
	          loadExposicaoList(id_museu); // Recarrega a lista de exposições após a atualização
	      })
	      .catch(error => {
	          console.error('Erro ao atualizar exposição:', error);
			  Swal.fire({
			    title: 'Erro!',
			    text: 'Erro ao atualizar exposição!',
			    icon: 'error',
			    confirmButtonText: 'OK'
			  });
	      });
	  }

	  
	  
	  function deleteMuseu(museuId) {
	      fetch(`http://localhost:6790/museu/${museuId}`, {
	          method: 'DELETE',
	          headers: {
	              'Content-Type': 'application/json'
	          }
	      })
	      .then(response => {
	          if (!response.ok) {
	              return response.text().then(text => { throw new Error(text); });
	          }
			  Swal.fire({
			    title: 'Sucesso!',
			    text: 'Museu deletado com sucesso!',
			    icon: 'success',
			    confirmButtonText: 'OK'
			  });
	          loadMuseumList(); // Função para voltar à lista de museus
	      })
	      .catch(error => {
	          console.error('Erro ao deletar museu:', error);
			  Swal.fire({
			    title: 'Erro!',
			    text: 'Erro ao deletar museu!',
			    icon: 'error',
			    confirmButtonText: 'OK'
			  });
	      });
	  }

	  function deleteExposicao(exposicaoId) {
	    fetch(`http://localhost:6790/exposicao/${exposicaoId}`, {
	      method: 'DELETE',
	    })
	      .then(response => {
	        if (!response.ok) {
	          return response.text().then(text => { throw new Error(text); });
	        }
			Swal.fire({
			  title: 'Sucesso!',
			  text: 'Exposição deletado com sucesso!',
			  icon: 'success',
			  confirmButtonText: 'OK'
			});
	        loadMuseumList();  // Recarrega a lista de museus
	      })
	      .catch(error => {
	        console.error('Erro ao deletar exposição:', error);
			Swal.fire({
			  title: 'Erro!',
			  text: 'Erro ao deletar exposição!',
			  icon: 'error',
			  confirmButtonText: 'OK'
			});
	      });
	  }


	  btnMuseus.addEventListener('click', function() {
	    switchServiceSection('museus');
	    btnMuseus.classList.add('clicked');
	  });

	  function switchServiceSection(section, museuId = null) {
	    if (section === 'museus') {
	      contentAreaServices.innerHTML = `
	        <section class="section--container__responsive">
	          <section class="section--mainrow__responsive first--section">
	            <h1 class="generaltext">Cadastro</h1>
	            <form id="form-add-museu">
	              <p>Nome do Museu:</p>          
	              <input class="input--register" type="text" name="nome" placeholder="Nome do Museu" required>
	              
	              <p>Descrição:</p>              
	              <textarea class="input--register" name="descricao" placeholder="Descrição do Museu" required></textarea>
	              
	              <p>Localização:</p>
	              <input class="input--register" type="text" name="localizacao" placeholder="Localização do Museu" required>
	              
	              <input type="submit" value="Cadastrar" class="input--main__style input--button">
	            </form>
	          </section>
	        </section>
	      `;

	      const formAddMuseu = document.getElementById('form-add-museu');
	      formAddMuseu.addEventListener('submit', function(event) {
	        event.preventDefault();

	        const formData = {
	          nome: formAddMuseu.nome.value,
	          descricao: formAddMuseu.descricao.value,
	          localizacao: formAddMuseu.localizacao.value
	        };

	        fetch('http://localhost:6790/museu', {
	          method: 'POST',
	          headers: {
	            'Content-Type': 'application/json'
	          },
	          body: JSON.stringify(formData)
	        })
	        .then(response => {
	          if (!response.ok) {
	            return response.text().then(text => { throw new Error(text); });
	          }
	          return response.text();
	        })
	        .then(data => {
				Swal.fire({
				  title: 'Sucesso!',
				  text: 'Museu cadastrado com sucesso!',
				  icon: 'success',
				  confirmButtonText: 'OK'
				});
	          loadMuseumList();
	        })
	        .catch(error => {
	          console.error('Erro ao cadastrar museu:', error);
			  Swal.fire({
			    title: 'Erro!',
			    text: 'Erro ao cadastrar museu!',
			    icon: 'error',
			    confirmButtonText: 'OK'
			  });
	        });
	      });
	    } else if (section === 'exposicao' && museuId) {
	      // Carrega o formulário para adicionar uma nova exposição para o museu especificado
	      contentAreaServices.innerHTML = `
	        <section class="section--container__responsive">
	          <section class="section--mainrow__responsive first--section">
	            <h1 class="generaltext">Cadastrar Exposição</h1>
	            <form id="form-add-exposicao">
	              <p>Nome da Exposição:</p>          
	              <input class="input--register" type="text" name="nome" placeholder="Nome da Exposição" required>
	              
	              <p>Descrição:</p>              
	              <textarea class="input--register" name="descricao" placeholder="Descrição da Exposição" required></textarea>
	              
	              <input type="hidden" name="id_museu" value="${museuId}">
	              
	              <input type="submit" value="Cadastrar" class="input--main__style input--button">
	            </form>
	          </section>
	        </section>
	      `;

	      const formAddExposicao = document.getElementById('form-add-exposicao');
	      formAddExposicao.addEventListener('submit', function(event) {
	        event.preventDefault();

	        const formData = {
	          nome: formAddExposicao.nome.value,
	          descricao: formAddExposicao.descricao.value,
	          id_museu: formAddExposicao.id_museu.value
	        };

	        fetch('http://localhost:6790/exposicao', {
	          method: 'POST',
	          headers: {
	            'Content-Type': 'application/json'
	          },
	          body: JSON.stringify(formData)
	        })
	        .then(response => {
	          if (!response.ok) {
	            return response.text().then(text => { throw new Error(text); });
	          }
	          return response.text();
	        })
	        .then(data => {
				Swal.fire({
				  title: 'Sucesso!',
				  text: 'Exposiçao cadastrada com sucesso!',
				  icon: 'success',
				  confirmButtonText: 'OK'
				});
	          loadMuseumList();
	        })
	        .catch(error => {
	          console.error('Erro ao cadastrar exposição:', error);
			  Swal.fire({
			    title: 'Erro!',
			    text: 'Erro ao cadastrar exposição!',
			    icon: 'error',
			    confirmButtonText: 'OK'
			  });
	        });
	      });
	    }
	  }

	  loadMuseumList();
	  break;







	  
	  
	  
	  //login/cadastro de usuario


	  case 'settings':
	      mainContent.innerHTML = `
	        <div class="settings-content"></div>
	      `;
		  
		  function updateUser(id, nome, email, telefone, senha) {
		      fetch(`http://localhost:6790/usuario/${id}`, {
		          method: 'PUT',
		          headers: {
		              'Content-Type': 'application/json',
		              'X-Custom-Header': 'frontend'
		          },
		          body: JSON.stringify({ nome, email, telefone, senha })
		      })
		      .then(response => {
		          if (!response.ok) {
		              return response.text().then(text => { throw new Error(text); });
		          }
				  Swal.fire({
				  					  title: 'Sucesso!',
				  					  text: 'Informações salvas!',
				  					  icon: 'success',
				  					  confirmButtonText: 'OK'
				  					});
		          mostrarInformacoesDoUsuario();
		      })
		      .catch(error => {
		          console.error('Erro ao atualizar os dados do usuário:', error);
				  Swal.fire({
				  					  title: 'Erro!',
				  					  text: 'Não foi possível salvar as alterações!',
				  					  icon: 'success',
				  					  confirmButtonText: 'OK'
				  					});
		      });
		  }


			
		  function EditUserForm(usuario){
			document.querySelector('.settings-content').innerHTML = `
			<section class="section--container__responsive">
			            <section class="section--mainrow__responsive first--section">
			                <h1 class="generaltext">Editar Seus Dados</h1>
			                <form id="editUserForm">
			                    <p>Nome:</p>
			                    <input type="text" name="nome" value="${usuario.nome}" required>
			                    <p>Email:</p>
			                    <input type="email" name="email" value="${usuario.email}" required>
			                    <p>Telefone:</p>
			                    <input type="text" name="telefone" value="${usuario.telefone}" required>
			                    <p>Senha:</p>
			                    <input type="password" name="senha" placeholder="Digite sua nova senha" required>
			                    <input type="hidden" name="id" value="${usuario.id}">
			                    <button type="submit" class="input--button">Salvar Alterações</button>
			                    <button type="button" id="cancelEdit" class="input--button">Cancelar</button>
			                </form>
			            </section>
			        </section>
				          `;
						  
		  document.getElementById('editUserForm').addEventListener('submit', function (event) {
		          event.preventDefault();

		          // Captura os valores dos campos do formulário
		          const id = event.target.id.value;
		          const nome = event.target.nome.value;
		          const email = event.target.email.value;
		          const telefone = event.target.telefone.value;
		          const senha = event.target.senha.value;

		          // Chama a função para atualizar os dados do usuário
		          updateUser(id, nome, email, telefone, senha);
		      });
							  
		  // Event listener para o botão cancelar
		     document.getElementById('cancelEdit').addEventListener('click', function () {
		         // Retorna à visualização anterior
		         mostrarInformacoesDoUsuario();
		     });
		  }
	      function mostrarInformacoesDoUsuario() {
	        const usuario = JSON.parse(localStorage.getItem('usuario'));

	        if (usuario) {
	          // Usuário está logado, exibe as informações
	          document.querySelector('.settings-content').innerHTML = `
	            <section class="section--container__responsive">
	              <section class="section--mainrow__responsive first--section">
	                <h1 class="generaltext">Seus dados</h1>
	                <p><strong>Nome:</strong> ${usuario.nome}</p>
	                <p><strong>Email:</strong> ${usuario.email}</p>
	                <p><strong>Telefone:</strong> ${usuario.telefone}</p>
	                <button id="logoutButton" class="input--button">Logout</button>
					<button id="editinfo" class="input--button">Editar Informações</button>
	              </section>
	            </section>
	          `;
			  document.getElementById('editinfo').addEventListener('click', function() {
			  	            EditUserForm(usuario);
			  });

	          document.getElementById('logoutButton').addEventListener('click', function() {
	            localStorage.removeItem('usuario');
	            location.reload();
	          });
	        } else {
	          // Usuário não está logado, exibe o formulário de login
	          document.querySelector('.settings-content').innerHTML = `
	            <section class="section--container__responsive">
	              <section class="section--mainrow__responsive first--section">
	                <h1 class="generaltext">Login</h1>
	                <form id="loginForm">
	                  <p>Email:</p>
	                  <input class="input--register" type="email" name="email" placeholder="Seu email" required>
	                  <p>Senha:</p>
	                  <input class="input--register" type="password" name="senha" placeholder="Sua senha" required>
	                  <input type="submit" value="Login" class="input--main__style input--button">
	                </form>
	                <p>Não tem uma conta? <button id="registerButton" class="input--button">Cadastre-se</button></p>
	              </section>
	            </section>
	          `;

	          document.getElementById('loginForm').addEventListener('submit', function(event) {
	            event.preventDefault();

	            const email = event.target.email.value;
	            const senha = event.target.senha.value;

	            console.log("Tentativa de login:", { email, senha }); // Log para debug

	            fetch('http://localhost:6790/usuario/login', {
	              method: 'POST',
	              headers: {
	                'Content-Type': 'application/json'
	              },
	              body: JSON.stringify({ email, senha })
	            })
	            .then(response => {
	              if (!response.ok) {
	                return response.text().then(text => { throw new Error(text); });
	              }
	              return response.json();
	            })
	            .then(userData => {
	              localStorage.setItem('usuario', JSON.stringify(userData));
				  Swal.fire({
				    title: 'Sucesso!',
				    text: 'Login bem sucedido!',
				    icon: 'success',
				    confirmButtonText: 'OK'
				  });
	              // Atualiza a interface para exibir as informações do usuário
	              mostrarInformacoesDoUsuario();
	            })
	            .catch(error => {
	              console.error(error);
				  Swal.fire({
				    title: 'Erro!',
				    text: 'Erro ao fazer login!',
				    icon: 'error',
				    confirmButtonText: 'OK'
				  });
	            });
	          });

	          document.getElementById('registerButton').addEventListener('click', function() {
	            // Exibe o formulário de cadastro
	            document.querySelector('.settings-content').innerHTML = `
	              <section class="section--container__responsive">
	                <section class="section--mainrow__responsive first--section">
	                  <h1 class="generaltext">Cadastro</h1>
	                  <form id="registerForm">
	                    <p>Nome:</p>
	                    <input class="input--register" type="text" name="nome" placeholder="Seu nome" required>
	                    <p>Email:</p>
	                    <input class="input--register" type="email" name="email" placeholder="Seu email" required>
	                    <p>Telefone:</p>
	                    <input class="input--register" type="text" name="telefone" placeholder="Seu telefone" required>
	                    <p>Senha:</p>
	                    <input class="input--register" type="password" name="senha" placeholder="Sua senha" required>
	                    <input type="submit" value="Cadastrar" class="input--main__style input--button">
	                  </form>
	                </section>
	              </section>
	            `;

	            document.getElementById('registerForm').addEventListener('submit', function(event) {
	              event.preventDefault();

	              const nome = event.target.nome.value;
	              const email = event.target.email.value;
	              const telefone = event.target.telefone.value;
	              const senha = event.target.senha.value;

	              // Log para verificar os dados antes de enviar
	              console.log("Dados enviados para o cadastro:", { nome, email, telefone, senha });

	              fetch('http://localhost:6790/usuario', {
	                method: 'POST',
	                headers: {
	                  'Content-Type': 'application/json',
					  'X-Custom-Header': 'frontend'
	                },
	                body: JSON.stringify({ nome, email, telefone, senha })
	              })
	              .then(response => {
	                if (!response.ok) {
	                  return response.text().then(text => { throw new Error(text); });
	                }
	                return response.text();
	              })
	              .then(data => {
					Swal.fire({
					  title: 'Sucesso!',
					  text: 'Usuário cadastrado com sucesso!',
					  icon: 'success',
					  confirmButtonText: 'OK'
					});
	                location.reload();
	              })
	              .catch(error => {
	                console.error(error);
					Swal.fire({
					  title: 'Erro!',
					  text: 'Erro ao cadastrar usuário!',
					  icon: 'error',
					  confirmButtonText: 'OK'
					});
	              });
	            });
	          });
			  
	        }
	      }

	      // Chama a função ao carregar a página
	      mostrarInformacoesDoUsuario();

	      break;






    
    default:
    
      break;
  }
}
