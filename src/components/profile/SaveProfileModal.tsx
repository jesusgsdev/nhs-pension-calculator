import React, { useState, useEffect } from 'react';
import { X, BookmarkPlus, Save } from 'lucide-react';

interface SaveProfileModalProps {
  isOpen: boolean;
  isSaveAs?: boolean;
  defaultName?: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const SaveProfileModal: React.FC<SaveProfileModalProps> = ({
  isOpen,
  isSaveAs = false,
  defaultName = '',
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(defaultName);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      setError('');
    }
  }, [isOpen, defaultName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name for this profile.');
      return;
    }
    onSave(name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="bg-nhs-blue text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isSaveAs ? <BookmarkPlus className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            <h3 className="text-base font-bold">
              {isSaveAs ? 'Save Profile As' : 'Save New Profile'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Profile Name
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., Band 7 Ward Sister (London), Preceptorship Plan..."
              className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-nhs-blue"
            />
            {error && (
              <p className="text-xs text-red-600 font-medium mt-1">{error}</p>
            )}
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Saved profiles persist in your browser so you can return, compare options, and update input data anytime.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors min-h-[38px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-nhs-blue hover:bg-nhs-darkBlue text-white shadow-xs transition-colors min-h-[38px]"
            >
              {isSaveAs ? 'Save As New' : 'Save Profile'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

