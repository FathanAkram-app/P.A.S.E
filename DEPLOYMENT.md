# P.A.S.E Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)
1. Visit [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository: `https://github.com/FathanAkram-app/P.A.S.E.git`
5. Vercel will automatically detect it's a React app
6. Click "Deploy" - Your P.A.S.E will be live in 2 minutes!

### Option 2: Vercel CLI Deploy
```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# For production deployment
vercel --prod
```

## 🌍 Live URL
After deployment, you'll get a URL like:
- Preview: `https://p-a-s-e-[hash].vercel.app`
- Production: `https://pase.yourdomain.com` (with custom domain)

## ⚙️ Environment Variables Setup

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add these optional variables:

**AI Services (Optional - Game works without these):**
```
REACT_APP_OPENAI_API_KEY = your_openai_api_key_here
REACT_APP_STABILITY_API_KEY = your_stability_ai_key_here
```

**IPFS Storage (Optional):**
```
REACT_APP_PINATA_API_KEY = your_pinata_api_key
REACT_APP_PINATA_SECRET_KEY = your_pinata_secret_key
```

**Production Settings:**
```
GENERATE_SOURCEMAP = false
REACT_APP_ENV = production
```

## 🎮 Testing Your Deployment

### ✅ What Should Work Immediately:
- ✅ Full-screen P.A.S.E game interface
- ✅ Pet stats system with auto-decay
- ✅ Battle arena with 1v1 combat
- ✅ AI chat (fallback responses without API key)
- ✅ NFT minting simulation
- ✅ All glassmorphism UI effects
- ✅ Responsive design on mobile

### 🔧 Optional Features (Require API Keys):
- 🤖 **Real AI Chat**: Add `REACT_APP_OPENAI_API_KEY`
- 🎨 **AI Image Generation**: Add AI service keys
- ⛓️ **Blockchain Features**: Add Shape Network configuration

## 📊 Performance Tips

### Vercel Optimizations:
- **Edge Functions**: Automatically optimized
- **CDN**: Global content delivery
- **Compression**: Gzip/Brotli enabled
- **Caching**: Static assets cached for 1 year

### Build Optimization:
```bash
# Build locally to test
npm run build

# Analyze bundle size
npm install -g source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

## 🛠️ Custom Domain Setup

### Add Custom Domain:
1. Vercel Dashboard → Your Project
2. Settings → Domains
3. Add domain: `pase.yourdomain.com`
4. Configure DNS records as shown

### SSL Certificate:
- ✅ Automatic SSL via Let's Encrypt
- ✅ HTTP to HTTPS redirect enabled

## 🚀 Advanced Deployment

### Preview Deployments:
- Every GitHub push creates preview URL
- Perfect for testing before production
- Share with testers: `https://p-a-s-e-[branch].vercel.app`

### Production Deployment:
```bash
# Deploy to production
vercel --prod

# Or use GitHub integration (recommended)
# Push to main branch = auto production deploy
```

## 🔍 Monitoring & Analytics

### Vercel Analytics:
1. Enable in Vercel Dashboard
2. View real-time performance metrics
3. Monitor user engagement

### Error Tracking:
- Check Vercel Function logs
- Monitor build logs for issues
- Set up custom error boundaries

## 🆘 Troubleshooting

### Common Issues:

**Build Failed:**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check for TypeScript errors

**Environment Variables Not Working:**
- Ensure variables start with `REACT_APP_`
- Redeploy after adding new variables
- Check variable names match exactly

**Game Not Loading:**
- Check browser console for errors
- Verify Phaser.js compatibility
- Test in incognito mode

**AI Chat Not Working:**
- ✅ Expected without API key (fallback responses work)
- Add `REACT_APP_OPENAI_API_KEY` for real AI
- Check API key permissions and billing

## 🔐 Security Checklist

### Production Security:
- ✅ No secrets committed to GitHub
- ✅ Environment variables properly configured
- ✅ HTTPS enforced automatically
- ✅ Source maps disabled in production
- ✅ Sensitive data excluded from client bundle

## 📈 Post-Deployment

### Share Your P.A.S.E:
```markdown
🚀 **P.A.S.E - Pet Animal Space Entity** is now live!

🎮 **Play Now**: https://your-pase-url.vercel.app
🐙 **Source Code**: https://github.com/FathanAkram-app/P.A.S.E
🌟 **Features**: AI Chat, 1v1 Battles, NFT Minting, Full-screen Game

Try feeding, playing with, and battling your space entity!
```

### Next Steps:
1. **Test all features** on live deployment
2. **Share with friends** for feedback
3. **Monitor performance** via Vercel dashboard
4. **Add custom domain** for professional URL
5. **Enable AI features** with API keys
6. **Scale up** based on user feedback

---

**🎉 Congratulations! Your P.A.S.E is now live and ready for the cosmic pet universe!**

Remember: Your deployment will work perfectly without any API keys - the game has intelligent fallbacks for all features!