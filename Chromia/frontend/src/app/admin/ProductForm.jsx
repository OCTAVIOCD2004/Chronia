"use client";
import { useState, useEffect } from "react";

/**
 *  ProductForm
 *  -----------
 *  • initialData  → objeto con datos ({} cuando se crea)  
 *  • onSubmit     → callback(body) que hace el fetch correspondiente  
 *  • title        → string del encabezado
 */
export default function ProductForm({ initialData = {}, onSubmit, title }) {
  /** ← mismo shape que tu formulario original */
  const [form, setForm] = useState({
    nombre:        "",
    descripcion:   "",
    precio:        "",
    hexColor:      "#ffffff",
    imagenUrl:     "",
    categoria:     "",
    presentacion:  "",
    marca:         "",
    stock:         "",
    activo:        true,
    ...initialData,
  });

  /* si initialData llega después (modo editar) lo mergeamos */
  + useEffect(() => {
   // evita loop cuando initialData es {} vacío
   if (initialData && Object.keys(initialData).length) {
     setForm(initialData);
   }
 }, [initialData]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  /* ⤵︎ MISMAS CLASES Y ORDEN QUE TENÍAS */
  return (
    <main className="flex justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Nombre */}
          <input
            name="nombre"
            placeholder="Nombre"
            required
            value={form.nombre}
            onChange={handleChange}
            className="form-input w-full"
          />

          {/* Descripción */}
          <textarea
            name="descripcion"
            placeholder="Descripción"
            required
            value={form.descripcion}
            onChange={handleChange}
            className="form-textarea w-full min-h-28"
          />

          {/* Precio */}
          <input
            type="number"
            step="0.01"
            name="precio"
            placeholder="Precio"
            required
            value={form.precio}
            onChange={handleChange}
            className="form-input w-full"
          />

          {/* Color */}
          <div className="flex gap-2">
            <input
              name="hexColor"
              required
              value={form.hexColor}
              onChange={handleChange}
              className="form-input flex-1"
            />
            <input
              type="color"
              value={form.hexColor}
              onChange={(e) =>
                setForm((f) => ({ ...f, hexColor: e.target.value }))
              }
              className="w-12 h-11 rounded"
            />
          </div>

          {/* Imagen */}
          <input
            name="imagenUrl"
            placeholder="URL de imagen"
            required
            value={form.imagenUrl}
            onChange={handleChange}
            className="form-input w-full"
          />

          {/* Selects */}
          <select
            name="categoria"
            required
            value={form.categoria}
            onChange={handleChange}
            className="form-select w-full"
          >
            <option value="">Categoría</option>
            <option value="1">Interior</option>
            <option value="2">Exterior</option>
            <option value="3">Specialty</option>
          </select>

          <select
            name="presentacion"
            required
            value={form.presentacion}
            onChange={handleChange}
            className="form-select w-full"
          >
            <option value="">Presentación</option>
            <option value="gallon">Gallon</option>
            <option value="quart">Quart</option>
            <option value="sample">Sample</option>
          </select>

          <select
            name="marca"
            required
            value={form.marca}
            onChange={handleChange}
            className="form-select w-full"
          >
            <option value="">Marca</option>
            <option value="ColorPrime">ColorPrime</option>
            <option value="EcoHue">EcoHue</option>
            <option value="ProCoat">ProCoat</option>
          </select>

          {/* Stock + Activo */}
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            required
            value={form.stock}
            onChange={handleChange}
            className="form-input w-full"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />
            <span className="text-sm">Activo</span>
          </label>

          {/* Botón */}
          <button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
          >
            Guardar
          </button>
        </form>
      </div>
    </main>
  );
}
