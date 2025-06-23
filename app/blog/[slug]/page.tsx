import { BlogPostSchema } from "../../../src/lib/schemas"
import RecipeImage from "components/RecipeImage"
import ReactMarkdown from 'react-markdown'
import { collection, getDocs, where, query } from 'firebase/firestore'
import { db } from '../../../src/lib/firebase'

async function getPost(slug: string) {
  console.log("se inicia la funcion getPost");
  
  try {
    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    console.log(doc.data());
    console.log(doc);
    
    const postData = {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    };
    console.log(postData);
    
    const post = BlogPostSchema.safeParse(postData)
    if (!post.success) {
      throw new Error(post.error.message)
    }
    return post.data
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return <div>Post not found</div>
  } 

  return (
    <main className='max-w-[75ch] mx-auto my-36 flex flex-col gap-4 px-4 relative z-10'>
      <h1 className='text-4xl font-bold text-custom-1'>{post.title}</h1>

      <p className='text-xl font-medium text-custom-2'>{post.description}</p>

      <div className='flex flex-col gap-4'>
        {post.recipes.map((recipe) => (
          <div key={recipe.id} className="flex flex-col gap-2 mt-12 hover:shadow-lg transition-all transition-discrete duration-300">
            <RecipeImage src={recipe.img} alt="imagen de la receta" />
            <div className='px-3 prose text-lg max-w-none text-custom-1'>
              <ReactMarkdown>{recipe.recipeText}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
} 