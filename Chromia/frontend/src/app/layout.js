// src/app/layout.js  (ROOT LAYOUT – Server Component)
import "./globals.css";
import { Toaster }      from "react-hot-toast";
import { AuthProvider } from "../../context/AuthContext.jsx";
import { CartProvider } from "../../context/CartContext.jsx";
import ClientHeader     from "../../components/ClientHeader.jsx";

export const metadata = {
  title:       "Chromia – Premium Paints",
  description: "Tu tienda de pinturas premium",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans:wght@400;500;700;900&family=Work+Sans:wght@400;500;700;900"
          precedence="default"
        />

        {/* Material Icons */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
          precedence="default"
        />

        <link rel="icon" href="/favicon.ico" />
      </head>

      {/* bg-base-100 y text-base-content = modo claro DaisyUI */}
      <body className="relative flex min-h-screen flex-col overflow-x-hidden bg-base-100 text-base-content">
        <AuthProvider>
          <CartProvider>
            <ClientHeader />
            {children}
          </CartProvider>
        </AuthProvider>

        {/* ---------- FOOTER ---------- */}
        <footer className="bg-slate-800 text-slate-300 py-12 px-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Chromia</h3>
              <p className="text-sm leading-relaxed">
                Your partner in finding the perfect color for every project.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-white mb-3">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    className="hover:text-blue-400 transition-colors"
                    href="#"
                  >
                    Interior Paints
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-blue-400 transition-colors"
                    href="#"
                  >
                    Exterior Paints
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-blue-400 transition-colors"
                    href="#"
                  >
                    Primers
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-blue-400 transition-colors"
                    href="#"
                  >
                    Supplies
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-white mb-3">
                Customer Service
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    className="hover:text-blue-400 transition-colors"
                    href="#"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-blue-400 transition-colors"
                    href="#"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-blue-400 transition-colors"
                    href="#"
                  >
                    Shipping &amp; Returns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-white mb-3">
                Connect With Us
              </h4>
              <div className="flex space-x-4">
                <a
                  className="text-slate-400 hover:text-white transition-colors"
                  href="#"
                >
                  {/* SVG Facebook */}
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      clipRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      fillRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  className="text-slate-400 hover:text-white transition-colors"
                  href="#"
                >
                  {/* SVG Instagram */}
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      clipRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.388 1.363.434 2.427.048 1.067.06 1.407.06 4.156 0 2.749-.012 3.09-.06 4.156-.046 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.388-2.427.434-1.067.048-1.407.06-4.156.06-2.749 0-3.09-.012-4.156-.06-1.064-.046-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.388-1.363-.434-2.427C2.013 15.407 2 15.067 2 12.315c0-2.749.012-3.09.06-4.156.046-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.388 2.427-.434C8.933 2.013 9.273 2 12.025 2h.29zm-1.043 3.863A4.102 4.102 0 008.138 10.03a4.102 4.102 0 004.102 4.102 4.102 4.102 0 004.102-4.102 4.102 4.102 0 00-4.102-4.102H11.272zm5.707-1.172a1.231 1.231 0 100-2.462 1.231 1.231 0 000 2.462zM12 7.818a4.211 4.211 0 100 8.422 4.211 4.211 0 000-8.422z"
                      fillRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  className="text-slate-400 hover:text-white transition-colors"
                  href="#"
                >
                  {/* SVG Twitter */}
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-700 pt-8 text-center text-sm">
            <p>© 2023 Chromia. All rights reserved.</p>
          </div>
        </footer>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

