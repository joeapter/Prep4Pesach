"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    await supabaseClient.auth.signOut();
    setLoading(false);
    router.push("/login");
  };

  return (
    <button
      className="mt-3 w-full rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-200"
      type="button"
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
