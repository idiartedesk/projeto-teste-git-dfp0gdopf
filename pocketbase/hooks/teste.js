routerAdd('GET', '/backend/v1/teste', (e) => {
  return e.json(200, { versao: 'v1-git' })
})
