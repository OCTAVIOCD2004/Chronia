import { poolPromise } from '../DB/sqlserver.js';

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const buyNow = async (req, res) => {
  const { productos } = req.body;

  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ message: "Se requiere al menos un producto." });
  }

  try {
    const line_items = [];

for (const { idProducto, cantidad } of productos) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("idProducto", idProducto)
    .query("SELECT nombre, precio, imagenUrl FROM Productos WHERE idProducto = @idProducto");

  const prod = result.recordset[0];
  if (!prod) continue;

  line_items.push({
    price_data: {
      currency: "mxn",
      unit_amount: Math.round(prod.precio * 100),
      product_data: {
        name: prod.nombre,
        images: [prod.imagenUrl]
      }
    },
    quantity: cantidad
  });
}


    if (line_items.length === 0) {
      return res.status(400).json({ message: "Productos no válidos." });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`
    });

res.json({ url: session.url });


  } catch (error) {
    console.error("Error en buyNow:", error);
    res.status(500).json({ message: "Error al procesar la compra." });
  }
};

