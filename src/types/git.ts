export type FileStatus = 'novo' | 'modificado' | 'removido'

export interface PendingFile {
  id: string
  path: string
  status: FileStatus
  staged: boolean
  linesAdded?: number
  linesRemoved?: number
}

export interface CommitFile {
  path: string
  status: FileStatus
}

export interface Commit {
  id: string
  hash: string // 7-char short hash
  fullHash: string
  message: string
  author: string
  authorEmail: string
  date: string // ISO string
  relativeDate: string
  branch: string
  files: CommitFile[]
}

export interface Branch {
  name: string
  color: string
  latestCommitHash: string
  ahead: number
  behind: number
  isDefault?: boolean
}

export interface GitRepoContextType {
  commits: Commit[]
  branches: Branch[]
  currentBranch: string
  pendingFiles: PendingFile[]
  isCommitModalOpen: boolean
  selectedCommitForDetail: Commit | null
  setIsCommitModalOpen: (open: boolean) => void
  setSelectedCommitForDetail: (commit: Commit | null) => void
  setCurrentBranch: (branchName: string) => void
  toggleStageFile: (id: string) => void
  stageAllFiles: () => void
  unstageAllFiles: () => void
  createCommit: (data: { message: string; branch?: string; selectedFileIds?: string[] }) => Commit
  createBranch: (name: string) => boolean
  deleteBranch: (name: string) => boolean
  resetRepository: () => void
  executeTerminalCommand: (commandStr: string) => { output: string; success: boolean }
}
