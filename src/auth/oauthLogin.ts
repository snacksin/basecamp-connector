import { NextResponse } from 'next/server';

export async function GET() {
  const url = new URL('https://launchpad.37signals.com/authorization/new');
  url.searchParams.set('type', 'web_server');
  url.searchParams.set('client_id', process.env.BASECAMP_CLIENT_ID!);
  url.searchParams.set('redirect_uri', process.env.REDIRECT_URI!);
  url.searchParams.set('state', crypto.randomUUID());

  return NextResponse.redirect(url.toString());
}