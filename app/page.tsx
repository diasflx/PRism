'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code2, Sparkles, CheckCircle2, Zap, Shield, History, Download, Moon, Sun, ExternalLink, Trash2 } from 'lucide-react';
import ReviewResults from '@/components/review-results';
import LoadingSkeleton from '@/components/loading-skeleton';
import { AnalysisResult } from '@/types';

const DEMO_PR_URL = 'https://github.com/vercel/next.js/pull/73587';

interface HistoryItem {
  id: string;
  prUrl: string;
  prInfo: {
    title: string;
    author: string;
    additions: number;
    deletions: number;
    changedFiles: number;
  };
  result: AnalysisResult;
  timestamp: number;
}

export default function Home() {
  const [prUrl, setPrUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [prInfo, setPrInfo] = useState<{
    title: string;
    author: string;
    additions: number;
    deletions: number;
    changedFiles: number;
  } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ai-code-reviewer-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('ai-code-reviewer-darkmode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (prUrl: string, prInfo: any, result: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      prUrl,
      prInfo,
      result,
      timestamp: Date.now(),
    };
    const updatedHistory = [newItem, ...history].slice(0, 10); // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem('ai-code-reviewer-history', JSON.stringify(updatedHistory));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('ai-code-reviewer-darkmode', (!darkMode).toString());
  };

  // Clear all history
  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all analysis history? This cannot be undone.')) {
      setHistory([]);
      localStorage.removeItem('ai-code-reviewer-history');
      setShowHistory(false);
    }
  };

  // Delete single history item
  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking the item
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('ai-code-reviewer-history', JSON.stringify(updatedHistory));

    // If no history left, hide the panel
    if (updatedHistory.length === 0) {
      setShowHistory(false);
    }
  };

  const analyzePR = async (url: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setPrInfo(null);
    setProgress(0);

    const steps = [
      'Fetching pull request from GitHub...',
      'Downloading code diff...',
      'Analyzing code changes...',
      'Checking for bugs and issues...',
      'Scanning for security vulnerabilities...',
      'Evaluating code quality...',
      'Generating recommendations...',
      'Finalizing analysis...',
    ];

    let stepIndex = 0;
    setAnalysisStep(steps[0]);

    // Simulate progress with step updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + Math.random() * 12, 90);

        // Update step based on progress
        const newStepIndex = Math.floor((newProgress / 90) * steps.length);
        if (newStepIndex !== stepIndex && newStepIndex < steps.length) {
          stepIndex = newStepIndex;
          setAnalysisStep(steps[stepIndex]);
        }

        return newProgress;
      });
    }, 600);

    try {
      const response = await fetch('/api/analyze-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prUrl: url }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze PR');
      }

      setProgress(100);
      setAnalysisStep('Analysis complete!');
      setResult(data.data);
      setPrInfo(data.prInfo);

      // Save to history
      saveToHistory(url, data.prInfo, data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the PR');
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setTimeout(() => {
        setProgress(0);
        setAnalysisStep('');
      }, 1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prUrl.trim()) {
      setError('Please enter a GitHub PR URL');
      return;
    }
    analyzePR(prUrl);
  };

  const handleDemo = () => {
    setPrUrl(DEMO_PR_URL);
    analyzePR(DEMO_PR_URL);
  };

  const generateMarkdown = (result: AnalysisResult, prInfo: any) => {
    let markdown = `# Code Review Report\n\n`;

    if (prInfo) {
      markdown += `## Pull Request Information\n\n`;
      markdown += `- **Title**: ${prInfo.title}\n`;
      markdown += `- **Author**: ${prInfo.author}\n`;
      markdown += `- **Changes**: +${prInfo.additions} -${prInfo.deletions}\n`;
      markdown += `- **Files Changed**: ${prInfo.changedFiles}\n\n`;
    }

    markdown += `## Summary\n\n${result.summary}\n\n`;

    markdown += `## Code Quality Score: ${result.code_quality.score}/100\n\n`;
    if (result.code_quality.improvements.length > 0) {
      markdown += `### Suggested Improvements\n\n`;
      result.code_quality.improvements.forEach((imp, idx) => {
        markdown += `${idx + 1}. ${imp}\n`;
      });
      markdown += `\n`;
    }

    if (result.issues.length > 0) {
      markdown += `## Issues Found (${result.issues.length})\n\n`;
      result.issues.forEach((issue, idx) => {
        markdown += `### ${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.description}\n\n`;
        if (issue.file) {
          markdown += `**File**: \`${issue.file}${issue.line ? `:${issue.line}` : ''}\`\n\n`;
        }
        markdown += `**Suggestion**: ${issue.suggestion}\n\n`;
      });
    }

    if (result.security_concerns.length > 0) {
      markdown += `## Security Concerns\n\n`;
      result.security_concerns.forEach((concern, idx) => {
        markdown += `${idx + 1}. ${concern}\n`;
      });
      markdown += `\n`;
    }

    if (result.performance_tips.length > 0) {
      markdown += `## Performance Optimization Tips\n\n`;
      result.performance_tips.forEach((tip, idx) => {
        markdown += `${idx + 1}. ${tip}\n`;
      });
      markdown += `\n`;
    }

    if (result.complexity_analysis) {
      markdown += `## Complexity Analysis\n\n${result.complexity_analysis}\n\n`;
    }

    markdown += `\n---\n\n*Generated by AI Code Reviewer powered by Claude Sonnet 4*\n`;
    return markdown;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Code2 className="h-7 w-7 text-primary" />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                AI Code Reviewer
              </span>
            </div>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                  <span className="bg-primary text-white px-1.5 py-0.5 rounded-full text-xs">
                    {history.length}
                  </span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className="flex items-center gap-2"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Hero Section */}
        {!result && !loading && (
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
              Intelligent Code Review
              <br />
              Powered by Claude AI
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Get comprehensive, AI-powered code reviews for your GitHub pull requests.
              Identify bugs, security issues, and performance improvements instantly.
            </p>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <Shield className="h-8 w-8 text-primary mb-2 mx-auto" />
                  <h3 className="font-semibold mb-1">Security Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Detect vulnerabilities and security concerns
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <Zap className="h-8 w-8 text-primary mb-2 mx-auto" />
                  <h3 className="font-semibold mb-1">Performance Tips</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimize your code for better performance
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <CheckCircle2 className="h-8 w-8 text-primary mb-2 mx-auto" />
                  <h3 className="font-semibold mb-1">Quality Score</h3>
                  <p className="text-sm text-muted-foreground">
                    Get actionable code quality improvements
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Input Form */}
        {!result && !loading && (
          <Card className="max-w-2xl mx-auto shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Enter GitHub PR URL
              </CardTitle>
              <CardDescription>
                Paste a link to any public GitHub pull request to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pr-url">Pull Request URL</Label>
                  <Input
                    id="pr-url"
                    type="url"
                    placeholder="https://github.com/owner/repo/pull/123"
                    value={prUrl}
                    onChange={(e) => setPrUrl(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1" size="lg">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze PR
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDemo}
                    size="lg"
                  >
                    Try Demo
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* History Panel */}
        {showHistory && history.length > 0 && !loading && (
          <Card className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Analysis History
                  </CardTitle>
                  <CardDescription>
                    Your last {history.length} analyzed pull requests
                  </CardDescription>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearHistory}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    onClick={() => {
                      setPrUrl(item.prUrl);
                      setResult(item.result);
                      setPrInfo(item.prInfo);
                      setShowHistory(false);
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.prInfo.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.prInfo.author} • {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl font-bold dark:opacity-90 ${
                        item.result.code_quality.score >= 80 ? 'text-green-600 dark:text-green-400' :
                        item.result.code_quality.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {item.result.code_quality.score}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    AI Analysis in Progress
                  </div>

                  <div className="mb-4">
                    <p className="text-base font-medium text-foreground mb-1">{analysisStep}</p>
                    <p className="text-sm text-muted-foreground">Powered by Claude Sonnet 4</p>
                  </div>

                  <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>Progress</span>
                      <span className="font-mono font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-primary transition-all duration-300 ease-out shadow-lg"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <LoadingSkeleton />
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Review Results</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Analysis completed • {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {prUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(prUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on GitHub
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const markdown = generateMarkdown(result, prInfo);
                    const blob = new Blob([markdown], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `code-review-${Date.now()}.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setResult(null);
                    setPrInfo(null);
                    setPrUrl('');
                    setError(null);
                  }}
                >
                  New Analysis
                </Button>
              </div>
            </div>
            <ReviewResults result={result} prInfo={prInfo} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            Powered by{' '}
            <a
              href="https://www.anthropic.com/claude"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Claude Sonnet 4
            </a>
            {' '}&amp;{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              GitHub API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
