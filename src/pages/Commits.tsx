import React, { useState, useMemo } from 'react'
import {
  GitCommit,
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  CheckCircle2,
  GitBranch,
  ArrowUpDown,
} from 'lucide-react'
import { useGitRepo } from '../context/GitRepoContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Commit } from '../types/git'

export default function Commits() {
  const { commits, branches, setIsCommitModalOpen, setSelectedCommitForDetail } = useGitRepo()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('all')
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('all')

  // Extract distinct authors
  const authors = useMemo(() => {
    const set = new Set<string>()
    commits.forEach((c) => set.add(c.author))
    return Array.from(set)
  }, [commits])

  // Filtered commits
  const filteredCommits = useMemo(() => {
    return commits.filter((c) => {
      const matchSearch =
        c.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.fullHash.toLowerCase().includes(searchTerm.toLowerCase())

      const matchAuthor = selectedAuthor === 'all' || c.author === selectedAuthor
      const matchBranch = selectedBranchFilter === 'all' || c.branch === selectedBranchFilter

      return matchSearch && matchAuthor && matchBranch
    })
  }, [commits, searchTerm, selectedAuthor, selectedBranchFilter])

  // Get author avatar colors
  const getAvatarColor = (name: string) => {
    const colors = ['#F05133', '#4DA3FF', '#3DD68C', '#B983FF', '#F5A623']
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EDEFF6]">
              Histórico de commits
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1A1E2A] border border-[#232838] text-[#8A91A8]">
              {commits.length} no total
            </span>
          </div>
          <p className="text-sm text-[#8A91A8] mt-1">
            Explore a árvore imutável de snapshots registrados no repositório local.
          </p>
        </div>

        <Button
          onClick={() => setIsCommitModalOpen(true)}
          className="bg-[#F05133] hover:bg-[#FF6A4D] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 h-10 px-4 shadow-md shadow-[#F05133]/25 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Commit</span>
        </Button>
      </div>

      {/* 2. Filters & Search bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-[#12151E] rounded-xl border border-[#232838]">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-[#8A91A8] absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Buscar por mensagem ou hash (ex: feat, 8b3d1f0)…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-[#0A0C12] border-[#232838] text-[#EDEFF6] placeholder:text-[#8A91A8]/50 text-xs sm:text-sm h-10 focus-visible:ring-[#F05133]"
          />
        </div>

        {/* Filter by Author */}
        <div className="sm:col-span-3">
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="w-full h-10 bg-[#0A0C12] border border-[#232838] rounded-md px-3 text-xs sm:text-sm text-[#EDEFF6] focus:outline-none focus:ring-1 focus:ring-[#F05133]"
          >
            <option value="all">Todos os autores</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Branch */}
        <div className="sm:col-span-3">
          <select
            value={selectedBranchFilter}
            onChange={(e) => setSelectedBranchFilter(e.target.value)}
            className="w-full h-10 bg-[#0A0C12] border border-[#232838] rounded-md px-3 text-xs sm:text-sm text-[#EDEFF6] focus:outline-none focus:ring-1 focus:ring-[#F05133]"
          >
            <option value="all">Todas as branches</option>
            {branches.map((b) => (
              <option key={b.name} value={b.name}>
                branch: {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Commit List Table */}
      <div className="rounded-xl border border-[#232838] bg-[#12151E] overflow-hidden shadow-sm">
        {filteredCommits.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1A1E2A] flex items-center justify-center mx-auto text-[#8A91A8]">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-[#EDEFF6]">Nenhum commit encontrado</p>
            <p className="text-xs text-[#8A91A8] max-w-sm mx-auto">
              Nenhum commit corresponde aos filtros aplicados. Tente limpar a busca ou selecionar
              outro autor.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setSelectedAuthor('all')
                setSelectedBranchFilter('all')
              }}
              className="border-[#232838] bg-[#0A0C12] text-[#EDEFF6] text-xs hover:bg-[#1A1E2A]"
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div>
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#232838] bg-[#0A0C12]/50 text-xs font-semibold uppercase tracking-wider text-[#8A91A8]">
              <div className="col-span-2">Hash</div>
              <div className="col-span-5">Mensagem</div>
              <div className="col-span-2">Autor</div>
              <div className="col-span-2">Data</div>
              <div className="col-span-1 text-right">Branch</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#232838]">
              {filteredCommits.map((commit) => {
                const isBranchTip = branches.some((b) => b.latestCommitHash === commit.hash)
                const tipBranch = branches.find((b) => b.latestCommitHash === commit.hash)

                return (
                  <div
                    key={commit.id}
                    onClick={() => setSelectedCommitForDetail(commit)}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 sm:px-5 py-3.5 hover:bg-[#1A1E2A]/70 cursor-pointer transition-colors items-center text-xs group"
                  >
                    {/* Hash */}
                    <div className="md:col-span-2 flex items-center gap-2">
                      <span className="font-mono font-bold text-[#F05133] px-2 py-0.5 rounded bg-[#F05133]/10 border border-[#F05133]/20 group-hover:border-[#F05133]/50">
                        {commit.hash}
                      </span>
                      {isBranchTip && tipBranch && (
                        <span
                          className="md:hidden text-[10px] font-mono px-2 py-0.5 rounded-full border"
                          style={{
                            color: tipBranch.color,
                            backgroundColor: `${tipBranch.color}15`,
                            borderColor: `${tipBranch.color}35`,
                          }}
                        >
                          HEAD {tipBranch.name}
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    <div className="md:col-span-5 font-medium text-sm text-[#EDEFF6] group-hover:text-white line-clamp-2 md:line-clamp-1">
                      {commit.message}
                    </div>

                    {/* Author */}
                    <div className="md:col-span-2 flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ backgroundColor: getAvatarColor(commit.author) }}
                      >
                        {commit.author.charAt(0)}
                      </div>
                      <span className="text-[#8A91A8] group-hover:text-[#EDEFF6] truncate">
                        {commit.author}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="md:col-span-2 text-[#8A91A8] font-mono flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 md:hidden" />
                      <span>{commit.relativeDate}</span>
                    </div>

                    {/* Branch Badge (Desktop) */}
                    <div className="md:col-span-1 text-right">
                      {isBranchTip && tipBranch ? (
                        <span
                          className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border truncate"
                          style={{
                            color: tipBranch.color,
                            backgroundColor: `${tipBranch.color}15`,
                            borderColor: `${tipBranch.color}35`,
                          }}
                        >
                          {tipBranch.name}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#8A91A8]/60 font-mono">
                          {commit.branch}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
