import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { PiArrowLeftDuotone } from 'react-icons/pi';

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 min-h-full">
      <header className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')} 
          iconLeft={<PiArrowLeftDuotone />}
          className="text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-2"
        >
          Back to Dashboard
        </Button>
        <h1 className="page-header">Create New Project</h1>
        <p className="page-subheader">
          Define the details for your new research project.
        </p>
      </header>

      <div className="card-base p-6 sm:p-8 rounded-lg">
        <h2 className="card-title mb-4">Project Configuration</h2>
        <p className="text-slate-600 dark:text-slate-400">
          The interface for defining project metadata, privacy policies, initial roles, and other settings will be implemented here.
        </p>
        {/* Placeholder for form elements */}
        <div className="mt-6 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-10 text-center">
          <p className="text-slate-500 dark:text-slate-400">Project creation form elements will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage; 