import { NextRequest, NextResponse } from 'next/server';
import { welcomeEmailWorkflow, weeklyDigestWorkflow } from '@/lib/workflows';

/**
 * Webhook endpoint for Workflow.dev to trigger email workflows
 * POST /api/workflows/email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflow, payload } = body;

    if (!workflow || !payload) {
      return NextResponse.json(
        { error: 'Missing workflow or payload' },
        { status: 400 }
      );
    }

    let result;

    switch (workflow) {
      case 'welcome':
        if (!payload.email || !payload.name) {
          return NextResponse.json(
            { error: 'Missing email or name in payload' },
            { status: 400 }
          );
        }
        result = await welcomeEmailWorkflow(payload);
        break;

      case 'weekly-digest':
        if (!payload.email || !payload.name || !payload.stats) {
          return NextResponse.json(
            { error: 'Missing required fields in payload' },
            { status: 400 }
          );
        }
        result = await weeklyDigestWorkflow(payload);
        break;

      default:
        return NextResponse.json(
          { error: 'Unknown workflow type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${workflow} workflow executed successfully`,
      result,
    });
  } catch (error) {
    console.error('Error executing workflow:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    );
  }
}
