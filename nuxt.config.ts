export default ({
  css: ["~/assets/css/tailwind.css"],
  devtools: { enabled: true },
  pages: true, // Pastikan fitur Pages diaktifkan
  ssr: false, // (Opsional) Nonaktifkan SSR jika tidak diperlukan
  postcss: {
    plugins: {},
      tailwindcss: {},
      autoprefixer: {},
  },
  modules: ["@sidebase/nuxt-pdf"],
  compatibilityDate: "2025-02-21",
});
