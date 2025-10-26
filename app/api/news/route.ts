import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/admin';

export async function GET() {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Check admin permission
  const adminCheck = await checkAdmin(request as any);
  if (adminCheck) return adminCheck;

  try {
    const body = await request.json();
    const article = await prisma.newsArticle.create({
      data: {
        title: body.title,
        category: body.category,
        excerpt: body.excerpt,
        imageUrl: body.imageUrl,
        date: body.date,
        isFeatured: body.isFeatured || false,
        content: body.content,
      },
    });
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 }
    );
  }
}

