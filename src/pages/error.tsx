import { Link, useRouteError } from 'react-router-dom'

import Tristeza from '@/assets/tristeza.png'

export function Error() {
  const error = useRouteError() as Error & { status?: number }

  return (
    <div className="flex h-screen items-center justify-evenly flex-col md:flex-row p-6 md:p-0">
      <img src={Tristeza} alt="" width={330} />

      <div className="flex flex-col items-center justify-center gap-1 p-6 md:p-0">
        <h1 className="flex items-center justify-center pb-4 text-9xl font-bold">
          {error?.status || 'Erro'}
        </h1>
        <h2 className="text-4xl font-bold text-center">
          Whoops, algo aconteceu...
        </h2>
        <p className='text-accent-foreground w-auto text-ce'>
          Um erro aconteceu na aplicação. Por favor, entre em contato com o suporte para mais detalhes!
        </p>
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