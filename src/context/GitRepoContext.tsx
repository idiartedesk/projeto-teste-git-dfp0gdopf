import React, { createContext, useContext, useState, useEffect } from 'react'
import { Commit, Branch, PendingFile, GitRepoContextType, FileStatus } from '../types/git'
import { toast } from 'sonner'

const BRANCH_COLORS: Record<string, string> = {
  main: '#F05133',
  develop: '#4DA3FF',
  'feature/login': '#3DD68C',
  'hotfix/crash': '#B983FF',
  default: '#F5A623',
}

function generateHash(length = 40): string {
  const chars = '0123456789abcdef'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

const INITIAL_COMMITS: Commit[] = [
  {
    id: 'c1',
    fullHash: 'a7c93e4f1b82d3e5c9a0b1c2d3e4f5a6b7c8d9e0',
    hash: 'a7c93e4',
    message: 'perf: otimiza carregamento da listagem',
    author: 'Carla Mendes',
    authorEmail: 'carla.mendes@empresa.com.br',
    date: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    relativeDate: 'há 25 minutos',
    branch: 'main',
    files: [
      { path: 'src/pages/Index.tsx', status: 'modificado' },
      { path: 'src/lib/cache.ts', status: 'novo' },
    ],
  },
  {
    id: 'c2',
    fullHash: '8b3d1f0e2a4c6e80b2c4d6f8a0b2c4d6e8f0a2b4',
    hash: '8b3d1f0',
    message: 'docs: atualiza README',
    author: 'Bruno Lima',
    authorEmail: 'bruno.lima@empresa.com.br',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    relativeDate: 'há 3 horas',
    branch: 'main',
    files: [
      { path: 'README.md', status: 'modificado' },
      { path: 'docs/architecture.md', status: 'novo' },
    ],
  },
  {
    id: 'c3',
    fullHash: '3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f',
    hash: '3e5f7a9',
    message: 'test: cobre utilitários de formatação',
    author: 'Ana Souza',
    authorEmail: 'ana.souza@empresa.com.br',
    date: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    relativeDate: 'há 18 horas',
    branch: 'develop',
    files: [
      { path: 'tests/formatters.test.ts', status: 'novo' },
      { path: 'src/lib/utils.ts', status: 'modificado' },
    ],
  },
  {
    id: 'c4',
    fullHash: 'f4a2c8e0d6b4a2f0e8c6a4b2d0e8f6a4b2c0d8e6',
    hash: 'f4a2c8e',
    message: 'refactor: extrai componente de botão',
    author: 'Bruno Lima',
    authorEmail: 'bruno.lima@empresa.com.br',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    relativeDate: 'há 1 dia',
    branch: 'develop',
    files: [
      { path: 'src/components/ui/button.tsx', status: 'modificado' },
      { path: 'src/components/ui/button-variants.ts', status: 'novo' },
    ],
  },
  {
    id: 'c5',
    fullHash: '9c1e3a5b7d9f1b3d5f7a9b1c3d5e7f9a1b3c5d7e',
    hash: '9c1e3a5',
    message: 'feat: cria endpoint de usuários',
    author: 'Carla Mendes',
    authorEmail: 'carla.mendes@empresa.com.br',
    date: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    relativeDate: 'há 1 dia',
    branch: 'develop',
    files: [
      { path: 'src/server/routes/users.ts', status: 'novo' },
      { path: 'src/server/controllers/userController.ts', status: 'novo' },
    ],
  },
  {
    id: 'c6',
    fullHash: '6d8f0b2a4c6e8a0c2e4f6a8b0d2e4f6a8b0c2d4e',
    hash: '6d8f0b2',
    message: 'chore: atualiza dependências',
    author: 'Ana Souza',
    authorEmail: 'ana.souza@empresa.com.br',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    relativeDate: 'há 2 dias',
    branch: 'main',
    files: [
      { path: 'package.json', status: 'modificado' },
      { path: 'pnpm-lock.yaml', status: 'modificado' },
    ],
  },
  {
    id: 'c7',
    fullHash: '2b4d6f8a0c2e4b6d8f0a2c4e6a8b0c2d4e6f8a0b',
    hash: '2b4d6f8',
    message: 'fix: corrige bug de sessão expirada',
    author: 'Bruno Lima',
    authorEmail: 'bruno.lima@empresa.com.br',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    relativeDate: 'há 3 dias',
    branch: 'hotfix/crash',
    files: [
      { path: 'src/auth/sessionManager.ts', status: 'modificado' },
      { path: 'src/auth/tokenStorage.ts', status: 'modificado' },
    ],
  },
  {
    id: 'c8',
    fullHash: 'e0f2a4c6b8d0e2f4a6c8e0b2d4f6a8c0e2f4a6b8',
    hash: 'e0f2a4c',
    message: 'feat: adiciona página de login',
    author: 'Ana Souza',
    authorEmail: 'ana.souza@empresa.com.br',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    relativeDate: 'há 4 dias',
    branch: 'feature/login',
    files: [
      { path: 'src/pages/Login.tsx', status: 'novo' },
      { path: 'src/components/LoginForm.tsx', status: 'novo' },
      { path: 'src/styles/auth.css', status: 'novo' },
    ],
  },
]

const INITIAL_BRANCHES: Branch[] = [
  {
    name: 'main',
    color: '#F05133',
    latestCommitHash: 'a7c93e4',
    ahead: 0,
    behind: 0,
    isDefault: true,
  },
  {
    name: 'develop',
    color: '#4DA3FF',
    latestCommitHash: '3e5f7a9',
    ahead: 3,
    behind: 1,
  },
  {
    name: 'feature/login',
    color: '#3DD68C',
    latestCommitHash: 'e0f2a4c',
    ahead: 1,
    behind: 4,
  },
  {
    name: 'hotfix/crash',
    color: '#B983FF',
    latestCommitHash: '2b4d6f8',
    ahead: 1,
    behind: 2,
  },
]

const INITIAL_PENDING_FILES: PendingFile[] = [
  {
    id: 'p1',
    path: 'src/components/GitGraph.tsx',
    status: 'novo',
    staged: true,
    linesAdded: 142,
    linesRemoved: 0,
  },
  {
    id: 'p2',
    path: 'src/pages/Branches.tsx',
    status: 'modificado',
    staged: true,
    linesAdded: 38,
    linesRemoved: 12,
  },
  {
    id: 'p3',
    path: 'src/types/repository.ts',
    status: 'modificado',
    staged: false,
    linesAdded: 15,
    linesRemoved: 4,
  },
  {
    id: 'p4',
    path: 'src/legacy/oldGraph.ts',
    status: 'removido',
    staged: false,
    linesAdded: 0,
    linesRemoved: 86,
  },
  {
    id: 'p5',
    path: 'docs/git-workflow.md',
    status: 'novo',
    staged: false,
    linesAdded: 64,
    linesRemoved: 0,
  },
]

const GitRepoContext = createContext<GitRepoContextType | undefined>(undefined)

export const GitRepoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [commits, setCommits] = useState<Commit[]>(INITIAL_COMMITS)
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES)
  const [currentBranch, setCurrentBranchState] = useState<string>('main')
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>(INITIAL_PENDING_FILES)
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false)
  const [selectedCommitForDetail, setSelectedCommitForDetail] = useState<Commit | null>(null)

  // Keep branch latest commits up to date
  useEffect(() => {
    // optional sync
  }, [commits])

  const setCurrentBranch = (branchName: string) => {
    const exists = branches.some((b) => b.name === branchName)
    if (!exists) {
      toast.error(`A branch '${branchName}' não existe.`)
      return
    }
    setCurrentBranchState(branchName)
    toast.success(`Trocado para a branch '${branchName}'`)
  }

  const toggleStageFile = (id: string) => {
    setPendingFiles((prev) => prev.map((f) => (f.id === id ? { ...f, staged: !f.staged } : f)))
  }

  const stageAllFiles = () => {
    setPendingFiles((prev) => prev.map((f) => ({ ...f, staged: true })))
  }

  const unstageAllFiles = () => {
    setPendingFiles((prev) => prev.map((f) => ({ ...f, staged: false })))
  }

  const createCommit = ({
    message,
    branch,
    selectedFileIds,
  }: {
    message: string
    branch?: string
    selectedFileIds?: string[]
  }): Commit => {
    const targetBranch = branch || currentBranch
    const fullHash = generateHash(40)
    const hash = fullHash.slice(0, 7)

    // Determine files committed
    let committedFiles: PendingFile[] = []
    if (selectedFileIds && selectedFileIds.length > 0) {
      committedFiles = pendingFiles.filter((f) => selectedFileIds.includes(f.id))
    } else {
      committedFiles = pendingFiles.filter((f) => f.staged)
      if (committedFiles.length === 0) {
        committedFiles = pendingFiles.slice(0, 1) // default to at least one file if staged was empty
      }
    }

    const newCommit: Commit = {
      id: `c_${Date.now()}`,
      fullHash,
      hash,
      message: message.trim(),
      author: 'Você (Desenvolvedor)',
      authorEmail: 'dev@testegit.local',
      date: new Date().toISOString(),
      relativeDate: 'agora mesmo',
      branch: targetBranch,
      files: committedFiles.map((f) => ({
        path: f.path,
        status: f.status as FileStatus,
      })),
    }

    setCommits((prev) => [newCommit, ...prev])

    // Remove committed files from pending list
    const committedIds = new Set(committedFiles.map((f) => f.id))
    setPendingFiles((prev) => {
      const remaining = prev.filter((f) => !committedIds.has(f.id))
      return remaining
    })

    // Update the target branch latest commit and ahead counter
    setBranches((prev) =>
      prev.map((b) => {
        if (b.name === targetBranch) {
          return {
            ...b,
            latestCommitHash: hash,
            ahead: b.ahead + 1,
          }
        }
        return b
      }),
    )

    toast.success(`Commit [${hash}] criado com sucesso!`)
    return newCommit
  }

  const createBranch = (name: string): boolean => {
    const cleanName = name.trim().replace(/\s+/g, '-')
    if (!cleanName) {
      toast.error('Informe um nome válido para a branch.')
      return false
    }

    if (branches.some((b) => b.name.toLowerCase() === cleanName.toLowerCase())) {
      toast.error(`A branch '${cleanName}' já existe.`)
      return false
    }

    const availableColors = [
      '#F05133',
      '#4DA3FF',
      '#3DD68C',
      '#B983FF',
      '#F5A623',
      '#FF4D4F',
      '#00D8BB',
    ]
    const color =
      BRANCH_COLORS[cleanName] || availableColors[branches.length % availableColors.length]
    const currentBranchObj = branches.find((b) => b.name === currentBranch)

    const newBranch: Branch = {
      name: cleanName,
      color,
      latestCommitHash: currentBranchObj?.latestCommitHash || commits[0]?.hash || '0000000',
      ahead: 0,
      behind: 0,
    }

    setBranches((prev) => [...prev, newBranch])
    toast.success(`Branch '${cleanName}' criada com sucesso!`)
    return true
  }

  const deleteBranch = (name: string): boolean => {
    if (name === 'main' || name === 'master') {
      toast.error('A branch main é protegida e não pode ser excluída.')
      return false
    }

    if (name === currentBranch) {
      toast.error(
        'Não é possível excluir a branch em que você está atualmente. Mude para outra branch antes.',
      )
      return false
    }

    setBranches((prev) => prev.filter((b) => b.name !== name))
    toast.success(`Branch '${name}' excluída.`)
    return true
  }

  const resetRepository = () => {
    setCommits(INITIAL_COMMITS)
    setBranches(INITIAL_BRANCHES)
    setCurrentBranchState('main')
    setPendingFiles(INITIAL_PENDING_FILES)
    toast.success('Repositório restaurado para o estado inicial!')
  }

  const executeTerminalCommand = (commandStr: string): { output: string; success: boolean } => {
    const trimmed = commandStr.trim()
    if (!trimmed) {
      return { output: '', success: true }
    }

    if (trimmed === 'git help' || trimmed === 'help') {
      const help = [
        'Comandos Git suportados no TesteGit:',
        '  git status                  Mostra o estado da árvore de trabalho e arquivos preparados',
        '  git log --oneline           Exibe histórico resumido de commits',
        '  git branch                  Lista todas as branches locais (* indica a atual)',
        '  git branch <nome>           Cria uma nova branch a partir da atual',
        '  git checkout <nome>         Alterna para a branch especificada',
        '  git checkout -b <nome>      Cria e alterna para a nova branch',
        '  git add <arquivo | .>       Prepara arquivos para commit',
        '  git commit -m "<mensagem>"  Cria um novo commit com os arquivos preparados',
        '  git reset --hard            Restaura o repositório para os dados sementes',
        '  clear                       Limpa o terminal',
      ].join('\n')
      return { output: help, success: true }
    }

    if (trimmed === 'git status') {
      const stagedFiles = pendingFiles.filter((f) => f.staged)
      const unstagedFiles = pendingFiles.filter((f) => !f.staged)

      let res = `Na branch ${currentBranch}\n`
      const currentB = branches.find((b) => b.name === currentBranch)
      if (currentB && currentB.ahead > 0) {
        res += `Sua branch está à frente de 'origin/${currentBranch}' por ${currentB.ahead} commit(s).\n`
      }

      if (pendingFiles.length === 0) {
        res += '\nárvore de trabalho limpa, nada a commitar'
        return { output: res, success: true }
      }

      if (stagedFiles.length > 0) {
        res +=
          '\nMudanças a serem commitadas:\n  (use "git restore --staged <file>..." para retirar do stage)\n'
        stagedFiles.forEach((f) => {
          res += `\t\x1b[32m${f.status === 'novo' ? 'novo arquivo:   ' : f.status === 'removido' ? 'deletado:       ' : 'modificado:     '}${f.path}\x1b[0m\n`
        })
      }

      if (unstagedFiles.length > 0) {
        res +=
          '\nArquivos não preparados para commit:\n  (use "git add <file>..." para atualizar o que será commitado)\n'
        unstagedFiles.forEach((f) => {
          res += `\t\x1b[31m${f.status === 'novo' ? 'novo:           ' : f.status === 'removido' ? 'deletado:       ' : 'modificado:     '}${f.path}\x1b[0m\n`
        })
      }

      return { output: res.trimEnd(), success: true }
    }

    if (trimmed === 'git log' || trimmed === 'git log --oneline') {
      const lines = commits.map((c) => {
        const isHead = c.hash === branches.find((b) => b.name === currentBranch)?.latestCommitHash
        const headBadge = isHead ? `\x1b[33m(HEAD -> ${currentBranch})\x1b[0m ` : ''
        return `\x1b[38;2;240;81;51m${c.hash}\x1b[0m ${headBadge}${c.message} \x1b[90m(${c.author}, ${c.relativeDate})\x1b[0m`
      })
      return { output: lines.join('\n'), success: true }
    }

    if (trimmed === 'git branch') {
      const lines = branches.map((b) => {
        if (b.name === currentBranch) {
          return `* \x1b[32m${b.name}\x1b[0m`
        }
        return `  ${b.name}`
      })
      return { output: lines.join('\n'), success: true }
    }

    // git checkout -b <name>
    const checkoutBRegex = /^git\s+checkout\s+-b\s+([^\s]+)$/
    const matchCheckoutB = trimmed.match(checkoutBRegex)
    if (matchCheckoutB) {
      const name = matchCheckoutB[1]
      const created = createBranch(name)
      if (created) {
        setCurrentBranchState(name)
        return { output: `Branch '${name}' criada e alternada para ela.`, success: true }
      }
      return { output: `Erro ao criar branch '${name}'.`, success: false }
    }

    // git checkout <name>
    const checkoutRegex = /^git\s+checkout\s+([^\s]+)$/
    const matchCheckout = trimmed.match(checkoutRegex)
    if (matchCheckout) {
      const name = matchCheckout[1]
      const exists = branches.some((b) => b.name === name)
      if (exists) {
        setCurrentBranchState(name)
        toast.success(`Trocado para a branch '${name}'`)
        return { output: `Trocado para a branch '${name}'`, success: true }
      }
      return { output: `erro: referência '${name}' não encontrada.`, success: false }
    }

    // git branch <name>
    const branchCreateRegex = /^git\s+branch\s+([^\s]+)$/
    const matchBranchCreate = trimmed.match(branchCreateRegex)
    if (matchBranchCreate) {
      const name = matchBranchCreate[1]
      const created = createBranch(name)
      if (created) {
        return { output: `Branch '${name}' criada.`, success: true }
      }
      return { output: `Falha ao criar branch '${name}'.`, success: false }
    }

    // git add . or git add <file>
    const addRegex = /^git\s+add\s+(.+)$/
    const matchAdd = trimmed.match(addRegex)
    if (matchAdd) {
      const target = matchAdd[1].trim()
      if (target === '.' || target === '-A' || target === '--all') {
        stageAllFiles()
        return { output: 'Todos os arquivos foram preparados (staged).', success: true }
      }
      const file = pendingFiles.find((f) => f.path === target || f.path.endsWith(target))
      if (file) {
        setPendingFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, staged: true } : f)))
        return { output: `Arquivo '${file.path}' preparado para commit.`, success: true }
      }
      return {
        output: `fatal: caminho '${target}' não corresponde a nenhum arquivo pendente`,
        success: false,
      }
    }

    // git commit -m "mensagem"
    const commitRegex = /^git\s+commit\s+-m\s+["'](.+)["']$/
    const matchCommit = trimmed.match(commitRegex)
    if (matchCommit) {
      const msg = matchCommit[1]
      const staged = pendingFiles.filter((f) => f.staged)
      if (staged.length === 0 && pendingFiles.length > 0) {
        return {
          output:
            'nada para commitar (use "git add" para preparar arquivos antes ou execute com arquivos pendentes)',
          success: false,
        }
      }
      const c = createCommit({ message: msg })
      return {
        output: `[${currentBranch} ${c.hash}] ${msg}\n ${c.files.length} arquivo(s) alterado(s)`,
        success: true,
      }
    }

    if (trimmed === 'git reset --hard') {
      resetRepository()
      return { output: 'HEAD está agora em estado inicial do laboratório.', success: true }
    }

    return {
      output: `comando não reconhecido. Digite 'git help' para ver os comandos suportados.`,
      success: false,
    }
  }

  return (
    <GitRepoContext.Provider
      value={{
        commits,
        branches,
        currentBranch,
        pendingFiles,
        isCommitModalOpen,
        selectedCommitForDetail,
        setIsCommitModalOpen,
        setSelectedCommitForDetail,
        setCurrentBranch,
        toggleStageFile,
        stageAllFiles,
        unstageAllFiles,
        createCommit,
        createBranch,
        deleteBranch,
        resetRepository,
        executeTerminalCommand,
      }}
    >
      {children}
    </GitRepoContext.Provider>
  )
}

export function useGitRepo(): GitRepoContextType {
  const context = useContext(GitRepoContext)
  if (!context) {
    throw new Error('useGitRepo deve ser usado dentro de um GitRepoProvider')
  }
  return context
}
