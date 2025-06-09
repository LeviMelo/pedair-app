// src/pages/NotificationSchedulerPage.tsx
import React, { useState } from 'react';
import { 
  PiBellDuotone, 
  PiCalendarPlusDuotone, 
  PiEnvelopeDuotone, 
  PiClockDuotone,
  PiListChecksDuotone,
  PiPlayDuotone,
  PiPauseDuotone,
  PiTrashDuotone,
  PiPlusDuotone
} from 'react-icons/pi';
import { Button } from '../components/ui/Button'; // Corrected import

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  delay: string;
  status: 'active' | 'paused';
  type: 'email' | 'sms' | 'whatsapp';
  recipients: number;
}

const NotificationSchedulerPage: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState<NotificationRule | null>(null);

  const mockRules: NotificationRule[] = [
    { id: '1', name: '30-Day Follow-up', description: 'Send follow-up reminder 30 days after patient discharge', trigger: 'Patient Discharge', delay: '30 days', status: 'active', type: 'email', recipients: 142 },
    { id: '2', name: 'Weekly Study Update', description: 'Weekly progress update to study coordinators', trigger: 'Every Monday', delay: '0 days', status: 'active', type: 'email', recipients: 5 },
    { id: '3', name: '6-Month Follow-up', description: 'Long-term follow-up questionnaire reminder', trigger: 'Patient Discharge', delay: '180 days', status: 'paused', type: 'email', recipients: 87 }
  ];

  const getStatusColor = (status: 'active' | 'paused') => {
    return status === 'active' 
      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
  };

  const getTypeIcon = (type: 'email' | 'sms' | 'whatsapp') => {
    switch(type) {
      case 'email': return <PiEnvelopeDuotone />;
      default: return <PiBellDuotone />;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 min-h-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Notification Scheduler</h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Configure automated reminders and notifications for your research project.</p>
        </div>
        <Button 
          variant="primary" 
          size="lg" 
          iconLeft={<PiPlusDuotone />}
          className="shadow-lg"
        >
          New Rule
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 card-base p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold text-gradient-cool flex items-center mb-6">
            <PiListChecksDuotone className="mr-3 text-2xl text-blue-500 dark:text-blue-400" /> Notification Rules
          </h2>
          <div className="space-y-4">
            {mockRules.map((rule) => (
              <div key={rule.id} className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${selectedRule?.id === rule.id ? 'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/10 shadow-lg shadow-blue-500/25' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-blue-300 dark:hover:border-blue-500'}`} onClick={() => setSelectedRule(rule)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">{getTypeIcon(rule.type)}</div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">{rule.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{rule.description}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(rule.status)}`}>{rule.status}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-slate-600 dark:text-slate-300"><PiCalendarPlusDuotone className="mr-2 text-slate-400" /><span>Trigger: {rule.trigger}</span></div>
                  <div className="flex items-center text-slate-600 dark:text-slate-300"><PiClockDuotone className="mr-2 text-slate-400" /><span>Delay: {rule.delay}</span></div>
                  <div className="flex items-center text-slate-600 dark:text-slate-300"><PiBellDuotone className="mr-2 text-slate-400" /><span>{rule.recipients} recipients</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <aside className="lg:col-span-1 space-y-6">
          {selectedRule ? (
            <>
              <section className="card-colorful p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gradient-warm flex items-center mb-4 relative z-10"><PiBellDuotone className="mr-3 text-2xl text-purple-500 dark:text-purple-400" /> Rule Details</h2>
                <div className="space-y-4 relative z-10">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{selectedRule.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{selectedRule.description}</p>
                  </div>
                  <div className="space-y-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex justify-between"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</span><span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedRule.status)}`}>{selectedRule.status}</span></div>
                    <div className="flex justify-between"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">Type</span><span className="text-sm text-slate-600 dark:text-slate-300 capitalize">{selectedRule.type}</span></div>
                    <div className="flex justify-between"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">Recipients</span><span className="text-sm text-slate-600 dark:text-slate-300">{selectedRule.recipients}</span></div>
                  </div>
                </div>
              </section>
              <section className="card-colorful p-6 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold text-gradient flex items-center mb-4 relative z-10">Actions</h2>
                <div className="space-y-3 relative z-10">
                  <Button variant={selectedRule.status === 'active' ? 'warning' : 'success'} fullWidth size="sm" iconLeft={selectedRule.status === 'active' ? <PiPauseDuotone /> : <PiPlayDuotone />}>
                    {selectedRule.status === 'active' ? 'Pause Rule' : 'Activate Rule'}
                  </Button>
                  <Button variant="outline" fullWidth size="sm">Edit Rule</Button>
                  <Button variant="danger" fullWidth size="sm" iconLeft={<PiTrashDuotone />}>Delete Rule</Button>
                </div>
              </section>
            </>
          ) : (
            <section className="card-colorful p-6 rounded-xl shadow-lg">
              <div className="text-center py-8 relative z-10">
                <PiBellDuotone className="text-4xl text-slate-400 dark:text-slate-500 mx-auto mb-4 animate-pulse-glow" />
                <p className="text-slate-500 dark:text-slate-400">Select a notification rule</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Choose a rule from the list to view details and actions</p>
              </div>
            </section>
          )}
          <section className="card-colorful p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold text-gradient-cool flex items-center mb-4 relative z-10"><PiCalendarPlusDuotone className="mr-2 text-slate-500 dark:text-slate-400" /> Statistics</h2>
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-slate-700/50"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">Active Rules</span><span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">2</span></div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-slate-700/50"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">Total Recipients</span><span className="text-sm font-semibold text-blue-600 dark:text-blue-400">234</span></div>
              <div className="flex justify-between items-center py-2"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">This Week Sent</span><span className="text-sm font-semibold text-purple-600 dark:text-purple-400">47</span></div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default NotificationSchedulerPage;