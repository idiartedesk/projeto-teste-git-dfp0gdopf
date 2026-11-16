/* Main App Component - Handles routing (using react-router-dom), query client and other providers */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { GitRepoProvider } from './context/GitRepoContext'
import Layout from './components/Layout'
import Index from './pages/Index'
import Commits from './pages/Commits'
import Branches from './pages/Branches'
import Terminal from './pages/Terminal'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <GitRepoProvider>
        <Toaster />
        <Sonner
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#12151E',
              border: '1px solid #232838',
              color: '#EDEFF6',
            },
          }}
        />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/commits" element={<Commits />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/terminal" element={<Terminal />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GitRepoProvider>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
