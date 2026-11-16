import { useState } from 'react'
import { Loader2, ServerCog, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Backend do próprio Skip Cloud: rotas em /backend/v1/...
const ROUTE = '/backend/v1/teste'

type Result = { kind: 'ok'; raw: string } | { kind: 'error'; message: string } | null

export default function BackendTestButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result>(null)

  const handleTest = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(ROUTE)

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const raw = await res.text()
      // valida que a resposta é o JSON esperado
      const data = JSON.parse(raw)
      setResult({
        kind: 'ok',
        raw: typeof data.versao !== 'undefined' ? JSON.stringify(data) : raw,
      })
    } catch (err) {
      const detail =
        err instanceof Error && /^HTTP \d+/.test(err.message)
          ? ` (código ${err.message.replace('HTTP ', '')})`
          : ''
      setResult({
        kind: 'error',
        message: `Não foi possível conectar ao backend do Skip (${ROUTE}) — verifique se o backend está ativo e publicado.${detail}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleTest}
        disabled={loading}
        className="bg-[#F05133] hover:bg-[#FF6A4D] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 h-10 px-4 shadow-md shadow-[#F05133]/25 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ServerCog className="w-4 h-4" />}
        <span>{loading ? 'Testando…' : 'Testar backend (/backend/v1/teste)'}</span>
      </Button>

      {result?.kind === 'ok' && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-[#3DD68C] font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{`Resposta recebida de GET ${ROUTE}`}</span>
          </div>
          <div className="font-mono text-xs text-[#EDEFF6] bg-[#050507] p-3 rounded-lg border border-[#232838] whitespace-pre-wrap leading-relaxed overflow-x-auto">
            <span className="text-[#8A91A8]">{`$ GET ${ROUTE} → `}</span>
            <span className="text-[#3DD68C]">{result.raw}</span>
          </div>
        </div>
      )}

      {result?.kind === 'error' && (
        <div className="flex items-start gap-2 text-xs text-[#FF4D4F] bg-[#FF4D4F]/10 p-3 rounded-lg border border-[#FF4D4F]/30 font-mono leading-relaxed">
          <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{result.message}</span>
        </div>
      )}
    </div>
  )
}
