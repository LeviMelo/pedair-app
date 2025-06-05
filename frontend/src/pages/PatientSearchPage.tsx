import React, { useState } from 'react';
import { PiMagnifyingGlassDuotone, PiUserDuotone, PiFileTextDuotone, PiCalendarDuotone, PiListBulletsDuotone } from 'react-icons/pi';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

const PatientSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate search process
    setTimeout(() => {
      setIsSearching(false);
      // Mock search results would be displayed here
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 min-h-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Patient Search</h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg">Search for pseudonymized patient records using identifying information.</p>
      </div>

      {/* Search Form */}
      <section className="card-enhanced p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold text-gradient-cool flex items-center mb-6">
          <PiMagnifyingGlassDuotone className="mr-3 text-2xl text-blue-500 dark:text-blue-400" /> Search Criteria
        </h2>
        
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              id="patientInitials"
              label="Patient Initials"
              type="text"
              placeholder="e.g., J.S."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
            
            <div className="form-field">
              <label htmlFor="patientGender" className="form-label">Gender</label>
              <select
                id="patientGender"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="input-base"
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male (M)</option>
                <option value="F">Female (F)</option>
                <option value="O">Other (O)</option>
              </select>
            </div>

            <InputField
              id="patientDob"
              label="Date of Birth"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center">
              <PiUserDuotone className="mr-2 text-slate-500 dark:text-slate-400" />
              Search Format
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Use the exact format: <span className="font-mono bg-white dark:bg-slate-700 px-2 py-0.5 rounded">Initials + Gender + Date of Birth</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Example: J.S. + M + 2017-02-04 (for a male patient João Silva born on Feb 4, 2017)
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSearching}
              iconLeft={<PiMagnifyingGlassDuotone />}
              className="px-8"
              disabled={!searchQuery || !selectedGender || !selectedDate}
            >
              {isSearching ? 'Searching...' : 'Search Patient Records'}
            </Button>
          </div>
        </form>
      </section>

      {/* Search Results */}
      <section className="card-colorful p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gradient-warm flex items-center mb-6 relative z-10">
          <PiListBulletsDuotone className="mr-3 text-2xl text-emerald-500 dark:text-emerald-400" /> Search Results
        </h2>
        
        {!isSearching ? (
          <div className="text-center py-12 relative z-10">
            <PiFileTextDuotone className="text-4xl text-slate-400 dark:text-slate-500 mx-auto mb-4 animate-pulse-glow" />
            <p className="text-slate-500 dark:text-slate-400">No search performed yet.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Enter patient details above to search for records.</p>
          </div>
        ) : (
          <div className="text-center py-12 relative z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Searching patient records...</p>
          </div>
        )}

        {/* Mock Results (would be populated from actual search) */}
        {false && (
          <div className="space-y-4 relative z-10">
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800/60">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Patient Record Found</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Patient ID: ***abc123*** (pseudonymized)</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">Active</span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <PiCalendarDuotone className="mr-2 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">Last Visit: 2024-01-10</span>
                </div>
                <div className="flex items-center">
                  <PiFileTextDuotone className="mr-2 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">3 Forms Completed</span>
                </div>
                <div className="flex items-center">
                  <PiUserDuotone className="mr-2 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">Project: CREST Pilot</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Privacy Notice */}
      <section className="card-colorful p-4 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
        <div className="relative z-10">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">Privacy & Security Notice</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            All patient searches are logged for audit purposes. Patient data is pseudonymized and complies with LGPD regulations. 
            Only authorized personnel with appropriate project roles can perform patient searches.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PatientSearchPage; 