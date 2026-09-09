import { describe, it, expect } from 'vitest';
import { lessons } from './lessons';
import { modules } from './modules';
import { exercises } from './exercises';
import { projects } from './projects';

describe('content integrity', () => {
  it('all modules have valid lessons', () => {
    for (const mod of modules) {
      expect(mod.lessonIds.length).toBeGreaterThan(0);
      for (const id of mod.lessonIds) {
        const lesson = lessons.find(l => l.id === id);
        expect(lesson, `lesson ${id} should exist`).toBeDefined();
        expect(lesson?.moduleId).toBe(mod.id);
      }
    }
  });

  it('lessons have required fields and no placeholder', () => {
    for (const lesson of lessons) {
      expect(lesson.title).toBeTruthy();
      expect(lesson.description).toBeTruthy();
      expect(lesson.theory.length).toBeGreaterThan(0);
      expect(lesson.takeaway).toBeTruthy();
      expect(lesson.takeaway.toLowerCase()).not.toContain('lorem ipsum');
      expect(lesson.description.toLowerCase()).not.toContain('coming soon');
    }
  });

  it('lesson chain is consistent', () => {
    const lessonIds = new Set(lessons.map(l => l.id));
    for (const lesson of lessons) {
      if (lesson.prevLessonId) {
        expect(lessonIds.has(lesson.prevLessonId)).toBe(true);
      }
      if (lesson.nextLessonId) {
        expect(lessonIds.has(lesson.nextLessonId)).toBe(true);
      }
    }
  });

  it('exercises have test cases and starter code', () => {
    for (const ex of exercises) {
      expect(ex.starterCode).toBeTruthy();
      expect(ex.testCases.length).toBeGreaterThan(0);
      expect(ex.title).toBeTruthy();
    }
  });

  it('projects have requirements', () => {
    for (const p of projects) {
      expect(p.requirements.length).toBeGreaterThan(0);
      expect(p.milestones.length).toBeGreaterThan(0);
    }
  });

  it('total counts meet minimum', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(20);
    expect(exercises.length).toBeGreaterThanOrEqual(10);
    expect(projects.length).toBeGreaterThanOrEqual(4);
  });
});
