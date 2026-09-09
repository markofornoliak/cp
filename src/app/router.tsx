import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Welcome } from '../pages/Welcome';
import { Home } from '../pages/Home';
import { Learn } from '../pages/Learn';
import { LessonPage } from '../pages/LessonPage';
import { PracticeList } from '../pages/PracticeList';
import { PracticeDetail } from '../pages/PracticeDetail';
import { ProjectsList, ProjectDetail } from '../pages/Projects';
import { ProgressPage } from '../pages/Progress';
import { Settings } from '../pages/Settings';

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:lessonId" element={<LessonPage />} />
          <Route path="/practice" element={<PracticeList />} />
          <Route path="/practice/:exerciseId" element={<PracticeDetail />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
