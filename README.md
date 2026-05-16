# RX Library — Homepage Prototype

Standalone Next.js app extracted from the main monorepo (`pharmacy-time`) for Vercel deployment. No Docker, no Medplum, no internal packages. Deploys as a static marketing page.

## Stack

- Next.js 14
- Tailwind CSS
- Three.js (NarrativeCube animation)

## Local dev

```bash
npm install
npm run dev
```

## Differences from the main app

`src/app/page.tsx` has two lines replaced to remove the Medplum dependency:

```tsx
// Main app (packages/app/web/src/app/page.tsx)
const medplum = useMedplum();
const isLoggedIn = !!medplum.getProfile();
const roleHome = useRoleHome();

// Prototype (src/app/page.tsx)
const isLoggedIn = false;
const roleHome = { href: '/login' };
```

Everything else is identical to the main app.

---

## Syncing from the main app

When homepage changes are made in `D:\Coding\pharmacy-time`, copy the relevant files:

```bash
cp "D:\Coding\pharmacy-time\packages\app\web\src\app\page.tsx" \
   "D:\Coding\rxlibrary-homepage-prototype\src\app\page.tsx"

cp "D:\Coding\pharmacy-time\packages\app\web\src\components\homepage\narrative-cube.tsx" \
   "D:\Coding\rxlibrary-homepage-prototype\src\components\homepage\narrative-cube.tsx"

cp "D:\Coding\pharmacy-time\packages\app\web\src\components\homepage\marketing-nav.tsx" \
   "D:\Coding\rxlibrary-homepage-prototype\src\components\homepage\marketing-nav.tsx"

cp "D:\Coding\pharmacy-time\packages\app\web\src\components\homepage\fade-up.tsx" \
   "D:\Coding\rxlibrary-homepage-prototype\src\components\homepage\fade-up.tsx"
```

Then re-apply the two-line patch in `src/app/page.tsx` (replace the medplum block as shown above), commit, and push. Vercel auto-deploys on push.

```bash
cd D:\Coding\rxlibrary-homepage-prototype
git add . && git commit -m "sync: homepage from main app" && git push
```
