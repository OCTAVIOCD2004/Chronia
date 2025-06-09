/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  // … cualquier otra configuración que ya tengas
  images: {
    // Opción A: lista manual de hostnames “permitidos”
    domains: [
      "imgs.search.brave.com",
      // añade aquí otros dominios que tu API pudiera devolver, p.ej.:
      // "example.com",
      // "cdn.misitio.com"
    ],

    // Opción B: en Next 13.5+ también puedes usar remotePatterns si
    // necesitas mayor flexibilidad (p. ej. permitir subdirectorios, http/https, etc.)
    //
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "imgs.search.brave.com",
    //     port: "",
    //     pathname: "/**", // permite cualquier ruta dentro de ese host
    //   },
    //   // { protocol: "https", hostname: "otro-host.com", pathname: "/images/**" },
    // ],
  },
};

export default nextConfig;
