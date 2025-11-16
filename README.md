# AI Code Reviewer

An intelligent, production-ready code review assistant powered by Claude AI that analyzes GitHub pull requests and provides comprehensive feedback on code quality, security, performance, and best practices.

![AI Code Reviewer](https://img.shields.io/badge/AI-Code%20Reviewer-blue)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### 🔍 **Comprehensive Code Analysis**
- **Security Scanner**: Detects critical vulnerabilities (SQL injection, XSS, auth issues, hardcoded secrets)
  - Severity-based categorization (CRITICAL, HIGH, MEDIUM, LOW)
  - Risk assessment and remediation steps
  - Code snippets showing problematic patterns
- **Performance Analysis**: Identifies bottlenecks with impact ratings (⚡⚡⚡ high, ⚡⚡ medium, ⚡ low)
  - O(n²) algorithm detection
  - Unnecessary re-renders
  - Optimization suggestions
- **Bug Detection**: Finds logic errors with AI-suggested fixes
  - Before/after code comparison
  - Copy-to-clipboard functionality
  - Detailed explanations
- **Test Coverage**: Suggests missing test cases with ready-to-use templates
  - Jest/Vitest test skeletons
  - Edge case identification
- **Code Quality**: Expandable improvement suggestions with impact analysis
  - Why it matters
  - How to implement
  - Expected impact metrics

### 📊 **Code Metrics Dashboard**
- Complexity Score (1-10)
- Technical Debt indicator (Low/Medium/High)
- Risk Score percentage (0-100%)

### 🎨 **Modern UX Features**
- **Dynamic Progress Tracking**: 8-step analysis progress with real-time updates
- **Analysis History**: Persistent history with individual delete options (saves last 10)
- **Dark Mode**: Full dark mode support with localStorage persistence
- **Export Functionality**: Copy full analysis or export as JSON
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Demo Mode**: Try instantly with a pre-loaded Next.js PR

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI**: Anthropic Claude Sonnet 4 API
- **APIs**: GitHub REST API via Octokit
- **Deployment**: Vercel-ready

## Project Architecture

```
ai-code-reviewer/
├── app/
│   ├── api/
│   │   └── analyze-pr/
│   │       └── route.ts          # API endpoint for PR analysis
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── review-results.tsx        # Results display component
│   └── loading-skeleton.tsx      # Loading state component
├── types/
│   └── index.ts                  # TypeScript type definitions
└── lib/
    └── utils.ts                  # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- GitHub Personal Access Token ([Create one here](https://github.com/settings/tokens))
  - For public repos: No scopes required
  - For private repos: Enable `repo` scope

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-code-reviewer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your API keys:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GITHUB_TOKEN=your_github_token_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. Navigate to the application
2. Paste a GitHub PR URL (e.g., `https://github.com/owner/repo/pull/123`)
3. Click "Analyze PR" or try the demo with "Try Demo"
4. Wait for Claude AI to analyze the code (usually 5-10 seconds)
5. Review the comprehensive analysis with:
   - Summary and overall assessment
   - Severity-coded issues with suggestions
   - Security concerns
   - Performance tips
   - Code quality score and improvements
   - Complexity analysis

## API Reference

### POST /api/analyze-pr

Analyzes a GitHub pull request.

**Request:**
```json
{
  "prUrl": "https://github.com/owner/repo/pull/123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "...",
    "issues": [...],
    "security_concerns": [...],
    "performance_tips": [...],
    "code_quality": {
      "score": 85,
      "improvements": [...]
    },
    "complexity_analysis": "..."
  },
  "prInfo": {
    "title": "...",
    "author": "...",
    "additions": 100,
    "deletions": 50,
    "changedFiles": 5
  }
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import the project in Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Configure environment variables:
     - `ANTHROPIC_API_KEY`
     - `GITHUB_TOKEN`

3. Deploy!

The application will be live at your Vercel URL (e.g., `https://your-app.vercel.app`)

### Environment Variables for Production

Make sure to set these in your Vercel project settings:

- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `GITHUB_TOKEN`: Your GitHub personal access token

## Development

### Project Structure

- `/app/page.tsx` - Main application UI with form and results display
- `/app/api/analyze-pr/route.ts` - API route that handles PR fetching and Claude analysis
- `/components/review-results.tsx` - Component for displaying analysis results
- `/components/loading-skeleton.tsx` - Loading state UI
- `/types/index.ts` - TypeScript interfaces for type safety

### Key Features Implementation

1. **GitHub Integration**: Uses Octokit to fetch PR details and diff
2. **Claude AI Integration**: Sends diff to Claude Sonnet 4 with structured prompt
3. **Error Handling**: Comprehensive error handling at API and UI levels
4. **Type Safety**: Full TypeScript support with strict mode
5. **Responsive Design**: Mobile-first design with Tailwind CSS

## Future Improvements

- [ ] Add authentication (GitHub OAuth)
- [ ] Store review history in database
- [ ] Support for analyzing multiple PRs in batch
- [ ] Export reviews as PDF or markdown
- [ ] Compare reviews across different Claude models
- [ ] Integration with GitHub webhooks for automatic reviews
- [ ] Custom review templates and rules
- [ ] Team collaboration features

## Troubleshooting

### "Anthropic API key not configured"
- Make sure `.env.local` exists with `ANTHROPIC_API_KEY` set
- Restart the dev server after adding environment variables

### "Failed to fetch PR data from GitHub"
- Verify your `GITHUB_TOKEN` is valid
- Check that the PR URL is correct and accessible
- For private repos, ensure your token has `repo` scope

### "Failed to analyze code with Claude API"
- Check your Anthropic API key is valid
- Verify you have API credits available
- Try with a smaller PR (very large diffs may timeout)

## License

MIT License - feel free to use this project for your portfolio or learning!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Built as a co-op portfolio project to demonstrate:
- Full-stack development with Next.js and TypeScript
- AI/LLM integration (Claude API)
- API integration (GitHub API)
- Modern UI/UX design
- Production-ready code quality

## Acknowledgments

- [Anthropic](https://www.anthropic.com/) for Claude AI
- [GitHub](https://github.com) for the GitHub API
- [Vercel](https://vercel.com) for Next.js and hosting
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
