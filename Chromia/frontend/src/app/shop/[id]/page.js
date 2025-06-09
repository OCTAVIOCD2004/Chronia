import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient.jsx";

export default async function ProductDetailPage({ params }) {
  const id = await params.id; // ✅ solo si params es async                    // 💡 aviso desaparece con dynamic
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/productos/${id}`,
    { next: { revalidate: 0 } }
  );
  if (res.status === 404) return notFound();
  if (!res.ok) throw new Error("Error al obtener el producto");

  const prod = await res.json();
  return <ProductDetailClient prod={prod} />; // toda la lógica de cliente ahí
}


