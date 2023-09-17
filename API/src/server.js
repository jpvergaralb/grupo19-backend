const app = require('./app');

const port = process.env.API_PORT || 8000;

// eslint-disable-next-line
process.env.NODE_ENV === 'test' ? null : app.listen(port, () => {
  console.log(`🚀| Servidor corriendo en http://localhost:${port}`);
});
