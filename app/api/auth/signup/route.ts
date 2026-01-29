import { NextResponse } from 'next/server';
import { supabaseService, supabaseServiceReady } from '@/lib/supabase/service';

type SignupBody = {
  full_name: string;
  email: string;
  password: string;
  phone?: string | null;
};

export async function POST(req: Request) {
  let body: SignupBody | null = null;
  try {
    const raw = await req.text();
    body = raw ? (JSON.parse(raw) as SignupBody) : null;
  } catch {
    body = null;
  }
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!supabaseServiceReady) {
    return NextResponse.json({ error: 'Server not configured.' }, { status: 500 });
  }

  if (!body.email || !body.password || !body.full_name) {
    return NextResponse.json({ error: 'Full name, email, and password are required.' }, { status: 400 });
  }

  const { data: userData, error: authError } = await supabaseService.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
    user_metadata: {
      full_name: body.full_name
    }
  });

  if (authError || !userData.user) {
    return NextResponse.json({ error: authError?.message ?? 'Unable to create account.' }, { status: 400 });
  }

  const userId = userData.user.id;

  const phone = body.phone && body.phone.trim() ? body.phone.trim() : null;

  const { error: profileError } = await supabaseService.from('profiles').insert({
    id: userId,
    role: 'client',
    full_name: body.full_name,
    phone
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  const { error: clientError } = await supabaseService.from('clients').insert({
    profile_id: userId,
    email: body.email,
    address_text: '',
    notes: ''
  });

  if (clientError) {
    return NextResponse.json({ error: clientError.message }, { status: 400 });
  }

  return NextResponse.json({ created: true });
}
