import { BlogPostSchema } from "../../../src/lib/schemas"
import RecipeImage from "components/RecipeImage"
import ReactMarkdown from 'react-markdown'
import { collection, getDocs, where, query } from 'firebase/firestore'
import { db } from '../../../src/lib/firebase'
import { notFound } from 'next/navigation'


export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getPost(slug: string) {
  try {
    if (!db) {
      throw new Error("Firebase DB no está inicializada");
    }

    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, where('slug', '==', slug));
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const rawData = doc.data();
    
    if (!rawData.createdAt || !rawData.updatedAt) {
      throw new Error("Documento incompleto: faltan fechas");
    }
    
    const postData = {
      id: doc.id,
      ...rawData,
      createdAt: rawData.createdAt.toDate(),
      updatedAt: rawData.updatedAt.toDate(),
    };
    
    const validationResult = BlogPostSchema.safeParse(postData);
    if (!validationResult.success) {
      throw new Error(`Validación fallida: ${validationResult.error.message}`);
    }
    
    return validationResult.data;
    
  } catch (error) {
    return null;
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  } 

  return (
    <main className='max-w-[75ch] mx-auto my-36 flex flex-col gap-4 px-4 relative z-10'>
      <h1 className='text-4xl font-bold text-custom-1'>{post.title}</h1>

      <p className='text-xl font-medium text-custom-2'>{post.description}</p>

      <div className='flex flex-col gap-4'>
        {post.recipes && post.recipes.length > 0 ? (
          post.recipes.map((recipe) => (
            <div key={recipe.id} className="flex flex-col gap-2 mt-12 hover:shadow-lg transition-all transition-discrete duration-300">
              <RecipeImage src={recipe.img} alt="imagen de la receta" />
              <div className='px-3 prose text-lg max-w-none text-custom-1'>
                <ReactMarkdown>{recipe.recipeText}</ReactMarkdown>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-custom-2">No hay recetas disponibles para este post.</p>
          </div>
        )}
      </div>

    </main>
  );
} 