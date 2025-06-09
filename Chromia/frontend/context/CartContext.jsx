// frontend/context/CartContext.jsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const api = process.env.NEXT_PUBLIC_API_URL;

/* Convierte la forma devuelta por la API → forma que usa el front */
const mapItems = (raw = []) =>
  raw.map((r) => ({
    idDetalle: r.idDetalleCarrito,
    cantidad:  r.cantidad,
    producto: {
      idProducto: r.idProducto,
      nombre:     r.nombreProducto,
      precio:     r.precioUnitario,
      imagenUrl:  r.imagenUrl,
    },
  }));

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  /* -------- GET -------- */
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res  = await fetch(`${api}/api/carrito`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { setItems([]); return; }

    const data = await res.json();
    setItems(mapItems(data.items));
  };

  /* -------- POST (+1) -------- */
  const add = async (idProducto, cantidad = 1) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${api}/api/carrito`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${token}`,
      },
      body: JSON.stringify({ idProducto, cantidad }),
    });
    if (!res.ok) return;

    const data = await res.json();
    setItems(mapItems(data.items));
  };

  /* -------- PUT (cambiar cantidad) -------- */
  const update = async (idProducto, cantidad) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${api}/api/carrito`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${token}`,
      },
      body: JSON.stringify({ idProducto, cantidad }),
    });
    if (!res.ok) return;

    const data = await res.json();
    setItems(mapItems(data.items));
  };

  /* -------- DELETE -------- */
  const remove = async (idProducto) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${api}/api/carrito/${idProducto}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;

    const data = await res.json();
    setItems(mapItems(data.items));
  };

  /* Cargar carrito al montar */
useEffect(() => {
  fetchCart();
}, []);


  return (
    <CartContext.Provider value={{ items, add, update, remove, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}
