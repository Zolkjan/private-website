This is a Next.js portfolio with Firebase Authentication and Cloud Firestore-backed projects and page copy.

## Firebase setup

1. Create a Firebase project, register a Web app, enable Email/Password in Authentication, create a Cloud Firestore database, and enable Firebase Storage by creating a bucket.
2. Copy `.env.example` to `.env.local` and fill in the Web app configuration from Firebase project settings. These `NEXT_PUBLIC_*` values are public client configuration, not server secrets.
3. Create the administrator account in Firebase Authentication. Copy its UID into `NEXT_PUBLIC_FIREBASE_ADMIN_UID`.
4. Make sure the same administrator UID is used in `firestore.rules` and `storage.rules`. Publish each file in the matching Firebase console Rules tab.
5. Restart the development server and open `/admin`. On first administrator login, the current project list and technology dictionary are initialized in Firestore.

Firestore and Storage allow public reads for portfolio content and restrict writes to the configured administrator UID. Firestore stores projects in `projects`, page copy in `siteContent/main`, profile details in `siteContent/profile`, and the editable categorized technology dictionary in `technologies`. Storage accepts image files smaller than 10 MB under `projects/{projectId}/`.

The admin panel manages projects, technology names/categories/colors, personal profile and contact details, and the hero, about, and contact copy. Uploaded project images are stored in Firebase Storage.

## Portfolio wideo

- `/video` — portfolio z filtrami rodzaju realizacji (rolki, reklamy, filmy wizerunkowe, strona + wideo), formatu (9:16, 16:9, 1:1) i zakresu prac (scenariusz, nagranie, montaż, web).
- `/admin/videos` — dodawanie, edycja, usuwanie, kolejność, szkice i publikacja realizacji. Zaznaczenie „Wyróżnij” pokazuje maksymalnie trzy opublikowane filmy na stronie głównej. Projekt strony lub aplikacji można powiązać z filmem.
- Obsługiwane są linki HTTPS do YouTube (w tym Shorts), Vimeo i plików MP4/WebM. Odtwarzacz powstaje dopiero po kliknięciu i jest usuwany po zamknięciu. Nie ma automatycznego odtwarzania na liście ani pobierania filmów podczas wczytywania strony.
- Filmy muszą być dostępne dla odwiedzających bez logowania i zezwalać na osadzanie. Dla materiałów z Instagrama/TikToka użyj pliku MP4 lub linku YouTube/Vimeo. Napisy do MP4/WebM mogą pochodzić z opcjonalnego pliku WebVTT; przy napisach z innej domeny serwery filmu i napisów muszą zezwalać na CORS.
- Okładki JPG/PNG/WebP do 10 MB są zapisywane w Storage pod `videos/{id}/`. Sam film pozostaje w wybranym hostingu. Okładki są publicznymi plikami, także w szkicach; szkice dokumentów Firestore może czytać tylko administrator.
- Nowe teksty marki, sekcji wideo i oferty web + wideo edytujesz w `/admin/content`. Pole `brandDescription` zastępuje wcześniejszy opis hero, zachowany w danych jako `heroDescription`; pozostałe zapisane treści są zachowane.

**Przed użyciem modułu na wdrożonej stronie opublikuj aktualne `firestore.rules` i `storage.rules` w konsoli Firebase.** Kolekcja `videos` jest nowa: odczyt publiczny używa zapytania `published == true`, a administrator może odczytać szkice i zapisywać realizacje. Nie wymaga dodatkowego indeksu złożonego. Moduł nie dodaje przykładowych realizacji do bazy.

Alternatywnie, plik `firebase.json` pozwala wdrożyć same reguły przez Firebase CLI. Po zalogowaniu kontem z dostępem do projektu uruchom `firebase deploy --only "firestore:rules,storage" --project private-webiste`. Przy wygasłej sesji najpierw wykonaj `firebase login --reauth`. Zmiany kodu strony wdraża się osobno w używanym hostingu.

## Uruchomienie lokalne

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
