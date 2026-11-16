import React, { useState } from 'react'
import { useGitRepo } from '../context/GitRepoContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { GitCommit, Plus, CheckCircle2, AlertCircle } from 'lucide-react'

export const CreateCommitModal: React.FC = () => {
  const {
    isCommitModalOpen,
    setIsCommitModalOpen,
    branches,
    currentBranch,
    pendingFiles,
    createCommit,
    toggleStageFile,
  } = useGitRepo()

  const [message, setMessage] = useState('')
  const [targetBranch, setTargetBranch] = useState(currentBranch)
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([])

  // Keep targetBranch in sync when modal opens
  React.useEffect(() => {
    if (isCommitModalOpen) {
      setTargetBranch(currentBranch)
      // Pre-select staged files
      const stagedIds = pendingFiles.filter((f) => f.staged).map((f) => f.id)
      setSelectedFileIds(stagedIds.length > 0 ? stagedIds : pendingFiles.map((f) => f.id))
      setMessage('')
    }
  }, [isCommitModalOpen, currentBranch, pendingFiles])

  const handleToggleSelect = (id: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
    // sync stage state in context
    toggleStageFile(id)
  }

  const handleSelectAll = () => {
    if (selectedFileIds.length === pendingFiles.length) {
      setSelectedFileIds([])
    } else {
      setSelectedFileIds(pendingFiles.map((f) => f.id))
    }
  }

  const handleQuickPrefix = (prefix: string) => {
    if (!message.startsWith(prefix)) {
      setMessage(
        `${prefix} ` + message.replace(/^(feat|fix|docs|refactor|test|chore|perf):?\s*/, ''),
      )
    }
  }

  const canSubmit = message.trim().length > 0 && selectedFileIds.length > 0

  const handleConfirm = () => {
    if (!canSubmit) return
    createCommit({
      message: message.trim(),
      branch: targetBranch,
      selectedFileIds,
    })
    setIsCommitModalOpen(false)
  }

  return (
    <Dialog open={isCommitModalOpen} onOpenChange={setIsCommitModalOpen}>
      <DialogContent className="bg-[#12151E] border border-[#232838] text-[#EDEFF6] max-w-lg w-[95vw] p-6 shadow-2xl rounded-xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F05133]/20 flex items-center justify-center text-[#F05133]">
              <GitCommit className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-bold text-[#EDEFF6]">Criar Commit</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-[#8A91A8]">
            Grave suas alterações no histórico local da branch selecionada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Branch Target */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8A91A8]">
              Branch de Destino
            </label>
            <select
              value={targetBranch}
              onChange={(e) => setTargetBranch(e.target.value)}
              className="w-full bg-[#1A1E2A] border border-[#232838] rounded-md px-3 py-2 text-sm text-[#EDEFF6] focus:outline-none focus:ring-1 focus:ring-[#F05133]"
            >
              {branches.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name} {b.name === currentBranch ? '(atual)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Pending Files to Stage/Commit */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#8A91A8]">
                Arquivos para commitar ({selectedFileIds.length}/{pendingFiles.length})
              </label>
              {pendingFiles.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs text-[#F05133] hover:underline"
                >
                  {selectedFileIds.length === pendingFiles.length
                    ? 'Desmarcar todos'
                    : 'Marcar todos'}
                </button>
              )}
            </div>

            <div className="max-h-40 overflow-y-auto border border-[#232838] rounded-md bg-[#0A0C12] p-2 space-y-1 divide-y divide-[#232838]/40">
              {pendingFiles.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#8A91A8]">
                  Nenhum arquivo modificado. Um novo arquivo padrão será simulado para o commit.
                </div>
              ) : (
                pendingFiles.map((file) => {
                  const isChecked = selectedFileIds.includes(file.id)
                  const statusColor =
                    file.status === 'novo'
                      ? 'text-[#3DD68C] bg-[#3DD68C]/10 border-[#3DD68C]/20'
                      : file.status === 'removido'
                        ? 'text-[#FF4D4F] bg-[#FF4D4F]/10 border-[#FF4D4F]/20'
                        : 'text-[#F5A623] bg-[#F5A623]/10 border-[#F5A623]/20'

                  return (
                    <label
                      key={file.id}
                      className="flex items-center gap-2.5 py-1.5 px-2 rounded hover:bg-[#1A1E2A]/60 cursor-pointer text-xs"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleToggleSelect(file.id)}
                        className="border-[#232838] data-[state=checked]:bg-[#F05133] data-[state=checked]:border-[#F05133]"
                      />
                      <span className="font-mono flex-1 truncate text-[#EDEFF6]">{file.path}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${statusColor}`}
                      >
                        {file.status}
                      </span>
                    </label>
                  )
                })
              )}
            </div>
          </div>

          {/* Commit Message */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8A91A8] flex items-center justify-between">
              <span>Mensagem do commit *</span>
              <span className="text-[11px] text-[#8A91A8] normal-case">Conventional Commits</span>
            </label>
            <Input
              type="text"
              placeholder="ex: feat: adiciona fluxo de autenticação"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && canSubmit) {
                  e.preventDefault()
                  handleConfirm()
                }
              }}
              className="bg-[#1A1E2A] border-[#232838] text-[#EDEFF6] placeholder:text-[#8A91A8]/50 focus-visible:ring-[#F05133] text-sm"
              autoFocus
            />

            {/* Quick conventional buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['feat:', 'fix:', 'docs:', 'refactor:', 'test:', 'chore:'].map((prefix) => (
                <button
                  key={prefix}
                  type="button"
                  onClick={() => handleQuickPrefix(prefix)}
                  className="text-[11px] px-2 py-0.5 rounded bg-[#1A1E2A] border border-[#232838] text-[#8A91A8] hover:text-[#EDEFF6] hover:border-[#F05133]/50 transition-colors"
                >
                  {prefix}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2 border-t border-[#232838]">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCommitModalOpen(false)}
            className="border-[#232838] bg-transparent text-[#EDEFF6] hover:bg-[#1A1E2A]"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!canSubmit}
            className="bg-[#F05133] hover:bg-[#FF6A4D] text-white disabled:opacity-40 font-semibold shadow-lg shadow-[#F05133]/20"
          >
            Confirmar commit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
