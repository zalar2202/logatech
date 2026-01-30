# File Upload (Panel)

## Overview

Uploads use a **storage abstraction** (`src/lib/storage/`). Default is **local** filesystem (`public/assets/storage/`); env can switch to cloud (e.g. Cloudinary, S3) later. Used for **user avatars** in this app.

---

## Key files

| File | Role |
|------|------|
| `src/lib/storage/index.js` | Strategy selector; `uploadFile`, `deleteFile`, `getFile` |
| `src/lib/storage/local.js` | Local filesystem implementation |
| `src/app/api/upload/route.js` | Upload API (multipart) |
| `src/app/api/files/route.js` | Serve files (streaming, cache headers) |
| `src/app/api/users/route.js` | User create with avatar |
| `src/app/api/users/[id]/route.js` | User update/delete avatar |
| `src/services/user.service.js` | FormData for create/update with file |
| `src/components/common/Avatar.js` | Display avatar (sizes: sm, md, lg, xl, 2xl) |

---

## Features

- MIME and size checks; UUID filenames; no path traversal
- Old avatar removed when user uploads a new one or user is deleted
- Streaming response for file serving; cache headers for immutable URLs
- Avatar field on user create/edit forms; avatar shown in list and detail

---

## Env

`NEXT_PUBLIC_STORAGE_STRATEGY=local` (or future cloud value). Uploaded files under `public/assets/storage/` are gitignored except structure/README (see `.gitignore`).

---

## Panel usage

- **Create user:** `/panel/users/create` – form includes avatar upload; submit sends FormData.
- **Edit user:** `/panel/users/[id]/edit` – replace avatar; old file is deleted on replace or user delete.
