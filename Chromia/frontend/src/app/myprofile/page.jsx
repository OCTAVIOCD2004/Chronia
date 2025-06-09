// frontend/app/myprofile/page.jsx
"use client";

import { useEffect, useState } from "react";
import ThreeBackground from "../../../components/ThreeBackground";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function MyProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);

  // ── Cargar datos de /me al montar ─────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setProfile(data));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/auth");
  };

  if (!profile) return null; // puede mostrar spinner

  return (
    <>
      <ThreeBackground />
      <main className="relative z-10 flex flex-1 flex-col px-10 lg:px-20 xl:px-40 py-10 items-center">
        <h1 className="text-4xl font-bold text-slate-300 mb-8 w-full max-w-7xl">My Profile</h1>

        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ────────── Side nav ────────── */}
          <nav className="md:col-span-1">
            <ul className="space-y-2">
              <li>
                <span className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-50 bg-blue-600">
                  Personal Information
                </span>
              </li>
              <li>
                <span className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500/60 cursor-not-allowed select-none">
                  Order History
                </span>
              </li>
              <li>
                <span className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500/60 cursor-not-allowed select-none">
                  Saved Payment Methods
                </span>
              </li>
              <li>
                <span className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500/60 cursor-not-allowed select-none">
                  Security
                </span>
              </li>
            </ul>
          </nav>

          {/* ────────── Card ────────── */}
          <section className="md:col-span-2 bg-slate-800/95 text-slate-50 p-6 sm:p-8 rounded-xl shadow-lg backdrop-blur">
            <h3 className="text-2xl font-semibold mb-8 text-center md:text-left">Personal Information</h3>

            {/* Datos personales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-10">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
                <input
                  type="text"
                  value={profile.nombre}
                  readOnly
                  disabled
                  className="pointer-events-none w-full rounded-lg bg-slate-100 text-slate-800 border-none py-3 px-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={profile.correo}
                  readOnly
                  disabled
                  className="pointer-events-none w-full rounded-lg bg-slate-100 text-slate-800 border-none py-3 px-4"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={profile.telefono}
                  readOnly
                  disabled
                  className="pointer-events-none w-full rounded-lg bg-slate-100 text-slate-800 border-none py-3 px-4"
                />
              </div>
            </div>

            {/* Dirección */}
            <h3 className="text-xl font-semibold mb-6">Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-10">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Street</label>
                <input
                  type="text"
                  value={profile.calle}
                  readOnly
                  disabled
                  className="pointer-events-none w-full rounded-lg bg-slate-100 text-slate-800 border-none py-3 px-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Number</label>
                <input
                  type="text"
                  value={profile.numero}
                  readOnly
                  disabled
                  className="pointer-events-none w-full rounded-lg bg-slate-100 text-slate-800 border-none py-3 px-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Neighborhood</label>
                <input
                  type="text"
                  value={profile.colonia}
                  readOnly
                  disabled
                  className="pointer-events-none w-full rounded-lg bg-slate-100 text-slate-800 border-none py-3 px-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Postal Code</label>
                <input
                  type="text"
                  value={profile.codigoPostal}
                  readOnly
                  disabled
                  className="pointer-events-none w-full rounded-lg bg-slate-100 text-slate-800 border-none py-3 px-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">City</label>
                <input
                  type="text"
                  value={profile.ciudad}
                  readOnly
                  disabled
                  className="pointer-events-none w-full rounded-lg bg-slate-100 text-slate-800 border-none py-3 px-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">State</label>
                <input
                  type="text"
                  value={profile.estado}
                  readOnly
                  disabled
                  className="pointer-events-none w-full rounded-lg bg-slate-100 text-slate-800 border-none py-3 px-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Country</label>
                <input
                  type="text"
                  value={profile.pais}
                  readOnly
                  disabled
                  className="pointer-events-none w-full rounded-lg bg-slate-100 text-slate-800 border-none py-3 px-4"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Reference</label>
                <input
                  type="text"
                  value={profile.referencia || "—"}
                  readOnly
                  disabled
                  className="pointer-events-none w-full rounded-lg bg-slate-100 text-slate-800 border-none py-3 px-4"
                />
              </div>
            </div>

            {/* Detalles de cuenta */}
            <h3 className="text-xl font-semibold mb-4">Account Details</h3>
            <p className="text-sm text-slate-300 mb-10">
              Account created on: {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-700 pt-6">
              <button
                disabled
                className="cursor-not-allowed flex min-w-[120px] items-center justify-center rounded-lg h-11 px-6 bg-blue-600 text-slate-50 text-sm font-semibold shadow-sm opacity-60"
              >
                Update Information
              </button>
              <button
                disabled
                className="cursor-not-allowed flex min-w-[120px] items-center justify-center rounded-lg h-11 px-6 bg-slate-100 text-slate-600 text-sm font-semibold shadow-sm opacity-60"
              >
                Change Password
              </button>
              <div className="flex-1"></div>
              <button
                onClick={handleLogout}
                className="flex min-w-[84px] items-center justify-center rounded-lg h-11 px-6 bg-red-600 text-slate-50 text-sm font-semibold shadow-sm hover:bg-red-700 transition"
              >
                Log out
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
