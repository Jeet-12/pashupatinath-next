import { NextResponse } from 'next/server';

interface TagsResponse {
  success: boolean;
  data: {
    tags: any[];
  };
  message?: string;
}

export async function GET(): Promise<Response> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog-tags`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }

    const data: TagsResponse = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        tags: data.data?.tags || []
      }
    });

  } catch (error) {
    console.error('Tags API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch tags',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}