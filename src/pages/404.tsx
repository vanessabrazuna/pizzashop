import { Ban } from 'lucide-react'
import { Link } from 'react-router-dom'

import Homer from '@/assets/homer.png'

export function NotFound() {
  return (
    <div className="flex h-screen items-center justify-evenly">
      <img src={Homer} alt="" width={325} className="brightness-5 blur-sm" />

      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="flex items-center justify-center pb-4 text-9xl font-bold">
          404
        </h1>
        <h2 className="text-4xl font-bold">Página não encontrada</h2>
        <p className="text-accent-foreground">
          Voltar para o{' '}
          <Link to="/" className="text-sky-600 dark:text-sky-400">
            Dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
