import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
        likedBy: true,
        poll: {
          include: {
            options: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.content && !body.images) {
      return NextResponse.json(
        { error: 'Content or images are required' },
        { status: 400 }
      );
    }

    if (!body.authorId) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: 400 }
      );
    }

    // Find or create user by Clerk ID using upsert
    const user = await prisma.user.upsert({
      where: { clerkId: body.authorId },
      update: {
        name: body.name || undefined,
        avatar: body.avatar || undefined,
      },
      create: {
        clerkId: body.authorId,
        email: body.email || `user-${body.authorId}@bandoxanh.local`,
        name: body.name || 'Anonymous User',
        avatar: body.avatar,
      },
    });

    // Create the post
    const post = await prisma.post.create({
      data: {
        content: body.content || '',
        images: body.images ? JSON.stringify(body.images) : null,
        timestamp: body.timestamp || new Date().toISOString(),
        authorId: user.id,
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
