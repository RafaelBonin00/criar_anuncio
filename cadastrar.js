async function carregaPrimeiroCodigo() {
  const dados = await buscarDados();
  if (!dados) return;

  // Filtrar itens com historico false ou 'FALSE'
  const itensFiltrados = dados.filter(item => item.historico === false || item.historico === 'FALSE');

  if (itensFiltrados.length === 0) {
    document.getElementById('codigo').value = 'Lista zerada';
    document.getElementById('descricaoLista').textContent = '';
    return;
  }

  // Encontrar o item com menor id
  const itemMenorId = itensFiltrados.reduce((menor, item) => {
    return item.codigo < menor.codigo ? item : menor;
  }, itensFiltrados[0]);

  // Preencher campos com o item encontrado
  document.getElementById('codigo').value = itemMenorId.codigo;
  document.getElementById('descricaoLista').textContent = itemMenorId.inf_tec;
    const infTecnica = itemMenorId.inf_tec || ''; // garante que seja string
    const primeiraPalavra = infTecnica.trim().split(/\s+/)[0] || '';
    document.getElementById('peca_cadastro').value = primeiraPalavra;

  document.getElementById('numero_original').value = itemMenorId.num_original;
  document.getElementById('numero_fabrica').value = itemMenorId.num_fab;
  document.getElementById('original').checked = CheckVerificacao(itemMenorId.inf_tec, "*");
  document.getElementById('ladoDireito').checked = CheckVerificacao(itemMenorId.inf_tec, "LD");
  document.getElementById('dianteiro').checked = CheckVerificacao(itemMenorId.inf_tec, "DIANT");
  document.getElementById('traseiro').checked = CheckVerificacao(itemMenorId.inf_tec, "TRAS");
  document.getElementById('superior').checked = CheckVerificacao(itemMenorId.inf_tec, "SUPERIOR");
  document.getElementById('inferior').checked = CheckVerificacao(itemMenorId.inf_tec, "INFERIOR");

}

async function carregarPorCodigo(id) {
  try {
    id = parseInt(id);
  } catch (error) {
    return; // sai da função se der erro na conversão
  }
  if (!isNaN(id)){
      const dados = await buscarDadosForID(id);
    if (!dados) return;

    // Filtrar itens com historico false ou 'FALSE'
    const itensFiltrados = dados.filter(item => item.historico === false || item.historico === 'FALSE');

    if (itensFiltrados.length === 0) {
      document.getElementById('codigo').value = `Codigo ${id} não localizado.`;
      document.getElementById('descricaoLista').textContent = '';
      limparCampos();
      return;
    }

    // Encontrar o item com menor id
    const itemMenorId = itensFiltrados.reduce((menor, item) => {
      return item.codigo < menor.codigo ? item : menor;
    }, itensFiltrados[0]);

    // Preencher campos com o item encontrado
    document.getElementById('codigo').value = itemMenorId.codigo;
    document.getElementById('descricaoLista').textContent = itemMenorId.inf_tec;
    const infTecnica = itemMenorId.inf_tec || ''; // garante que seja string
    const primeiraPalavra = infTecnica.trim().split(/\s+/)[0] || '';
    document.getElementById('peca_cadastro').value = primeiraPalavra;

    document.getElementById('numero_original').value = itemMenorId.num_original;
    document.getElementById('numero_fabrica').value = itemMenorId.num_fab;
    document.getElementById('original').checked = CheckVerificacao(itemMenorId.inf_tec, "*");
    document.getElementById('ladoDireito').checked = CheckVerificacao(itemMenorId.inf_tec, "LD");
    document.getElementById('dianteiro').checked = CheckVerificacao(itemMenorId.inf_tec, "DIANT");
    document.getElementById('traseiro').checked = CheckVerificacao(itemMenorId.inf_tec, "TRAS");
    document.getElementById('superior').checked = CheckVerificacao(itemMenorId.inf_tec, "SUPERIOR");
    document.getElementById('inferior').checked = CheckVerificacao(itemMenorId.inf_tec, "INFERIOR");
  }else{
    document.getElementById('codigo').value = `Codigo Invalido, tentar novamente.`;
    document.getElementById('descricaoLista').textContent = '';
    limparCampos();

  }
  

}



function coletarVeiculos() {
  var quantidade = parseInt(document.getElementById("quantidade").value);
  var veiculos = [];

  for (var i = 1; i <= quantidade; i++) {
    var veiculo = document.getElementById("veiculo" + i)?.value || "";
    var ano_inicial = document.getElementById("anoInicial" + i)?.value || "";
    var ano_final = document.getElementById("anoFinal" + i)?.value || "";

    veiculos.push({
      veiculo: veiculo,
      ano_inicial: ano_inicial,
      ano_final: ano_final
    });
  }

  return veiculos;  // retorna só o array puro
}

function limparCampos() {
  // Resetar campos de texto e number
  document.getElementById('peca_cadastro').value = '';
  document.getElementById('complemento_titulo').value = '';
  document.getElementById('complemento_itens').value = '';
  document.getElementById('numero_original').value = '';
  document.getElementById('numero_fabrica').value = '';

  // Desmarcar checkboxes
  document.getElementById('original').checked = false;
  document.getElementById('ladoDireito').checked = false;
  document.getElementById('ladoEsquerdo').checked = false;
  document.getElementById('dianteiro').checked = false;
  document.getElementById('traseiro').checked = false;
  document.getElementById('superior').checked = false;
  document.getElementById('inferior').checked = false;

  // Resetar quantidade e gerar um campo vazio para veículo
  const quantidadeInput = document.getElementById('quantidade');
  quantidadeInput.value = 1;
  gerarCampos();
}

async function salvarValoresApi() {
  const codigo = document.getElementById('codigo').value;
  const peca_cadastro = document.getElementById('peca_cadastro').value;
  const complemento_titulo = document.getElementById('complemento_titulo').value;
  const complemento_itens = document.getElementById('complemento_itens').value;
  const numero_original = document.getElementById('numero_original').value;
  const numero_fabrica = document.getElementById('numero_fabrica').value;
  const original = document.getElementById('original').checked;
  const generoFeminino = document.getElementById('generoFeminino').checked;
  const ladoDireito = document.getElementById('ladoDireito').checked;
  const ladoEsquerdo = document.getElementById('ladoEsquerdo').checked;
  const dianteiro = document.getElementById('dianteiro').checked;
  const traseiro = document.getElementById('traseiro').checked;
  const superior = document.getElementById('superior').checked;
  const inferior = document.getElementById('inferior').checked;

  if (codigo === "Lista zerada") {
    alert('Sem dados para atualizar');
    return;
  }

  // Confirmação antes de salvar
  const confirmar = confirm('Deseja confirmar o cadastro?');
  if (!confirmar) {
    return; // Sai da função se o usuário clicar em "Não"
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
        historico: true,
        veiculos: coletarVeiculos(),
        peca: peca_cadastro,
        complemento_titulo: complemento_titulo,
        complemento_descricao: complemento_itens,
        generofeminino:generoFeminino,
        num_original: numero_original,
        num_fab: numero_fabrica,
        original: original,
        ladodireito: ladoDireito,
        ladoesquerdo: ladoEsquerdo,
        dianteiro: dianteiro,
        traseiro: traseiro,
        superior: superior,
        inferior: inferior,
        created_at: new Date()
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na atualização: ${response.status} - ${errorText}`);
    }

    alert('Cadastro criado com sucesso!');
    limparCampos();
    carregaPrimeiroCodigo();

  } catch (error) {
    alert('Erro ao atualizar o cadastro');
    console.error(error);
  }
}


function atualizarCampos(item) {
  document.getElementById('codigoLista').textContent = item.codigo;
  document.getElementById('descricaoLista').textContent = item.descricao;
  document.getElementById('peca').value = item.codigo;  // Mantém o código no input peca
}

// Função para criar campos de veículos (exemplo simples, ajuste conforme seu gerarCampos)
function gerarCampos() {
  var quantidade = document.getElementById("quantidade").value;
  var container = document.getElementById("veiculos-container");
  container.innerHTML = ""; 

  for (var i = 1; i <= quantidade; i++) {
  var veiculoDiv = document.createElement("div");
  veiculoDiv.className = "input-container";
  veiculoDiv.innerHTML = '<label>Veículo ' + i + ':</label>' +
                          '<input type="text" id="veiculo' + i + '" autocomplete="off">' ;

  var anoDiv = document.createElement("div");
  anoDiv.className = "ano-container";
  anoDiv.innerHTML = '<label>Anos ' + i + ':</label>' +
                      '<input type="number" id="anoInicial' + i + '" placeholder="Inicial" autocomplete="off">' +
                      '<span>A</span>' +
                      '<input type="number" id="anoFinal' + i + '" placeholder="Final" autocomplete="off">' ;
  container.appendChild(veiculoDiv);
  container.appendChild(anoDiv);
  }
}
// Eventos
window.onload = () => {
  gerarCampos();
  document.getElementById('btnProximo').addEventListener('click', mostrarProximo);
  document.getElementById('quantidade').addEventListener('change', gerarCampos);
};

function CheckVerificacao(texto, verificar) {
    const textoMaiusculo = texto.toUpperCase();
    const verificarMaiusculo = verificar.toUpperCase();
    return textoMaiusculo.includes(verificarMaiusculo);
}

async function atualizarCreatedAt(codigo) {
  // Função para pegar data/hora atual no UTC-3 formatada ISO sem milissegundos
  function getCurrentLocalISO() {
  const now = new Date();
  return now.toISOString().slice(0,19); // sem milissegundos, com T no meio
  }

  try {
    const response = await fetch(`${supabaseUrl}?codigo=eq.${codigo}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        created_at: getCurrentLocalISO()
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na atualização: ${response.status} - ${errorText}`);
    }

    const dadosAtualizados = await response.json();
    console.log('Registro atualizado:', dadosAtualizados);
  } catch (error) {
    console.error('Erro ao atualizar created_at:', error);
  }
}