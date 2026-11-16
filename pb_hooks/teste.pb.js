/**
 * Hook PocketBase (JSVM, PocketBase v0.23+)
 *
 * Como usar: copie este arquivo para a pasta `pb_hooks/` da sua instância
 * PocketBase (ou use esta pasta inteira como `pb_hooks/`) e reinicie o
 * PocketBase para que o hook seja carregado.
 *
 * Registra a rota GET /teste, sem autenticação e sem coleções.
 */

$app.routerAdd('GET', '/teste', (e) => {
  return e.json(200, { versao: 'v1' })
})
