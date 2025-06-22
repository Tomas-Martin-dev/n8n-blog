import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../src/lib/firebase';
import { IncomingPostSchema, BlogPostSchema } from '../../../src/lib/schemas';
import { validateBearerToken, createUnauthorizedResponse } from '../../../src/lib/auth';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  
    .replace(/[^a-z0-9\s-]/g, '') 
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-'); 
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    const authResult = validateBearerToken(request);
    if (!authResult.isValid) {
      return createUnauthorizedResponse(authResult.error || 'Error al validar el token');
    }
    
    const rawData = await request.json();

    // Validar con Zod - súper simple
    const validationResult = IncomingPostSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: `Datos inválidos: ${validationResult.error.issues[0].message}`
      }, { status: 400 });
    }

    const data = validationResult.data;

    const blogPost = {
      title: data.title,
      description: data.description,
      recipes: data.recipes,
      createdAt: new Date(),
      updatedAt: new Date(),
      slug: generateSlug(data.title)
    };

    const postsCollection = collection(db, 'posts');
    const docRef = await addDoc(postsCollection, blogPost);

    const savedPost = {
      id: docRef.id,
      ...blogPost
    };

    return NextResponse.json({
      success: true,
      data: savedPost,
      message: 'Post creado exitosamente'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// GET /api/posts 
export async function GET() {
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

    return NextResponse.json({
      success: true,
      data: validatedPosts
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al obtener los posts'
    }, { status: 500 });
  }
} 