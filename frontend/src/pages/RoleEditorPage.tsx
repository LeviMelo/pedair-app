import React, { useState } from 'react';
import SectionCard from '../components/ui/SectionCard';
import InputField from '../components/ui/InputField';

// --- Mock Data & Types ---
type Permission = 'can_submit_forms' | 'can_view_submissions' | 'can_edit_project_settings' | 'can_manage_users' | 'can_build_forms';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

const MOCK_PERMISSIONS_LIST: { id: Permission, label: string }[] = [
  { id: 'can_submit_forms', label: 'Submit Forms' },
  { id: 'can_view_submissions', label: 'View Submissions' },
  { id: 'can_edit_project_settings', label: 'Edit Project Settings' },
  { id: 'can_manage_users', label: 'Manage Users' },
  { id: 'can_build_forms', label: 'Build Forms' },
];

const initialRoles: Role[] = [
  { id: '1', name: 'Researcher', description: 'Can submit forms and view submissions.', permissions: ['can_submit_forms', 'can_view_submissions'] },
  { id: '2', name: 'Project Admin', description: 'Full control over the project.', permissions: ['can_submit_forms', 'can_view_submissions', 'can_edit_project_settings', 'can_manage_users', 'can_build_forms'] },
  { id: '3', name: 'Data Entry Clerk', description: 'Can only submit forms.', permissions: ['can_submit_forms'] },
];

// --- RoleEditorPage Component ---
const RoleEditorPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<Permission[]>([]);

  const [isCreatingNewRole, setIsCreatingNewRole] = useState(false);

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setNewRoleName(role.name);
    setNewRoleDescription(role.description);
    setNewRolePermissions([...role.permissions]);
    setIsCreatingNewRole(false);
  };

  const handlePermissionToggle = (permissionId: Permission) => {
    setNewRolePermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSaveRole = () => {
    if (!newRoleName.trim()) {
      alert('Role name cannot be empty.');
      return;
    }
    if (isCreatingNewRole) {
      const newRole: Role = {
        id: String(Date.now()), // Simple unique ID for mock
        name: newRoleName,
        description: newRoleDescription,
        permissions: [...newRolePermissions],
      };
      setRoles(prev => [...prev, newRole]);
      alert(`Role '${newRole.name}' created successfully!`);
    } else if (selectedRole) {
      setRoles(prev => prev.map(r => 
        r.id === selectedRole.id 
          ? { ...r, name: newRoleName, description: newRoleDescription, permissions: [...newRolePermissions] } 
          : r
      ));
      alert(`Role '${newRoleName}' updated successfully!`);
    }
    // Reset form
    setSelectedRole(null);
    setNewRoleName('');
    setNewRoleDescription('');
    setNewRolePermissions([]);
    setIsCreatingNewRole(false);
  };

  const handleStartCreateNewRole = () => {
    setSelectedRole(null);
    setNewRoleName('');
    setNewRoleDescription('');
    setNewRolePermissions([]);
    setIsCreatingNewRole(true);
  };
  
  const handleCancelEdit = () => {
    setSelectedRole(null);
    setNewRoleName('');
    setNewRoleDescription('');
    setNewRolePermissions([]);
    setIsCreatingNewRole(false);
  };

  return (
    <div className="p-1">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">Role Editor (MVP 1)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Role List */} 
        <SectionCard title="Project Roles" className="md:col-span-1">
          <button 
            onClick={handleStartCreateNewRole}
            className="w-full mb-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-sm transition-colors text-sm"
          >
            + Create New Role
          </button>
          {roles.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No roles defined yet.</p>}
          <ul className="space-y-2">
            {roles.map(role => (
              <li key={role.id}>
                <button 
                  onClick={() => handleSelectRole(role)}
                  className={`w-full text-left p-2.5 rounded-md transition-colors text-sm 
                              ${selectedRole?.id === role.id 
                                ? 'bg-blue-100 dark:bg-blue-700/50 text-blue-700 dark:text-blue-300 font-semibold' 
                                : 'bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-600/50'}`}
                >
                  {role.name}
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Column 2: Role Editor/Creator Form */} 
        {(selectedRole || isCreatingNewRole) && (
          <SectionCard title={isCreatingNewRole ? "Create New Role" : `Edit Role: ${selectedRole?.name}`} className="md:col-span-2">
            <div className="space-y-4">
              <InputField
                id="roleName"
                label="Role Name"
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                required
                className="mb-0"
              />
              <div>
                <label htmlFor="roleDescription" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Description</label>
                <textarea 
                  id="roleDescription"
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border rounded-md text-sm shadow-sm bg-white dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Briefly describe this role..."
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Permissions:</h4>
                <div className="space-y-1.5">
                  {MOCK_PERMISSIONS_LIST.map(perm => (
                    <label key={perm.id} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={newRolePermissions.includes(perm.id)}
                        onChange={() => handlePermissionToggle(perm.id)}
                        className="h-4 w-4 rounded text-blue-600 dark:text-blue-500 border-slate-300 dark:border-slate-500 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-600/50">
                <button 
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-medium rounded-md shadow-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveRole}
                  className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-sm transition-colors"
                >
                  {isCreatingNewRole ? "Create Role" : "Save Changes"}
                </button>
              </div>
            </div>
          </SectionCard>
        )}
         {!selectedRole && !isCreatingNewRole && (
            <div className="md:col-span-2 flex items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow">
                <p className="text-slate-500 dark:text-slate-400">Select a role to edit or create a new one.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default RoleEditorPage; 