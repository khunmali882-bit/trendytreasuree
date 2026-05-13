const products = require('../../src/data/products.json');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  const path = event.path.replace('/.netlify/functions/products', '');
  
  // Get single product
  if (path.startsWith('/') && path.length > 1) {
    const id = path.substring(1);
    const product = products.find(p => p.id === id || p.id === parseInt(id));
    if (product) {
      return { statusCode: 200, headers, body: JSON.stringify(product) };
    }
    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Product not found' }) };
  }

  // Get all products (with search/category filter)
  const { search, category } = event.queryStringParameters || {};
  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(filteredProducts)
  };
};
