import Link from 'next/link'

export default function NotFound() {
  return (
    <main className='max-w-[75ch] mx-auto my-36 flex flex-col gap-4 px-4 relative z-10 text-center'>
      <h1 className='text-4xl font-bold text-custom-1'>Post no encontrado</h1>
      <p className='text-xl text-custom-2'>
        Lo sentimos, el post que buscas no existe o ha sido eliminado.
      </p>
      <Link 
        href="/" 
        className='inline-block mt-8 px-6 py-3 bg-custom-1 text-white rounded-lg hover:opacity-90 transition-opacity'
      >
        Volver al inicio
      </Link>
    </main>
  )
} 