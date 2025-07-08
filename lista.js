  document.getElementById('uploadBtn').addEventListener('click', () => {
    const input = document.getElementById('fileInput');
    if (!input.files.length) {
      alert('Selecione um arquivo Excel primeiro!');
      return;
    }
    const file = input.files[0];
    readExcelAndUpdate(file);
    
  });

  function readExcelAndUpdate(file) {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Converter planilha para JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log('Dados do Excel:', jsonData);

      // Atualizar registros via API Supabase
      for (const record of jsonData) {
        await insertSupabase(record);
      }
      alert('Processo finalizado!');
    };

    reader.readAsArrayBuffer(file);
  }


async function insertSupabase(record) {
  // Converte para string os campos que são texto, se necessário
  if (record.num_fab !== undefined && record.num_fab !== null) {
    record.num_fab = String(record.num_fab);
  }
  if (record.num_original !== undefined && record.num_original !== null) {
    record.num_original = String(record.num_original);
  }

  try {
    const response = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Erro inserindo código ${record.codigo}:`, text);
    } else {
      const data = await response.json();
      console.log('Inserido:', data);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}


async function excluirItem(codigo) {
  const url = `${supabaseUrl}?codigo=eq.${codigo}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro ao excluir: ${text}`);
  }
}


async function atualizarItem(codigo, novoInfTec) {
  const url = `${supabaseUrl}?codigo=eq.${codigo}`;
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Prefer': 'return=representation' // Isso instrui o Supabase a retornar o item atualizado
    },
    body: JSON.stringify({
      inf_tec: novoInfTec
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro ao atualizar: ${text}`);
  }

  // Opcional: retorna o item atualizado
  const data = await response.json();
  return data;
}
