// frontend/app/cart/page.jsx
'use client';
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../../context/CartContext.jsx";   // ← 3 subidas
import { toast } from 'react-hot-toast';


export default function CartPage() {
  const { items, fetchCart, add, update, remove } = useCart();

  useEffect(() => { if (items.length === 0) fetchCart(); }, []);

const subtotal = items.reduce(
  (s, it) => s + it.cantidad * (it.producto?.precio ?? 0),
  0
);

const handleBuyAll = async () => {
  const token = localStorage.getItem('token');
  if (!token || items.length === 0) return;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/checkout/buy-now`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productos: items.map((it) => ({
          idProducto: it.producto.idProducto,
          cantidad: it.cantidad,
        })),
      }),
    }
  );

const { url } = await res.json();
if (!url) {
  toast.error("Error al generar la sesión de pago.");
  return;
}
window.location.href = url;

};


  return (
    <main className="px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8 bg-gray-50">
      <div className="layout-content-container flex flex-col w-full max-w-screen-lg">
        {/* Breadcrumb */}
        <div className="flex flex-wrap gap-2 p-4 items-center">
          <a
            href="/"
            className="text-gray-500 hover:text-[#2A669F] text-sm font-medium leading-normal"
          >
            Home
          </a>
          <svg
            className="text-gray-400"
            fill="none"
            height="16"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
          <span className="text-gray-800 text-sm font-semibold leading-normal">
            Carrito de Compras
          </span>
        </div>

        {/* Título y botón “Continue Shopping” */}
        <div className="flex flex-wrap justify-between items-center gap-4 p-4">
          <h1 className="text-gray-900 tracking-tight text-3xl font-bold leading-tight min-w-72">
            Tu Carrito
          </h1>
          <a
            href="/shop"
            className="text-sm text-gray-600 hover:text-[#2A669F] font-medium"
          >
            Continue Comprando
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-4">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center px-6 py-3 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Product</span>
            <span className="text-center">Cantidad</span>
            <span className="text-right">Precio</span>
            <span></span>
          </div>

{items.length === 0 ? (
  <p className="px-6 py-10 text-center text-gray-500">Tu carrito está vacío.</p>
) : (
  items.map((it) => (
    <div
      key={it.idDetalle}
      className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[2fr_1fr_1fr_auto] items-center gap-4 px-6 py-5 border-b border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4 col-span-1 md:col-span-1">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-md size-16 border border-gray-200"
          style={{
            backgroundImage: `url("${it.producto.imagenUrl}")`,
          }}
        ></div>
        <div className="flex flex-col">
          <p className="text-gray-800 text-base font-semibold line-clamp-1">
            {it.producto.nombre}
          </p>
          <p className="md:hidden text-gray-700 text-sm font-medium mt-1">
            ${it.producto.precio.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Cantidad + - */}
      <div className="flex items-center justify-center gap-2 text-gray-800">
        <button
          onClick={() => update(it.producto.idProducto, it.cantidad - 1)}
          disabled={it.cantidad <= 1}
          className="text-lg font-medium h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
        >
          -
        </button>
        <input
          className="number-input text-base font-medium w-10 text-center bg-transparent border-0"
          type="number"
          readOnly
          value={it.cantidad}
        />
        <button
          onClick={() => update(it.producto.idProducto, it.cantidad + 1)}
          className="text-lg font-medium h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
        >
          +
        </button>
      </div>

      {/* Precio total */}
      <p className="hidden md:block text-gray-800 text-base font-medium text-right">
        ${(it.producto.precio * it.cantidad).toFixed(2)}
      </p>

      {/* Botón eliminar */}
      <button
        onClick={() => remove(it.producto.idProducto)}
        className="text-gray-500 hover:text-red-600 transition-colors justify-self-end md:justify-self-center"
        title="Eliminar del carrito"
      >
        <svg
          fill="currentColor"
          height="20"
          viewBox="0 0 256 256"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
        </svg>
      </button>
    </div>
  ))
)}


        </div>

        {/* ---------- Order Summary ---------- */}
        <div className="mt-8 self-end w-full md:max-w-md">
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-gray-800 text-xl font-semibold leading-tight tracking-[-0.015em] mb-6">
      Order Summary
    </h3>

    <div className="space-y-3 text-sm">
      <div className="flex justify-between gap-x-6">
        <p className="text-gray-600">Subtotal</p>
        <p className="text-gray-800 font-medium text-right">
          ${subtotal.toFixed(2)}
        </p>
      </div>
      <div className="flex justify-between gap-x-6">
        <p className="text-gray-600">Shipping</p>
        <p className="text-gray-800 font-medium text-right">Free</p>
      </div>
      <div className="flex justify-between gap-x-6">
        <p className="text-gray-600">Taxes (Est.)</p>
        <p className="text-gray-800 font-medium text-right">
          ${(subtotal * 0.10).toFixed(2)}
        </p>
      </div>

      <hr className="my-4 border-gray-200" />

      <div className="flex justify-between gap-x-6 text-base">
        <p className="text-gray-800 font-semibold">Total</p>
        <p className="text-gray-900 text-lg font-bold text-right">
          ${(subtotal * 1.10).toFixed(2)}
        </p>
      </div>
    </div>

    <button className="w-full mt-8 flex items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#2A669F] hover:bg-[#235682] text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors duration-150" onClick={handleBuyAll}>
      <span className="truncate">Proceed to Checkout</span>
    </button>
  </div>
</div>

      </div>
    </main>
  );
}
