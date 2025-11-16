import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import Anthropic from '@anthropic-ai/sdk';
import { AnalysisResult, AnalyzeResponse } from '@/types';

// Initialize clients
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Parse GitHub PR URL
function parsePRUrl(url: string): { owner: string; repo: string; pull_number: number } | null {
  try {
    // More flexible regex that handles various URL formats
    // Matches: https://github.com/owner/repo/pull/123
    // Also handles trailing slashes, query params, and fragments
    const regex = /github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)\/pull\/(\d+)/;
    const match = url.trim().match(regex);

    if (!match) return null;

    return {
      owner: match[1],
      repo: match[2],
      pull_number: parseInt(match[3], 10),
    };
  } catch {
    return null;
  }
}

// Fetch PR data from GitHub
async function fetchPRData(owner: string, repo: string, pull_number: number) {
  try {
    // Get PR details
    const { data: pr } = await octokit.pulls.get({
      owner,
      repo,
      pull_number,
    });

    // Get PR files and diff
    const { data: files } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number,
    });

    // Get the full diff
    const { data: diff } = await octokit.pulls.get({
      owner,
      repo,
      pull_number,
      mediaType: {
        format: 'diff',
      },
    });

    return {
      pr,
      files,
      diff: diff as unknown as string,
    };
  } catch (error: any) {
    console.error('Error fetching PR data:', error);

    // Provide more specific error messages based on the error type
    if (error.status === 404) {
      throw new Error('Pull request not found. Please check the URL and ensure the repository is public or your token has access.');
    } else if (error.status === 403) {
      throw new Error('Access forbidden. Your GitHub token may not have permission to access this repository.');
    } else if (error.status === 401) {
      throw new Error('GitHub authentication failed. Please check your GitHub token.');
    } else if (error.message?.includes('rate limit')) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }

    throw new Error('Failed to fetch PR data from GitHub. Please check the URL and your GitHub token.');
  }
}

// Analyze code with Claude
async function analyzeWithClaude(diff: string, prInfo: { title: string; changed_files: number; additions: number; deletions: number }): Promise<AnalysisResult> {
  const prompt = `You are an expert code reviewer specializing in security, performance, and code quality analysis.

Analyze this pull request and provide a comprehensive, actionable code review with specific fixes.

Pull Request Information:
- Title: ${prInfo.title}
- Changed Files: ${prInfo.changed_files}
- Additions: ${prInfo.additions}
- Deletions: ${prInfo.deletions}

Code Diff:
\`\`\`diff
${diff.slice(0, 50000)}${diff.length > 50000 ? '\n... (diff truncated for length)' : ''}
\`\`\`

Provide your analysis in the following JSON format with enhanced detail:

{
  "summary": "Concise 2-3 sentence summary of changes and overall assessment",
  "metrics": {
    "complexity_score": 1-10,
    "technical_debt": "Low" | "Medium" | "High",
    "risk_score": 0-100
  },
  "security_issues": [
    {
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "type": "SQL Injection" | "XSS" | "Auth Issue" | etc,
      "file": "path/to/file.ts",
      "line": 42,
      "description": "What the security issue is",
      "risk": "What could happen if exploited",
      "remediation": "How to fix it",
      "code_snippet": "Problematic code if applicable"
    }
  ],
  "issues": [
    {
      "severity": "high" | "medium" | "low",
      "file": "path/to/file.ts",
      "line": 42,
      "description": "What the bug/issue is",
      "suggestion": "How to fix it",
      "original_code": "current problematic code",
      "fixed_code": "corrected code with proper syntax",
      "explanation": "Why this fix works"
    }
  ],
  "performance_issues": [
    {
      "severity": "high" | "medium" | "low",
      "description": "Performance issue description",
      "file": "path/to/file.ts",
      "line": 42,
      "impact": "high" | "medium" | "low",
      "suggestion": "Optimization approach (e.g., 'Use Map instead of nested loops for O(n) complexity')"
    }
  ],
  "test_suggestions": [
    {
      "function": "functionName()",
      "file": "path/to/file.ts",
      "missing_tests": ["edge case 1", "edge case 2"],
      "test_skeleton": "describe('functionName', () => { it('should handle edge case', () => { expect(...).toBe(...); }); });"
    }
  ],
  "security_concerns": [
    "Legacy format security notes if any"
  ],
  "performance_tips": [
    "Legacy format performance notes if any"
  ],
  "code_quality": {
    "score": 0-100,
    "improvements": ["Specific improvement suggestions"]
  },
  "complexity_analysis": "Analysis of code complexity and maintainability"
}

CRITICAL ANALYSIS AREAS:
1. **Security** (highest priority):
   - SQL injection, XSS, CSRF vulnerabilities
   - Hardcoded secrets/API keys
   - Authentication/authorization flaws
   - Insecure dependencies
   - Data exposure risks

2. **Bugs & Logic Errors**:
   - Null/undefined handling
   - Off-by-one errors
   - Race conditions
   - Unhandled promise rejections
   - Type mismatches

3. **Performance**:
   - O(n²) or worse algorithms
   - Unnecessary re-renders (React)
   - Large bundle imports
   - Missing indexes (databases)
   - Blocking operations

4. **Test Coverage**:
   - New functions without tests
   - Missing edge cases
   - Error path coverage

5. **Code Quality**:
   - Best practices
   - Maintainability
   - Documentation

For code snippets, use proper syntax highlighting format. Keep original_code and fixed_code concise but complete.

Return ONLY valid JSON, no markdown code blocks or additional text.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000, // Reduced from 16000 for faster response
      temperature: 0,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the JSON response
    let jsonText = content.text.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```\n?$/g, '').trim();
    }

    const analysis: AnalysisResult = JSON.parse(jsonText);

    // Validate the response structure
    if (!analysis.summary || !Array.isArray(analysis.issues)) {
      throw new Error('Invalid response structure from Claude');
    }

    // Ensure all required fields are present with defaults if missing
    return {
      summary: analysis.summary,
      issues: analysis.issues,
      security_concerns: Array.isArray(analysis.security_concerns) ? analysis.security_concerns : [],
      performance_tips: Array.isArray(analysis.performance_tips) ? analysis.performance_tips : [],
      code_quality: analysis.code_quality || { score: 0, improvements: [] },
      complexity_analysis: analysis.complexity_analysis || undefined,
      // New enhanced fields
      security_issues: Array.isArray(analysis.security_issues) ? analysis.security_issues : [],
      performance_issues: Array.isArray(analysis.performance_issues) ? analysis.performance_issues : [],
      test_suggestions: Array.isArray(analysis.test_suggestions) ? analysis.test_suggestions : [],
      metrics: analysis.metrics || undefined,
    };
  } catch (error) {
    console.error('Error analyzing with Claude:', error);
    throw new Error('Failed to analyze code with Claude API. Please try again.');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate API keys
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { prUrl } = body;

    if (!prUrl || typeof prUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid PR URL provided' },
        { status: 400 }
      );
    }

    // Parse PR URL
    const prParams = parsePRUrl(prUrl);
    if (!prParams) {
      return NextResponse.json(
        { success: false, error: 'Invalid GitHub PR URL format. Expected: https://github.com/owner/repo/pull/123' },
        { status: 400 }
      );
    }

    // Fetch PR data
    const { pr, diff } = await fetchPRData(
      prParams.owner,
      prParams.repo,
      prParams.pull_number
    );

    // Analyze with Claude
    const analysis = await analyzeWithClaude(diff, {
      title: pr.title,
      changed_files: pr.changed_files,
      additions: pr.additions,
      deletions: pr.deletions,
    });

    // Prepare response
    const response: AnalyzeResponse = {
      success: true,
      data: analysis,
      prInfo: {
        title: pr.title,
        author: pr.user?.login || 'Unknown',
        additions: pr.additions,
        deletions: pr.deletions,
        changedFiles: pr.changed_files,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in analyze-pr route:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
