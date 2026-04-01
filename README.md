# BackStock

Sistema de gestão de estoque para restaurantes, desenvolvido com React + TypeScript no frontend e Node.js no backend.

## Estrutura

```
backstock/
├── frontend/   # React + Vite + TypeScript + shadcn/ui
└── backend/    # Node.js + Express — integração SEFAZ (NF-e)
```

## Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:8080
```

## Backend

Crie um arquivo `.env` na pasta `backend/`:

```env
CAMINHO_CERTIFICADO=./certificados/seu-certificado.pfx
SENHA_CERTIFICADO=sua-senha
```

```bash
cd backend
npm install
npm start         # http://localhost:3000
```

## Funcionalidades

- Estoque geral com categorias (seco, congelado, fresco)
- Controle de retirada para a cozinha e devolução de sobras
- Importação de NF-e via chave de acesso (SEFAZ — ambiente de produção)
- Scanner de código de barras (EAN-13, Code 128, QR Code e outros)
- Alertas de estoque baixo
