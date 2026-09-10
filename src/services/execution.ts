import type { ExecutionResult, SubmissionResult, TestCase } from '../types';

const PISTON_API = 'https://emkc.org/api/v2/piston/execute';
const LANGUAGE = 'c++';
const VERSION = '10.2.0';

interface PistonResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
}

function normalizeOutput(s: string): string {
  // Trim trailing whitespace per line, normalize line endings, trim overall
  return s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

function extractCompilerError(stderr: string, compileStdout: string, compileStderr: string): string | undefined {
  const combined = `${compileStderr}\n${compileStdout}\n${stderr}`.trim();
  if (!combined) return undefined;
  // Try to extract first meaningful error line
  const lines = combined.split('\n');
  // Look for error: pattern
  const errorLine = lines.find(l => l.toLowerCase().includes('error:'));
  if (errorLine) {
    // Try to extract line number
    const match = errorLine.match(/:(\d+):\d*:\s*error:/);
    if (match) {
      return `Line ${match[1]}: ${errorLine.split('error:').pop()?.trim() || errorLine}`;
    }
    return errorLine.trim();
  }
  return lines[0]?.trim();
}

export class CodeExecutionService {
  private abortController: AbortController | null = null;

  async execute(code: string, stdin: string = '', timeoutMs: number = 10000): Promise<ExecutionResult> {
    // Cancel previous
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    const timeout = setTimeout(() => {
      this.abortController?.abort();
    }, timeoutMs);

    try {
      const response = await fetch(PISTON_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: LANGUAGE,
          version: VERSION,
          files: [{ name: 'main.cpp', content: code }],
          stdin,
          args: [],
          compile_timeout: 10000,
          run_timeout: 3000,
        }),
        signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        return {
          status: 'service_error',
          stdout: '',
          stderr: text || `Service returned ${response.status}`,
          errorMessage: `Execution service unavailable (${response.status}). Please try again.`,
        };
      }

      const data: PistonResponse = await response.json();

      // Check compile stage
      if (data.compile && data.compile.code !== 0) {
        const compileOutput = (data.compile.stdout + '\n' + data.compile.stderr).trim();
        const errorMsg = extractCompilerError(data.run?.stderr || '', data.compile.stdout, data.compile.stderr);
        return {
          status: 'compile_error',
          stdout: data.run?.stdout || '',
          stderr: data.run?.stderr || '',
          compileOutput,
          exitCode: data.compile.code,
          errorMessage: errorMsg || 'Compilation failed',
        };
      }

      // Check run stage
      if (data.run.code !== 0) {
        // Could be runtime error
        const stderr = data.run.stderr.trim();
        const isRuntimeError = stderr.length > 0 || data.run.signal !== null;
        return {
          status: isRuntimeError ? 'runtime_error' : 'success',
          stdout: data.run.stdout,
          stderr: data.run.stderr,
          exitCode: data.run.code,
          errorMessage: isRuntimeError ? (stderr || `Program exited with code ${data.run.code}`) : undefined,
        };
      }

      return {
        status: 'success',
        stdout: data.run.stdout,
        stderr: data.run.stderr,
        exitCode: data.run.code,
      };
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof DOMException && err.name === 'AbortError') {
        return {
          status: 'timeout',
          stdout: '',
          stderr: '',
          errorMessage: 'Execution timed out. Your program may have an infinite loop.',
        };
      }
      return {
        status: 'service_error',
        stdout: '',
        stderr: err instanceof Error ? err.message : String(err),
        errorMessage: 'Could not reach execution service. Check your connection and try again.',
      };
    }
  }

  async submit(code: string, testCases: TestCase[]): Promise<SubmissionResult> {
    const results: SubmissionResult['results'] = [];
    let passed = 0;

    for (const tc of testCases) {
      const exec = await this.execute(code, tc.input, 8000);

      if (exec.status === 'compile_error') {
        return {
          status: 'compile_error',
          passed: 0,
          total: testCases.length,
          results: [
            {
              testCaseId: tc.id,
              passed: false,
              input: tc.input,
              expected: tc.expectedOutput,
              actual: exec.compileOutput || exec.stderr,
              isHidden: !!tc.isHidden,
            },
          ],
          executionResult: exec,
        };
      }

      if (exec.status === 'service_error' || exec.status === 'timeout') {
        return {
          status: exec.status === 'timeout' ? 'timeout' : 'service_error',
          passed,
          total: testCases.length,
          results,
          executionResult: exec,
        };
      }

      if (exec.status === 'runtime_error') {
        return {
          status: 'runtime_error',
          passed,
          total: testCases.length,
          results: [
            ...results,
            {
              testCaseId: tc.id,
              passed: false,
              input: tc.input,
              expected: tc.expectedOutput,
              actual: exec.stderr || exec.stdout,
              isHidden: !!tc.isHidden,
            },
          ],
          executionResult: exec,
        };
      }

      const actualNorm = normalizeOutput(exec.stdout);
      const expectedNorm = normalizeOutput(tc.expectedOutput);
      const ok = actualNorm === expectedNorm;

      if (ok) passed++;

      results.push({
        testCaseId: tc.id,
        passed: ok,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: exec.stdout,
        isHidden: !!tc.isHidden,
      });

      // Early exit on first failure for hidden tests? Continue to count.
      // But for UX, if first visible fails, we still want to show it.
    }

    const allPassed = passed === testCases.length;
    return {
      status: allPassed ? 'accepted' : 'wrong_answer',
      passed,
      total: testCases.length,
      results,
    };
  }

  cancel() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

export const executionService = new CodeExecutionService();
