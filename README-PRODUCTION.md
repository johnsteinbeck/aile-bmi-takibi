# Pizzeria Tov Production Setup

Public menu URL:
https://pizzeria-tov.vercel.app

Admin URL:
https://pizzeria-tov.vercel.app/admin.html

This project is a static HTML/CSS/JS site hosted on the free Vercel subdomain. Menu products, prices, visibility, order, and uploaded product images are stored in Supabase. Do not use a local JSON file or browser storage as permanent menu storage.

## 1. Supabase Project

1. Create a Supabase project.
2. Open Supabase Dashboard > SQL Editor.
3. Run `supabase-menu-schema.sql`.
4. In the SQL file, replace `owner@example.com` with the restaurant owner's real email, or run:

```sql
update public.app_admins
set email = 'OWNER_EMAIL_HERE'
where email = 'owner@example.com';
```

5. Supabase creates the `product-images` Storage bucket through the SQL file.
6. Product images uploaded from `admin.html` are saved in Supabase Storage and the product row stores the Storage path.

## 2. Supabase Auth

1. Go to Supabase Dashboard > Authentication > URL Configuration.
2. Set Site URL to:

```text
https://pizzeria-tov.vercel.app
```

3. Add this Redirect URL:

```text
https://pizzeria-tov.vercel.app/admin.html
```

The admin panel uses Supabase Magic Link login. Only emails listed in `public.app_admins` can manage menu data because Row Level Security policies protect insert, update, delete, and image upload actions.

Important: `admin.html` is a static page, so the URL can technically be opened by anyone who knows it. The menu data and image operations are protected by Supabase Auth and RLS; unauthorized visitors cannot manage products.

## 3. Connect The Website

Open `config.js` and replace:

```js
supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",
```

Use Supabase Dashboard > Project Settings > API:

- Project URL goes into `supabaseUrl`
- anon public key goes into `supabaseAnonKey`

Never put a Supabase service role key in this static site.

## 4. Deploy To Vercel

Use Vercel with no custom domain.

Git method:

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Framework Preset: Other.
4. Build Command: leave empty.
5. Output Directory: leave empty.
6. Deploy.
7. Set the project name to `pizzeria-tov` so the production subdomain becomes:

```text
https://pizzeria-tov.vercel.app
```

CLI method:

```powershell
npm i -g vercel
vercel --prod
```

Choose this project folder as the root. Do not add a custom domain.

## 5. QR Code

`qr-code.svg` points to:

```text
https://pizzeria-tov.vercel.app
```

Use this SVG for printed QR cards, table stickers, or Instagram highlights. Regenerate it only if the public menu URL changes.

## 6. Owner Workflow

1. Visit `https://pizzeria-tov.vercel.app/admin.html`.
2. Enter the authorized owner email.
3. Open the Supabase Magic Link email.
4. Add products, update prices, upload photos, change product order, hide/show products, or delete products.
5. Public visitors only see visible products on `https://pizzeria-tov.vercel.app`.

## References

- Supabase JavaScript client: https://supabase.com/docs/reference/javascript/initializing
- Supabase Magic Link login: https://supabase.com/docs/guides/auth/auth-email-passwordless
- Supabase Storage uploads: https://supabase.com/docs/reference/javascript/storage-from-upload
- Supabase Storage public URLs: https://supabase.com/docs/guides/storage/serving/downloads
- Supabase Storage overview: https://supabase.com/docs/guides/storage
- Vercel deployments: https://vercel.com/docs/deployments
