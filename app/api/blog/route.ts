import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const page = searchParams.get('page') || '1';
    const show = searchParams.get('show') || '9';

    // Build URL according to your Laravel routes
    let url = `${process.env.NEXT_PUBLIC_APP_URL}/api/blog`;
    
    if (category) {
      url = `${process.env.NEXT_PUBLIC_APP_URL}/api/blog-cat/${category}`;
    } else if (tag) {
      url = `${process.env.NEXT_PUBLIC_APP_URL}/api/blog-tag/${tag}`;
    } else {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (show) params.append('show', show);
      url = `${process.env.NEXT_PUBLIC_APP_URL}/api/blog?${params}`;
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to fetch blog posts',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}