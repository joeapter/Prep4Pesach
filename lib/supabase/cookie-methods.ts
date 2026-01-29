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
    setAll: async () => {
      // Not used by the current helpers.
    }
  };
}
