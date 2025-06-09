// frontend/app/auth/page.jsx
import React from 'react';
import Head from 'next/head';
import ThreeBackground from '../../../components/ThreeBackground';
import AuthForm from '../../../components/AuthForm';

export default function AuthPage() {
  return (
    <>
      <Head>
        <title>Login / Registro</title>
        {/* … Google Fonts … */}
      </Head>

      {/* Fondo 3D (full-screen, zIndex: -1) */}
      <ThreeBackground />

      {/* ─── MAIN ─── 
          Eliminamos el div de 100vw×100vh y ponemos un <main> que ocupa 
          el espacio remanente entre header y footer. De este modo, el 
          nav/footer que viene de layout.js no se cubren. */}
      <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* 
          Aquí envolvemos nuestro AuthForm en un contenedor blanco con 
          max-width:2xl y sombra, igual que en tu boceto. 
          fíjate que no ponemos width:100vw ni height:100vh, sino un “flex-1” 
          que deja el header y footer visibles.
        */}
        <div className="w-full max-w-2xl bg-white p-6 md:p-10 rounded-xl shadow-lg z-10">
          <AuthForm />
        </div>
      </main>
    </>
  );
}
