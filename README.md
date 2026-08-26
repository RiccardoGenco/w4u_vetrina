# W4U — sito vetrina SEO-first

Sito marketing di W4U: trasforma un’idea, un’esperienza o un metodo in un libro strutturato, modificabile e scaricabile. Il progetto è pensato per acquisire traffico organico, spiegare il prodotto con chiarezza e portare le persone alla webapp.

La direzione attuale del branch `design/manoscritto-vivente` racconta il prodotto come un manoscritto che prende forma: un linguaggio visivo distinto, ma coerente con la webapp W4U per palette, tipografia, componenti e tono.

## Stack e architettura

- **Astro 7** per pagine statiche, performance e HTML pronto al crawl.
- **React** solo come island per l’interazione che lo richiede: la scrollstory delle otto fasi.
- **Tailwind CSS 4** per il layer utility, affiancato agli stili di sistema del progetto.
- **GSAP + ScrollTrigger** caricato solo per l’esperienza manoscritto e disattivato per chi preferisce animazioni ridotte.
- **Astro Content Collections** per le guide SEO in Markdown.
- **Astro Sitemap** per generare la sitemap del sito statico.

Questo rispetta la separazione richiesta tra sito vetrina e prodotto: il sito pubblico privilegia SEO e velocità con Astro; la webapp interattiva resta un’app React separata.

## Esperienza e design

Il sito utilizza i token W4U (teal/cyan, Inter e Outfit, superfici morbide e controlli coerenti) affinché vetrina e webapp sembrino lo stesso prodotto.

La direzione “manoscritto vivente” comprende:

- un hero che mette il prodotto in primo piano, con oggetti editoriali e profondità;
- una scrollstory in otto fasi, dove il percorso cambia con lo scroll;
- un libro con pagine animate, stabilizzato per evitare flash del contenuto precedente durante l’atterraggio;
- indicatore di capitolo e progresso di lettura nella pagina;
- transizioni di navigazione senza perdere tema e continuità;
- animazioni progressive, hover e parallax discreti, con fallback `prefers-reduced-motion`;
- layout responsive e testi leggibili sia da laptop sia da telefono. I controlli essenziali, incluso il cambio tema, restano disponibili su mobile.

## SEO: requisiti implementati

Il contenuto che deve essere trovato dai motori di ricerca non dipende da JavaScript client-side:

- titoli, testi, tabelle dei prezzi, FAQ e guide sono generati nell’HTML statico di Astro;
- ogni pagina ha `title`, meta description, canonical, Open Graph e Twitter metadata;
- le pagine principali includono dati strutturati JSON-LD; la pagina prezzi espone anche `FAQPage`;
- le guide in `/risorse/` sono articoli statici con URL dedicato, H1, metadati e schema `Article`;
- la sitemap include le pagine pubbliche e esclude 404 e documenti legali provvisori;
- `robots` è impostato a `index,follow` sulle pagine pubbliche; le pagine legali rimangono `noindex` fino alla validazione dei testi;
- `npm run seo:check` verifica su tutte le pagine generate title univoco, description, canonical, un solo H1 e immagine social.

## Prezzi pubblicati

La pagina `/prezzi/` riflette la configurazione della webapp:

- demo gratuita dopo la registrazione: un libro completo da 30 pagine;
- libro completo: **30 €** fino a 50 pagine;
- **5 €** per ogni blocco aggiuntivo di 10 pagine;
- limite di 250 pagine per libro;
- credito senza scadenza e nessun abbonamento/rinnovo automatico.

Prima di modificare questa pagina, verificare i valori nella configurazione prezzi della webapp: è la fonte di verità commerciale.

## Avvio locale

```sh
npm install
npm run dev
```

Il sito è disponibile su `http://localhost:4321`. Copiare `.env.example` in `.env` e impostare:

```dotenv
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_APP_URL=http://localhost:5173
```

Prima di una pubblicazione ufficiale, sostituire `PUBLIC_SITE_URL` con il dominio definitivo e verificare i link della webapp.

## Verifiche obbligatorie

```sh
npm run check
npm run build
npm run seo:check
```

Non pubblicare modifiche finché i tre comandi non sono completati con successo.

## Preview per revisione

La preview del branch manoscritto è disponibile su:

<https://manoscritto-vivente--w4u-manuscript-preview.netlify.app/>

È un deploy draft Netlify separato dalla produzione. Gli aggiornamenti vengono caricati manualmente nella preview dopo build e validazione; non è ancora presente un collegamento CI GitHub → Netlify.

## Vincoli per AI e contributori

Quando si lavora su questo repository, rispettare sempre questi vincoli:

1. Usare Astro per nuove pagine pubbliche, landing, FAQ e risorse. React va riservato a componenti realmente interattivi.
2. Non spostare contenuti SEO importanti in componenti renderizzati esclusivamente nel browser: heading, testo, FAQ, prezzi e guide devono esistere nell’HTML restituito dal server/build.
3. Per ogni nuova pagina pubblica definire title, description, canonical, Open Graph e un solo H1; aggiungere JSON-LD quando semanticamente utile.
4. Non inventare prezzi, limiti, promesse o condizioni commerciali. Verificarli nella webapp o chiedere conferma prima della pubblicazione.
5. Mantenere palette, font, raggi, controlli e tono coerenti con W4U. Non introdurre una nuova identità visiva scollegata dalla webapp.
6. Progettare prima laptop e mobile: corpo testo leggibile, pulsanti comodi al tocco, nessuna informazione essenziale affidata a hover o testo minuscolo.
7. Le animazioni devono aggiungere orientamento o profondità, non ostacolare la lettura. Rispettare `prefers-reduced-motion`, prevenire layout shift e testare transizioni iniziali/finali.
8. Conservare accessibilità semantica: landmark, label, focus visibile, contrasto adeguato e controlli raggiungibili da tastiera.
9. Aggiornare sitemap, contenuti correlati e link interni quando si aggiunge una risorsa; evitare pagine orfane e duplicazioni di intent di ricerca.
10. Eseguire sempre le verifiche obbligatorie prima di commit, push o deploy.
