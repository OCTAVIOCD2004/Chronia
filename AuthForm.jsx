// components/AuthForm.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext.jsx"; // Asegúrate de que la ruta sea correcta


export default function AuthForm() {
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // p.e. "http://localhost:4000"
const { setUser } = useAuth();   // <- ¡faltaba!

  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",  // ojo al confirm
    calle: "",
    numero: "",
    colonia: "",
    codigoPostal: "",
    ciudad: "",
    estado: "",
    pais: "",
    referencia: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleForm = () => {
    setIsRegister((prev) => !prev);
    setErrorMsg("");
    setFormData({
      nombre: "",
      correo: "",
      telefono: "",
      password: "",
      confirmPassword: "",
      calle: "",
      numero: "",
      colonia: "",
      codigoPostal: "",
      ciudad: "",
      estado: "",
      pais: "",
      referencia: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (isRegister) {
      // Validación básica antes de enviar:
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg("Las contraseñas no coinciden");
        return;
      }
      setLoading(true);

      try {
        // (A) Prepara el payload que espera tu backend:
        const payload = {
          nombre: formData.nombre,
          correo: formData.correo,
          telefono: formData.telefono,
          password: formData.password,   // Ver nota en sección 2.3
          calle: formData.calle,
          numero: formData.numero,
          colonia: formData.colonia,
          codigoPostal: formData.codigoPostal,
          ciudad: formData.ciudad,
          estado: formData.estado,
          pais: formData.pais,
          referencia: formData.referencia,
        };

        const res = await fetch(`${apiUrl}/api/usuarios/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          // Por ejemplo, status 409 “Ya existe un usuario con ese correo”
          throw new Error(data.message || "Error al registrar usuario");
        }

        // (B) Tu backend te devolvió { token, usuario: { idUsuario, nombre, correo } }
        const { token, usuario } = data;
        // Guárdalo en localStorage (o sessionStorage, o cookies, según prefieras)
        // Guarda y notifica al contexto
        localStorage.setItem("token", token);
        setUser(usuario);

        // (C) Redirige al home u otra vista:
        router.push("/");

      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // --- LOGIN ---
      setLoading(true);
      try {
        const payload = {
          correo: formData.correo,
          password: formData.password,
        };

        const res = await fetch(`${apiUrl}/api/usuarios/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Credenciales inválidas");
        }

        // El backend te devuelve { idUsuario, nombre, correo, token }
        const { token, idUsuario, nombre, correo } = data;
        localStorage.setItem("token", token);
        setUser({ idUsuario, nombre, correo });

        router.push("/");
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="layout-content-container flex flex-col w-full max-w-2xl bg-white p-6 md:p-10 rounded-xl shadow-lg">
      {/* 1) Cabecera */}
      <div className="mb-8 text-center">
        <h1 className="text-gray-800 text-3xl md:text-4xl font-bold leading-tight tracking-tight">
          {isRegister ? "Create an Account" : "Welcome back"}
        </h1>
        {isRegister ? (
          <p className="text-gray-600 mt-2 text-base">
            Fill in the details below to get started.
          </p>
        ) : (
          <p className="text-gray-600 mt-2 text-base">
            Login to continue to ColorCraft.
          </p>
        )}
      </div>

      {/* 2) Mensaje de error si existe */}
      {errorMsg && (
        <div className="mb-4 text-red-600 text-center font-medium">{errorMsg}</div>
      )}

      {/* 3) Formulario (Register o Login) */}
      {isRegister ? (
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
          onSubmit={handleSubmit}
        >
          {/* ── Full Name ── */}
          <div className="md:col-span-2">
            <label className="form-label" htmlFor="nombre">
              Full Name
            </label>
            <input
              className="form-input"
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Enter your full name"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── Email ── */}
          <div className="md:col-span-2">
            <label className="form-label" htmlFor="correo">
              Email Address
            </label>
            <input
              className="form-input"
              id="correo"
              name="correo"
              type="email"
              placeholder="Enter your email address"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── Phone ── */}
          <div className="md:col-span-2">
            <label className="form-label" htmlFor="telefono">
              Phone Number
            </label>
            <input
              className="form-input"
              id="telefono"
              name="telefono"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── Street ── */}
          <div>
            <label className="form-label" htmlFor="calle">
              Street
            </label>
            <input
              className="form-input"
              id="calle"
              name="calle"
              type="text"
              placeholder="Enter your street"
              value={formData.calle}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── Number ── */}
          <div>
            <label className="form-label" htmlFor="numero">
              Number
            </label>
            <input
              className="form-input"
              id="numero"
              name="numero"
              type="text"
              placeholder="Apt, suite, etc."
              value={formData.numero}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── Neighborhood ── */}
          <div>
            <label className="form-label" htmlFor="colonia">
              Neighborhood
            </label>
            <input
              className="form-input"
              id="colonia"
              name="colonia"
              type="text"
              placeholder="Enter your neighborhood"
              value={formData.colonia}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── Postal Code ── */}
          <div>
            <label className="form-label" htmlFor="codigoPostal">
              Postal Code
            </label>
            <input
              className="form-input"
              id="codigoPostal"
              name="codigoPostal"
              type="text"
              placeholder="Enter your postal code"
              value={formData.codigoPostal}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── City ── */}
          <div>
            <label className="form-label" htmlFor="ciudad">
              City
            </label>
            <input
              className="form-input"
              id="ciudad"
              name="ciudad"
              type="text"
              placeholder="Enter your city"
              value={formData.ciudad}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── State / Province ── */}
          <div>
            <label className="form-label" htmlFor="estado">
              State / Province
            </label>
            <input
              className="form-input"
              id="estado"
              name="estado"
              type="text"
              placeholder="Enter your state or province"
              value={formData.estado}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── Country (span 2 cols) ── */}
          <div className="md:col-span-2">
            <label className="form-label" htmlFor="pais">
              Country
            </label>
            <input
              className="form-input"
              id="pais"
              name="pais"
              type="text"
              placeholder="Enter your country"
              value={formData.pais}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── Reference (Optional) (span 2 cols) ── */}
          <div className="md:col-span-2">
            <label className="form-label" htmlFor="referencia">
              Reference (Optional)
            </label>
            <input
              className="form-input"
              id="referencia"
              name="referencia"
              type="text"
              placeholder="e.g., near the blue house"
              value={formData.referencia}
              onChange={handleChange}
            />
          </div>

          {/* ── Password (span 2 cols) ── */}
          <div className="md:col-span-2">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-input"
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── Confirm Password (span 2 cols) ── */}
          <div className="md:col-span-2">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="form-input"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── Checkbox “Terms” (span 2 cols) ── */}
          <div className="md:col-span-2 mt-2">
            <label className="flex items-center gap-x-2.5 py-2">
              <input
                className="h-5 w-5 rounded border-gray-300 text-[#5e92c9] 
                           checked:bg-[#5e92c9] checked:border-[#5e92c9] 
                           focus:ring-2 focus:ring-offset-1 focus:ring-[#5e92c9] 
                           focus:outline-none"
                type="checkbox"
                required
              />
              <p className="text-gray-700 text-sm font-normal leading-normal">
                I agree to the{" "}
                <a
                  className="font-medium text-[#5e92c9] hover:underline"
                  href="#"
                >
                  Terms of Service
                </a>
              </p>
            </label>
          </div>

          {/* ── Botón “Sign Up” (span 2 cols) ── */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full min-w-[84px] items-center justify-center 
                         rounded-full h-12 px-6 bg-[#5e92c9] hover:bg-opacity-90 
                         text-white text-base font-semibold leading-normal tracking-wide 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering…" : "Sign Up"}
            </button>
          </div>
        </form>
      ) : (
        // ─── Formulario login muy sencillo ───
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input name="remember" type="hidden" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label className="sr-only" htmlFor="correoLogin">
                Correo
              </label>
              <input
                id="correoLogin"
                name="correo"
                type="email"
                autoComplete="email"
                required
                value={formData.correo}
                onChange={handleChange}
                placeholder="Correo"
                className="form-input appearance-none relative block w-full 
                           px-3 py-3 border border-gray-300 placeholder-gray-500 
                           text-gray-900 rounded-t-md focus:outline-none 
                           focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="passwordLogin">
                Password
              </label>
              <input
                id="passwordLogin"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="form-input appearance-none relative block w-full 
                           px-3 py-3 border border-gray-300 placeholder-gray-500 
                           text-gray-900 rounded-b-md focus:outline-none 
                           focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 
                         border border-transparent text-sm font-medium rounded-md 
                         text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
                         focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors 
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </div>
        </form>
      )}

      {/* 4) Toggle “¿Ya tienes cuenta? / ¿No tienes cuenta?” */}
      <p className="mt-8 text-center text-sm text-gray-600">
        {isRegister ? "Already have an account? " : "Don't have an account? "}
        <span
          className="font-medium text-[#5e92c9] hover:underline cursor-pointer"
          onClick={toggleForm}
        >
          {isRegister ? "Sign In" : "Sign Up"}
        </span>
      </p>
    </div>
  );
}
