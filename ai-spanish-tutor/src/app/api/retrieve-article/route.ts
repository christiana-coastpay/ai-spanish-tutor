import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    const API_KEY = process.env.WORLDNEWS_API_KEY;
    
    const response = await fetch(
      `https://api.worldnewsapi.com/retrieve-news?ids=${id}&api-key=${API_KEY}`
    );

    const data = await response.json();
    const article = data.news?.[0];

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      content: article.text || article.summary || ""
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve article' }, { status: 500 });
  }
}