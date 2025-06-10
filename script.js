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

  if (!isNaN(id)) { // verifica se id é número válido
    const returndados = await buscarDadosForID(id);
    if (returndados.length > 0) {
      const dados = returndados[0];
      if(dados.historico){
        document.getElementById('informacao_tec').textContent = dados.inf_tec;

      if (dados.finalizado){
        document.getElementById('titulo_vitrina').value = dados.titulotray;
        document.getElementById('itens_incluisos').value = dados.itensincluso;


const veiculos = dados.veiculos;  // seu array de objetos

const textoFormatado = veiculos.map((v, i) => {
  const index = i + 1;  // para começar em 1
  return `- ${v.veiculo}\n- ${v.ano_inicial} a ${v.ano_final}`;
}).join('\n');

document.getElementById('veiculos').value = textoFormatado;




        BuscarTextoBase("MensagemAdicional").then(texto => {
          document.getElementById('mensagem_adicional').value = texto;
        });

        BuscarTextoBase("DescricaoTray").then(texto => {
          const novoTexto = texto.replace("--", `- ${dados.titulotray} -`);
          document.getElementById('meta_description').value = novoTexto;
        });

        document.getElementById('palavras_chaves').value = dados.palavraschaves;

        document.getElementById('textoConteudo').value = dados.textfinal;

        }else{
          const titulovitrina = gerarTitulo(dados);
          document.getElementById('titulo_vitrina').value = titulovitrina;
          document.getElementById('itens_incluisos').value = gerarItensInclusos(dados);


     

const veiculos = dados.veiculos;  // seu array de objetos

const textoFormatado = veiculos.map((v, i) => {
  const index = i + 1;  // para começar em 1
  return `V${index} - ${v.veiculo}\nA${index} - ${v.ano_inicial} - ${v.ano_final}`;
}).join('\n');

document.getElementById('veiculos').value = textoFormatado;




          BuscarTextoBase("MensagemAdicional").then(texto => {
            document.getElementById('mensagem_adicional').value = texto;
          });

          BuscarTextoBase("DescricaoTray").then(texto => {
            const novoTexto = texto.replace("--", `- ${titulovitrina} -`);
            document.getElementById('meta_description').value = novoTexto;
          });



          document.getElementById('palavras_chaves').value = gerarPalavrasChaves(dados);
          montarTextoCompleto(dados).then(texto => {
            document.getElementById('textoConteudo').value = texto;
          });
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

async function salvarValoresApi() {
  const codigo = document.getElementById('buscarocodigo').value;
  const titulo_vitrina = document.getElementById('titulo_vitrina').value;
  const itens_incluisos = document.getElementById('itens_incluisos').value;
  const palavras_chaves = document.getElementById('palavras_chaves').value;
  const textoConteudo = document.getElementById('textoConteudo').value;
  const veiculosTexto = document.getElementById('veiculos').value;

  // converte texto para array de objetos
  const veiculos = textoParaVeiculos(veiculosTexto);

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
        veiculos: veiculos,   // envia o array convertido
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

  const itensInclusos = gerarItensInclusos(dados);
  const textoVeiculos = gerarTextoVeiculos(dados);

  // Substitui no texto base
  textoBase = textoBase.replace("- CONTEÚDO DA EMBALAGEM:", `- CONTEÚDO DA EMBALAGEM:\n\n${itensInclusos}\n`);

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
    // Mapeia cada veículo para "veiculo ano_inicial A ano_final"
    const modelosVeiculosStr = dados.veiculos
      .map(v => `${v.veiculo} ${v.ano_inicial} A ${v.ano_final}`)
      .join(" ");
      return modelosVeiculosStr
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
  } else if (dados.num_original && dados.num_original.trim() !== "") {
    descricao += " " + dados.num_original.trim();
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

  // Deseleciona o input após copiar
  window.getSelection().removeAllRanges();
}




