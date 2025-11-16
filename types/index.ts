export interface CodeIssue {
  severity: 'high' | 'medium' | 'low';
  line?: number;
  file?: string;
  description: string;
  suggestion: string;
  original_code?: string;
  fixed_code?: string;
  explanation?: string;
}

export interface SecurityIssue {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  file?: string;
  line?: number;
  description: string;
  risk: string;
  remediation: string;
  code_snippet?: string;
}

export interface PerformanceIssue {
  severity: 'high' | 'medium' | 'low';
  description: string;
  file?: string;
  line?: number;
  impact: 'high' | 'medium' | 'low';
  suggestion: string;
}

export interface TestSuggestion {
  function: string;
  file: string;
  missing_tests: string[];
  test_skeleton: string;
}

export interface CodeMetrics {
  lines_added?: number;
  lines_removed?: number;
  files_changed?: number;
  complexity_score?: number;
  technical_debt?: string;
  risk_score?: number;
}

export interface CodeQuality {
  score: number;
  improvements: string[];
}

export interface AnalysisResult {
  summary: string;
  issues: CodeIssue[];
  security_concerns: string[];
  performance_tips: string[];
  code_quality: CodeQuality;
  complexity_analysis?: string;
  // Enhanced fields
  security_issues?: SecurityIssue[];
  performance_issues?: PerformanceIssue[];
  test_suggestions?: TestSuggestion[];
  metrics?: CodeMetrics;
}

export interface AnalyzeRequest {
  prUrl: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  prInfo?: {
    title: string;
    author: string;
    additions: number;
    deletions: number;
    changedFiles: number;
  };
}
