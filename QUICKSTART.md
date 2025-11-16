# Quick Start Guide

Get the AI Code Reviewer running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Anthropic API key
- GitHub personal access token

## 5-Minute Setup

### 1. Clone and Install (2 min)

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-code-reviewer

# Install dependencies
npm install
```

### 2. Configure Environment (1 min)

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your API keys
# - Get Anthropic key: https://console.anthropic.com/
# - Get GitHub token: https://github.com/settings/tokens
```

Your `.env.local` should look like:
```env
ANTHROPIC_API_KEY=sk-ant-api03-...
GITHUB_TOKEN=ghp_...
```

### 3. Run Development Server (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Test It Out (1 min)

1. Click the "Try Demo" button
2. Wait 5-10 seconds for analysis
3. Explore the results!

## That's It!

You now have a fully functional AI Code Reviewer running locally.

## Next Steps

- **Deploy to Vercel**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Customize**: Edit `app/page.tsx` to change the UI
- **Extend**: Add new features to the API route

## Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Can't connect to APIs?**
- Check your `.env.local` file exists
- Verify API keys are valid
- Restart the dev server

**Build errors?**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Production Build

Test the production build locally:

```bash
npm run build
npm start
```

## Support

- Read the [README.md](README.md) for full documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guides
- Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for technical details

---

Happy coding! 🚀
