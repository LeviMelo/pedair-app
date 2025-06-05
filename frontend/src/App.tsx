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
        
        {/* Project-specific routes */}
        <Route path="project/:projectId">
          <Route index element={<ProjectDetailsPage />} />
          <Route path="submission" element={<DataSubmissionPage />} />
          <Route path="builder" element={<FormBuilderPage />} />
          <Route path="roles" element={<RoleEditorPage />} />
          <Route path="search" element={<PatientSearchPage />} />
          <Route path="notifications" element={<NotificationSchedulerPage />} />
        </Route>
        
        <Route path="settings" element={<SettingsPage />} />
        
        {/* Routes for existing test form pages - can be integrated or kept separate */}
        <Route path="test/recuperacao" element={<TestRecuperacaoFormPage />} />
        <Route path="test/preanestesia" element={<TestPreAnestesiaFormPage />} />
        <Route path="test/intraoperatoria" element={<TestIntraoperatoriaFormPage />} />

        {/* Catch-all for 404 Not Found pages */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;