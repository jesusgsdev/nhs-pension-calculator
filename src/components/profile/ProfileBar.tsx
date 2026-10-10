import React from 'react';
import { SavedProfile } from '../../types/profile';
import {
  Save,
  BookmarkPlus,
  RotateCcw,
  Trash2,
  FolderCheck,
  FileQuestion,
  ChevronDown,
} from 'lucide-react';

interface ProfileBarProps {
  savedProfiles: SavedProfile[];
  activeProfileId: string | null;
  activeProfile: SavedProfile | null;
  onSave: () => void;
  onSaveAs: () => void;
  onSelectProfile: (id: string) => void;
  onStartScratch: () => void;
  onDeleteProfile: (id: string) => void;
}

export const ProfileBar: React.FC<ProfileBarProps> = ({
  savedProfiles,
  activeProfileId,
  activeProfile,
  onSave,
  onSaveAs,
  onSelectProfile,
  onStartScratch,
  onDeleteProfile,
}) => {
  const handleStartFresh = () => {
    const message = activeProfile
      ? `Start from scratch? Your saved profile "${activeProfile.name}" will remain safely saved, but current working inputs will reset.`
      : 'Reset all inputs to start fresh from scratch?';
    if (window.confirm(message)) {
      onStartScratch();
    }
  };

  const handleDelete = () => {
    if (!activeProfileId || !activeProfile) return;
    if (window.confirm(`Are you sure you want to delete profile "${activeProfile.name}"? This cannot be undone.`)) {
      onDeleteProfile(activeProfileId);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-3.5 sm:p-4.5 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left Side: Active Profile Status & Dropdown Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
          
          {/* Active Profile Status Badge */}
          <div className="flex items-center space-x-2 shrink-0">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                activeProfile
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {activeProfile ? (
                <FolderCheck className="w-4 h-4" />
              ) : (
                <FileQuestion className="w-4 h-4" />
              )}
            </div>

            <div className="min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {activeProfile ? 'Saved Profile' : 'Current Session'}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                {activeProfile ? activeProfile.name : 'Draft (Unsaved Profile)'}
              </div>
            </div>
          </div>

          {/* Vertical Divider on tablet/desktop */}
          <div className="hidden sm:block h-7 w-px bg-slate-200 shrink-0" />

          {/* Profiles Dropdown */}
          <div className="relative flex-1 max-w-full sm:max-w-xs">
            <label htmlFor="profile-select" className="sr-only">
              Switch Saved Profile
            </label>
            <div className="relative">
              <select
                id="profile-select"
                value={activeProfileId || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    onSelectProfile(e.target.value);
                  }
                }}
                className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl pl-3 pr-8 py-2 min-h-[38px] focus:outline-hidden focus:ring-2 focus:ring-nhs-blue transition-colors cursor-pointer"
              >
                <option value="" disabled={Boolean(activeProfileId)}>
                  {savedProfiles.length === 0
                    ? 'No saved profiles yet'
                    : 'Switch saved profile...'}
                </option>
                {savedProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.role === 'nurse' ? 'Nurse' : 'Midwife'})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 shrink-0">
          
          {/* Save Button */}
          <button
            type="button"
            onClick={onSave}
            title={
              activeProfile
                ? `Save and overwrite "${activeProfile.name}"`
                : 'Save as a new named profile'
            }
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-nhs-blue hover:bg-nhs-darkBlue text-white shadow-xs transition-colors min-h-[38px]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{activeProfile ? 'Save Changes' : 'Save Profile'}</span>
          </button>

          {/* Save As Button */}
          <button
            type="button"
            onClick={onSaveAs}
            title="Save current inputs under a new profile name"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors min-h-[38px]"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Save As...</span>
          </button>

          {/* Start from Scratch Button */}
          <button
            type="button"
            onClick={handleStartFresh}
            title="Reset inputs and start a brand new calculation"
            className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors min-h-[38px]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Start from Scratch</span>
            <span className="sm:hidden">Reset</span>
          </button>

          {/* Delete Button (only if active profile is saved) */}
          {activeProfile && (
            <button
              type="button"
              onClick={handleDelete}
              title={`Delete profile "${activeProfile.name}"`}
              className="inline-flex items-center justify-center p-2 rounded-xl text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors min-h-[38px] min-w-[38px]"
              aria-label={`Delete profile ${activeProfile.name}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

