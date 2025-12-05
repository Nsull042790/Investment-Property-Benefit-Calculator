import { useState } from 'react';
import type { QualificationChecklistItem } from '../types';
import { SectionCard } from './SectionCard';

interface QualificationChecklistProps {
  items: QualificationChecklistItem[];
  onChange: (items: QualificationChecklistItem[]) => void;
}

const defaultChecklist: QualificationChecklistItem[] = [
  // Documentation
  { id: 'doc-1', category: 'documentation', label: 'Government-issued ID', description: 'Valid drivers license or passport', required: true, completed: false },
  { id: 'doc-2', category: 'documentation', label: 'Bank statements (2 months)', description: 'Showing reserves and down payment funds', required: true, completed: false },
  { id: 'doc-3', category: 'documentation', label: 'Tax returns (2 years)', description: 'Required for conventional loans', required: false, completed: false },
  { id: 'doc-4', category: 'documentation', label: 'W-2s or 1099s (2 years)', description: 'Income verification documents', required: false, completed: false },
  { id: 'doc-5', category: 'documentation', label: 'Current lease agreement', description: 'If property is already rented', required: false, completed: false },

  // Financial
  { id: 'fin-1', category: 'financial', label: 'Down payment funds verified', description: 'Seasoned for 60+ days', required: true, completed: false },
  { id: 'fin-2', category: 'financial', label: 'Reserves documented', description: '6+ months PITIA in liquid assets', required: true, completed: false },
  { id: 'fin-3', category: 'financial', label: 'No large recent deposits', description: 'Or have paper trail for them', required: true, completed: false },
  { id: 'fin-4', category: 'financial', label: 'Debt-to-income calculated', description: 'Below 43-50% for conventional', required: false, completed: false },

  // Property
  { id: 'prop-1', category: 'property', label: 'Property appraisal ordered', description: 'Value supports purchase price', required: true, completed: false },
  { id: 'prop-2', category: 'property', label: 'Home inspection completed', description: 'No major issues identified', required: true, completed: false },
  { id: 'prop-3', category: 'property', label: 'Title search clear', description: 'No liens or encumbrances', required: true, completed: false },
  { id: 'prop-4', category: 'property', label: 'Insurance quote obtained', description: 'Landlord/investment property policy', required: true, completed: false },
  { id: 'prop-5', category: 'property', label: 'Rent roll / lease review', description: 'Verify current rental income', required: false, completed: false },

  // Credit
  { id: 'cred-1', category: 'credit', label: 'Credit report pulled', description: 'Score meets minimum requirements', required: true, completed: false },
  { id: 'cred-2', category: 'credit', label: 'No recent late payments', description: 'Last 12 months clean', required: true, completed: false },
  { id: 'cred-3', category: 'credit', label: 'No recent collections', description: 'Or have explanations ready', required: false, completed: false },
  { id: 'cred-4', category: 'credit', label: 'Credit inquiries reviewed', description: 'Limited new credit applications', required: false, completed: false },
];

export function QualificationChecklist({ items, onChange }: QualificationChecklistProps) {
  const [filter, setFilter] = useState<'all' | 'documentation' | 'financial' | 'property' | 'credit'>('all');

  const checklistItems = items.length > 0 ? items : defaultChecklist;

  const toggleItem = (id: string) => {
    const updated = checklistItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onChange(updated);
  };

  const filteredItems = filter === 'all'
    ? checklistItems
    : checklistItems.filter(item => item.category === filter);

  const completedCount = checklistItems.filter(item => item.completed).length;
  const requiredCount = checklistItems.filter(item => item.required).length;
  const completedRequired = checklistItems.filter(item => item.required && item.completed).length;

  const ClipboardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );

  const categoryLabels = {
    documentation: 'Documentation',
    financial: 'Financial',
    property: 'Property',
    credit: 'Credit',
  };

  const categoryColors = {
    documentation: 'bg-blue-100 text-blue-800',
    financial: 'bg-green-100 text-green-800',
    property: 'bg-purple-100 text-purple-800',
    credit: 'bg-orange-100 text-orange-800',
  };

  return (
    <SectionCard title="Qualification Checklist" icon={<ClipboardIcon />}>
      <div className="space-y-4">
        {/* Progress */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-600">{completedCount} / {checklistItems.length}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(completedCount / checklistItems.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Required items: {completedRequired} / {requiredCount}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'documentation', 'financial', 'property', 'credit'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'All' : categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Checklist Items */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredItems.map((item) => (
            <label
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                item.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-medium ${item.completed ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                    {item.label}
                  </span>
                  {item.required && (
                    <span className="text-xs text-red-600 font-medium">Required</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[item.category]}`}>
                    {categoryLabels[item.category]}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

export { defaultChecklist };
