import { cookies } from 'next/headers';
import { createServerActionClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export const createServerClient = () =>
  createServerComponentClient({
    cookies
  });

export const createServerActionSupabase = () =>
  createServerActionClient({
    cookies
  });
