// src/components/ClientHeader.jsx
"use client";

import Link           from "next/link";
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import UserAvatar  from './UserAvatar';          // ⬅️  ya lo tenías

export default function ClientHeader() {
  const { user, logout } = useAuth();
  const { items }        = useCart();
  const cartQty = items.reduce((t, i) => t + i.cantidad, 0);

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-10 py-4 shadow-sm">
      {/* --- Logo + navegación pública --- */}
      <div className="flex items-center gap-10">
        {/* logo */}
        <Link href="/" className="flex items-center gap-3 text-slate-900">
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 48 48" fill="currentColor">
            <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fillRule="evenodd"/>
            <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fillRule="evenodd"/>
          </svg>
          <span className="text-xl font-bold">Chromia</span>
        </Link>

        <nav className="flex items-center gap-8 text-sm font-medium">
          <Link href="/"            className="nav-link">Home</Link>
          <Link href="/shop"        className="nav-link">Catálogo</Link>

          {/* Enlace de gestión SOLO para administradores */}
          {user?.rol === "admin" && (
            <Link
              href="/admin/products"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Gestión&nbsp;Productos
            </Link>
          )}
        </nav>
      </div>

      {/* --- Search + iconos lado derecho --- */}
      <div className="flex items-center gap-4">
        {/* buscador */}
        <label className="relative hidden sm:block">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            type="text"
            placeholder="Search products..."
            className="form-input h-10 w-56 rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-3 text-sm placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {/* wishlist */}
        <button className="icon-btn">
          <span className="material-icons">favorite_border</span>
        </button>

        {/* carrito */}
        <Link href="/cart" className="icon-btn relative">
          <span className="material-icons">shopping_bag</span>
          {cartQty > 0 && (
            <span className="absolute -top-1 -right-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-semibold text-white">
              {cartQty}
            </span>
          )}
        </Link>

        {/* avatar / login */}
        {user ? (
          <UserAvatar onLogout={logout} />
        ) : (
          <Link href="/auth" className="text-blue-600 hover:text-blue-700">
            Iniciar&nbsp;sesión
          </Link>
        )}
      </div>
    </header>
  );
}

/* util: clase tailwind común */
const navLink = "text-slate-700 hover:text-blue-600 transition-colors";
