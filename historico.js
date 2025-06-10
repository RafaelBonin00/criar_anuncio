async function carregarHistorico() {
  const dados = await buscarDados(); // Sua função para obter dados da API
  const tbody = document.querySelector('#tabelaRegistros tbody');
  if (!dados || !tbody) return;

  // Ordena os dados do mais recente para o mais antigo pela data 'created_at'
  dados.sort((a, b) => {
    const dataA = new Date(a.created_at);
    const dataB = new Date(b.created_at);
    return dataB - dataA; // Descendente
  });

  tbody.innerHTML = '';

  dados.forEach(item => {
    // Mostrar só se historico for true (boolean ou string)
    if (item.historico === true || item.historico === 'true') {
      const tr = document.createElement('tr');

      let veiculosText = '';

      if (Array.isArray(item.veiculos)) {
        veiculosText = item.veiculos
          .map(v => {
            const anoIni = v.ano_inicial || '';
            const anoFin = v.ano_final || '';
            let anos = '';

            if (anoIni && anoFin) {
              anos = `(${anoIni} - ${anoFin})`;
            } else if (anoIni) {
              anos = `(a partir de ${anoIni})`;
            } else if (anoFin) {
              anos = `(até ${anoFin})`;
            }

            return `${v.veiculo || ''} ${anos}`.trim();
          })
          .join(', ');
      } else if (typeof item.veiculos === 'string') {
        veiculosText = item.veiculos;
      }

      // Quantidade - não existe no schema? Coloque "-" ou 1 por padrão
      const quantidade = item.quantidade !== undefined ? item.quantidade : '-';

      // Flags - mostra só as flags true com labels legíveis
          const flags = [
      { key: 'finalizado', label: 'Finalizado', className: 'flag-finalizado' },
      { key: 'original', label: 'Original', className: 'flag-original' },
      { key: 'generofeminino', label: 'Gênero Feminino', className: 'flag-generofeminino' },
      { key: 'ladodireito', label: 'Lado Direito', className: 'flag-ladodireito' },
      { key: 'ladoesquerdo', label: 'Lado Esquerdo', className: 'flag-ladoesquerdo' },
      { key: 'dianteiro', label: 'Dianteiro', className: 'flag-dianteiro' },
      { key: 'traseiro', label: 'Traseiro', className: 'flag-traseiro' },
      { key: 'superior', label: 'Superior', className: 'flag-superior' },
      { key: 'inferior', label: 'Inferior', className: 'flag-inferior' },
    ];

    // Depois, quando montar o flagsHTML:
    const flagsHTML = flags
      .filter(f => item[f.key])
      .map(f => `<span class="flag-item ${f.className}">${f.label}</span>`)
      .join(' ');


      // Data formatada (created_at)
      let dataFormatada = '-';
      if (item.created_at) {
        const d = new Date(item.created_at);
        dataFormatada = d.toLocaleString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
      }

      // Monta a linha
      tr.innerHTML = `
        <td>${item.codigo || ''}</td>
        <td>${item.peca || item.inf_tec || ''}</td>
        <td>${veiculosText}</td>
        <td>${item.marca}</td>
        <td>${item.complemento_titulo || ''}</td>
        <td>${item.complemento_descricao || ''}</td>
        <td>${item.num_original || ''}</td>
        <td>${item.num_fab || ''}</td>
        <td>${flagsHTML}</td>
        <td class="data-salvo">${dataFormatada}</td>
      `;

      tbody.appendChild(tr);
    }
  });

  // Caso não tenha registros para mostrar
  if (tbody.children.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;">Nenhum registro histórico encontrado.</td></tr>`;
  }
}
