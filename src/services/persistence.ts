import type { UserProgress, ExerciseResult } from '../types';

const STORAGE_KEY = 'learn-cpp-progress-v1';
const CURRENT_VERSION = 1;

function createDefaultProgress(): UserProgress {
  return {
    version: CURRENT_VERSION,
    completedLessons: [],
    completedExercises: [],
    completedProjects: [],
    exerciseResults: {},
    lastActiveAt: Date.now(),
  };
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw);
    // Validate version
    if (!parsed.version || parsed.version !== CURRENT_VERSION) {
      // Migrate if needed, for now reset but keep compatible fields
      const migrated: UserProgress = {
        version: CURRENT_VERSION,
        completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
        completedExercises: Array.isArray(parsed.completedExercises) ? parsed.completedExercises : [],
        completedProjects: Array.isArray(parsed.completedProjects) ? parsed.completedProjects : [],
        currentLessonId: typeof parsed.currentLessonId === 'string' ? parsed.currentLessonId : undefined,
        exerciseResults: typeof parsed.exerciseResults === 'object' && parsed.exerciseResults !== null ? parsed.exerciseResults : {},
        lastActiveAt: Date.now(),
      };
      saveProgress(migrated);
      return migrated;
    }
    // Ensure all fields exist
    return {
      version: CURRENT_VERSION,
      completedLessons: Array.isArray(parsed.completedLessons) ? [...parsed.completedLessons] : [],
      completedExercises: Array.isArray(parsed.completedExercises) ? [...parsed.completedExercises] : [],
      completedProjects: Array.isArray(parsed.completedProjects) ? [...parsed.completedProjects] : [],
      currentLessonId: parsed.currentLessonId,
      exerciseResults: parsed.exerciseResults ? { ...parsed.exerciseResults } : {},
      lastActiveAt: parsed.lastActiveAt || Date.now(),
    };
  } catch {
    // Corrupted data
    console.warn('Corrupted progress data, resetting');
    localStorage.removeItem(STORAGE_KEY);
    return createDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    const toSave = { ...progress, lastActiveAt: Date.now(), version: CURRENT_VERSION };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
}

export function markLessonComplete(lessonId: string): UserProgress {
  const progress = loadProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  progress.currentLessonId = lessonId;
  saveProgress(progress);
  return progress;
}

export function markExerciseComplete(exerciseId: string, result: ExerciseResult): UserProgress {
  const progress = loadProgress();
  progress.exerciseResults[exerciseId] = result;
  if (result.status === 'accepted' && !progress.completedExercises.includes(exerciseId)) {
    progress.completedExercises.push(exerciseId);
  }
  saveProgress(progress);
  return progress;
}

export function markProjectComplete(projectId: string): UserProgress {
  const progress = loadProgress();
  if (!progress.completedProjects.includes(projectId)) {
    progress.completedProjects.push(projectId);
  }
  saveProgress(progress);
  return progress;
}

export function setCurrentLesson(lessonId: string): UserProgress {
  const progress = loadProgress();
  progress.currentLessonId = lessonId;
  saveProgress(progress);
  return progress;
}

export function resetProgress(): UserProgress {
  const fresh = createDefaultProgress();
  saveProgress(fresh);
  return fresh;
}

export function getProgressStats(progress: UserProgress, totalLessons: number, totalExercises: number) {
  const lessonPct = totalLessons > 0 ? Math.round((progress.completedLessons.length / totalLessons) * 100) : 0;
  const exercisePct = totalExercises > 0 ? Math.round((progress.completedExercises.length / totalExercises) * 100) : 0;
  return {
    lessonsCompleted: progress.completedLessons.length,
    exercisesCompleted: progress.completedExercises.length,
    projectsCompleted: progress.completedProjects.length,
    lessonPct,
    exercisePct,
    totalLessons,
    totalExercises,
  };
}
