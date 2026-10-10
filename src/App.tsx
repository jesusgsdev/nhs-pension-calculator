import { useState } from 'react';
import { useCalculator } from './store/useCalculatorStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { RoleAndProfileSection } from './components/steps/RoleAndProfileSection';
import { CareerTimelineSection } from './components/steps/CareerTimelineSection';
import { ScheduleSection } from './components/steps/ScheduleSection';
import { PensionBoostSection } from './components/steps/PensionBoostSection';
import { RetirementPlannerSection } from './components/steps/RetirementPlannerSection';
import { HeroStatCards } from './components/results/HeroStatCards';
import { SalaryBreakdownCard } from './components/results/SalaryBreakdownCard';
import { SchemeBreakdownCard } from './components/results/SchemeBreakdownCard';
import { McCloudCard } from './components/results/McCloudCard';
import { RetirementAgeChart } from './components/results/RetirementAgeChart';
import { ExplanationsModal } from './components/educational/ExplanationsModal';
import { ExplainCard } from './components/common/ExplainCard';
import { ProfileBar } from './components/profile/ProfileBar';
import { SaveProfileModal } from './components/profile/SaveProfileModal';
import { Sparkles, SlidersHorizontal, BarChart3, ChevronRight, Wallet, LayoutList, CheckCircle2 } from 'lucide-react';

export function App() {
  const {
    role,
    setRole,
    careerPeriods,
    addPeriod,
    updatePeriod,
    removePeriod,
    loadPreset,
    schedule,
    setSchedule,
    profile,
    setProfile,
    currentSalaryBreakdown,
    projection,
    savedProfiles,
    activeProfileId,
    activeProfile,
    saveProfile,
    saveProfileAs,
    loadSavedProfile,
    startFromScratch,
    deleteProfile,
    notificationMessage,
  } = useCalculator();

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'inputs' | 'results'>('all');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaveAs, setIsSaveAs] = useState(false);

  const currentPeriod = careerPeriods[careerPeriods.length - 1];

  const handleTabSwitch = (tab: 'all' | 'inputs' | 'results') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveClick = () => {
    if (activeProfileId) {
      saveProfile();
    } else {
      setIsSaveAs(false);
      setIsSaveModalOpen(true);
    }
  };

  const handleSaveAsClick = () => {
    setIsSaveAs(true);
    setIsSaveModalOpen(true);
  };

  const handleModalSave = (name: string) => {
    if (isSaveAs) {
      saveProfileAs(name);
    } else {
      saveProfile(name);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-nhs-darkBlue">
      
      {/* Header */}
      <Header
        role={role}
        onRoleChange={setRole}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Container - Full Width Canvas up to 1600px */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-8 space-y-6 sm:space-y-8 pb-24 lg:pb-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-nhs-blue via-nhs-darkBlue to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-9 shadow-md relative overflow-hidden w-full">
          <div className="relative z-10 max-w-4xl space-y-2 sm:space-y-2.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>NHS England {role === 'nurse' ? 'Registered Nurses' : 'Midwives'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              NHS Career Pay & Pension Planning Calculator
            </h2>
            <p className="text-xs sm:text-base text-sky-100 leading-relaxed max-w-3xl">
              Model step progression through Agenda for Change bands, London weighting (HCAS), rotational 11.5-hour shifts, and project your pension across the 1995, 2008, and 2015 schemes, including the McCloud remedy.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-8 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Profile Management Bar */}
        <ProfileBar
          savedProfiles={savedProfiles}
          activeProfileId={activeProfileId}
          activeProfile={activeProfile}
          onSave={handleSaveClick}
          onSaveAs={handleSaveAsClick}
          onSelectProfile={loadSavedProfile}
          onStartScratch={startFromScratch}
          onDeleteProfile={deleteProfile}
        />

        {/* Top Hero Stat Cards (Live Results) */}
        {projection && (
          <section className="space-y-2.5 sm:space-y-3.5 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1 sm:space-x-2">
                <span>Retirement Entitlement (at Age {profile.targetRetirementAge})</span>
              </h3>
              <span className="text-[10px] sm:text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-emerald-200 shadow-xs">
                ● Live Real-Time
              </span>
            </div>
            <HeroStatCards
              projection={projection}
              salary={currentSalaryBreakdown}
            />
          </section>
        )}

        {/* Section Navigation Tabs */}
        <div className="flex items-center justify-center bg-white p-1 rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto w-full">
          <button
            type="button"
            onClick={() => handleTabSwitch('all')}
            className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all min-h-[38px] ${
              activeTab === 'all'
                ? 'bg-nhs-blue text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>All Sections</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('inputs')}
            className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all min-h-[38px] ${
              activeTab === 'inputs'
                ? 'bg-nhs-blue text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>1. Career Inputs</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('results')}
            className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all min-h-[38px] ${
              activeTab === 'results'
                ? 'bg-nhs-blue text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>2. Results & Charts</span>
          </button>
        </div>

        {/* Full Width Stacked Layout */}
        <div className="space-y-8 w-full">
          
          {/* SECTION 1: CAREER & PENSION INPUTS */}
          {(activeTab === 'all' || activeTab === 'inputs') && (
            <div className="space-y-6 sm:space-y-7 w-full">
              
              {/* Step 1: Role & Eligibility */}
              <RoleAndProfileSection
                role={role}
                onRoleChange={setRole}
                profile={profile}
                onProfileChange={(updates) => setProfile((p) => ({ ...p, ...updates }))}
              />

              {/* Step 2: Career History & Progression */}
              <CareerTimelineSection
                role={role}
                periods={careerPeriods}
                onAddPeriod={addPeriod}
                onUpdatePeriod={updatePeriod}
                onRemovePeriod={removePeriod}
                onLoadPreset={loadPreset}
              />

              {/* Step 3: Working Hours & Shift Rotas */}
              <ScheduleSection
                schedule={schedule}
                onScheduleChange={(updates) => setSchedule((s) => ({ ...s, ...updates }))}
              />

              {/* Step 4: Pension Policies & Boosting */}
              <PensionBoostSection
                profile={profile}
                onProfileChange={(updates) => setProfile((p) => ({ ...p, ...updates }))}
              />

              {/* Step 5: Retirement Age & Commutation */}
              <RetirementPlannerSection
                profile={profile}
                onProfileChange={(updates) => setProfile((p) => ({ ...p, ...updates }))}
                projection={projection}
              />

              {/* In-line Educational Guides */}
              <div className="space-y-3 pt-2 w-full">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quick Explanations & Notes
                </h4>
                
                <ExplainCard title="How do Agenda for Change pay steps work?">
                  Each band features streamlined pay steps. Upon qualifying, staff enter at the <strong>Entry step</strong>. After 2 years in post, you advance to the <strong>Intermediate step</strong>. After 4 or 5 years, you reach the <strong>Top step</strong>. When promoted to a higher band, you typically move to the entry step of the new band.
                </ExplainCard>

                <ExplainCard title="Are unsocial hours enhancements pensionable?">
                  <strong>Yes!</strong> Under Agenda for Change Section 2, contractual enhancements for working night shifts (+30%) and weekends (+30% Saturdays, +60% Sundays) count towards your annual pensionable pay. Voluntary bank work or overtime beyond 37.5 hours is non-pensionable.
                </ExplainCard>

                <ExplainCard title="How does the McCloud Remedy affect me?">
                  If you were an active member on or before 31 March 2012, your service between 1 April 2015 and 31 March 2022 is placed in your legacy scheme (1995 or 2008). At retirement, you make a <em>Deferred Choice</em> to keep legacy benefits or switch to 2015 CARE benefits for those 7 years, choosing whichever pays more!
                </ExplainCard>
              </div>

            </div>
          )}

          {/* SECTION 2: RESULTS, BREAKDOWN & CHARTS */}
          {(activeTab === 'all' || activeTab === 'results') && (
            <div className="space-y-6 sm:space-y-7 w-full pt-2">
              
              {/* Divider if in "All" view */}
              {activeTab === 'all' && (
                <div className="flex items-center space-x-3 py-2">
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    Detailed Projections & Analysis
                  </span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>
              )}

              {/* Current Salary Breakdown */}
              {currentSalaryBreakdown && currentPeriod && (
                <SalaryBreakdownCard
                  salary={currentSalaryBreakdown}
                  currentPeriod={currentPeriod}
                  schedule={schedule}
                />
              )}

              {/* Multi-Scheme Breakdown */}
              {projection && (
                <SchemeBreakdownCard projection={projection} />
              )}

              {/* McCloud Remedy Side-by-Side Card */}
              {projection && projection.mccloudComparison.eligibleForRemedy && (
                <McCloudCard mccloud={projection.mccloudComparison} />
              )}

              {/* Retirement Age Interactive Chart / Curve / Table */}
              <RetirementAgeChart
                careerPeriods={careerPeriods}
                schedule={schedule}
                profile={profile}
              />

            </div>
          )}

        </div>

      </main>

      {/* Sticky Mobile Floating Bottom Bar */}
      {projection && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-xl">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-nhs-blue flex items-center justify-center shrink-0 border border-blue-100">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Take-Home (Age {profile.targetRetirementAge})
                </div>
                <div className="text-sm font-black text-nhs-darkBlue flex items-baseline space-x-1.5">
                  <span>£{projection.tax.netMonthlyPension.toLocaleString()}/mo</span>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    • £{projection.finalTaxFreeLumpSum.toLocaleString()} cash
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleTabSwitch(activeTab === 'results' ? 'inputs' : 'results')}
              className="py-2 px-3 rounded-xl bg-nhs-blue text-white text-xs font-bold hover:bg-nhs-darkBlue transition-colors flex items-center space-x-1 shadow-xs shrink-0 min-h-[36px]"
            >
              <span>{activeTab === 'results' ? 'Inputs' : 'Breakdown'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Explanations Modal */}
      <ExplanationsModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Save / Save As Profile Modal */}
      <SaveProfileModal
        isOpen={isSaveModalOpen}
        isSaveAs={isSaveAs}
        defaultName={
          isSaveAs
            ? activeProfile
              ? `${activeProfile.name} (Copy)`
              : 'Scenario Plan'
            : activeProfile
            ? activeProfile.name
            : ''
        }
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleModalSave}
      />

      {/* Real-time Notification Toast */}
      {notificationMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 border border-slate-700/80 text-xs font-bold animate-fadeIn"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationMessage}</span>
        </aside>
      )}

    </div>
  );
}

export default App;
