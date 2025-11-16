'use client';

import { AnalysisResult } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Info,
  Zap,
  Code2,
  CheckCircle2,
  Copy,
  FileCode,
  TrendingUp,
  XCircle,
  Bug,
  Target,
  Lightbulb,
  ArrowRight,
  Shield,
  Lock,
  Flame,
  Activity,
  TestTube,
  ClipboardCopy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ReviewResultsProps {
  result: AnalysisResult;
  prInfo?: {
    title: string;
    author: string;
    additions: number;
    deletions: number;
    changedFiles: number;
  } | null;
}

export default function ReviewResults({ result, prInfo }: ReviewResultsProps) {
  const [copied, setCopied] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <XCircle className="h-4 w-4" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4" />;
      case 'low':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const copyToClipboard = async () => {
    try {
      const text = JSON.stringify(result, null, 2);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const highIssues = result.issues.filter(i => i.severity === 'high');

  return (
    <div className="space-y-8">
      {/* 1. Pull Request Header */}
      {prInfo && (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg border-2 border-primary/20 shadow-lg p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-white break-words leading-tight flex-1">
                {prInfo.title}
              </h1>
              <Button
                variant="secondary"
                size="sm"
                onClick={copyToClipboard}
                className="shrink-0 shadow-lg"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <FileCode className="h-3.5 w-3.5 text-white flex-shrink-0" />
                <span className="text-white text-sm font-medium">@{prInfo.author}</span>
              </div>

              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Code2 className="h-3.5 w-3.5 text-white flex-shrink-0" />
                <span className="text-white text-sm whitespace-nowrap">{prInfo.changedFiles} {prInfo.changedFiles === 1 ? 'file' : 'files'}</span>
              </div>

              <div className="flex items-center gap-2 bg-green-500/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-green-400/30">
                <span className="text-white text-sm font-semibold whitespace-nowrap">+{prInfo.additions} additions</span>
              </div>

              <div className="flex items-center gap-2 bg-red-500/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-red-400/30">
                <span className="text-white text-sm font-semibold whitespace-nowrap">-{prInfo.deletions} deletions</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Executive Summary */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Executive Summary</h2>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-base leading-relaxed">{result.summary}</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Critical Alerts - Security & High Priority Issues */}
      {((result.security_issues && result.security_issues.length > 0) || highIssues.length > 0) && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Critical Alerts</h2>
          </div>

          <div className="space-y-4">
            {/* Security Vulnerabilities */}
            {result.security_issues && result.security_issues.length > 0 && (
              <Card className="border-2 border-red-300 dark:border-red-900 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-red-600 dark:bg-red-700 shadow-lg">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-red-900 dark:text-red-100">
                        {result.security_issues.length} Security {result.security_issues.length === 1 ? 'Vulnerability' : 'Vulnerabilities'}
                      </CardTitle>
                      <CardDescription className="text-red-700 dark:text-red-300">
                        Immediate attention required
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.security_issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="border-2 border-red-200 dark:border-red-900 rounded-lg p-5 bg-white dark:bg-slate-900 shadow-md"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <Badge
                            variant="destructive"
                            className={`text-sm font-bold ${
                              issue.severity === 'CRITICAL' ? 'bg-red-700 dark:bg-red-800' :
                              issue.severity === 'HIGH' ? 'bg-red-600 dark:bg-red-700' :
                              issue.severity === 'MEDIUM' ? 'bg-orange-500 dark:bg-orange-600' :
                              'bg-yellow-500 dark:bg-yellow-600'
                            }`}
                          >
                            <Flame className="h-3.5 w-3.5 mr-1" />
                            {issue.severity}
                          </Badge>
                          <Badge variant="outline" className="font-semibold">
                            {issue.type}
                          </Badge>
                          {issue.file && (
                            <code className="text-xs bg-red-100 dark:bg-red-950 px-2.5 py-1 rounded font-mono ml-auto">
                              {issue.file}{issue.line && `:${issue.line}`}
                            </code>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-bold text-red-900 dark:text-red-100 mb-1">Vulnerability</h4>
                            <p className="text-sm leading-relaxed text-foreground">{issue.description}</p>
                          </div>

                          <div className="bg-red-100 dark:bg-red-950/50 border-l-4 border-red-600 p-4 rounded-r">
                            <h4 className="text-sm font-bold text-red-900 dark:text-red-100 mb-1">⚠️ Risk</h4>
                            <p className="text-sm leading-relaxed text-red-800 dark:text-red-200">{issue.risk}</p>
                          </div>

                          <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-600 p-4 rounded-r">
                            <h4 className="text-sm font-bold text-green-900 dark:text-green-100 mb-1">✓ How to Fix</h4>
                            <p className="text-sm leading-relaxed text-green-800 dark:text-green-200">{issue.remediation}</p>
                          </div>

                          {issue.code_snippet && (
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Problematic Code:</h4>
                              <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-3 rounded-lg overflow-x-auto text-xs border border-slate-700">
                                <code>{issue.code_snippet}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* High Priority Issues Summary */}
            {highIssues.length > 0 && (
              <Card className="border-2 border-red-200 dark:border-red-900">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      <span className="font-semibold text-lg">High Priority Issues Detected</span>
                    </div>
                    <Badge variant="destructive" className="text-xl px-4 py-1">
                      {highIssues.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* 4. Code Metrics Dashboard */}
      {result.metrics && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Code Metrics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.metrics.complexity_score !== undefined && (
              <Card className="border-blue-200 dark:border-blue-900">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {result.metrics.complexity_score}/10
                    </div>
                    <p className="text-sm text-muted-foreground">Complexity Score</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {result.metrics.technical_debt && (
              <Card className={`border-2 ${
                result.metrics.technical_debt === 'High' ? 'border-red-300 dark:border-red-900' :
                result.metrics.technical_debt === 'Medium' ? 'border-yellow-300 dark:border-yellow-900' :
                'border-green-300 dark:border-green-900'
              }`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${
                      result.metrics.technical_debt === 'High' ? 'text-red-600 dark:text-red-400' :
                      result.metrics.technical_debt === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {result.metrics.technical_debt}
                    </div>
                    <p className="text-sm text-muted-foreground">Technical Debt</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {result.metrics.risk_score !== undefined && (
              <Card className="border-purple-200 dark:border-purple-900">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {result.metrics.risk_score}%
                    </div>
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          result.metrics.risk_score >= 70 ? 'bg-red-500' :
                          result.metrics.risk_score >= 40 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${result.metrics.risk_score}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* 5. Code Quality Improvements */}
      {result.code_quality.improvements.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Code Quality Improvements</h2>
          </div>

          <Card>
            <CardHeader>
              <CardDescription>
                {result.code_quality.improvements.length} suggestions to enhance code quality - click to view details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {result.code_quality.improvements.map((improvement, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg mb-3 px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-start gap-4 w-full pr-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
                          {idx + 1}
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-semibold leading-relaxed">{improvement}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-12 pr-4 space-y-4">
                        {/* Why This Matters */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                            <h4 className="text-sm font-semibold text-foreground">Why This Matters</h4>
                          </div>
                          <div className="pl-6 text-sm text-muted-foreground leading-relaxed">
                            <p>
                              {improvement.toLowerCase().includes('error') || improvement.toLowerCase().includes('exception')
                                ? 'Proper error handling prevents application crashes and provides better user experience by gracefully managing unexpected situations.'
                                : improvement.toLowerCase().includes('performance') || improvement.toLowerCase().includes('optimize')
                                ? 'Performance optimizations reduce resource consumption, improve response times, and create a smoother user experience.'
                                : improvement.toLowerCase().includes('type') || improvement.toLowerCase().includes('typescript')
                                ? 'Strong typing catches errors at compile-time, improves IDE autocomplete, and makes code more maintainable.'
                                : improvement.toLowerCase().includes('test') || improvement.toLowerCase().includes('coverage')
                                ? 'Comprehensive testing ensures code reliability, prevents regressions, and gives confidence when making changes.'
                                : improvement.toLowerCase().includes('security') || improvement.toLowerCase().includes('vulnerable')
                                ? 'Security improvements protect user data, prevent unauthorized access, and maintain application integrity.'
                                : improvement.toLowerCase().includes('document') || improvement.toLowerCase().includes('comment')
                                ? 'Clear documentation helps team members understand code faster, reduces onboarding time, and prevents misuse.'
                                : 'This improvement enhances code maintainability, readability, and follows industry best practices.'}
                            </p>
                          </div>
                        </div>

                        {/* Implementation Steps */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-blue-500" />
                            <h4 className="text-sm font-semibold text-foreground">How to Implement</h4>
                          </div>
                          <div className="pl-6 space-y-2">
                            <div className="text-sm text-muted-foreground leading-relaxed">
                              {improvement.toLowerCase().includes('error') || improvement.toLowerCase().includes('exception')
                                ? (
                                  <ul className="list-disc list-inside space-y-1">
                                    <li>Wrap risky operations in try-catch blocks</li>
                                    <li>Create custom error classes for specific scenarios</li>
                                    <li>Add user-friendly error messages</li>
                                    <li>Log errors for debugging while showing graceful UI</li>
                                  </ul>
                                )
                                : improvement.toLowerCase().includes('performance') || improvement.toLowerCase().includes('optimize')
                                ? (
                                  <ul className="list-disc list-inside space-y-1">
                                    <li>Profile code to identify bottlenecks</li>
                                    <li>Use memoization for expensive computations</li>
                                    <li>Implement lazy loading where appropriate</li>
                                    <li>Optimize database queries and API calls</li>
                                  </ul>
                                )
                                : improvement.toLowerCase().includes('type') || improvement.toLowerCase().includes('typescript')
                                ? (
                                  <ul className="list-disc list-inside space-y-1">
                                    <li>Add explicit type annotations to function parameters</li>
                                    <li>Define interfaces for complex objects</li>
                                    <li>Use union types for variables with multiple possible types</li>
                                    <li>Enable strict mode in TypeScript config</li>
                                  </ul>
                                )
                                : improvement.toLowerCase().includes('test') || improvement.toLowerCase().includes('coverage')
                                ? (
                                  <ul className="list-disc list-inside space-y-1">
                                    <li>Write unit tests for individual functions</li>
                                    <li>Add integration tests for critical user flows</li>
                                    <li>Use test coverage tools to identify gaps</li>
                                    <li>Implement continuous integration for automated testing</li>
                                  </ul>
                                )
                                : improvement.toLowerCase().includes('security') || improvement.toLowerCase().includes('vulnerable')
                                ? (
                                  <ul className="list-disc list-inside space-y-1">
                                    <li>Validate and sanitize all user inputs</li>
                                    <li>Use parameterized queries to prevent injection attacks</li>
                                    <li>Implement proper authentication and authorization</li>
                                    <li>Keep dependencies updated and audit for vulnerabilities</li>
                                  </ul>
                                )
                                : improvement.toLowerCase().includes('document') || improvement.toLowerCase().includes('comment')
                                ? (
                                  <ul className="list-disc list-inside space-y-1">
                                    <li>Add JSDoc comments to public functions</li>
                                    <li>Document complex logic and edge cases</li>
                                    <li>Keep README files up to date</li>
                                    <li>Use self-documenting variable and function names</li>
                                  </ul>
                                )
                                : (
                                  <ul className="list-disc list-inside space-y-1">
                                    <li>Review relevant best practices and style guides</li>
                                    <li>Refactor code incrementally to avoid breaking changes</li>
                                    <li>Add tests before making significant changes</li>
                                    <li>Get code reviewed by team members</li>
                                  </ul>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Expected Impact */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">Expected Impact</h4>
                              <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                                {improvement.toLowerCase().includes('error') || improvement.toLowerCase().includes('exception')
                                  ? 'Reduces application crashes by 40-60%, improves user trust and satisfaction.'
                                  : improvement.toLowerCase().includes('performance') || improvement.toLowerCase().includes('optimize')
                                  ? 'Can improve response times by 30-70%, reduces server costs and enhances UX.'
                                  : improvement.toLowerCase().includes('type') || improvement.toLowerCase().includes('typescript')
                                  ? 'Catches 15-30% of bugs before runtime, accelerates development speed.'
                                  : improvement.toLowerCase().includes('test') || improvement.toLowerCase().includes('coverage')
                                  ? 'Reduces production bugs by 40-80%, increases deployment confidence.'
                                  : improvement.toLowerCase().includes('security') || improvement.toLowerCase().includes('vulnerable')
                                  ? 'Prevents data breaches, protects user privacy, maintains compliance.'
                                  : improvement.toLowerCase().includes('document') || improvement.toLowerCase().includes('comment')
                                  ? 'Reduces onboarding time by 50%, decreases maintenance costs.'
                                  : 'Improves overall code quality, maintainability, and team productivity.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 6. Detected Issues */}
      {result.issues.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bug className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Detected Issues</h2>
          </div>

          <Card>
            <CardHeader>
              <CardDescription>
                {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''} identified that require attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.issues.map((issue, idx) => (
                  <div key={idx} className="border rounded-lg p-5 space-y-3 hover:shadow-md transition-shadow bg-card">
                    <div className="flex items-start gap-3 flex-wrap">
                      <Badge variant={getSeverityColor(issue.severity)} className="shrink-0">
                        {getSeverityIcon(issue.severity)}
                        <span className="ml-1.5 capitalize font-semibold">{issue.severity}</span>
                      </Badge>
                      {issue.file && (
                        <code className="text-xs bg-muted px-2.5 py-1 rounded font-mono">
                          {issue.file}{issue.line && `:${issue.line}`}
                        </code>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Problem</div>
                        <div className="font-semibold text-base leading-snug">{issue.description}</div>
                      </div>

                      {issue.original_code && issue.fixed_code && (
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-xs font-bold text-red-700 dark:text-red-400">Before (Problematic):</h4>
                            </div>
                            <pre className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 rounded-lg overflow-x-auto text-xs">
                              <code className="text-red-900 dark:text-red-100">{issue.original_code}</code>
                            </pre>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-xs font-bold text-green-700 dark:text-green-400">After (Fixed):</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => {
                                  navigator.clipboard.writeText(issue.fixed_code || '');
                                }}
                              >
                                <ClipboardCopy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <pre className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-3 rounded-lg overflow-x-auto text-xs">
                              <code className="text-green-900 dark:text-green-100">{issue.fixed_code}</code>
                            </pre>
                          </div>

                          {issue.explanation && (
                            <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-3 rounded-r">
                              <p className="text-xs text-blue-900 dark:text-blue-100 leading-relaxed">
                                <span className="font-semibold">Why this works:</span> {issue.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {!issue.original_code && (
                        <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-4 rounded-r">
                          <div className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300 mb-2 font-semibold">
                            💡 Recommended Fix
                          </div>
                          <div className="text-sm leading-relaxed text-blue-900 dark:text-blue-100">
                            {issue.suggestion}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 7. Performance Analysis */}
      {result.performance_issues && result.performance_issues.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <h2 className="text-2xl font-bold">Performance Analysis</h2>
          </div>

          <Card className="border-yellow-200 dark:border-yellow-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-950">
                  <Activity className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <CardTitle>Performance Concerns</CardTitle>
                  <CardDescription>
                    {result.performance_issues.length} optimization opportunity{result.performance_issues.length !== 1 ? 's' : ''} detected
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.performance_issues.map((perf, idx) => (
                  <div key={idx} className="border border-yellow-200 dark:border-yellow-900 rounded-lg p-4 bg-yellow-50/50 dark:bg-yellow-950/20">
                    <div className="flex items-start gap-3 mb-3">
                      <Badge variant={perf.severity === 'high' ? 'destructive' : perf.severity === 'medium' ? 'default' : 'secondary'}>
                        {perf.severity.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        {perf.impact === 'high' && <><Zap className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" /><Zap className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" /><Zap className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" /></>}
                        {perf.impact === 'medium' && <><Zap className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" /><Zap className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" /></>}
                        {perf.impact === 'low' && <Zap className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />}
                        <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                          {perf.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                      {perf.file && (
                        <code className="text-xs bg-yellow-100 dark:bg-yellow-950 px-2.5 py-1 rounded font-mono ml-auto">
                          {perf.file}{perf.line && `:${perf.line}`}
                        </code>
                      )}
                    </div>

                    <p className="text-sm font-medium mb-3">{perf.description}</p>

                    <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-600 p-3 rounded-r">
                      <p className="text-xs text-green-800 dark:text-green-200">
                        <span className="font-semibold">Optimization:</span> {perf.suggestion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 8. Test Coverage Suggestions */}
      {result.test_suggestions && result.test_suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TestTube className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold">Test Coverage Suggestions</h2>
          </div>

          <Card className="border-purple-200 dark:border-purple-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                  <TestTube className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Missing Test Coverage</CardTitle>
                  <CardDescription>
                    {result.test_suggestions.length} function{result.test_suggestions.length !== 1 ? 's' : ''} need{result.test_suggestions.length === 1 ? 's' : ''} additional tests
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.test_suggestions.map((test, idx) => (
                  <div key={idx} className="border border-purple-200 dark:border-purple-900 rounded-lg p-4 bg-purple-50/50 dark:bg-purple-950/20">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <code className="text-sm font-bold text-purple-900 dark:text-purple-100">{test.function}</code>
                        <p className="text-xs text-muted-foreground mt-1">{test.file}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-purple-900 dark:text-purple-100 mb-2">Missing Test Cases:</h4>
                      <ul className="space-y-1">
                        {test.missing_tests.map((missing, mIdx) => (
                          <li key={mIdx} className="text-xs text-purple-800 dark:text-purple-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            {missing}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-purple-900 dark:text-purple-100">Test Template:</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            navigator.clipboard.writeText(test.test_skeleton);
                          }}
                        >
                          <ClipboardCopy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-3 rounded-lg overflow-x-auto text-xs border border-slate-700">
                        <code>{test.test_skeleton}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 9. Complexity Analysis */}
      {result.complexity_analysis && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Complexity Analysis</h2>
          </div>

          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                  <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>Code Maintainability & Structure</CardTitle>
                  <CardDescription>
                    Assessment of code complexity and long-term maintainability
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                <p className="text-sm leading-relaxed">{result.complexity_analysis}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
