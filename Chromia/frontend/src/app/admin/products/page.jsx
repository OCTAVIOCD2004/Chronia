// src/app/admin/products/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";

export default function ProductsManagement() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const api = process.env.NEXT_PUBLIC_API_URL;

  /* ───────── estado ───────── */
  const [rows,   setRows]   = useState([]);
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);
  const ROWS_PER_PAGE = 8;

  /* ───────── proteger ruta ───────── */
  useEffect(() => {
    if (!loading && (!user || user.rol !== "admin")) router.push("/auth");
  }, [user, loading]);

  /* ───────── traer productos ───────── */
  useEffect(() => {
    if (!user) return;
    fetch(`${api}/api/productos`)
      .then((r) => r.json())
      .then(setRows);
  }, [user]);

  /* ───────── eliminar ───────── */
  async function handleDelete(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    const res = await fetch(`${api}/api/productos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) return alert("Error al eliminar");
    setRows((r) => r.filter((p) => p.idProducto !== id));
  }

  /* ───────── filtrado + paginado ───────── */
  const filtered = rows.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );
  const lastPage = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paged    = filtered.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  /* ───────── UI ───────── */
  return (
    <main className="px-8 sm:px-16 md:px-24 lg:px-40 py-8">
      <div className="mx-auto max-w-6xl flex flex-col gap-8">
        {/* encabezado */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-gray-900 text-3xl font-bold">Product Management</h1>
            <p className="text-gray-600">Manage your product catalog.</p>
          </div>

          <button
            onClick={() => router.push("/admin/create-product")}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <span className="material-icons text-lg">add</span>
            Add Product
          </button>
        </div>

        {/* búsqueda */}
        <div className="relative w-full sm:max-w-md">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            className="form-input w-full rounded-lg border-gray-300 py-2.5 pl-10 pr-4 text-sm"
            placeholder="Search products…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // volver a página 1 al filtrar
            }}
          />
        </div>

        {/* tabla */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3.5 text-left">Product</th>
                <th className="px-6 py-3.5 text-left">Price</th>
                <th className="px-6 py-3.5 text-left">Category</th>
                <th className="px-6 py-3.5 text-left">Stock</th>
                <th className="px-6 py-3.5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paged.map((p) => (
                <tr key={p.idProducto} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {p.nombre}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    ${p.precio}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {p.idCategoria}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {p.stock ?? "--"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                    <div className="flex justify-center gap-4">
                      {/* EDIT */}
                      <button
                        onClick={() =>
                          router.push(`/admin/products/${p.idProducto}/edit`)
                        }
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span className="material-icons text-base">edit</span>
                        <span>Edit</span>
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(p.idProducto)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <span className="material-icons text-base">delete</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* paginación */}
        {filtered.length > ROWS_PER_PAGE && (
          <div className="flex items-center justify-between pt-6">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {(page - 1) * ROWS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(page * ROWS_PER_PAGE, filtered.length)}
              </span>{" "}
              of <span className="font-semibold">{filtered.length}</span> results
            </p>

            <nav className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium
                           text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <span className="material-icons text-lg">chevron_left</span>
              </button>

              {[...Array(lastPage).keys()].map((i) => {
                const n = i + 1;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium
                      ${
                        n === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      }`}
                  >
                    {n}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page === lastPage}
                className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium
                           text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <span className="material-icons text-lg">chevron_right</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </main>
  );
}
