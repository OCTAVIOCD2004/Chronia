// frontend/components/UserAvatar.jsx
"use client";
 import { useEffect, useState } from "react";
 import Link from "next/link";   // <--- Importación obligatoria
 import { useAuth } from "../context/AuthContext.jsx"; // Asegúrate de que la ruta sea correcta

export default function UserAvatar() {
  const { user, setUser, loading } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!user) return;
    const fetchAvatar = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${apiUrl}/api/usuarios/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("No autorizado");
        const data = await res.json();
        setAvatarUrl(data.avatarUrl || "");
      } catch (err) {
        console.error("Error al cargar avatar:", err);
      }
    };
    fetchAvatar();
  }, [apiUrl]);

  if (loading) return null;
  if (!user) {
    return (
      <Link href="/auth" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-sm font-medium leading-normal">
        <span>Sign In</span>
      </Link>
    );
  }

  // Hay sesión
  return (
    <Link href="/myprofile">
      <div
        className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-blue-500 hover:scale-105 transition-all"
        style={{ backgroundImage: `url("${avatarUrl || "https://ui-avatars.com/api/?name=U"}")` }}
      />
    </Link>
  );
}
