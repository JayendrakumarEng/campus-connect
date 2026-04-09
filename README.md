# 🎓 Campus Connect

> A professional social network built exclusively for college communities — Students · Alumni · Faculty · Admins, all in one platform.


**[🚀 Live Demo](https://jayendrakumareng.github.io/campus-connect)** · **[🐛 Report Bug](https://github.com/JayendrakumarEng/campus-connect/issues/new?labels=bug)** · **[✨ Request Feature](https://github.com/JayendrakumarEng/campus-connect/issues/new?labels=enhancement)**

---

## What Is This?

Campus Connect is a LinkedIn-style platform scoped to a single college. Students build profiles and network, alumni share placement stories, staff publish events and opportunities, and admins manage users and moderate content — all behind a clean role-based permission system.

Think of it as the internal social layer your college never had.

---

## Features

**🎓 For Students**
- Build a profile with skills, resume, portfolio, and project links
- Browse a live feed of posts and job/internship opportunities
- Message any user directly with real-time chat
- Bookmark posts and revisit them later
- Explore and search all students, alumni, and staff

**🏆 For Alumni**
- Share placement stories with company, role, package, and journey
- Get verified by admin to unlock alumni privileges
- Endorse juniors' skills and help with referrals

**👨‍🏫 For Staff / Faculty**
- Publish announcements and updates (auto-approved)
- Create and manage campus events
- Run polls to collect student feedback
- Formally endorse students for skills

**🛡️ For Admins**
- Full user management — search, filter, change any user's role
- Verify alumni accounts and approve content
- Review and moderate pending posts and success stories
- Live dashboard with role-based user counts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Backend & Auth | Supabase — Postgres, Realtime, Auth, Storage |
| Animations | Framer Motion |
| Routing | React Router v6 |
| State | React Query + Context API |

---

## Getting Started

**Prerequisites:** Node.js `18+` and npm · A free [Supabase](https://supabase.com) project

**1. Clone & install**

```sh
git clone https://github.com/JayendrakumarEng/campus-connect.git
cd campus-connect
npm install
```

**2. Configure environment**

```sh
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

Get both values from **Supabase → Project Settings → API**.

**3. Run**

```sh
npm run dev
```

App runs at [http://localhost:8080](http://localhost:8080).

---

## Project Structure

```
src/
├── assets/                   # Static campus images
├── components/
│   ├── college/              # College page sections
│   ├── staff/                # Staff dashboard tabs
│   └── ui/                   # shadcn/ui component library
├── contexts/
│   └── AuthContext.tsx       # Global auth + profile state
├── integrations/
│   └── supabase/             # Client config + generated types
├── lib/
│   └── app-url.ts            # Base URL helper for GitHub Pages
└── pages/
    ├── Landing.tsx           # Public marketing page
    ├── Auth.tsx              # Login / signup
    ├── Feed.tsx              # Main post feed
    ├── Explore.tsx           # Discover users
    ├── Profile.tsx           # User profile
    ├── Messages.tsx          # Real-time messaging
    ├── SuccessStories.tsx    # Alumni placement stories
    ├── StaffDashboard.tsx    # Staff control panel
    ├── Admin.tsx             # Admin panel
    └── Settings.tsx          # Profile settings
```

---

## Role System

| Role | Permissions |
|---|---|
| `student` | Post (requires approval), feed, messages, bookmarks, explore |
| `alumni` | All above + placement stories (requires admin verification) |
| `staff` | Auto-approved posts, events, polls, endorsements, moderation |
| `admin` | Everything + user management, role changes, alumni verification |

### Bootstrapping the First Admin

Run this once in your **Supabase SQL Editor**:

```sql
UPDATE profiles
SET role = 'admin', is_verified = true
WHERE email = 'your@email.com';
```

After that, promote or demote any user directly from the Admin panel — no more SQL needed.

### Fixing Avatar Images

If profile photos are not loading, the `avatars` storage bucket needs to be public. Run in Supabase SQL Editor:

```sql
UPDATE storage.buckets SET public = true WHERE id = 'avatars';

CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users upload own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Deployment

**Vercel / Netlify**

```sh
npm run build
# Deploy the /dist folder
```

Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as environment variables in your hosting dashboard.

**GitHub Pages**

Auto-deploys via GitHub Actions on every push to `main`. The `vite.config.ts` automatically sets the correct base path — no manual config needed.

---

## Contributing

```sh
git checkout -b feat/your-feature
git commit -m "feat: what you added"
git push origin feat/your-feature
# Open a pull request
```

One feature or fix per PR. Clear commit messages.

---

## Author

**Jayendra Kumar** — B.Tech IT, Techno International Newtown, Kolkata


---

## License

MIT © 2025 [Jayendra Kumar](https://github.com/JayendrakumarEng)
