import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return new NextResponse('Missing code', { status: 400 });

  const { data } = await axios.post(
    'https://launchpad.37signals.com/authorization/token',
    {
      type: 'web_server',
      client_id: process.env.BASECAMP_CLIENT_ID,
      client_secret: process.env.BASECAMP_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      code,
    },
    { headers: { 'Content-Type': 'application/json' } },
  );

  const res = new NextResponse('Auth OK — close this tab.');
  res.cookies.set('bc_token', JSON.stringify(data), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}