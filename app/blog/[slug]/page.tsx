import { BlogPostSchema } from "../../../src/lib/schemas"
import RecipeImage from "components/RecipeImage"
import ReactMarkdown from 'react-markdown'

async function getPost(slug: string) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/posts/${slug}`)
    const data = await response.json()
    
    if (!data.success || !data.data) {
      throw new Error(data.error || 'No hay datos')
    }
    
    const post = BlogPostSchema.safeParse(data.data)
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
            <div className='px-2 prose prose-lg max-w-none text-custom-1'>
              <ReactMarkdown>{recipe.recipeText}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
} 