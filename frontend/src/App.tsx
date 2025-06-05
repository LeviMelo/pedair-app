import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import FormBuilderPage from './pages/FormBuilderPage';
import RoleEditorPage from './pages/RoleEditorPage';
import DataSubmissionPage from './pages/DataSubmissionPage';
import PatientSearchPage from './pages/PatientSearchPage';
import NotificationSchedulerPage from './pages/NotificationSchedulerPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Import the actual ProjectDetailsPage
import ProjectDetailsPage from './pages/ProjectDetailsPage'; 
import CreateProjectPage from './pages/CreateProjectPage';

// Test pages (can be kept for development or removed later)
import TestRecuperacaoFormPage from './pages/TestRecuperacaoFormPage';
import TestPreAnestesiaFormPage from './pages/TestPreAnestesiaFormPage';
import TestIntraoperatoriaFormPage from './pages/TestIntraoperatoriaFormPage';

// Placeholder for ProjectDetailsPage - User will create this file manually
// import ProjectDetailsPage from './pages/ProjectDetailsPage'; 

import './index.css'; // Ensure global styles are loaded

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard/create-project" element={<CreateProjectPage />} />
        <Route path="project/:projectId" element={<ProjectDetailsPage />} /> 
        <Route path="forms" element={<DataSubmissionPage />} />
        <Route path="builder" element={<FormBuilderPage />} />
        <Route path="roles" element={<RoleEditorPage />} />
        <Route path="search" element={<PatientSearchPage />} />
        <Route path="scheduler" element={<NotificationSchedulerPage />} />
        <Route path="settings" element={<SettingsPage />} />
        
        {/* Routes for existing test form pages - can be integrated or kept separate */}
        <Route path="test/recuperacao" element={<TestRecuperacaoFormPage />} />
        <Route path="test/preanestesia" element={<TestPreAnestesiaFormPage />} />
        <Route path="test/intraoperatoria" element={<TestIntraoperatoriaFormPage />} />
      </Route>
      
      {/* Route for pages without the main layout, e.g., login, or a standalone NotFoundPage */}
      {/* For now, NotFoundPage will also use the Layout, but this can be changed. */}
      {/* To have NotFoundPage outside Layout, define a separate <Route path="*" element={<NotFoundPage />} /> outside the Layout route. */}
      {/* However, for a consistent experience, often 404 pages are also within the main layout. */}
      {/* If you want a full screen 404 without sidebar: */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
      {/* For now, let's make it part of the layout for simplicity, or a specific route if needed. */}
      {/* For a true catch-all, it should be outside and last. Let's use a specific path for now if needed or rely on nested. */}
      {/* A common pattern is to have the catch-all * within the Layout to show 404 within the app structure */}
      <Route path="/" element={<Layout />}> {/* Re-opening Layout for the wildcard to be inside it */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;