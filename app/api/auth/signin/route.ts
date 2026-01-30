import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { supabaseService } from '@/lib/supabase/service';

type SigninBody = {
  email: string;
  password: string;
};

export async function POST(req: Request) {
  let body: SigninBody | null = null;
  try {
    const raw = await req.text();
    body = raw ? (JSON.parse(raw) as SigninBody) : null;
  } catch {
    body = null;
  }

  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password
  });

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message ?? 'Unable to sign in.' }, { status: 400 });
  }

  const { data: profile } = await supabaseService
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  return NextResponse.json({ role: profile?.role ?? 'client' });
}
