'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../../context/CartContext.jsx';
import { toast } from 'react-hot-toast';

export default function ProductDetailClient({ prod }) {
const { items, fetchCart, add, update, remove } = useCart();
  const router  = useRouter();
  

  /* ---------- handlers ---------- */
  const handleAdd = async () => {
    await add(prod.idProducto, 1);
    toast.success('Producto añadido al carrito 🛒');
  };

  const handleBuyNow = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("Necesitas iniciar sesión");
    return;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/checkout/buy-now`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productos: [
          {
            idProducto: prod.idProducto,
            cantidad: 1,
          },
        ],
      }),
    }
  );

  const { url } = await res.json();
  if (!url) {
    toast.error("Error al generar la sesión de pago");
    return;
  }

  window.location.href = url;
};


  /* ---------- imagen segura ---------- */
  const imagenSrc = Array.isArray(prod.imagenUrl)
    ? prod.imagenUrl[0]
    : prod.imagenUrl || '/placeholder-no-image.png';

  /* ---------- UI ---------- */
  return (
    <main className="px-40 flex flex-1 justify-center py-8 bg-gray-50">
      <div className="layout-content-container flex flex-col max-w-5xl flex-1">

        {/* breadcrumbs */}
        <div className="flex flex-wrap gap-2 p-4 text-sm text-gray-600">
          <a className="hover:text-[#d2e2f3] hover:underline" href="/">Home</a>
          <span>/</span>
          <a
            className="hover:text-[#d2e2f3] hover:underline"
            href={`/shop?category=${encodeURIComponent(prod.idCategoria)}`}
          >
            {prod.nombreCategoria}
          </a>
          <span>/</span>
          <span className="text-gray-800 font-medium">{prod.nombre}</span>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-4">
          {/* imagen */}
          <div className="relative w-full aspect-[4/3] rounded-xl shadow-lg overflow-hidden">
            <Image
              src={imagenSrc}
              alt={prod.nombre}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>

          {/* detalles */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{prod.nombre}</h1>
            <p className="text-lg text-gray-700 mb-6">{prod.descripcion}</p>

            {/* opcionales … Size & Finish omitidos por brevedad */}

            {/* precio + stock */}
            <div className="flex items-center mb-6">
              <p className="text-3xl font-bold mr-4">${prod.precio.toFixed(2)}</p>
              <span className="text-green-600 font-semibold">In Stock</span>
            </div>

            {/* botones */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAdd}
                className="flex-1 h-12 rounded-full px-6 bg-[#d2e2f3] hover:bg-[#b0cdee] font-semibold shadow-sm"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 h-12 rounded-full px-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold shadow-sm"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
