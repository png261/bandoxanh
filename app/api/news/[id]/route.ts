import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const article = await prisma.newsArticle.findUnique({
      where: { id: parseInt(id) },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'News article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching news article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Check admin permission
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const body = await request.json();
    const article = await prisma.newsArticle.update({
      where: { id: parseInt(id) },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Check admin permission
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    await prisma.newsArticle.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news article:', error);
    return NextResponse.json(
      { error: 'Failed to delete news article' },
      { status: 500 }
    );
  }
}
