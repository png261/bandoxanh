import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  // Check admin authorization
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const body = await request.json();
    const { title, content, category, imageUrl, excerpt, date, isFeatured } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, category' },
        { status: 400 }
      );
    }

    console.log('Creating news article:', {
      title,
      content: content.substring(0, 100) + '...',
      category,
      imageUrl: imageUrl || '',
      excerpt: excerpt || '',
      date: date || new Date().toISOString().split('T')[0],
      isFeatured: isFeatured || false,
    });

    // Create new news article
    const article = await prisma.newsArticle.create({
      data: {
        title,
        content,
        category,
        imageUrl: imageUrl || '',
        excerpt: excerpt || title.substring(0, 150),
        date: date || new Date().toISOString().split('T')[0],
        isFeatured: isFeatured || false,
      },
    });

    console.log('News article created successfully:', article);

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create news article',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Check admin authorization
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const articles = await prisma.newsArticle.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
              { excerpt: { contains: search, mode: 'insensitive' } },
            ],
          } : {},
          category ? { category } : {},
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
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
