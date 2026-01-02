import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const API_KEY = process.env.WORLDNEWS_API_KEY;
    
    if (!API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch(
      `https://api.worldnewsapi.com/search-news?` +
      `language=es&` +
      `source-countries=mx,ar,co&` +
      `number=15&` +
      `api-key=${API_KEY}`,
      { cache: 'no-store' }
    );

    const data = await response.json();

    if (!data.news) {
      return NextResponse.json({ articles: [] });
    }

    const articles = data.news.map((article: any) => ({
      id: article.id, // IMPORTANT: Keep the ID
      title: article.title,
      description: article.summary || article.text?.substring(0, 200) || "",
      content: "", // Empty for now
      url: article.url,
      source: article.source || "Unknown",
      publishedAt: article.publish_date,
      country: article.source_country || 'es'
    }));

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}