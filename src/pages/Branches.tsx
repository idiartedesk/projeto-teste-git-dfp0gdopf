import React, { useState } from 'react'
import {
  GitBranch,
  Plus,
  Trash2,
  Check,
  ArrowRight,
  GitCommit,
  Info,
  AlertTriangle,
} from 'lucide-react'
import { useGitRepo } from '../context/GitRepoContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function Branches() {
  const { branches, currentBranch, commits, setCurrentBranch, createBranch, deleteBranch } =
    useGitRepo()

  const [newBranchName, setNewBranchName] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBranchName.trim()) return
    const success = createBranch(newBranchName.trim())
    if (success) {
      setNewBranchName('')
      setIsCreateOpen(false)
    }
  }

  const handleDeleteConfirm = () => {
    if (!branchToDelete) return
    deleteBranch(branchToDelete)
    setBranchToDelete(null)
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EDEFF6]">
              Branches & Topologia
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1A1E2A] border border-[#232838] text-[#8A91A8]">
              {branches.length} ativas
            </span>
          </div>
          <p className="text-sm text-[#8A91A8] mt-1">
            Navegue entre ramificações de desenvolvimento, crie novas branches ou alterne seu HEAD.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#F05133] hover:bg-[#FF6A4D] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 h-10 px-4 shadow-md shadow-[#F05133]/25 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Branch</span>
        </Button>
      </div>

      {/* 2. Visual Merge Graph */}
      <div className="rounded-xl border border-[#232838] bg-[#12151E] p-5 sm:p-6 space-y-4 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#F05133]" />
            <h2 className="text-base font-bold text-[#EDEFF6]">Grafo Visual de Ramos</h2>
          </div>
          <span className="text-xs font-mono text-[#8A91A8]">fluxo simulado</span>
        </div>

        {/* SVG Git Graph Diagram */}
        <div className="w-full overflow-x-auto py-2">
          <div className="min-w-[680px]">
            <svg viewBox="0 0 760 160" className="w-full h-auto overflow-visible select-none">
              {/* Grid guide lines */}
              <line
                x1="40"
                y1="40"
                x2="720"
                y2="40"
                stroke="#232838"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <line
                x1="40"
                y1="80"
                x2="720"
                y2="80"
                stroke="#232838"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <line
                x1="40"
                y1="120"
                x2="720"
                y2="120"
                stroke="#232838"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Main branch trunk (orange) */}
              <path
                d="M 60 40 L 700 40"
                stroke="#F05133"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                className="animate-draw-line"
              />

              {/* Develop branch line (blue) diverging and running */}
              <path
                d="M 160 40 C 200 40, 220 80, 260 80 L 640 80"
                stroke="#4DA3FF"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                className="animate-draw-line"
              />

              {/* Feature/login branch line (green) diverging from develop */}
              <path
                d="M 320 80 C 350 80, 370 120, 400 120 L 580 120"
                stroke="#3DD68C"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                className="animate-draw-line"
              />

              {/* Hotfix/crash branch line (purple) diverging and merging back */}
              <path
                d="M 460 40 C 490 40, 500 80, 520 80 C 540 80, 560 40, 590 40"
                stroke="#B983FF"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                className="animate-draw-line"
              />

              {/* Commit Nodes along main (orange) */}
              <circle cx="80" cy="40" r="7" fill="#F05133" stroke="#12151E" strokeWidth="3" />
              <circle cx="160" cy="40" r="7" fill="#F05133" stroke="#12151E" strokeWidth="3" />
              <circle cx="360" cy="40" r="7" fill="#F05133" stroke="#12151E" strokeWidth="3" />
              <circle cx="460" cy="40" r="7" fill="#F05133" stroke="#12151E" strokeWidth="3" />
              <circle cx="590" cy="40" r="7" fill="#F05133" stroke="#12151E" strokeWidth="3" />
              <circle cx="680" cy="40" r="8" fill="#F05133" stroke="#EDEFF6" strokeWidth="2.5" />

              {/* Commit Nodes along develop (blue) */}
              <circle cx="260" cy="80" r="6" fill="#4DA3FF" stroke="#12151E" strokeWidth="2.5" />
              <circle cx="320" cy="80" r="6" fill="#4DA3FF" stroke="#12151E" strokeWidth="2.5" />
              <circle cx="480" cy="80" r="6" fill="#4DA3FF" stroke="#12151E" strokeWidth="2.5" />
              <circle cx="620" cy="80" r="7" fill="#4DA3FF" stroke="#EDEFF6" strokeWidth="2" />

              {/* Commit Nodes along feature (green) */}
              <circle cx="400" cy="120" r="6" fill="#3DD68C" stroke="#12151E" strokeWidth="2.5" />
              <circle cx="560" cy="120" r="7" fill="#3DD68C" stroke="#EDEFF6" strokeWidth="2" />

              {/* Commit Nodes along hotfix (purple) */}
              <circle cx="520" cy="80" r="6" fill="#B983FF" stroke="#12151E" strokeWidth="2.5" />

              {/* Branch labels on graph */}
              <text
                x="705"
                y="44"
                fill="#F05133"
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                main
              </text>
              <text
                x="645"
                y="84"
                fill="#4DA3FF"
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                develop
              </text>
              <text
                x="585"
                y="124"
                fill="#3DD68C"
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                feature/login
              </text>
              <text
                x="525"
                y="65"
                fill="#B983FF"
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                hotfix
              </text>
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8A91A8] pt-2 border-t border-[#232838]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F05133]" />
            <span>main (produção)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4DA3FF]" />
            <span>develop (integração)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3DD68C]" />
            <span>features (funcionalidades)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B983FF]" />
            <span>hotfixes (urgentes)</span>
          </div>
        </div>
      </div>

      {/* 3. Branch Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#EDEFF6] flex items-center gap-2">
          <span>Branches Registradas</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((b) => {
            const isCurrent = b.name === currentBranch
            const latestCommit = commits.find((c) => c.hash === b.latestCommitHash) || commits[0]
            const isProtected = b.name === 'main' || b.name === 'master'

            return (
              <div
                key={b.name}
                className={`rounded-xl border bg-[#12151E] p-5 space-y-4 transition-all ${
                  isCurrent
                    ? 'border-[#F05133] shadow-md shadow-[#F05133]/10 bg-gradient-to-br from-[#12151E] to-[#1A1E2A]'
                    : 'border-[#232838] hover:border-[#8A91A8]/40'
                }`}
              >
                {/* Top card row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: b.color }}
                    />
                    <span className="font-mono font-bold text-base text-[#EDEFF6] truncate">
                      {b.name}
                    </span>
                  </div>

                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F05133]/20 border border-[#F05133]/40 text-[#F05133] text-xs font-mono font-bold shrink-0">
                      atual (HEAD)
                    </span>
                  )}
                </div>

                {/* Commit info preview */}
                <div className="p-3 bg-[#0A0C12] rounded-lg border border-[#232838] space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[#8A91A8]">
                    <span className="font-semibold uppercase text-[10px]">Último commit</span>
                    <span className="font-mono text-[#F05133]">{b.latestCommitHash}</span>
                  </div>
                  <p className="font-medium text-[#EDEFF6] truncate">
                    {latestCommit ? latestCommit.message : 'Nenhum commit associado'}
                  </p>
                </div>

                {/* Ahead / Behind stats */}
                <div className="flex items-center justify-between text-xs font-mono text-[#8A91A8] border-t border-[#232838] pt-3">
                  <span>
                    {b.ahead} à frente, {b.behind} atrás
                  </span>
                  {isProtected && (
                    <span className="text-[11px] text-[#8A91A8] italic">branch protegida</span>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  {isCurrent ? (
                    <Button
                      disabled
                      size="sm"
                      variant="outline"
                      className="border-[#232838] text-xs text-[#3DD68C] bg-[#3DD68C]/10 w-full"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Branch ativa
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setCurrentBranch(b.name)}
                      className="bg-[#1A1E2A] hover:bg-[#F05133] hover:text-white border border-[#232838] text-xs text-[#EDEFF6] transition-colors w-full"
                    >
                      Trocar para esta branch
                    </Button>
                  )}

                  {/* Delete button with protected tooltip */}
                  {isProtected ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span tabIndex={0}>
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled
                            className="text-[#8A91A8] opacity-30 cursor-not-allowed h-8 w-8 shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#12151E] border border-[#232838] text-xs text-[#EDEFF6]">
                        A branch main é protegida
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setBranchToDelete(b.name)}
                      title={`Excluir branch ${b.name}`}
                      className="text-[#8A91A8] hover:text-[#FF4D4F] hover:bg-[#FF4D4F]/10 h-8 w-8 shrink-0 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. Info Banner */}
      <div className="rounded-xl border border-[#232838] bg-[#12151E]/60 p-4 flex items-center gap-3 text-xs text-[#8A91A8]">
        <Info className="w-4 h-4 text-[#4DA3FF] shrink-0" />
        <p>
          Este é um teste simulado — crie e exclua branches à vontade. As modificações ocorrem em
          memória e você pode redefinir o estado a qualquer momento no terminal com{' '}
          <code className="text-[#EDEFF6] font-mono">git reset --hard</code>.
        </p>
      </div>

      {/* Modal: Nova Branch */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-[#12151E] border border-[#232838] text-[#EDEFF6] max-w-md w-[95vw] p-6 shadow-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#EDEFF6] flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-[#F05133]" />
              Criar Nova Branch
            </DialogTitle>
            <DialogDescription className="text-xs text-[#8A91A8]">
              A nova branch será bifurcada a partir do estado atual da branch{' '}
              <strong className="text-[#EDEFF6]">{currentBranch}</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#8A91A8]">
                Nome da branch
              </label>
              <Input
                type="text"
                placeholder="ex: feature/carrinho-compras"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                autoFocus
                className="bg-[#0A0C12] border-[#232838] text-[#EDEFF6] text-sm focus-visible:ring-[#F05133] font-mono"
              />
              <p className="text-[11px] text-[#8A91A8]">
                Use prefixos como <code className="text-[#EDEFF6]">feature/</code>,{' '}
                <code className="text-[#EDEFF6]">bugfix/</code> ou{' '}
                <code className="text-[#EDEFF6]">chore/</code>.
              </p>
            </div>

            <DialogFooter className="pt-2 border-t border-[#232838] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="border-[#232838] bg-transparent text-[#EDEFF6] hover:bg-[#1A1E2A]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!newBranchName.trim()}
                className="bg-[#F05133] hover:bg-[#FF6A4D] text-white font-semibold disabled:opacity-40"
              >
                Criar branch
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar exclusão de branch */}
      <Dialog open={!!branchToDelete} onOpenChange={(open) => !open && setBranchToDelete(null)}>
        <DialogContent className="bg-[#12151E] border border-[#232838] text-[#EDEFF6] max-w-md w-[95vw] p-6 shadow-2xl rounded-xl">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-[#FF4D4F]/20 flex items-center justify-center text-[#FF4D4F] mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-[#EDEFF6]">
              Excluir branch '{branchToDelete}'?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#8A91A8] leading-relaxed">
              Esta ação removerá a referência local da branch. Os commits compartilhados na história
              permanecerão intactos.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setBranchToDelete(null)}
              className="border-[#232838] bg-transparent text-[#EDEFF6] hover:bg-[#1A1E2A]"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleDeleteConfirm}
              className="bg-[#FF4D4F] hover:bg-[#FF4D4F]/80 text-white font-semibold"
            >
              Sim, excluir branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
