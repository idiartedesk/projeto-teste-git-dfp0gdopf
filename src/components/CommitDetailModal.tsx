import React from 'react'
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
import {
  GitCommit,
  Calendar,
  User,
  FileCode,
  CheckCircle,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
} from 'lucide-react'

export const CommitDetailModal: React.FC = () => {
  const { selectedCommitForDetail, setSelectedCommitForDetail } = useGitRepo()
  const [copied, setCopied] = React.useState(false)

  if (!selectedCommitForDetail) return null

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(selectedCommitForDetail.fullHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog
      open={!!selectedCommitForDetail}
      onOpenChange={(open) => !open && setSelectedCommitForDetail(null)}
    >
      <DialogContent className="bg-[#12151E] border border-[#232838] text-[#EDEFF6] max-w-xl w-[95vw] p-6 shadow-2xl rounded-xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F05133]/20 flex items-center justify-center text-[#F05133]">
                <GitCommit className="w-5 h-5" />
              </div>
              <DialogTitle className="text-xl font-bold text-[#EDEFF6]">
                Detalhes do Commit
              </DialogTitle>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full border border-[#232838] bg-[#1A1E2A] text-[#8A91A8] font-mono">
              branch: {selectedCommitForDetail.branch}
            </span>
          </div>
          <DialogDescription className="text-xs text-[#8A91A8]">
            Informações completas do snapshot gravado na árvore Git.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Commit Message Box */}
          <div className="p-3 bg-[#0A0C12] rounded-lg border border-[#232838]">
            <p className="font-semibold text-base text-[#EDEFF6] leading-snug">
              {selectedCommitForDetail.message}
            </p>
          </div>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#1A1E2A]/50 rounded-lg border border-[#232838] text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#8A91A8] shrink-0" />
              <div>
                <p className="text-[#8A91A8]">Autor</p>
                <p className="font-medium text-[#EDEFF6]">{selectedCommitForDetail.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8A91A8] shrink-0" />
              <div>
                <p className="text-[#8A91A8]">Data</p>
                <p className="font-medium text-[#EDEFF6]">
                  {new Date(selectedCommitForDetail.date).toLocaleString('pt-BR')} (
                  {selectedCommitForDetail.relativeDate})
                </p>
              </div>
            </div>
          </div>

          {/* Hashes */}
          <div className="space-y-1 text-xs">
            <span className="text-[#8A91A8] font-semibold uppercase tracking-wider block">
              Hash SHA-1
            </span>
            <div className="flex items-center justify-between p-2 rounded bg-[#0A0C12] border border-[#232838] font-mono text-xs">
              <span className="text-[#F05133] truncate pr-2">
                {selectedCommitForDetail.fullHash}
              </span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="p-1 rounded hover:bg-[#1A1E2A] text-[#8A91A8] hover:text-[#EDEFF6] transition-colors shrink-0"
                title="Copiar hash completo"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#3DD68C]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Touched Files */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A91A8] flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-[#F05133]" />
              Arquivos modificados ({selectedCommitForDetail.files.length})
            </span>
            <div className="border border-[#232838] rounded-md bg-[#0A0C12] divide-y divide-[#232838]/60 max-h-48 overflow-y-auto">
              {selectedCommitForDetail.files.map((file, idx) => {
                const badgeColor =
                  file.status === 'novo'
                    ? 'text-[#3DD68C] bg-[#3DD68C]/10 border-[#3DD68C]/30'
                    : file.status === 'removido'
                      ? 'text-[#FF4D4F] bg-[#FF4D4F]/10 border-[#FF4D4F]/30'
                      : 'text-[#F5A623] bg-[#F5A623]/10 border-[#F5A623]/30'
                const icon =
                  file.status === 'novo' ? (
                    <Plus className="w-3 h-3 text-[#3DD68C]" />
                  ) : file.status === 'removido' ? (
                    <Trash2 className="w-3 h-3 text-[#FF4D4F]" />
                  ) : (
                    <Edit3 className="w-3 h-3 text-[#F5A623]" />
                  )

                return (
                  <div key={idx} className="flex items-center justify-between px-3 py-2 text-xs">
                    <div className="flex items-center gap-2 truncate font-mono text-[#EDEFF6]">
                      {icon}
                      <span className="truncate">{file.path}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${badgeColor}`}
                    >
                      {file.status}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t border-[#232838]">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSelectedCommitForDetail(null)}
            className="border-[#232838] bg-transparent text-[#EDEFF6] hover:bg-[#1A1E2A]"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
