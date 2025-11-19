# ⚡ Quick Deploy Cheat Sheet

**Status: ✅ READY**

---

## 🚀 5-Minute Deploy

```bash
# 1. Push to GitHub
git add .
git commit -m "feat: prepare for Vercel deployment"
git push origin main

# 2. Go to: https://vercel.com/new
# 3. Import: bkhtmm/ax_hack
# 4. Add Postgres & Blob (Storage tab)
# 5. Add Environment Variables:
#    - AUTH_SECRET = LUOXHLTqtgQlOnyZ+8DZNFzI+/3hc782bxsctqlh3xU=
#    - K2_THINK_API_KEY = IFM-seW1eggrh5oISPU1
# 6. Deploy!
```

---

## 📋 Environment Variables

Copy these to Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `AUTH_SECRET` | `LUOXHLTqtgQlOnyZ+8DZNFzI+/3hc782bxsctqlh3xU=` |
| `K2_THINK_API_KEY` | `IFM-seW1eggrh5oISPU1` |

Auto-created by Vercel:
- `POSTGRES_URL` ✅
- `BLOB_READ_WRITE_TOKEN` ✅

---

## ✅ Success Checklist

After deployment:

- [ ] App loads at your Vercel URL
- [ ] Can log in / create account
- [ ] Can send messages to AI
- [ ] AI responds correctly
- [ ] No errors in Vercel logs (except Lean/RAG disabled warnings - these are OK!)

---

## 📚 Full Guides

- **Detailed Steps**: [DEPLOY_NOW.md](./DEPLOY_NOW.md)
- **Troubleshooting**: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
- **Summary**: [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)

---

**That's it! You're ready to deploy.** 🎉
