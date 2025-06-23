import { BlogPostSchema } from "../../../src/lib/schemas"
import RecipeImage from "components/RecipeImage"
import ReactMarkdown from 'react-markdown'
import { collection, getDocs, where, query } from 'firebase/firestore'
import { db } from '../../../src/lib/firebase'
import { notFound } from 'next/navigation'

// Forzar renderizado del lado del servidor
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getPost(slug: string) {
  console.log("🔍 Iniciando getPost con slug:", slug);
  
  try {
    // Verificar conexión a Firebase
    if (!db) {
      console.error("❌ Firebase DB no está inicializada");
      throw new Error("Firebase DB no está inicializada");
    }

    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, where('slug', '==', slug));
    
    console.log("🔥 Ejecutando consulta Firebase...");
    const querySnapshot = await getDocs(q);
    
    console.log("📊 Resultado consulta - Documentos encontrados:", querySnapshot.size);
    
    if (querySnapshot.empty) {
      console.log("⚠️ No se encontró ningún post con slug:", slug);
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const rawData = doc.data();
    
    console.log("📄 Datos del documento:", rawData);
    console.log("🆔 ID del documento:", doc.id);
    
    // Verificar que los campos de fecha existan
    if (!rawData.createdAt || !rawData.updatedAt) {
      console.error("❌ Faltan campos de fecha en el documento");
      throw new Error("Documento incompleto: faltan fechas");
    }
    
    const postData = {
      id: doc.id,
      ...rawData,
      createdAt: rawData.createdAt.toDate(),
      updatedAt: rawData.updatedAt.toDate(),
    };
    
    console.log("✅ Post data procesado:", postData);
    
    const validationResult = BlogPostSchema.safeParse(postData);
    if (!validationResult.success) {
      console.error("❌ Error de validación:", validationResult.error.format());
      throw new Error(`Validación fallida: ${validationResult.error.message}`);
    }
    
    console.log("✅ Post validado correctamente");
    return validationResult.data;
    
  } catch (error) {
    console.error('❌ Error completo en getPost:', error);
    console.error('Stack trace:', (error as Error).stack);
    return null;
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  console.log("🚀 Iniciando PostPage component");
  
  const { slug } = await params;
  console.log("📝 Slug recibido:", slug);
  
  const post = await getPost(slug);
  console.log("📋 Post obtenido:", post ? "✅ Encontrado" : "❌ No encontrado");

  if (!post) {
    console.log("🔄 Redirigiendo a 404");
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