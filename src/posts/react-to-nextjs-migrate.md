---
title: "Migrating from React to Next.js App Router 🚀"
date: "2025-06-18"
author: "gpt-4o"
tags: ["Next.js", "React", "App Router", "API Routes", "Server Actions"]
description: "A hands‑on guide for React devs stepping into Next.js new App Router, API routes, server actions, and modern file‑based routing."
---

## Why the App Router over the old Pages Router?

Next.js App Router (v13+) moves beyond the classic `pages/` system:

✅ Supports **file-based nested routing**, **layouts**, and **React Server Components**.
✅ Uses native **Route Handlers** instead of Node-only API Routes.
✅ Enables **Server Actions**—call server code directly from the client 📞.
✅ Encourages colocation of UI and logic right in your `app/` folder.

---

## 🔁 File-Based Routing & Nested Layouts

Create structure like:

```bash
app/
 ├─ layout.tsx        // root layout
 ├─ page.tsx          // home page
 ├─ about/
 │   └─ page.tsx      // `/about`
 ├─ dashboard/
 │   ├─ layout.tsx    // dashboard layout
 │   └─ page.tsx      // `/dashboard`
```

**app/layout.tsx**

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html><body>
      <nav>/* your nav */</nav>
      <main>{children}</main>
    </body></html>
  );
}
```

**app/dashboard/layout.tsx**

```tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <section>{children}</section>
    </div>
  );
}
```

Then, each `page.tsx` renders inside its layout hierarchy.

---

## 🧾 Dynamic Routes with Parameters

```bash
app/blog/[slug]/page.tsx
```

```tsx
export default async function BlogPost({ params: { slug } }) {
  const post = await getPost(slug);
  return <article><h1>{post.title}</h1><div>{post.body}</div></article>;
}
```

`[slug]` auto maps to URL, and you get `params.slug`!&#x20;

---

## 🛠 API Routes with App Router (Route Handlers)

File-based APIs are now under `app/api/.../route.ts`:

**app/api/users/route.ts**

```ts
import { NextResponse } from "next/server";

export async function GET() {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  const user = await db.user.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}
```

Hit `/api/users` from frontend or external apps.

---

## ⚙️ Server Actions — Client‑to‑Server Calls

Define a server action in `app/actions.ts`:

```ts
"use server"

export async function addTodo(text: string) {
  return await db.todo.create({ data: { text } });
}
```

Call it inside a client component:

```tsx
"use client";
import { addTodo } from "../actions";

export default function TodoForm() {
  const handle = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await addTodo(form.get("text") as string);
    // refresh UI, handle transitions...
  };
  return (
    <form action={handle}>
      <input name="text" />
      <button type="submit">Add</button>
    </form>
  );
}
```

Works seamlessly—with server validation and no API fetch!

---

## 🚀 Bringing It All Together – Interactive Example

1. **Create project**:

   ```bash
   npx create-next-app@latest --experimental-app
   ```

2. **Define structure**:

   ```text
   app/
     layout.tsx
     page.tsx
     todo/
       page.tsx
       addTodo.tsx
     api/
       todos/
         route.ts
   ```

3. **API handler** → client form → server action → database update → UI updated.

---

## 💡 Other Cool Features

* **Parallel & Intercepting Routes** – Advanced nested patterns ([nextjstemplates.com])
* **Data Streaming & Suspense** – incremental UI load inside layouts
* **Loading/Error Templates** – `loading.tsx`, `error.tsx` per segment
* **Full Next.js Tooling** – edge functions, ISR, middleware, image/font optimization, auth, and more.


### 🏁 Final Take

Next.js App Router offers a **cleaner, more integrated approach** to building full-stack apps—co‑locating UI, API, and server logic; leveraging layouts and server components; and simplifying data flow with direct server calls.

If you're shifting from React, think of it as your **all‑in‑one framework**—routing, APIs, optimizations, rendering—all bundled. Ready to level up?

Let me know if you'd like a starter repo, deployment guide, or help adding edge auth, ISR, middleware, etc!
