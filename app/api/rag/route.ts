import { NextRequest, NextResponse } from 'next/server';

const RAG_SERVER_URL = process.env.RAG_SERVER_URL || 'http://localhost:5001';

export async function POST(request: NextRequest) {
  try {
    // Check if RAG server is configured and not localhost
    if (!process.env.RAG_SERVER_URL || RAG_SERVER_URL.includes('localhost') || RAG_SERVER_URL.includes('127.0.0.1')) {
      console.log('[RAG API] RAG server not configured or using localhost - returning unavailable response');
      return NextResponse.json(
        {
          error: 'RAG service not available',
          message: 'RAG server is not configured for this deployment. This feature requires an external RAG server.'
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { query, k = 5 } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Call Python RAG server
    const response = await fetch(`${RAG_SERVER_URL}/retrieve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, k }),
    });

    if (!response.ok) {
      throw new Error(`RAG server error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('RAG API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check if RAG server is configured
    if (!process.env.RAG_SERVER_URL || RAG_SERVER_URL.includes('localhost') || RAG_SERVER_URL.includes('127.0.0.1')) {
      return NextResponse.json(
        {
          status: 'disabled',
          message: 'RAG server not configured for this deployment',
        },
        { status: 503 }
      );
    }

    // Health check - forward to RAG server
    const response = await fetch(`${RAG_SERVER_URL}/health`);
    const data = await response.json();

    return NextResponse.json({
      status: 'ok',
      rag_server: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'RAG server not available',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
