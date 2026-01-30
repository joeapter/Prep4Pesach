import { cookies } from 'next/headers';

export function createSupabaseCookieMethods() {
  return {
    getAll: async () => {
      const cookieStore = await cookies();
      return cookieStore.getAll().map((cookie) => ({
        name: cookie.name,
        value: cookie.value ?? ''
      }));
    },
    setAll: async (cookiesToSet: Array<{ name: string; value: string; options?: Record<string, any> }>) => {
      try {
        const cookieStore = await cookies();
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set({ name, value, ...(options ?? {}) });
        });
      } catch {
        // Ignore when cookies cannot be set in a server component context.
      }
    }
  };
}
