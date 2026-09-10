import { describe, it, expect, beforeEach } from 'vitest';
import { loadProgress, saveProgress, markLessonComplete, resetProgress } from './persistence';
import type { UserProgress } from '../types';

describe('persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads default progress when empty', () => {
    const p = loadProgress();
    expect(p.completedLessons).toEqual([]);
    expect(p.version).toBe(1);
  });

  it('saves and loads progress', () => {
    const progress: UserProgress = {
      version: 1,
      completedLessons: ['a', 'b'],
      completedExercises: ['ex1'],
      completedProjects: [],
      exerciseResults: {},
      lastActiveAt: Date.now(),
    };
    saveProgress(progress);
    const loaded = loadProgress();
    expect(loaded.completedLessons).toEqual(['a', 'b']);
    expect(loaded.completedExercises).toEqual(['ex1']);
  });

  it('marks lesson complete', () => {
    markLessonComplete('first-program');
    const p = loadProgress();
    expect(p.completedLessons).toContain('first-program');
  });

  it('handles corrupted data gracefully', () => {
    localStorage.setItem('learn-cpp-progress-v1', 'not json');
    const p = loadProgress();
    expect(p.completedLessons).toEqual([]);
  });

  it('resets progress', () => {
    markLessonComplete('first-program');
    resetProgress();
    const p = loadProgress();
    expect(p.completedLessons).toEqual([]);
  });
});
