// src/app/shop/ShopClient.jsx
'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from '../../../context/CartContext.jsx';
import ShopFilters from './ShopFilters';

export default function ShopClient({ productos }) {
  /* ---------- estado ---------- */
  const { add } = useCart();
  const [filters, setFilters]       = useState({ type: [], brand: [], finish: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  /* ---------- helpers ---------- */
  const handleAddToCart = async (id) => {
    await add(id, 1);
    toast.success('Producto añadido al carrito 🛒');
  };

  /* ---------- filtros ---------- */
  const filtered = useMemo(() => {
    return productos.filter((p) => {
      const matchType   = !filters.type.length   || filters.type.includes(p.tipo);
      const matchBrand  = !filters.brand.length  || filters.brand.includes(p.marca);
      const matchFinish = !filters.finish.length || filters.finish.includes(p.acabado);
      return matchType && matchBrand && matchFinish;
    });
  }, [productos, filters]);

  /* ---------- paginación ---------- */
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // Al cambiar filtros volvemos a la página 1
  useEffect(() => setCurrentPage(1), [filters]);

  /* ---------- UI ---------- */
  return (
    <main className="px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8 bg-base-200">
      <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">
        {/* ---------- encabezado ---------- */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-4">
          <h2 className="text-neutral text-4xl font-bold leading-tight">Shop All Paints</h2>

          {/* (selector de orden – todavía sin lógica) */}
          <div className="flex items-center gap-2">
            <span className="text-neutral/70 text-sm">Sort by:</span>
            <select className="form-select rounded-lg border-base-300 bg-base-100 py-2 pl-3 pr-8 text-sm font-medium text-neutral focus:border-primary focus:ring-1 focus:ring-primary">
              <option>Most Popular</option>
              <option>Newest Arrivals</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ---------- filtros ---------- */}
          <ShopFilters filters={filters} setFilters={setFilters} />

          {/* ---------- grid de productos ---------- */}
          <section className="lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 p-4 bg-base-100 rounded-xl shadow-sm">
              {paginated.length === 0 ? (
                <p className="col-span-full text-center text-neutral/70">
                  No hay productos disponibles.
                </p>
              ) : (
                paginated.map((prod) => (
                  <Link
                    key={prod.idProducto}
                    href={`/shop/${prod.idProducto}`}
                    className="block"
                  >
                    <div className="flex flex-col gap-3 pb-3 rounded-lg overflow-hidden border border-base-300 hover:shadow-lg transition-shadow">
                      {/* imagen */}
                      <div className="relative">
                        <div
                          className="w-full aspect-[4/3] bg-center bg-cover"
                          style={{ backgroundImage: `url("${prod.imagenUrl}")` }}
                        />
                        <button
                          onClick={(e) => e.preventDefault()}
                          className="absolute top-3 right-3 p-1.5 bg-base-100/80 rounded-full text-neutral hover:bg-primary hover:text-primary-content transition-colors"
                        >
                          <svg fill="currentColor" height="20" width="20" viewBox="0 0 256 256">
                            <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32Z" />
                          </svg>
                        </button>
                      </div>

                      {/* texto */}
                      <div className="px-4">
                        <h3 className="text-neutral text-base font-semibold mb-1">
                          {prod.nombre}
                        </h3>
                        <p className="text-neutral/70 text-sm mb-2">{prod.descripcion}</p>
                        <p className="text-primary text-lg font-bold">${prod.precio.toFixed(2)}</p>
                      </div>

                      {/* botón */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(prod.idProducto);
                        }}
                        className="mx-4 mt-2 mb-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-content hover:bg-opacity-90 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* ---------- paginación ---------- */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center p-6 mt-6 flex-wrap gap-1">
                {/* anterior */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-link flex size-9 items-center justify-center rounded-lg text-neutral hover:text-primary disabled:opacity-30"
                >
                  <svg fill="currentColor" height="20" width="20" viewBox="0 0 256 256">
                    <path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,1,1,17,17L95.51,128Z" />
                  </svg>
                </button>

                {/* números */}
                {[...Array(totalPages)].map((_, idx) => {
                  const page = idx + 1;
                  return (
                    <button
                      key={`page-${page}`}
                      onClick={() => setCurrentPage(page)}
                      className={`pagination-link flex size-9 items-center justify-center rounded-lg text-sm font-medium ${
                        currentPage === page ? 'pagination-link-active' : 'text-neutral'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* siguiente */}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-link flex size-9 items-center justify-center rounded-lg text-neutral hover:text-primary disabled:opacity-30"
                >
                  <svg fill="currentColor" height="20" width="20" viewBox="0 0 256 256">
                    <path d="M87.51,55.51a12,12,0,0,1,17-17l80,80a12,12,0,0,1,0,17l-80,80a12,12,0,1,1-17-17L159.51,128Z" />
                  </svg>
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
