# Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the project root:
```bash
vercel
```

4. Set environment variables:
```bash
vercel env add ANTHROPIC_API_KEY
vercel env add GITHUB_TOKEN
```

5. Redeploy with environment variables:
```bash
vercel --prod
```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: AI Code Reviewer"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [vercel.com/new](https://vercel.com/new)

3. Import your GitHub repository

4. Configure environment variables in Vercel:
   - Click "Environment Variables"
   - Add `ANTHROPIC_API_KEY` with your Anthropic API key
   - Add `GITHUB_TOKEN` with your GitHub personal access token
   - Set variables for Production, Preview, and Development

5. Click "Deploy"

6. Your app will be live at `https://your-app-name.vercel.app`

## Environment Variables

Make sure to set these in Vercel:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `ANTHROPIC_API_KEY` | API key for Claude | https://console.anthropic.com/ |
| `GITHUB_TOKEN` | Personal access token | https://github.com/settings/tokens |

### GitHub Token Scopes

For public repositories only:
- No scopes required

For private repositories:
- ✅ `repo` - Full control of private repositories

## Post-Deployment

1. Visit your deployment URL
2. Click "Try Demo" to test with the example PR
3. Try analyzing your own PRs

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version is 18+
- Check TypeScript errors: `npm run build`

### API Errors
- Verify environment variables are set correctly in Vercel
- Check API key permissions and credits
- Review Vercel function logs

### Rate Limiting
- GitHub API: 60 requests/hour (unauthenticated), 5000/hour (authenticated)
- Claude API: Depends on your plan
- Consider implementing caching for production

## Custom Domain (Optional)

1. Go to your project in Vercel
2. Settings > Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Monitoring

- View logs: Vercel Dashboard > Your Project > Logs
- Monitor API usage: Check Claude and GitHub dashboards
- Set up alerts for errors (Vercel Pro feature)

## Production Best Practices

1. **Rate Limiting**: Add rate limiting middleware
2. **Caching**: Cache PR analysis results
3. **Error Tracking**: Integrate Sentry or similar
4. **Analytics**: Add Vercel Analytics
5. **Security**: 
   - Don't commit `.env.local`
   - Rotate tokens regularly
   - Use environment-specific tokens
