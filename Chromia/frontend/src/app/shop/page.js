// src/app/shop/page.js
//--------------------------------------------------------------
// Server Component (App Router – Next 13/14)
// 📌 Obtiene la lista de productos desde la API y la pasa a
//     ShopClient, que se encarga del render y de los botones.
//--------------------------------------------------------------

import ShopClient from './ShopClient.jsx';

// Opcional: fuerzan refetch y evitan caché en dev
export const dynamic     = 'force-dynamic';
export const fetchCache  = 'force-no-store';

export default async function ShopPage() {
  // 1) Traer productos desde tu API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/productos`,
    { next: { revalidate: 0 } }           // ⚡ sin caché
  );

  if (!res.ok) {
    throw new Error('Error al obtener productos desde la API');
  }

  const productos = await res.json();

  // 2) Renderizar el Client Component con los datos
  return <ShopClient productos={productos} />;
}
