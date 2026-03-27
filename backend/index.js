const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const axios = require('axios');
const zlib = require('zlib');
const xml2js = require('xml2js');
require('dotenv').config();

const app = express();

// Permite que o HTML faça requisições para este servidor sem bloqueios de CORS
app.use(cors());
// Permite que o servidor entenda dados enviados no formato JSON
app.use(express.json());

// Carregar as variáveis de ambiente
const caminhoCertificado = process.env.CAMINHO_CERTIFICADO;
const palavraPasse = process.env.SENHA_CERTIFICADO;

// Dados fixos para a requisição à SEFAZ
const CNPJ_RESTAURANTE = '19421040000135'; 
const CODIGO_UF = '26'; // Pernambuco

// ROTA DA API: O front-end vai bater aqui
app.post('/api/importar-nota', async (req, res) => {
  const chaveNota = req.body.chave;

  // Validação básica da chave
  if (!chaveNota || chaveNota.length !== 44) {
    return res.status(400).json({ erro: 'Chave de acesso inválida. Deve conter 44 dígitos.' });
  }

  console.log(`\n📥 A procurar nota na SEFAZ: ${chaveNota}`);

  try {
    // 1. Preparar o Certificado e o Agente HTTPS
    const certificadoPfx = fs.readFileSync(caminhoCertificado);
    const agenteHttps = new https.Agent({
      pfx: certificadoPfx,
      passphrase: palavraPasse,
      rejectUnauthorized: false,
      secureProtocol: 'TLSv1_2_method' // Força o TLS 1.2 que a SEFAZ exige
    });

    // 2. Montar o XML da Requisição (SOAP)
    const xmlRequisicao = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <nfeDistDFeInteresse xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeDistribuicaoDFe">
      <nfeDadosMsg>
        <distDFeInt versao="1.01" xmlns="http://www.portalfiscal.inf.br/nfe">
          <tpAmb>1</tpAmb>
          <cUFAutor>${CODIGO_UF}</cUFAutor>
          <CNPJ>${CNPJ_RESTAURANTE}</CNPJ>
          <consChNFe>
            <chNFe>${chaveNota}</chNFe>
          </consChNFe>
        </distDFeInt>
      </nfeDadosMsg>
    </nfeDistDFeInteresse>
  </soap12:Body>
</soap12:Envelope>`;

    // 3. Fazer a requisição com TIMEOUT ajustado para 6 minutos
    const resposta = await axios.post(
      'https://www1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx',
      xmlRequisicao,
      {
        httpsAgent: agenteHttps,
        timeout: 360000, // 360000ms = 6 minutos (espera o tempo que a SEFAZ precisar)
        headers: { 'Content-Type': 'application/soap+xml; charset=utf-8' }
      }
    );

    // 4. Tentar extrair o XML comprimido da resposta
    const match = resposta.data.match(/<docZip[^>]*>(.*?)<\/docZip>/);
    if (!match || !match[1]) {
      // O throw vai atirar para o catch de produção abaixo
      throw new Error('A nota foi localizada, mas o XML não está disponível para download. A SEFAZ pode exigir Manifestação do Destinatário prévia.');
    }

    // 5. Descompactar e converter de XML para JSON
    const bufferComprimido = Buffer.from(match[1], 'base64');
    const xmlExtraido = zlib.unzipSync(bufferComprimido).toString('utf-8');
    const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
    const resultadoJson = await parser.parseStringPromise(xmlExtraido);

    const nota = resultadoJson.nfeProc.NFe.infNFe;
    const itensXml = Array.isArray(nota.det) ? nota.det : [nota.det];

    // 6. Limpar os dados para o Front-end
    const itensMapeados = itensXml.map(item => ({
      nome: item.prod.xProd,
      quantidade: parseFloat(item.prod.qCom),
      unidade: item.prod.uCom
    }));

    console.log(`✅ Sucesso real na SEFAZ! A devolver ${itensMapeados.length} itens para o Front-end.`);
    
    return res.json({
      fornecedor: nota.emit.xNome,
      itens: itensMapeados
    });

  } catch (erro) {
    // BLOCO CATCH DE PRODUÇÃO REAL
    console.error(`\n❌ Falha na integração com a SEFAZ:`, erro.message);
    
    // Devolve o erro verdadeiro com status 500 para o navegador exibir no Toast
    return res.status(500).json({ 
      erro: 'Não foi possível importar a nota no momento.',
      detalhe: erro.message 
    });
  }
});

// Ligar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor BackStock a correr na porta ${PORT} (Em modo Produção)`);
  console.log(`🔌 API pronta em http://localhost:${PORT}/api/importar-nota\n`);
});