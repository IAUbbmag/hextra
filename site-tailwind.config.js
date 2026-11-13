// Tailwind CSS (v3) for the site's own templates and content — the classes WITHOUT the hx- prefix.
// Hextra's own styles (hx- prefix) are built separately and are not affected.
//
// How it is built:
//  - On every deploy, .github/workflows/pages.yaml (website repo) rebuilds the file automatically:
//    a first Hugo pass writes hugo_stats.json (all classes actually rendered), then the Tailwind CLI
//    regenerates the file from it, then Hugo builds the site. Nobody has to remember to do it.
//  - The output is also committed as assets/css/site-tailwind.css and linked from
//    layouts/partials/head.html, so a plain local `hugo server` works without Node.
//    It replaces the old <script src="https://cdn.tailwindcss.com">, which compiled CSS in every
//    visitor's browser at runtime and made pages slow or blank where that CDN is slow or blocked.
//
// To refresh the committed copy by hand (from the website repo root):
//   hugo --quiet --renderToMemory
//   npx tailwindcss@3.4.17 -c themes/hextra/site-tailwind.config.js -i themes/hextra/site-tailwind.in.css \
//       -o themes/hextra/assets/css/site-tailwind.css --minify
module.exports = {
  content: [
    './hugo_stats.json',
    './themes/hextra/layouts/**/*.html',
    './content/**/*.md',
    './themes/hextra/assets/js/feature/*.js',
    './themes/hextra/assets/js/*.js',
  ],
  theme: { extend: {} },
  plugins: [],
};
