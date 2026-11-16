// Endpoint GET /backend/v1/teste — backend do Skip Cloud.
// Sem autenticação e sem coleções. Devolve {"versao":"v1"}.
module.exports = function handler(req, res) {
  res.status(200).json({ versao: 'v1' })
}
