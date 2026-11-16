import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GitCommit,
  GitBranch,
  FileCode2,
  ArrowUpRight,
  Terminal,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react'
import { useGitRepo } from '../context/GitRepoContext'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export default function Index() {
  const navigate = useNavigate()
  const {
    commits,
    branches,
    currentBranch,
    pendingFiles,
    toggleStageFile,
    setIsCommitModalOpen,
    setSelectedCommitForDetail,
    executeTerminalCommand,
  } = useGitRepo()

  const [miniTerminalInput, setMiniTerminalInput] = useState('')
  const [miniTerminalOutput, setMiniTerminalOutput] = useState<string | null>(null)

  // Animated counters
  const [animatedCommits, setAnimatedCommits] = useState(0)
  const [animatedBranches, setAnimatedBranches] = useState(0)
  const [animatedPending, setAnimatedPending] = useState(0)

  useEffect(() => {
    const targetCommits = commits.length
    const targetBranches = branches.length
    const targetPending = pendingFiles.length

    let frame = 0
    const totalFrames = 20
    const interval = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      setAnimatedCommits(Math.round(targetCommits * progress))
      setAnimatedBranches(Math.round(targetBranches * progress))
      setAnimatedPending(Math.round(targetPending * progress))

      if (frame >= totalFrames) {
        clearInterval(interval)
        setAnimatedCommits(targetCommits)
        setAnimatedBranches(targetBranches)
        setAnimatedPending(targetPending)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [commits.length, branches.length, pendingFiles.length])

  const currentBranchObj = branches.find((b) => b.name === currentBranch)
  const aheadCount = currentBranchObj?.ahead ?? 0

  const handleMiniTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!miniTerminalInput.trim()) return

    const res = executeTerminalCommand(miniTerminalInput)
    setMiniTerminalOutput(res.output)
    setMiniTerminalInput('')
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Welcome Strip / Hero */}
      <div className="relative overflow-hidden rounded-xl border border-[#232838] bg-gradient-to-r from-[#12151E] via-[#1A1E2A] to-[#12151E] p-6 sm:p-7 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F05133]/15 text-[#F05133] border border-[#F05133]/30 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ambiente Interativo de Aprendizado</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EDEFF6]">
              TesteGit — seu laboratório de Git
            </h1>
            <p className="text-sm text-[#8A91A8] max-w-2xl">
              Simule commits, branches e comandos sem medo de quebrar nada. Cada ação reflete
              visualmente em tempo real na árvore de histórico.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={() => navigate('/terminal')}
              className="border-[#232838] bg-[#0A0C12] hover:bg-[#1A1E2A] text-[#EDEFF6] text-xs sm:text-sm font-semibold flex items-center gap-2 h-10 px-4"
            >
              <Terminal className="w-4 h-4 text-[#F05133]" />
              <span>Abrir terminal</span>
            </Button>
            <Button
              onClick={() => setIsCommitModalOpen(true)}
              className="bg-[#F05133] hover:bg-[#FF6A4D] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 h-10 px-4 shadow-md shadow-[#F05133]/25"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Commit</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card Commits */}
        <div className="rounded-xl border border-[#232838] bg-[#12151E] p-4 sm:p-5 hover:border-[#F05133]/40 transition-all">
          <div className="flex items-center justify-between text-[#8A91A8] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Commits</span>
            <GitCommit className="w-4 h-4 text-[#F05133]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#EDEFF6]">
            {animatedCommits}
          </div>
          <p className="text-[11px] text-[#8A91A8] mt-1 truncate">no histórico total</p>
        </div>

        {/* Card Branches */}
        <div className="rounded-xl border border-[#232838] bg-[#12151E] p-4 sm:p-5 hover:border-[#4DA3FF]/40 transition-all">
          <div className="flex items-center justify-between text-[#8A91A8] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Branches</span>
            <GitBranch className="w-4 h-4 text-[#4DA3FF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#EDEFF6]">
            {animatedBranches}
          </div>
          <p className="text-[11px] text-[#8A91A8] mt-1 truncate">ativas no repositório</p>
        </div>

        {/* Card Pending Files */}
        <div className="rounded-xl border border-[#232838] bg-[#12151E] p-4 sm:p-5 hover:border-[#F5A623]/40 transition-all">
          <div className="flex items-center justify-between text-[#8A91A8] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Arquivos alterados
            </span>
            <FileCode2 className="w-4 h-4 text-[#F5A623]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#EDEFF6]">
            {animatedPending}
          </div>
          <p className="text-[11px] text-[#8A91A8] mt-1 truncate">pendentes de commit</p>
        </div>

        {/* Card Ahead / Behind (Highlighted with orange top border) */}
        <div className="rounded-xl border border-[#232838] border-t-2 border-t-[#F05133] bg-[#12151E] p-4 sm:p-5 shadow-sm hover:border-[#F05133] transition-all">
          <div className="flex items-center justify-between text-[#8A91A8] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F05133]">
              Ahead / Behind
            </span>
            <ArrowUpRight className="w-4 h-4 text-[#F05133]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#EDEFF6]">
            {aheadCount} à frente
          </div>
          <p className="text-[11px] text-[#8A91A8] mt-1 truncate">
            em relação a origin/{currentBranch}
          </p>
        </div>
      </div>

      {/* 3. Two-Column Layout (Timeline left 60%, Status right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Commit Timeline (~60%) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-[#F05133]" />
              <h2 className="text-lg font-bold text-[#EDEFF6]">Linha do Tempo de Commits</h2>
            </div>
            <button
              onClick={() => navigate('/commits')}
              className="text-xs text-[#8A91A8] hover:text-[#F05133] flex items-center gap-1 transition-colors"
            >
              Ver todos ({commits.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-xl border border-[#232838] bg-[#12151E] p-4 sm:p-5">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#232838]">
              {commits.slice(0, 8).map((commit, index) => {
                const isLatest = index === 0

                return (
                  <div
                    key={commit.id}
                    onClick={() => setSelectedCommitForDetail(commit)}
                    className="relative group cursor-pointer transition-all duration-150 hover:-translate-y-0.5"
                  >
                    {/* Timeline Node Dot */}
                    <div
                      className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#12151E] ${
                        isLatest
                          ? 'bg-[#F05133] animate-pulse-dot ring-4 ring-[#F05133]/20'
                          : 'bg-[#8A91A8] group-hover:bg-[#F05133]'
                      }`}
                    />

                    {/* Commit Row Content */}
                    <div className="p-3 rounded-lg border border-transparent group-hover:border-[#232838] group-hover:bg-[#1A1E2A]/70 transition-all space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-xs font-bold text-[#F05133]">
                            {commit.hash}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-[#1A1E2A] border border-[#232838] text-[#8A91A8] font-mono shrink-0">
                            {commit.branch}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#8A91A8] shrink-0 font-mono">
                          {commit.relativeDate}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-[#EDEFF6] group-hover:text-white line-clamp-2">
                        {commit.message}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-[#8A91A8]">
                        <span>{commit.author}</span>
                        <span className="text-[10px] text-[#F05133] opacity-0 group-hover:opacity-100 transition-opacity">
                          ver detalhes →
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Status Panel & Mini Terminal (~40%) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pending Changes Card */}
          <div className="rounded-xl border border-[#232838] bg-[#12151E] p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-[#F5A623]" />
                <h2 className="text-base font-bold text-[#EDEFF6]">Alterações pendentes</h2>
              </div>
              <span className="text-xs font-mono text-[#8A91A8] bg-[#1A1E2A] px-2 py-0.5 rounded border border-[#232838]">
                {pendingFiles.length} {pendingFiles.length === 1 ? 'item' : 'itens'}
              </span>
            </div>

            {pendingFiles.length === 0 ? (
              <div className="p-8 text-center space-y-2 border border-dashed border-[#232838] rounded-lg bg-[#0A0C12]/50">
                <CheckCircle2 className="w-8 h-8 text-[#3DD68C] mx-auto" />
                <p className="text-sm font-semibold text-[#EDEFF6]">Tudo limpo!</p>
                <p className="text-xs text-[#8A91A8]">Nenhuma alteração pendente no repositório.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {pendingFiles.map((file) => {
                  const statusBadge =
                    file.status === 'novo'
                      ? 'text-[#3DD68C] bg-[#3DD68C]/15 border-[#3DD68C]/30'
                      : file.status === 'removido'
                        ? 'text-[#FF4D4F] bg-[#FF4D4F]/15 border-[#FF4D4F]/30'
                        : 'text-[#F5A623] bg-[#F5A623]/15 border-[#F5A623]/30'

                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-[#232838] bg-[#0A0C12] hover:bg-[#1A1E2A] transition-colors gap-2"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Checkbox
                          checked={file.staged}
                          onCheckedChange={() => toggleStageFile(file.id)}
                          className="border-[#232838] data-[state=checked]:bg-[#F05133] data-[state=checked]:border-[#F05133]"
                          title={
                            file.staged
                              ? 'Arquivo preparado (staged)'
                              : 'Clique para preparar (stage)'
                          }
                        />
                        <span
                          className="font-mono text-xs text-[#EDEFF6] truncate"
                          title={file.path}
                        >
                          {file.path}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusBadge} shrink-0`}
                      >
                        {file.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Mini-Terminal Card */}
          <div className="rounded-xl border border-[#232838] bg-[#050507] p-4 sm:p-5 space-y-3 font-mono shadow-inner">
            <div className="flex items-center justify-between text-xs text-[#8A91A8] border-b border-[#232838] pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D4F]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#3DD68C]" />
                <span className="ml-2 text-[11px] text-[#8A91A8]">mini-terminal</span>
              </div>
              <span className="text-[11px] text-[#F05133]">bash</span>
            </div>

            {/* Terminal Command Result if any */}
            {miniTerminalOutput && (
              <div className="text-xs text-[#EDEFF6] bg-[#0A0C12] p-2.5 rounded border border-[#232838] max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {miniTerminalOutput}
              </div>
            )}

            {/* Command Input Form */}
            <form onSubmit={handleMiniTerminalSubmit} className="space-y-2">
              <div className="flex items-center gap-2 bg-[#0A0C12] px-3 py-2 rounded-lg border border-[#232838] focus-within:border-[#F05133]">
                <span className="text-[#F05133] font-bold text-sm">$</span>
                <input
                  type="text"
                  value={miniTerminalInput}
                  onChange={(e) => setMiniTerminalInput(e.target.value)}
                  placeholder="git commit -m 'mensagem'"
                  className="bg-transparent border-none text-xs text-[#EDEFF6] placeholder:text-[#8A91A8]/40 focus:outline-none w-full font-mono"
                />
                <button
                  type="submit"
                  className="text-[11px] text-[#8A91A8] hover:text-[#EDEFF6] px-2 py-0.5 bg-[#1A1E2A] rounded border border-[#232838] shrink-0"
                >
                  Enter
                </button>
              </div>

              <p className="text-[11px] text-[#8A91A8] leading-tight">
                Digite um comando como <code className="text-[#EDEFF6]">git status</code> ou clique
                em 'Novo Commit'.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
