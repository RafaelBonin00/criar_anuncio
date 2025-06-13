let catalogo = [];
let historico = [];
let indiceAtual = -1;

const supabaseUrl = 'https://brlpfvcnrcohdexmszrh.supabase.co/rest/v1/cadastro';
const supabaseUrlText = 'https://brlpfvcnrcohdexmszrh.supabase.co/rest/v1';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybHBmdmNucmNvaGRleG1zenJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzY5MDU5MCwiZXhwIjoyMDYzMjY2NTkwfQ.qU3twc6BQpDKnZioHk7eBR4hNV1RngsUuAon7fDRZ1E';



async function buscarDados() {
  try {
    const response = await fetch(supabaseUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar dados:', error.message || error);
    return null;
  }
}

async function buscarTexto(titulo) {
  try {
    const response = await fetch(`${supabaseUrlText}/config?titulo=eq.${titulo}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar dados:', error.message || error);
    return null;
  }
}

async function buscarDadosForID(id) {
  try {
    const response = await fetch(`${supabaseUrl}?codigo=eq.${id}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar dados:', error.message || error);
    return null;
  }
}

async function AtulizarInicio(id) {
  try {
    id = parseInt(id);
  } catch (error) {
    return; // sai da função se der erro na conversão
  }

  if (!isNaN(id)) { 
    
    const returndados = await buscarDadosForID(id);
    const informacao_tecnica = document.getElementById('informacao_tec')
    const cost_titulo_vitrina = document.getElementById('titulo_vitrina')
    const itens_incluisos = document.getElementById('itens_incluisos')
    const mensagem_adicional = document.getElementById('mensagem_adicional')
    const meta_description = document.getElementById('meta_description')
    const palavras_chaves = document.getElementById('palavras_chaves')

    if (returndados.length > 0) {
      const dados = returndados[0];
      if(dados.historico){
        informacao_tecnica.textContent = dados.inf_tec;

      if (dados.finalizado){

        cost_titulo_vitrina.value = dados.titulotray;
        itens_incluisos.value = dados.itensincluso;

        gerarInputsVeiculos(dados.veiculos, 'container-veiculos');


        BuscarTextoBase("MensagemAdicional").then(texto => {
          mensagem_adicional.value = texto;
        });
        BuscarTextoBase("DescricaoTray").then(texto => {
          const novoTexto = texto.replace("--", `- ${dados.titulotray} -`);
          meta_description.value = novoTexto;
        });

        palavras_chaves.value = dados.palavraschaves;

        montarTextoCompleto(dados).then(texto => {
            document.getElementById('textoConteudo').value = texto;
          });

          
        gerarInputsML(dados)

      }else{

        const titulovitrina = gerarTitulo(dados);
        cost_titulo_vitrina.value = titulovitrina;
        itens_incluisos.value = gerarItensInclusos(dados);

        gerarInputsVeiculos(dados.veiculos, 'container-veiculos');


        BuscarTextoBase("MensagemAdicional").then(texto => {
          mensagem_adicional.value = texto;
        });

        BuscarTextoBase("DescricaoTray").then(texto => {
          const novoTexto = texto.replace("--", `- ${titulovitrina} -`);
          meta_description.value = novoTexto;
        });

        document.getElementById('palavras_chaves').value = gerarPalavrasChaves(dados);

        montarTextoCompleto(dados).then(texto => {
          document.getElementById('textoConteudo').value = texto;
        });

        gerarInputsML(dados)
      }

    } else {
      document.getElementById('informacao_tec').innerHTML = `Codigo sem cadastro, realizar o <a href="./cadastro.html">Cadastrar</a> para continuar.`;

    }
    }else{
      document.getElementById('informacao_tec').innerHTML = `Codigo não listado. Verificar codigos pendentes na <a href="./Lista.html">Lista</a>.`;
    }
    
  } else {
    document.getElementById('informacao_tec').innerHTML = `Nenhum dado encontrado. Deseja <a href="./cadastro.html">Cadastrar</a> um novo codigo?`;;
  }
}


function gerarInputsVeiculos(veiculos, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // limpa antes

  veiculos.forEach((v, index) => {
    const div = document.createElement('div');
    div.style.marginBottom = '10px';

    const inputVeiculo = document.createElement('input');
    inputVeiculo.type = 'text';
    inputVeiculo.name = `veiculo_${index}`;
    inputVeiculo.value = v.veiculo;
    inputVeiculo.placeholder = 'Veículo';
    inputVeiculo.autocomplete = 'off';
    inputVeiculo.onblur = salvarValoresApi;

    const labelAnoInicial = document.createElement('label');
    labelAnoInicial.textContent = ' - ';
    labelAnoInicial.style.marginLeft = '10px';

    const inputAnoInicial = document.createElement('input');
    inputAnoInicial.type = 'text';
    inputAnoInicial.name = `ano_inicial_${index}`;
    inputAnoInicial.value = v.ano_inicial;
    inputAnoInicial.style.width = '50px';
    inputAnoInicial.autocomplete = 'off';
    inputAnoInicial.onblur = salvarValoresApi;

    const labelAnoFinal = document.createElement('label');
    labelAnoFinal.textContent = ' A ';
    labelAnoFinal.style.marginLeft = '10px';

    const inputAnoFinal = document.createElement('input');
    inputAnoFinal.type = 'text';
    inputAnoFinal.name = `ano_final_${index}`;
    inputAnoFinal.value = v.ano_final;
    inputAnoFinal.style.width = '50px';
    inputAnoFinal.autocomplete = 'off';
    inputAnoFinal.onblur = salvarValoresApi;

    div.appendChild(inputVeiculo);
    div.appendChild(labelAnoInicial);
    div.appendChild(inputAnoInicial);
    div.appendChild(labelAnoFinal);
    div.appendChild(inputAnoFinal);

    container.appendChild(div);
  });
}



function coletarVeiculosDoContainer(containerId) {
  const container = document.getElementById(containerId);
  const veiculos = [];

  // Pegamos todos os inputs de veiculo dentro do container
  const inputsVeiculo = container.querySelectorAll('input[name^="veiculo_"]');

  inputsVeiculo.forEach(inputVeiculo => {
    const index = inputVeiculo.name.split('_')[1];

    const veiculo = inputVeiculo.value.trim();
    const ano_inicial = container.querySelector(`input[name="ano_inicial_${index}"]`)?.value.trim() || "";
    const ano_final = container.querySelector(`input[name="ano_final_${index}"]`)?.value.trim() || "";

    veiculos.push({
      veiculo,
      ano_inicial,
      ano_final
    });
  });

  return veiculos;
}


async function salvarValoresApi() {
  const codigo = document.getElementById('buscarocodigo').value;
  const titulo_vitrina = document.getElementById('titulo_vitrina').value;
  const itens_incluisos = document.getElementById('itens_incluisos').value;
  const palavras_chaves = document.getElementById('palavras_chaves').value;
  const textoConteudo = document.getElementById('textoConteudo').value;
  const veiculosAtualizados = coletarVeiculosDoContainer('container-veiculos');
  const arrayml = coletarValoresInputs()




  if (codigo === "Lista zerada") {
    alert('Sem dados para atualizar');
    return;
  }
  try {
    const response = await fetch(`${supabaseUrl}?codigo=eq.${codigo}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=representation'  // para receber o registro atualizado
      },
      body: JSON.stringify({
        titulotray: titulo_vitrina,
        itensincluso: itens_incluisos,
        palavraschaves: palavras_chaves,
        textfinal: textoConteudo,
        veiculos:veiculosAtualizados,
        arrayml:arrayml,
        finalizado: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na atualização: ${response.status} - ${errorText}`);
    }
    AtulizarInicio(codigo);

  } catch (error) {
    console.error(error);
  }
}

function textoParaVeiculos(texto) {
  const linhas = texto.trim().split('\n');

  const veiculos = [];

  for (let i = 0; i < linhas.length; i += 2) {
    // remove o "- " e pega o nome do veículo
    const veiculo = linhas[i].replace(/^- /, '').trim();

    // remove o "- ", pega os anos, separa pelo " a "
    const anos = linhas[i + 1].replace(/^- /, '').trim().split(' a ');

    const ano_inicial = anos[0] || "";
    const ano_final = anos[1] || "";

    veiculos.push({ veiculo, ano_inicial, ano_final });
  }

  return veiculos;
}


async function BuscarTextoBase(tipo) {
  let texto = "";
  const retornoapi = await buscarTexto(tipo);

  texto = retornoapi[0].text;

  return texto;
}

async function gerarTexto(dados) {
  let texto = "";

  if (dados.original) {
    const retornoapi = await buscarTexto("textooriginal");
    if (retornoapi && retornoapi.length > 0) {
      texto = retornoapi[0].text;  // acessa o texto dentro do array retornado
    }
  } else {
    const retornoapi = await buscarTexto("textoprincipal");
    if (retornoapi && retornoapi.length > 0) {
      texto = retornoapi[0].text;
    }
  }

  return texto;
}

async function montarTextoCompleto(dados) {
  const tipo = dados.original ? "textooriginal" : "textoprincipal";
  const resposta = await buscarTexto(tipo);

  if (!resposta || resposta.length === 0) {
    console.error("Não foi possível obter o texto base da API.");
    return "";
  }

  let textoBase = resposta[0].text;
  let itensInclusos = "";

  if(dados.finalizado){
    itensInclusos = dados.itensincluso;
  }else{
    itensInclusos = gerarItensInclusos(dados);
  }
  
  const textoVeiculos = gerarTextoVeiculos(dados);

  // Substitui no texto base
  textoBase = textoBase.replace("- CONTEÚDO DA EMBALAGEM:", `- CONTEÚDO DA EMBALAGEM:\n\n\n${itensInclusos}\n`);

  if (dados.veiculos.length === 1) {
    // Para 1 veículo, separar linhas VEÍCULOS e ANOS, já incluídos na gerarTextoVeiculos
    const [veiculosLine, anosLine] = textoVeiculos.split("\n\n").map(s => s.trim());

    textoBase = textoBase.replace("- DESTINADO  AOS  VEÍCULOS:", veiculosLine);
    textoBase = textoBase.replace("-ANOS:", anosLine);
  } else {
    // Para mais de 1 veículo, substitui toda a seção VEÍCULOS e remove a linha ANOS (não usada)
    textoBase = textoBase.replace("- DESTINADO  AOS  VEÍCULOS:", textoVeiculos);
    textoBase = textoBase.replace("-ANOS:", "");  // Remove linha -ANOS: vazia
  }

  // Lógica para o código original
  if (dados.num_original !== "" && dados.num_original != null && dados.num_original !== false) {
    textoBase = textoBase.replace("- CÓDIGO ORIGINAL:", `- CÓDIGO ORIGINAL: ${dados.num_original}`);
  } else {
    // Remove linha - CÓDIGO ORIGINAL: do texto se existir
    textoBase = textoBase.replace(/- CÓDIGO ORIGINAL:.*\n.*\n.*\n?/, "");
  }

  return textoBase;
}


function gerarTextoVeiculos(dados) {
  if (!dados.veiculos || dados.veiculos.length === 0) return "";

  // Função para formatar anos do intervalo para "-2009 -2010 ..."
  function formatarAnos(anoInicio, anoFim) {
    // Se anoFim vazio ou inválido, usa ano atual
    if (!anoFim || anoFim.toString().trim() === "") {
      anoFim = new Date().getFullYear();
    }

    // Garantir que anoInicio e anoFim são números
    anoInicio = Number(anoInicio);
    anoFim = Number(anoFim);

    if (isNaN(anoInicio) || isNaN(anoFim)) return "";

    let resultado = "";
    for (let ano = anoInicio; ano <= anoFim; ano++) {
      resultado += `-${ano} `;
    }
    return resultado.trim();
  }

  if (dados.veiculos.length === 1) {
    const v = dados.veiculos[0];
    const anosFormatados = formatarAnos(v.ano_inicial, v.ano_final);
    return `- DESTINADO  AOS  VEÍCULOS:\n- ${v.veiculo}\n\n-ANOS: ${anosFormatados}`;
  } else {
    let resultado = "- DESTINADO  AOS  VEÍCULOS:\n\n";
    dados.veiculos.forEach(v => {
      const anosFormatados = formatarAnos(v.ano_inicial, v.ano_final);
      resultado += `- ${v.veiculo}: ${anosFormatados}\n\n`;
    });
    return resultado.trim();
  }
}


function gerarVeiculos(dados){
  if (Array.isArray(dados.veiculos) && dados.veiculos.length > 0) {
    const anoAtual = new Date().getFullYear();
    const modelosVeiculosStr = dados.veiculos
      .map(v => {
        const anoFinal = v.ano_final ? v.ano_final : anoAtual;
        return `${v.veiculo} ${v.ano_inicial} A ${anoFinal}`;
      })
      .join(" ");
    return modelosVeiculosStr;
  }
}


function gerarPalavrasChaves(dados) {
  let Palavraschaves = "VAN, VANS, NOVO, NOVA, PEÇA, PEÇAS, QUALIDADE, PREÇO, PROMOÇÃO, OFERTA, DESCONTO";

  if (dados.original) {
    Palavraschaves += " ORIGINAL,";

    if (Array.isArray(dados.veiculos) && dados.veiculos.length > 0) {
      const modelosVeiculosStr = dados.veiculos
        .map(v => v.veiculo)
        .join(", ");
      Palavraschaves += " " + modelosVeiculosStr;
    }
  }

  return Palavraschaves;
}

function gerarTitulo(dados) {
  let descricao = dados.peca || "";

  // feminino = generofeminino (booleano)
  const feminino = dados.generofeminino;

  // dianteiro
  if (dados.dianteiro) {
    descricao += feminino ? " DIANTEIRA" : " DIANTEIRO";
  }

  // traseiro
  if (dados.traseiro) {
    descricao += feminino ? " TRASEIRA" : " TRASEIRO";
  }

  // modelos_veiculos - monta string do array veiculos
  descricao += " " + gerarVeiculos(dados);

  // Lados e posições
  if (dados.ladodireito) descricao += " LADO DIREITO";
  if (dados.ladoesquerdo) descricao += " LADO ESQUERDO";
  if (dados.superior) descricao += " SUPERIOR";
  if (dados.inferior) descricao += " INFERIOR";

  // complemento (considerando complemento_titulo ou complemento_descricao)
  const complemento = dados.complemento_titulo || dados.complemento_descricao || "";
  if (complemento.trim() !== "") {
    descricao += " " + complemento.trim();
  }

  // original e numero_original
  if (dados.original) {
    descricao += " ORIGINAL";
  }

  if(dados.num_original != ""){
    descricao += ` - ${dados.num_original}`
  }
  

  return descricao;
}

function gerarItensInclusos(dados) {
  let descricao = `- (01 UNIDADE) ${dados.peca || ""}`;

  if (dados.dianteiro) descricao += " DIANTEIRO";
  if (dados.traseiro) descricao += " TRASEIRO";
  if (dados.ladodireito) descricao += " LADO DIREITO - LADO PASSAGEIRO/CARONA";
  if (dados.ladoesquerdo) descricao += " LADO ESQUERDO - LADO MOTORISTA/CONDUTOR";
  if (dados.superior) descricao += " SUPERIOR";
  if (dados.inferior) descricao += " INFERIOR";

  if (dados.complemento_descricao && dados.complemento_descricao.trim() !== "") {
    descricao += " " + dados.complemento_descricao.trim();
  }

  return descricao;
}

async function carregaLista() {
  const dados = await buscarDados();
  console.log(dados);
  const container = document.getElementById('catalogo-container');
  if (!dados || !container) return;

  container.innerHTML = '';

  dados.forEach(item => {
    // Se historico for false, mostra na lista
    if (item.historico === false || item.historico === 'FALSE') {
      const div = document.createElement('div');

      // Cria botão Excluir
      const btnExcluir = document.createElement('button');
      btnExcluir.textContent = 'Excluir';
      btnExcluir.style.marginRight = '10px';

      // Evento de clique no botão
      btnExcluir.addEventListener('click', async () => {
        const confirma = confirm(`Deseja excluir o código ${item.codigo}?`);
        if (confirma) {
          try {
            await excluirItem(item.codigo);
            alert(`Item ${item.codigo} excluído!`);
            // Atualiza a lista após exclusão
            carregaLista();
          } catch (error) {
            alert('Erro ao excluir o item.');
            console.error(error);
          }
        }
      });

      div.appendChild(btnExcluir);
      div.appendChild(document.createTextNode(`${item.codigo} - ${item.inf_tec}`));
      container.appendChild(div);
    }
  });

  if (container.innerHTML === '') {
    container.textContent = 'Nenhum item pendente encontrado.';
  }
}

function copiarTexto(idInput) {
  const input = document.getElementById(idInput);
  if (!input) return;

  input.select();
  input.setSelectionRange(0, 99999); // Para mobile

  try {
    document.execCommand('copy');
  } catch (err) {
    return;
  }

  window.getSelection().removeAllRanges();
}

// Gera variações de texto para os lados direito e esquerdo
function gerarVariacoesLaterais(lado) {
  if (lado === 'direita') {
    return ['DIREITO', 'PASSAGEIRO', 'CARONA'];
  } else if (lado === 'esquerda') {
    return ['ESQUERDO', 'MOTORISTA', 'CONDUTOR'];
  }
  return ['', '', ''];
}

// Monta texto final, com posições e veiculo, tudo maiúsculo e original no final
function montarTexto(dados, veiculoObj, variacaoLateral = '') {
  const partes = [dados.peca];

  const posicoes = [
    { prop: 'dianteiro', texto: 'Dianteiro' },
    { prop: 'traseiro', texto: 'Traseiro' },
    { prop: 'superior', texto: 'Superior' },
    { prop: 'inferior', texto: 'Inferior' }
  ];

  posicoes.forEach(p => {
    if (dados[p.prop]) partes.push(p.texto);
  });

  if (variacaoLateral) {
    partes.push(variacaoLateral);
  } else {
    if (dados.direita) partes.push('Direita');
    if (dados.esquerda) partes.push('Esquerda');
  }

  partes.push(`${veiculoObj.veiculo} ${veiculoObj.ano_inicial} A ${veiculoObj.ano_final}`);

  if (dados.original) partes.push('Original');

  return partes.join(' ').toUpperCase();
}

function gerarInputsML(dados) {
  const container = document.getElementById('container-ml');
  container.innerHTML = '';

  function checarTamanhoInput(event) {
    const input = event.target;
    if (input.value.length > 60) {
      input.classList.add('input-error');
    } else {
      input.classList.remove('input-error');
    }
  }

  if (dados.finalizado && Array.isArray(dados.arrayml)) {
    dados.arrayml.forEach((texto, index) => {
      const idInput = `input_finalizado_${index}`;
      const wrapper = document.createElement('div');
      wrapper.classList.add('input-wrapper');

      const input = document.createElement('input');
      input.type = 'text';
      input.value = texto;
      input.id = idInput;
      input.classList.add('input-veiculo');
      input.addEventListener('input', checarTamanhoInput);
      input.addEventListener('blur', checarTamanhoInput); // <-- ADICIONADO
      input.setAttribute('onblur', 'salvarValoresApi()');
      input.autocomplete = 'off';

      const btnCopy = document.createElement('button');
      btnCopy.textContent = 'Copiar';
      btnCopy.type = 'button';
      btnCopy.classList.add('btn-copiar');
      btnCopy.onclick = () => copiarTexto(idInput);

      wrapper.appendChild(input);
      wrapper.appendChild(btnCopy);
      container.appendChild(wrapper);

      // Verifica o tamanho assim que o input é criado
      checarTamanhoInput({ target: input }); // <-- ADICIONADO
    });
  } else {
    const veiculos = dados.veiculos || [];

    if (veiculos.length === 1) {
      let variacoes = ['', '', '', '', ''];
      if (dados.direita) {
        variacoes.splice(0, 3, ...gerarVariacoesLaterais('direita'));
      } else if (dados.esquerda) {
        variacoes.splice(0, 3, ...gerarVariacoesLaterais('esquerda'));
      }

      for (let i = 0; i < 5; i++) {
        const idInput = `input_veiculo0_${i}`;
        const wrapper = document.createElement('div');
        wrapper.classList.add('input-wrapper');

        const texto = montarTexto(dados, veiculos[0], variacoes[i]);

        const input = document.createElement('input');
        input.type = 'text';
        input.value = texto;
        input.id = idInput;
        input.classList.add('input-veiculo');
        input.addEventListener('input', checarTamanhoInput);
        input.addEventListener('blur', checarTamanhoInput); // <-- ADICIONADO
        input.setAttribute('onblur', 'salvarValoresApi()');
        input.autocomplete = 'off';

        const btnCopy = document.createElement('button');
        btnCopy.textContent = 'Copiar';
        btnCopy.type = 'button';
        btnCopy.classList.add('btn-copiar');
        btnCopy.onclick = () => copiarTexto(idInput);

        wrapper.appendChild(input);
        wrapper.appendChild(btnCopy);
        container.appendChild(wrapper);

        // Verifica o tamanho logo que cria o input
        checarTamanhoInput({ target: input }); // <-- ADICIONADO
      }
    } else if (veiculos.length > 1) {
      veiculos.forEach((v, idx) => {
        let variacoes = ['', '', ''];
        if (dados.direita) variacoes = gerarVariacoesLaterais('direita');
        else if (dados.esquerda) variacoes = gerarVariacoesLaterais('esquerda');

        for (let i = 0; i < 3; i++) {
          const idInput = `input_veiculo${idx}_${i}`;
          const wrapper = document.createElement('div');
          wrapper.classList.add('input-wrapper');

          const texto = montarTexto(dados, v, variacoes[i]);

          const input = document.createElement('input');
          input.type = 'text';
          input.value = texto;
          input.id = idInput;
          input.placeholder = `Veículo ${idx + 1}`;
          input.classList.add('input-veiculo');
          input.addEventListener('input', checarTamanhoInput);
          input.addEventListener('blur', checarTamanhoInput); // <-- ADICIONADO

          const btnCopy = document.createElement('button');
          btnCopy.textContent = 'Copiar';
          btnCopy.type = 'button';
          btnCopy.classList.add('btn-copiar');
          btnCopy.onclick = () => copiarTexto(idInput);

          wrapper.appendChild(input);
          wrapper.appendChild(btnCopy);
          container.appendChild(wrapper);

          // Checar tamanho na criação
          checarTamanhoInput({ target: input }); // <-- ADICIONADO
        }
      });
    }
  }
}

function coletarValoresInputs() {
  const container = document.getElementById('container-ml');
  const inputs = container.querySelectorAll('input.input-veiculo');
  const valores = [];

  inputs.forEach(input => {
    valores.push(input.value);
  });

  return valores;
}

