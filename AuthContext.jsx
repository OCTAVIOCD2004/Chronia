"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);  // { idUsuario, nombre, correo, rol? }
  const [loading, setLoading] = useState(true);

  // Al montar el provider, intenta restaurar sesión
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUser(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Cierra sesión
// context/AuthContext.jsx
const logout = () => {
  // elimina el token almacenado
  localStorage.removeItem("token");

  // limpia el estado global de usuario
  setUser(null);

  // redirige al inicio
  window.location.href = "/";
};


  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
