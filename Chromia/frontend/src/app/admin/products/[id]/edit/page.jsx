"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "../../../ProductForm";

export default function EditProductPage() {
  /* 1 ── id seguro vía hook */
  const { id } = useParams();                 // string | undefined
  const router  = useRouter();
  const api     = process.env.NEXT_PUBLIC_API_URL;
  const [data, setData] = useState(null);

  /* 2 ── carga del producto */
  useEffect(() => {
    if (!id) return;                          // aún no llega el parámetro
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

    fetch(`${api}/api/productos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => alert("No se encontró el producto"));
  }, [id, api]);

  /* 3 ── update */
  async function handleUpdate(body) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${api}/api/productos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return alert("Error al actualizar");
    alert("Cambios guardados ✓");
    router.push("/admin/products");
  }

  /* 4 ── render */
  return (
    <main className="py-10 px-4">
      {data ? (
        <ProductForm
          title="Editar producto"
          initialData={data}
          onSubmit={handleUpdate}
        />
      ) : (
        <p className="text-center">Cargando…</p>
      )}
    </main>
  );
}


