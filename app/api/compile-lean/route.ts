import { NextRequest, NextResponse } from 'next/server';

// Use Node.js runtime instead of Edge to support https.Agent
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Check if Lean compiler is configured and not localhost/ngrok
    const compilerUrl = process.env.LEAN_COMPILER_URL;

    if (!compilerUrl || compilerUrl.includes('localhost') || compilerUrl.includes('127.0.0.1') || compilerUrl.includes('ngrok')) {
      console.log('[LEAN API] Lean compiler not configured or using localhost/ngrok - returning unavailable response');
      return NextResponse.json(
        {
          success: false,
          error: 'Lean verification service not available',
          message: 'Lean compiler is not configured for this deployment. This feature requires an external Lean compiler service.'
        },
        { status: 503 }
      );
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    // Import https module for Node.js runtime
    const https = await import('https');
    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    // Create custom fetch with the agent
    const nodeFetch = (await import('node-fetch')).default;

    // Step 1: Establish session with compiler (bypass interstitial if needed)
    await nodeFetch(compilerUrl, {
      method: 'GET',
      agent: agent as any
    });

    // Step 2: Compile the Lean code
    const response = await nodeFetch(`${compilerUrl}/compile-lean`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
      agent: agent as any
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: result.exit_code === 0,
      stdout: result.stdout,
      stderr: result.stderr,
      exit_code: result.exit_code
    });

  } catch (error) {
    console.error('Lean compilation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}