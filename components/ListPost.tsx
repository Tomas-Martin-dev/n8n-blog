import Link from 'next/link'
import React from 'react'
import { BlogPostSchema, BlogPost } from '../src/lib/schemas'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../src/lib/firebase'

async function getPosts() {
  try {
    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    }));

    // Validar con Zod antes de enviar
    const validatedPosts = posts
      .map(post => BlogPostSchema.safeParse(post))
      .filter(result => result.success)
      .map(result => result.data);

    return validatedPosts;
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export default async function ListPost() {
  const posts = await getPosts();

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
