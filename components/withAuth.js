import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function withAuth(Component) {
  return function ProtectedComponent(props) {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const router = useRouter();

    useEffect(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          router.push("/login");
        } else {
          setSession(data.session);
        }
        setLoading(false);
      });

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    }, [router]);

    if (loading) return <p>Cargando...</p>;
    if (!session) return null;
    return <Component {...props} />;
  };
}
