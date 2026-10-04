// Tailwind CSS (v3) for the site's own templates and content — the classes WITHOUT the hx- prefix.
// Hextra's own styles (hx- prefix) are built separately and are not affected.
//
// The output is committed as assets/css/site-tailwind.css and linked from layouts/partials/head.html.
// This replaces the old <script src="https://cdn.tailwindcss.com">, which compiled CSS in every
// visitor's browser at runtime and made pages slow or blank where that CDN is slow or blocked.
//
// Regenerate after adding new Tailwind classes to layouts or content. From the website repo root:
//   printf '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n' > /tmp/tw-in.css
//   npx tailwindcss@3.4.17 -c themes/hextra/site-tailwind.config.js -i /tmp/tw-in.css \
//       -o themes/hextra/assets/css/site-tailwind.css --minify
module.exports = {
  content: [
    './themes/hextra/layouts/**/*.html',
    './content/**/*.md',
    './themes/hextra/assets/js/feature/*.js',
    './themes/hextra/assets/js/*.js',
  ],
  theme: { extend: {} },
  plugins: [],
};
