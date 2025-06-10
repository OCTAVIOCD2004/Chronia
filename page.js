// frontend/app/page.js
export default function HomePage() {
  return (
    <main className="px-20 flex flex-1 justify-center py-8 bg-slate-100">
      <div className="layout-content-container flex flex-col max-w-6xl flex-1 gap-8">
        {/* ---------- Hero ---------- */}
        <div className="@container">
          <div className="@[480px]:p-0">
            <div
              className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-6 pb-10 @[480px]:px-12 @[480px]:pb-12 shadow-lg"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQ_0dB0zr3fKEu0wbw3guSppyL4Xq7QklHFKy6tTStRTgvGiJn3dkS7LMFTHXuFIpCQUj7LRlc_adeJiue5Yi5YS9oHXU9Wl7f7wzhxc-75GhseVPKyqSPzNevx6-uMu1qdd_Al9vRmccTFk9crJtcdKypc_7C6nSQlrvbN19t532En1iIZm_891qlG3VK6b8aYcSBu-qxinldzH7YKtVI2Dt4PrZ21VDQTAPjTNqph0IKJnq_BcbIRiMJevaBlLiifpZyMaaiEw")',
              }}
            >
              <div className="flex flex-col gap-3 text-left">
                <h1 className="text-white text-4xl font-bold leading-tight tracking-tight @[480px]:text-5xl @[480px]:font-bold @[480px]:leading-tight @[480px]:tracking-tight">
                  Encuentra el color perfecto para tu hogar
                </h1>
                <h2 className="text-slate-100 text-base font-normal leading-relaxed @[480px]:text-lg @[480px]:font-normal @[480px]:leading-relaxed max-w-xl">
                  Explore nuestra colección seleccionada de pinturas de alta calidad para interiores y exteriores. Ideal para transformar su espacio con confianza.
                </h2>
              </div>
              <a
                href="/shop"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 @[480px]:h-12 @[480px]:px-8 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold leading-normal tracking-wide @[480px]:text-base @[480px]:font-semibold @[480px]:leading-normal @[480px]:tracking-wide transition-colors shadow-md hover:shadow-lg"
              >
                <span className="truncate">Shop All Paints</span>
              </a>
            </div>
          </div>
        </div>

        {/* ---------- Featured Products (estático) ---------- */}
        <section>
          <h2 className="text-slate-800 text-2xl font-bold leading-tight tracking-tight px-4 pb-4 pt-2">
            Productos Destacados
          </h2>
          <div className="flex overflow-x-auto py-2 [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-stretch p-4 gap-6">
              {/* Aquí puedes mapear dinámicamente los productos una vez los obtengas de la API */}
              <div className="flex h-full flex-1 flex-col gap-3 rounded-lg min-w-72 bg-white p-4 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-md flex flex-col"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFqSfFTwJq9R6E8op4C3y68BJ-XZzltEhbufZnjoHZlZKpohWW_dJpuO13ubjyOJ-6FWlRIgnS5tB5BAko6r_TxPo4i8uojrgVgBHjjYhiSZdG4y0bin-ymwZMV6QrkhU_-JVTDWpB6Kx5ae5RqoNxDqh338TN2RFNJZtSw0oWNK9tkEShXIKg38GIOhBz1IMYiFf2RdjdunT0i8EMorkmOqDc6aur1oVli-Jkw59hrlQeCyrgsff06Gu42UAmmGvmCb2hjR2ltw")',
                  }}
                />
                <div>
                  <p className="text-slate-800 text-lg font-semibold leading-normal line-clamp-1">
                    Pinta Interiores
                  </p>
                  <p className="text-slate-600 text-sm font-normal leading-normal line-clamp-2">
                    Transforme el interior de su hogar con nuestras pinturas duraderas y hermosas.
                  </p>
                </div>
              </div>
              {/* … (otros “cards” de ejemplo) */}
            </div>
          </div>
        </section>

        {/* ---------- Shop by Category ---------- */}
        <section>
          <h2 className="text-slate-800 text-2xl font-bold leading-tight tracking-tight px-4 pb-4 pt-2">
            Por Categorías
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
            {/* Interior */}
            <a
              href="/shop?category=Interior"
              className="group flex flex-col gap-3 pb-3 rounded-lg overflow-hidden hover:shadow-xl transition-shadow bg-white"
            >
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover group-hover:scale-105 transition-transform duration-300"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCby4VdmQptKkfxpRrrY08bbqeU1ZPz2uxl1ZbugTWhrmCTjXUyiJoQ29Rs89At6-QAds9VRqzuZtDFP9GkVLKHwVpY96lbpZ6SmoYAUwdmv-g5t80RzvourShW1uqUO_KjfBSBaQ2DSpNc_uZv_shr7RfqGpQ-QvgPCnneur2lf4_VByqQjDWZMHB0K0jNJHEAHWyIwhIFzpmZr0f7RRcbsKLlXsQdraT3ghyQjNLbUm0KXboMRc2LOvQRkRzHpGQu9qw2DGAUVg")',
                }}
              />
              <p className="text-slate-800 text-base font-semibold leading-normal px-4 group-hover:text-blue-600 transition-colors">
                Interiores
              </p>
            </a>

            {/* Exterior */}
            <a
              href="/shop?category=Exterior"
              className="group flex flex-col gap-3 pb-3 rounded-lg overflow-hidden hover:shadow-xl transition-shadow bg-white"
            >
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover group-hover:scale-105 transition-transform duration-300"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCymGUOWOMHqitwxwEfpr19lrKCvXf2CB-Cr1mcXkO4Kw5b5Rl6c8m9_o-3ZKiEe6WL9NqiXXlNxgEG67PsEukqXJ7XCLplp6z-NQnPRpYD9PjOiKBt7unm3BWGMGEWO40c81QEiQklD18Itf5ieg1706gfB5DIdNplr8pkxgP3BfbIoWta27REpX8kehPSxs8H9uskah0QEE6SWo00DZyhGZdqU6ubiaMuO3gp7HYhZGVy3NLQCHfM7bEHgZ7Pdcbjbpx2cSCNOA")',
                }}
              />
              <p className="text-slate-800 text-base font-semibold leading-normal px-4 group-hover:text-blue-600 transition-colors">
                Exteriores
              </p>
            </a>

            {/* Primers */}
            <a
              href="/shop?category=Primers"
              className="group flex flex-col gap-3 pb-3 rounded-lg overflow-hidden hover:shadow-xl transition-shadow bg-white"
            >
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover group-hover:scale-105 transition-transform duration-300"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA6M02G3KpUBl2MowGjNilyf3_aZuA2zHeJTDbuoEXiNPrrTT3bG8sEkjyJlud-0qh2i9cZytV0YSp0Syv01x1l0TL3f1_A272i28jCx1OWSX2Zrg5Nz08LkFonLJdPKCGFL4eDna1zIRJxU6SYTKwtwmsF7wrYNyZC5Jua8eP1f0auQKMCK8ZdWttkyk8VkLgSlgCmqdcVOGwMSU72pqQbYwAfMV_dlpAE8vWLYS6-pabWPNK0Wr05tbk09jGZC0aAguIErd-PgA")',
                }}
              />
              <p className="text-slate-800 text-base font-semibold leading-normal px-4 group-hover:text-blue-600 transition-colors">
                Primers
              </p>
            </a>

            {/* Supplies */}
            <a
              href="/shop?category=Supplies"
              className="group flex flex-col gap-3 pb-3 rounded-lg overflow-hidden hover:shadow-xl transition-shadow bg-white"
            >
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover group-hover:scale-105 transition-transform duration-300"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBy5Us-H4xngEpUo6dtXalaggN1nVBbOtcxf_hhIlXJhv8u2DEMmjoXdq7RW6Xx__P3kzHh_YYkGgD-N5BxN5GNgQKwAJVyST-Lzz5snUFnWURY2osiJ0A0LT-MZNPfg0egOTaxKePV56FVpQNjCPvAfLZ2L0Np19KrFreN3hl5a105PehmVVRtgzHkWDQs9CEhPOizMD_TSV3YidevVjSNfoTbHS1ZZOnKgOKfxP4ug5FkbKYdzN0NrKOtoPCLE76ybIDXUsKtgg")',
                }}
              />
              <p className="text-slate-800 text-base font-semibold leading-normal px-4 group-hover:text-blue-600 transition-colors">
                Existencias
              </p>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
