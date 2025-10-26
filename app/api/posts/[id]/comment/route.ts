import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, authorId, email, name, avatar } = body;
    const postId = parseInt(id);

    if (!content || !authorId) {
      return NextResponse.json(
        { error: 'Content and Author ID are required' },
        { status: 400 }
      );
    }

    // Find or create user by Clerk ID using upsert
    const user = await prisma.user.upsert({
      where: { clerkId: authorId },
      update: {
        name: name || undefined,
        avatar: avatar || undefined,
      },
      create: {
        clerkId: authorId,
        email: email || `user-${authorId}@bandoxanh.local`,
        name: name || 'Anonymous User',
        avatar: avatar,
      },
    });

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        timestamp: new Date().toISOString(),
        postId,
        authorId: user.id,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
