# W4U — sito vetrina

Sito marketing statico e SEO-first di W4U, costruito con Astro, React islands e Tailwind CSS. Testi, titoli, FAQ e guide sono renderizzati nell’HTML generato; React viene usato solo per la scrollstory interattiva.

## Avvio locale

```sh
npm install
npm run dev
```

Il sito è disponibile su `http://localhost:4321`. Copiare `.env.example` in `.env` per configurare l’URL pubblico del sito e quello della webapp.

## Verifiche

```sh
npm run check
npm run build
npm run seo:check
```

Le pagine legali sono intenzionalmente `noindex` finché i testi non saranno validati. Prima della pubblicazione occorre impostare il dominio reale con `PUBLIC_SITE_URL` e sincronizzare URL webapp, prezzi, recapiti e testi legali.
