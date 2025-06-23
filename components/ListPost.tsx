import Link from 'next/link'
import React from 'react'
import { BlogPostSchema, BlogPost } from '../src/lib/schemas'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../src/lib/firebase'

// Forzar renderizado del lado del servidor
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getPosts() {
  console.log("🔍 Iniciando getPosts");
  
  try {
    // Verificar conexión a Firebase
    if (!db) {
      console.error("❌ Firebase DB no está inicializada en ListPost");
      throw new Error("Firebase DB no está inicializada");
    }

    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    
    console.log("🔥 Ejecutando consulta para todos los posts...");
    const querySnapshot = await getDocs(q);
    
    console.log("📊 Total de documentos encontrados:", querySnapshot.size);
    
    const posts = querySnapshot.docs.map(doc => {
      const rawData = doc.data();
      console.log("📄 Procesando documento con ID:", doc.id);
      
      return {
        id: doc.id,
        ...rawData,
        createdAt: rawData.createdAt?.toDate() || new Date(),
        updatedAt: rawData.updatedAt?.toDate() || new Date(),
      };
    });

    console.log("📋 Posts procesados:", posts.length);

    // Validar con Zod antes de enviar
    const validatedPosts = posts
      .map((post, index) => {
        const result = BlogPostSchema.safeParse(post);
        if (!result.success) {
          console.warn(`⚠️ Post ${index} falló validación:`, result.error.format());
        }
        return result;
      })
      .filter(result => result.success)
      .map(result => result.data);

    console.log("✅ Posts validados:", validatedPosts.length);
    return validatedPosts;
  } catch (error) {
    console.error('❌ Error completo en getPosts:', error);
    console.error('Stack trace:', (error as Error).stack);
    return []
  }
}

export default async function ListPost() {
  console.log("🚀 Iniciando ListPost component");
  const posts = await getPosts();
  console.log("📋 Posts obtenidos en ListPost:", posts.length);

  if (posts.length === 0) {
    return (
      <div className='mt-24 border border-[var(--color-background-2)] rounded-lg shadow-lg py-6 px-3'>
        <p className='text-lg mb-4 px-6 text-custom-2 font-bold'>
          No hay recetas disponibles
        </p>
        <p className='text-sm px-6 text-custom-2'>
          Las recetas aparecerán aquí cuando se publiquen desde n8n.
        </p>
      </div>
    )
  }

  return (
    <div className='mt-24 border border-[var(--color-background-2)] rounded-lg shadow-lg py-6 px-3'>
      <p className='text-lg mb-4 px-6 text-custom-2 font-bold'>
        {posts.length} {posts.length === 1 ? 'receta' : 'recetas'}
      </p>

      <div className='flex flex-col'>
        {posts.map((post: BlogPost) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group px-6 py-4 hover:bg-custom-1 transition-all duration-300 rounded-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium text-custom-1 transition-colors">
                {post.title}
              </h2>
              <p className='text-sm font-medium text-custom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                {new Date(post.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
            <p className="text-custom-2 leading-relaxed text-base">
              {post.description}
            </p>
          </Link>
        ))}
      </div>  
    </div>
  )
}
