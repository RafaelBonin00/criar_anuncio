// config.js
const supabaseUrl = 'https://brlpfvcnrcohdexmszrh.supabase.co/rest/v1';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybHBmdmNucmNvaGRleG1zenJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzY5MDU5MCwiZXhwIjoyMDYzMjY2NTkwfQ.qU3twc6BQpDKnZioHk7eBR4hNV1RngsUuAon7fDRZ1E';  // coloque sua chave aqui

const textareaPrincipal = document.getElementById('textoConteudo');
const radios = document.querySelectorAll('input[name="tipoTexto"]');
const mensagensTextareas = document.querySelectorAll('textarea[data-titulo]');

/**
 * Busca texto do Supabase pelo título (key)
 * @param {string} titulo - A chave do texto no banco
 * @returns {Promise<string>} - Texto recuperado ou string vazia
 */
async function buscarTextoPorTitulo(titulo) {
  try {
    const response = await fetch(`${supabaseUrl}/config?titulo=eq.${titulo}`, {
      method: 'GET',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
    }

    const dados = await response.json();
    if (dados && dados.length > 0) {
      return dados[0].text || '';
    }
    return '';
  } catch (error) {
    console.error('Erro ao buscar texto:', error.message || error);
    return '';
  }
}

/**
 * Salva texto no Supabase pelo título (key)
 * @param {string} titulo - A chave do texto no banco
 * @param {string} novoTexto - O texto a salvar
 */
async function salvarTextoPorTitulo(titulo, novoTexto) {
  try {
    const response = await fetch(`${supabaseUrl}/config?titulo=eq.${titulo}`, {
      method: 'PATCH',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ text: novoTexto }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao salvar: ${response.status} - ${errorText}`);
    }

    console.log(`Texto "${titulo}" salvo com sucesso!`);
  } catch (error) {
    console.error('Erro ao salvar texto:', error.message || error);
  }
}

/**
 * Atualiza o textarea principal conforme o radio selecionado
 */
async function atualizarTextareaPrincipal() {
  const selecionado = document.querySelector('input[name="tipoTexto"]:checked');
  if (!selecionado) return;
  const titulo = selecionado.value;
  textareaPrincipal.value = await buscarTextoPorTitulo(titulo);
}

/**
 * Carrega todos os textareas com data-titulo
 */
async function carregarTodosTextos() {
  for (const textarea of mensagensTextareas) {
    const titulo = textarea.getAttribute('data-titulo');
    textarea.value = await buscarTextoPorTitulo(titulo);
  }
}

/**
 * Salva o texto do textarea principal com base no radio selecionado
 */
async function salvarTextoPrincipal() {
  const selecionado = document.querySelector('input[name="tipoTexto"]:checked');
  if (!selecionado) return;
  const titulo = selecionado.value;
  await salvarTextoPorTitulo(titulo, textareaPrincipal.value);
}

/**
 * Salva texto de qualquer textarea com data-titulo
 * @param {HTMLTextAreaElement} textarea 
 */
async function salvarTextoDinamico(textarea) {
  const titulo = textarea.getAttribute('data-titulo');
  if (!titulo) return;
  await salvarTextoPorTitulo(titulo, textarea.value);
}

// Eventos para os radios
radios.forEach(radio => {
  radio.addEventListener('change', atualizarTextareaPrincipal);
});

// Evento para salvar texto principal ao sair do textarea
textareaPrincipal.addEventListener('blur', salvarTextoPrincipal);

// Eventos para salvar cada textarea dinâmico ao sair do campo
mensagensTextareas.forEach(textarea => {
  textarea.addEventListener('blur', () => salvarTextoDinamico(textarea));
});

// Inicialização
async function init() {
  await atualizarTextareaPrincipal();
  await carregarTodosTextos();
}

init();
