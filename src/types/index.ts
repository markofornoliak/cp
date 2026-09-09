export type TheoryBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; level?: 2 | 3 }
  | { type: 'code'; code: string; language?: string; caption?: string }
  | { type: 'callout'; text: string; variant?: 'info' | 'tip' | 'warning' }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'divider' };

export interface CodeExample {
  id: string;
  title?: string;
  code: string;
  explanation?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  durationMinutes: number;
  objectives: string[];
  theory: TheoryBlock[];
  examples: CodeExample[];
  takeaway: string;
  exerciseIds: string[];
  prevLessonId?: string;
  nextLessonId?: string;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
  order: number;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  description?: string;
}

export interface Exercise {
  id: string;
  lessonId?: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  prompt: string;
  starterCode: string;
  sampleInput?: string;
  sampleOutput?: string;
  testCases: TestCase[];
  hints?: string[];
  concepts: string[];
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  goal: string;
  requirements: string[];
  milestones: { title: string; description: string }[];
  concepts: string[];
  hints?: string[];
  starterCode?: string;
}

export interface ExerciseResult {
  exerciseId: string;
  status: 'accepted' | 'wrong' | 'error' | 'timeout';
  timestamp: number;
  output?: string;
}

export interface UserProgress {
  version: number;
  completedLessons: string[];
  completedExercises: string[];
  completedProjects: string[];
  currentLessonId?: string;
  exerciseResults: Record<string, ExerciseResult>;
  lastActiveAt: number;
}

export type ExecutionStatus =
  | 'idle'
  | 'running'
  | 'success'
  | 'compile_error'
  | 'runtime_error'
  | 'timeout'
  | 'service_error';

export interface ExecutionResult {
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  compileOutput?: string;
  exitCode?: number;
  executionTimeMs?: number;
  errorMessage?: string;
}

export interface SubmissionResult {
  status: 'accepted' | 'wrong_answer' | 'compile_error' | 'runtime_error' | 'timeout' | 'service_error';
  passed: number;
  total: number;
  results: {
    testCaseId: string;
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    isHidden: boolean;
  }[];
  executionResult?: ExecutionResult;
}
