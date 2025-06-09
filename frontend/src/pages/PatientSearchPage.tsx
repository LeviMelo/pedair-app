// src/pages/PatientSearchPage.tsx
import React, { useState } from 'react';
import { 
  PiMagnifyingGlassDuotone, 
  PiUserDuotone, 
  PiHashDuotone,
  PiListChecksDuotone,
  PiEyeDuotone,
  PiDownloadDuotone
} from 'react-icons/pi';
import { InputField } from '../components/ui/InputField'; // Corrected import
import { Button } from '../components/ui/Button'; // Corrected import

const PatientSearchPage: React.FC = () => {
    // ... logic remains the same
    const [searchInitials, setSearchInitials] = useState('');
    const [searchGender, setSearchGender] = useState('');
    const [searchDOB, setSearchDOB] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
  
    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchInitials || !searchGender || !searchDOB) {
        alert('Please fill in all search fields');
        return;
      }
      setIsSearching(true);
      setHasSearched(false);
      setTimeout(() => {
        const mockResults = [
          {
            patientId: 'ANON_12345',
            submissions: [
              { formName: 'Pre-Anesthesia', date: '2024-01-15', status: 'Complete' },
              { formName: 'Intraoperative', date: '2024-01-15', status: 'Complete' },
              { formName: 'Recovery', date: '2024-01-15', status: 'Pending' }
            ]
          }
        ];
        setSearchResults(mockResults);
        setIsSearching(false);
        setHasSearched(true);
      }, 1000);
    };
  
    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      switch(field) {
        case 'initials': setSearchInitials(value); break;
        case 'gender': setSearchGender(value); break;
        case 'dob': setSearchDOB(value); break;
      }
    };
    
    return (
        <div className="p-4 sm:p-6 space-y-8 min-h-full max-w-6xl mx-auto">
            <div className="relative overflow-hidden bg-card border-2 border-blue-200/60 dark:border-blue-800/30 shadow-xl mb-6 rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10 dark:from-blue-500/5 dark:via-indigo-500/3 dark:to-purple-500/5"></div>
                <div className="relative z-10 px-6 py-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg"><PiMagnifyingGlassDuotone className="w-6 h-6 text-white" /></div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Patient Search</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">Search for patient data using pseudonymized identifiers</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-1 bg-card p-6 rounded-xl shadow-xl">
                    <h2 className="text-xl font-semibold text-foreground flex items-center mb-6"><PiMagnifyingGlassDuotone className="mr-3 text-2xl text-primary" /> Search Criteria</h2>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <InputField label="Patient Initials" id="initials" type="text" placeholder="e.g., JS" value={searchInitials} onChange={handleInputChange('initials')} required/>
                        <InputField label="Gender" id="gender" type="text" placeholder="M or F" value={searchGender} onChange={handleInputChange('gender')} required/>
                        <InputField label="Date of Birth" id="dob" type="date" value={searchDOB} onChange={handleInputChange('dob')} required/>
                        <Button type="submit" variant="primary" fullWidth isLoading={isSearching} iconLeft={<PiMagnifyingGlassDuotone />} className="mt-6">
                            {isSearching ? 'Searching...' : 'Search Patient'}
                        </Button>
                    </form>
                </section>
                <section className="lg:col-span-2 bg-card p-6 rounded-xl shadow-xl">
                    <h2 className="text-xl font-semibold text-foreground flex items-center mb-6"><PiListChecksDuotone className="mr-3 text-2xl text-primary" /> Search Results</h2>
                    {!hasSearched && searchResults.length === 0 && (
                        <div className="text-center py-12"><PiUserDuotone className="text-4xl text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Enter search criteria to find patient data</p></div>
                    )}
                    {hasSearched && searchResults.length === 0 && (
                        <div className="text-center py-12"><PiUserDuotone className="text-4xl text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No patients found matching the search criteria</p></div>
                    )}
                    {searchResults.length > 0 && (
                        <div className="space-y-4">
                        {searchResults.map((result, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-background">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 rounded-lg bg-primary text-primary-foreground"><PiHashDuotone className="w-4 h-4" /></div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">Patient ID: {result.patientId}</h3>
                                            <p className="text-sm text-muted-foreground">{result.submissions.length} submissions found</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" iconRight={<PiDownloadDuotone />}>Export Data</Button>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-foreground">Submissions:</h4>
                                    {result.submissions.map((submission: any, subIndex: number) => (
                                    <div key={subIndex} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <PiListChecksDuotone className="w-4 h-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-secondary-foreground">{submission.formName}</p>
                                                <p className="text-xs text-muted-foreground">{submission.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${submission.status === 'Complete' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}`}>{submission.status}</span>
                                            <Button variant="ghost" size="sm"><PiEyeDuotone className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default PatientSearchPage;