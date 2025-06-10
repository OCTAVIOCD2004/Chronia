'use client';

import { useEffect, useState } from 'react';
import Link                   from 'next/link';
import UserAvatar             from './UserAvatar';

/* utilidad para clases de links */
const NavLink = ({ href, children }) => (
  <Link
    href={href}
    className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
  >
    {children}
  </Link>
);

export default function MainHeader() {
  const [isAdmin, setIsAdmin] = useState(false);

  /* Detectar rol del usuario guardado en localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem('usuario');
      const user = raw ? JSON.parse(raw) : null;
      setIsAdmin(user?.rol === 'admin');
    } catch {/* noop */}
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-slate-200 px-10 py-4 bg-white shadow-sm">
      {/* ---------- Logo + navegación ---------- */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3 text-slate-900">
          <div className="text-blue-600 text-2xl">
            <svg fill="none" viewBox="0 0 48 48">
              <path d="M24 18.423 42 11.475V34.366a.85.85 0 0 1-.64.933L24 42V18.423Z" fill="currentColor" />
              <path d="M24 8.188 33.412 11.574 24 15.207 14.588 11.574 24 8.188Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight">ColorCraft</h2>
        </div>

        <nav className="flex items-center gap-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/shop">Shop</NavLink>
          <NavLink href="/inspiration">Inspiration</NavLink>
          <NavLink href="/services">Services</NavLink>
          <NavLink href="/find-a-store">Find a Store</NavLink>
        </nav>
      </div>

      {/* ---------- Zona derecha ---------- */}
      <div className="flex flex-1 justify-end gap-4">
        {/* --- Buscador --- */}
        <label className="flex min-w-48 max-w-xs h-10">
          <div className="flex w-full flex-1 items-stretch rounded-lg">
            <div className="flex items-center justify-center border border-slate-300 bg-slate-50 pl-3 rounded-l-lg border-r-0 text-slate-500">
              {/* lupa */}
              <svg fill="currentColor" width="20" height="20" viewBox="0 0 256 256">
                <path d="M229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32ZM40 112a72 72 0 1 1 72 72 72.08 72.08 0 0 1-72-72Z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar Productos..."
              className="form-input flex-1 border border-slate-300 border-l-0 rounded-r-lg bg-slate-50 px-3 text-sm placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </label>

        {/* --- Wishlist/Heart --- */}
        <button className="h-10 px-3 flex items-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
          <svg fill="currentColor" width="20" height="20" viewBox="0 0 256 256" className="text-slate-500">
            <path d="M178 32c-20.65 0-38.73 8.88-50 23.89C116.73 40.88 98.65 32 78 32A62.07 62.07 0 0 0 16 94c0 70 103.79 126.66 108.21 129a8 8 0 0 0 7.58 0C136.21 220.66 240 164 240 94A62.07 62.07 0 0 0 178 32Z" />
          </svg>
        </button>

        {/* --- Cart --- */}
        <Link
          href="/cart"
          className="relative h-10 px-3 flex items-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <svg fill="currentColor" width="20" height="20" viewBox="0 0 256 256" className="text-slate-500">
            <path d="M216 40H40A16 16 0 0 0 24 56v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Zm0 160H40V56h176v144Zm-40-112a48 48 0 0 1-96 0 8 8 0 0 1 16 0 32 32 0 0 0 64 0 8 8 0 0 1 16 0Z" />
          </svg>
          <span className="absolute -top-1 -right-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-semibold text-white">
            Cart
          </span>
        </Link>

        {/* --- Botón Crear producto para Admin --- */}
        {isAdmin && (
          <Link
            href="/admin/create-product"
            className="h-10 px-4 flex items-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            Crear producto
          </Link>
        )}

        {/* --- Avatar / Login --- */}
        <UserAvatar />
      </div>
    </header>
  );
}
