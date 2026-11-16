import React, { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  GitBranch,
  GitCommit,
  Terminal,
  LayoutDashboard,
  RotateCw,
  Plus,
  ChevronDown,
  Check,
} from 'lucide-react'
import { useGitRepo } from '../context/GitRepoContext'
import { CreateCommitModal } from './CreateCommitModal'
import { CommitDetailModal } from './CommitDetailModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { path: '/', label: 'Painel', icon: LayoutDashboard },
  { path: '/commits', label: 'Commits', icon: GitCommit },
  { path: '/branches', label: 'Branches', icon: GitBranch },
  { path: '/terminal', label: 'Terminal', icon: Terminal },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    currentBranch,
    branches,
    setCurrentBranch,
    pendingFiles,
    setIsCommitModalOpen,
    resetRepository,
  } = useGitRepo()

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 400)
  }

  const currentBranchObj = branches.find((b) => b.name === currentBranch)
  const pendingCount = pendingFiles.length

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0C12] text-[#EDEFF6]">
      {/* 1. Desktop & Tablet Sidebar */}
      <aside className="hidden sm:flex flex-col border-r border-[#232838] bg-[#12151E] w-[72px] lg:w-[260px] shrink-0 transition-all duration-200 z-30">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 lg:px-5 border-b border-[#232838] gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F05133] flex items-center justify-center text-white shadow-lg shadow-[#F05133]/25 shrink-0">
            <GitBranch className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="font-bold text-base tracking-tight text-[#EDEFF6] flex items-center gap-1.5">
              TesteGit
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F05133]/20 text-[#F05133] font-bold">
                LAB
              </span>
            </span>
            <span className="text-[11px] text-[#8A91A8] truncate">sandbox de git local</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#1A1E2A] text-[#EDEFF6] shadow-sm'
                    : 'text-[#8A91A8] hover:text-[#EDEFF6] hover:bg-[#1A1E2A]/50'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#F05133] rounded-r shadow-[0_0_8px_#F05133]" />
                )}

                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-[#F05133]' : 'text-[#8A91A8] group-hover:text-[#EDEFF6]'
                  }`}
                />

                <span className="hidden lg:inline text-xs font-semibold uppercase tracking-wider">
                  {item.label}
                </span>

                {item.path === '/commits' && (
                  <span className="hidden lg:inline-block ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[#0A0C12] text-[#8A91A8] border border-[#232838]">
                    log
                  </span>
                )}
                {item.path === '/branches' && (
                  <span className="hidden lg:inline-block ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[#0A0C12] text-[#8A91A8] border border-[#232838]">
                    {branches.length}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#232838]">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0A0C12] border border-[#232838] justify-center lg:justify-start">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DD68C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3DD68C]"></span>
            </span>
            <div className="hidden lg:flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-[#EDEFF6] leading-tight truncate">
                ambiente local
              </span>
              <span className="text-[10px] text-[#8A91A8] truncate">simulação in-memory</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* 2. Top Header */}
        <header className="h-16 border-b border-[#232838] bg-[#12151E] flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
          {/* Left: Breadcrumbs / Repo identifier */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#8A91A8]">
            <span className="hidden md:inline hover:text-[#EDEFF6] cursor-pointer">repos</span>
            <span className="hidden md:inline">/</span>
            <span className="text-[#EDEFF6] font-semibold bg-[#1A1E2A] px-2 py-1 rounded border border-[#232838]">
              repo-teste
            </span>
          </div>

          {/* Center/Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Branch selector dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1A1E2A] hover:bg-[#232838] border border-[#232838] text-xs font-mono text-[#EDEFF6] transition-colors focus:outline-none focus:ring-1 focus:ring-[#F05133]"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: currentBranchObj?.color || '#F05133' }}
                  />
                  <span className="font-semibold max-w-[110px] sm:max-w-[160px] truncate">
                    {currentBranch}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8A91A8]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-[#12151E] border border-[#232838] text-[#EDEFF6] p-1 shadow-xl"
              >
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-[#8A91A8] font-bold px-2 py-1.5">
                  Alternar Branch (checkout)
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#232838]" />
                {branches.map((b) => (
                  <DropdownMenuItem
                    key={b.name}
                    onClick={() => setCurrentBranch(b.name)}
                    className="flex items-center justify-between px-2 py-2 text-xs font-mono rounded cursor-pointer hover:bg-[#1A1E2A] focus:bg-[#1A1E2A]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: b.color }}
                      />
                      <span className="truncate">{b.name}</span>
                    </div>
                    {b.name === currentBranch && (
                      <Check className="w-3.5 h-3.5 text-[#3DD68C] shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Refresh button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              title="Atualizar estado visual"
              className="w-9 h-9 border-[#232838] bg-[#1A1E2A] hover:bg-[#232838] text-[#8A91A8] hover:text-[#EDEFF6]"
            >
              <RotateCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#F05133]' : ''}`}
              />
            </Button>

            {/* Primary CTA button */}
            <Button
              onClick={() => setIsCommitModalOpen(true)}
              className="bg-[#F05133] hover:bg-[#FF6A4D] text-white text-xs sm:text-sm font-semibold h-9 px-3 sm:px-4 shadow-lg shadow-[#F05133]/20 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Commit</span>
            </Button>
          </div>
        </header>

        {/* 3. Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
          <div className="max-w-[1200px] mx-auto animate-fade-slide-up">
            <Outlet />
          </div>
        </main>

        {/* 4. Desktop Status Bar (Bottom) */}
        <footer className="hidden sm:flex h-7 border-t border-[#232838] bg-[#12151E] px-4 items-center justify-between text-[11px] font-mono text-[#8A91A8] select-none shrink-0 z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#EDEFF6]">
              <GitBranch className="w-3 h-3 text-[#F05133]" />
              <span className="font-semibold">{currentBranch}</span>
            </div>
            <div className="text-[#8A91A8]">
              {pendingCount === 0 ? (
                <span className="text-[#3DD68C]">0 alterações</span>
              ) : (
                <span className="text-[#F5A623]">
                  {pendingCount} alteraç{pendingCount > 1 ? 'ões' : 'ão'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span
              className="hover:text-[#EDEFF6] cursor-pointer"
              onClick={() => navigate('/branches')}
            >
              origin/{currentBranch}
            </span>
            <span>UTF-8</span>
            <span className="flex items-center gap-1 text-[#3DD68C]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3DD68C]" />
              Git 2.44 (simulado)
            </span>
          </div>
        </footer>

        {/* 5. Mobile Bottom Fixed Navigation */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#12151E] border-t border-[#232838] flex items-center justify-around px-2 z-40">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
                  isActive ? 'text-[#F05133] bg-[#1A1E2A]' : 'text-[#8A91A8] hover:text-[#EDEFF6]'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Global Modals */}
      <CreateCommitModal />
      <CommitDetailModal />
    </div>
  )
}
