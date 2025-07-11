const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());

const tokens = {
  'ETH': { name: 'Ethereum', symbol: 'ETH', balance: 5.25, price: 3000 },
  'USDC': { name: 'USD Coin', symbol: 'USDC', balance: 15000, price: 1 },
  'LINK': { name: 'Chainlink', symbol: 'LINK', balance: 850, price: 15.5 },
  'UNI': { name: 'Uniswap', symbol: 'UNI', balance: 2000, price: 7.2 },
};

app.get('/api/tokens', (req, res) => {
  console.log('Request diterima di /api/tokens');
  res.json(tokens);
});

app.get('/api/rate', (req, res) => {
  const { from, to } = req.query;

  if (!from || !to || !tokens[from] || !tokens[to]) {
    return res.status(400).json({ error: 'Token tidak valid' });
  }

  const rate = tokens[from].price / tokens[to].price;
  console.log(`Menghitung kurs: 1 ${from} = ${rate} ${to}`);
  
  res.json({ from, to, rate });
});

app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
