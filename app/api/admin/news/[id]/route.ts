import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdmin } from '@/lib/admin';

// DELETE news article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await prisma.newsArticle.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news article:', error);
    return NextResponse.json(
      { error: 'Failed to delete news article' },
      { status: 500 }
    );
  }
}

// PUT news article (update)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();
    
    const article = await prisma.newsArticle.update({
      where: { id },
      data: {
        title: body.title,
        category: body.category,
        excerpt: body.excerpt,
        imageUrl: body.imageUrl,
        date: body.date,
        isFeatured: body.isFeatured,
        content: body.content,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating news article:', error);
    return NextResponse.json(
      { error: 'Failed to update news article' },
      { status: 500 }
    );
  }
}
