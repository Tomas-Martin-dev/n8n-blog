import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../src/lib/firebase';
import { BlogPostSchema } from '../../../../src/lib/schemas';

// GET /api/posts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slug } = await params;

    if (!slug) {
      return NextResponse.json({
        success: false,
        error: 'Slug del post es requerido'
      }, { status: 400 });
    }

    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({
        success: false,
        error: 'Post no encontrado'
      }, { status: 404 });
    }

    const doc = querySnapshot.docs[0];
    const postData = {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    };

    const validatedPost = BlogPostSchema.safeParse(postData);
    if (!validatedPost.success) {
      return NextResponse.json({
        success: false,
        error: 'Datos del post inválidos'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: validatedPost.data
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al obtener el post'
    }, { status: 500 });
  }
} 