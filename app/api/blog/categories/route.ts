import { NextResponse } from 'next/server';

interface CategoriesResponse {
  success: boolean;
  data: {
    categories: any[];
  };
  message?: string;
}

export async function GET(): Promise<Response> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog-categories`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data: CategoriesResponse = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        categories: data.data?.categories || []
      }
    });

  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch categories',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}