"use client";
import { useRouter } from "next/navigation";
import ProductForm from "../ProductForm";

export default function CreateProductPage() {
  const router = useRouter();
  const api    = process.env.NEXT_PUBLIC_API_URL;
  const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function handleCreate(body) {
    const res = await fetch(`${api}/api/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return alert("Error al crear");
    alert("Producto creado con éxito");
    router.push("/admin/products");
  }

  return (
    <main className="py-10 px-4">
      <ProductForm title="Agregar nuevo producto" onSubmit={handleCreate} />
    </main>
  );
}
