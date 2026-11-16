// Endpoint GET /backend/v1/teste — backend do Skip Cloud (PocketBase JSVM).
// Sem autenticação, sem coleções, sem banco. Responde {"versao":"v1"}.
routerAdd('GET', '/backend/v1/teste', (e) => {
  return e.json(200, { versao: 'v1' })
})
