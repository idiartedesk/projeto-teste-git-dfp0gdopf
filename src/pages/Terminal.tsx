import React, { useState, useRef, useEffect } from 'react'
import {
  Terminal as TerminalIcon,
  Sparkles,
  Trash2,
  HelpCircle,
  CornerDownLeft,
} from 'lucide-react'
import { useGitRepo } from '../context/GitRepoContext'
import { Button } from '@/components/ui/button'

interface CommandEntry {
  id: string
  command: string
  output: string
  success: boolean
  timestamp: string
}

const INITIAL_WELCOME = `TesteGit — terminal simulado v2.44.0 (browser sandbox)
Digite 'git help' para começar ou utilize os comandos rápidos abaixo.
`

export default function TerminalPage() {
  const { executeTerminalCommand, currentBranch } = useGitRepo()

  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState<CommandEntry[]>([])
  const [commandHistoryIndex, setCommandHistoryIndex] = useState<number | null>(null)
  const [typedOutputId, setTypedOutputId] = useState<string | null>(null)
  const [displayedTextMap, setDisplayedTextMap] = useState<Record<string, string>>({})

  const terminalEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll on history update
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, displayedTextMap])

  // Focus input on click anywhere in terminal card
  const handleTerminalClick = () => {
    inputRef.current?.focus()
  }

  // Typewriter effect for latest command output
  useEffect(() => {
    if (!typedOutputId) return
    const entry = history.find((h) => h.id === typedOutputId)
    if (!entry) return

    const fullText = entry.output
    if (!fullText) return

    let currentIdx = 0
    const stepSize = Math.max(1, Math.floor(fullText.length / 40)) // speed up long outputs
    const interval = setInterval(() => {
      currentIdx += stepSize
      if (currentIdx >= fullText.length) {
        setDisplayedTextMap((prev) => ({ ...prev, [typedOutputId]: fullText }))
        clearInterval(interval)
        setTypedOutputId(null)
      } else {
        setDisplayedTextMap((prev) => ({
          ...prev,
          [typedOutputId]: fullText.slice(0, currentIdx),
        }))
      }
    }, 15)

    return () => clearInterval(interval)
  }, [typedOutputId, history])

  const handleRunCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim()
    if (!trimmed) return

    if (trimmed === 'clear') {
      setHistory([])
      setInputVal('')
      setCommandHistoryIndex(null)
      return
    }

    const { output, success } = executeTerminalCommand(trimmed)
    const newEntry: CommandEntry = {
      id: `cmd_${Date.now()}_${Math.random()}`,
      command: trimmed,
      output,
      success,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
    }

    setHistory((prev) => [...prev, newEntry])
    setTypedOutputId(newEntry.id)
    setInputVal('')
    setCommandHistoryIndex(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleRunCommand(inputVal)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const nextIdx =
        commandHistoryIndex === null ? history.length - 1 : Math.max(0, commandHistoryIndex - 1)
      setCommandHistoryIndex(nextIdx)
      setInputVal(history[nextIdx].command)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (history.length === 0 || commandHistoryIndex === null) return
      const nextIdx = commandHistoryIndex + 1
      if (nextIdx >= history.length) {
        setCommandHistoryIndex(null)
        setInputVal('')
      } else {
        setCommandHistoryIndex(nextIdx)
        setInputVal(history[nextIdx].command)
      }
    }
  }

  // Quick command suggestions
  const quickCommands = [
    'git status',
    'git log --oneline',
    'git branch',
    'git help',
    'git commit -m "feat: nova funcionalidade"',
  ]

  return (
    <div className="space-y-4 pb-12 flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
      {/* 1. Page Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#EDEFF6] flex items-center gap-2">
            <TerminalIcon className="w-5 h-5 text-[#F05133]" />
            Terminal Git Simulado
          </h1>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#1A1E2A] text-[#3DD68C] border border-[#232838] hidden sm:inline">
            bash interativo
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setHistory([])}
            className="border-[#232838] bg-[#12151E] text-[#8A91A8] hover:text-[#EDEFF6] text-xs h-8 px-2.5"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Limpar tela
          </Button>
          <Button
            size="sm"
            onClick={() => handleRunCommand('git help')}
            className="bg-[#1A1E2A] hover:bg-[#232838] text-[#EDEFF6] border border-[#232838] text-xs h-8 px-2.5"
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1 text-[#F05133]" />
            Ajuda
          </Button>
        </div>
      </div>

      {/* 2. Quick Command Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[11px] text-[#8A91A8] uppercase tracking-wider shrink-0 font-semibold">
          Comandos rápidos:
        </span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => handleRunCommand(cmd)}
            className="px-2.5 py-1 rounded bg-[#12151E] hover:bg-[#1A1E2A] border border-[#232838] hover:border-[#F05133]/40 text-xs font-mono text-[#EDEFF6] shrink-0 transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* 3. Terminal Emulator Card */}
      <div
        onClick={handleTerminalClick}
        className="flex-1 flex flex-col rounded-xl border border-[#232838] bg-[#050507] shadow-2xl overflow-hidden cursor-text min-h-0"
      >
        {/* Terminal Top Window Bar */}
        <div className="h-9 bg-[#12151E] border-b border-[#232838] flex items-center justify-between px-4 select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF4D4F] border border-[#FF4D4F]/30" />
            <span className="w-3 h-3 rounded-full bg-[#F5A623] border border-[#F5A623]/30" />
            <span className="w-3 h-3 rounded-full bg-[#3DD68C] border border-[#3DD68C]/30" />
          </div>

          <span className="text-xs font-mono text-[#8A91A8] truncate">
            bash — repo-teste ({currentBranch})
          </span>

          <span className="text-[11px] font-mono text-[#8A91A8]">UTF-8</span>
        </div>

        {/* Terminal Screen Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed space-y-3">
          {/* Welcome Banner */}
          <div className="text-[#8A91A8] whitespace-pre-line pb-2 border-b border-[#232838]/60">
            {INITIAL_WELCOME}
          </div>

          {/* History lines */}
          {history.map((item) => {
            const displayed =
              typedOutputId === item.id ? (displayedTextMap[item.id] ?? '') : item.output

            return (
              <div key={item.id} className="space-y-1">
                {/* Command prompt line */}
                <div className="flex items-center gap-2 text-[#8A91A8]">
                  <span className="text-[#3DD68C] font-semibold">usuario@testegit</span>
                  <span className="text-[#8A91A8]">:</span>
                  <span className="text-[#4DA3FF] font-semibold">~/repo-teste</span>
                  <span className="text-[#F05133] font-bold">({currentBranch})</span>
                  <span className="text-[#EDEFF6] font-bold">$</span>
                  <span className="text-[#EDEFF6] font-medium">{item.command}</span>
                </div>

                {/* Output text */}
                {displayed && (
                  <div
                    className={`pl-2 sm:pl-4 whitespace-pre-wrap font-mono text-xs sm:text-[13px] ${
                      item.success ? 'text-[#EDEFF6]' : 'text-[#FF4D4F]'
                    }`}
                  >
                    {displayed}
                  </div>
                )}
              </div>
            )
          })}

          {/* Active Input Line */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[#3DD68C] font-semibold shrink-0">usuario@testegit</span>
            <span className="text-[#8A91A8] shrink-0">:</span>
            <span className="text-[#4DA3FF] font-semibold shrink-0">~/repo-teste</span>
            <span className="text-[#F05133] font-bold shrink-0">({currentBranch})</span>
            <span className="text-[#EDEFF6] font-bold shrink-0">$</span>

            <div className="relative flex-1 flex items-center min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none text-[#EDEFF6] focus:outline-none font-mono text-xs sm:text-[13px] sm:text-[15px] p-0 caret-transparent"
                autoFocus
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
              />
              {/* Blinking block cursor positioned at end of typed text */}
              <span className="inline-block w-2 sm:w-2.5 h-4 sm:h-4.5 bg-[#F05133] ml-0.5 animate-blink-cursor shrink-0" />
            </div>
          </div>

          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  )
}
