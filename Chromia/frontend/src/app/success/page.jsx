export default function SuccessPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-10 bg-white text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">¡Gracias por tu compra!</h1>
      <p className="text-gray-700 text-lg mb-6">
        El pago fue exitoso. Recibirás una confirmación por correo.
      </p>
      <a
        href="/shop"
        className="inline-block mt-4 px-6 py-3 bg-[#2A669F] text-white font-semibold rounded-lg shadow-md hover:bg-[#235682]"
      >
        Volver a la tienda
      </a>
    </main>
  );
}
