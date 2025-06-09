// src/pages/CreateProjectPage.tsx
import React, { useState } from 'react';
import { SectionCard } from '../components/ui/SectionCard'; // <-- Corrected import
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button'; // <-- Corrected import
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { InputField } from '../components/ui/InputField'; // <-- Corrected import
import TextareaField from '../components/ui/TextareaField';
import useProjectStore from '../stores/projectStore';
import useAuthStore from '../stores/authStore';

// ... rest of the file is correct
const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goals, setGoals] = useState('');
  const [error, setError] = useState('');
  const addProject = useProjectStore(state => state.addProject);
  const setActiveProject = useProjectStore(state => state.setActiveProject);
  const user = useAuthStore(state => state.user);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name) {
      setError('Project name is required.');
      return;
    }
    if (!user) {
      setError('You must be logged in to create a project.');
      return;
    }
    setError('');
    const newProject = {
      id: `proj_${new Date().getTime()}`,
      name,
      description,
      goals,
      members: [{ userId: user.id, roles: ['ProjectLead', 'Researcher'] }],
    };
    addProject(newProject);
    setActiveProject(newProject.id);
    navigate(`/project/${newProject.id}`);
  };
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <Link to="/">
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <SectionCard title="Create New Project">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            id="projectName"
            label="Project Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., ERAS Protocol for Pediatric Thoracic Surgery"
            required
          />
          <TextareaField
            id="projectDescription"
            label="Project Description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="A brief summary of the project's main purpose and scope."
            rows={4}
          />
          <TextareaField
            id="projectGoals"
            label="Project Goals"
            value={goals}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGoals(e.target.value)}
            placeholder="List the primary objectives and aims of this research project."
            rows={4}
          />
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button 
              type="submit"
              variant="primary" 
              iconLeft={<FaPlus />}
            >
              Create Project
            </Button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};
export default CreateProjectPage;