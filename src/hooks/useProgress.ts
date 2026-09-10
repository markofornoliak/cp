import { useEffect, useState, useCallback } from 'react';
import type { UserProgress, ExerciseResult } from '../types';
import {
  loadProgress,
  saveProgress,
  markLessonComplete as svcMarkLesson,
  markExerciseComplete as svcMarkExercise,
  markProjectComplete as svcMarkProject,
  setCurrentLesson as svcSetCurrent,
  resetProgress as svcReset,
} from '../services/persistence';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const refresh = useCallback(() => {
    setProgress(loadProgress());
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    const p = svcMarkLesson(lessonId);
    setProgress(p);
  }, []);

  const markExerciseComplete = useCallback((exerciseId: string, result: ExerciseResult) => {
    const p = svcMarkExercise(exerciseId, result);
    setProgress(p);
  }, []);

  const markProjectComplete = useCallback((projectId: string) => {
    const p = svcMarkProject(projectId);
    setProgress(p);
  }, []);

  const setCurrentLesson = useCallback((lessonId: string) => {
    const p = svcSetCurrent(lessonId);
    setProgress(p);
  }, []);

  const reset = useCallback(() => {
    const p = svcReset();
    setProgress(p);
  }, []);

  const updateProgress = useCallback((updater: (prev: UserProgress) => UserProgress) => {
    const current = loadProgress();
    const next = updater(current);
    saveProgress(next);
    setProgress(next);
  }, []);

  return {
    progress,
    refresh,
    markLessonComplete,
    markExerciseComplete,
    markProjectComplete,
    setCurrentLesson,
    reset,
    updateProgress,
  };
}
