import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { PatientView } from './pages/PatientView';
import { CaregiverView } from './pages/CaregiverView';
import { LoginPage } from './pages/LoginPage';

const MainLayout: React.FC = () => {
  const { userProfile, authLoading } = useAppContext();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-400">Authenticating with Firebase...</span>
        </div>
      </div>
    );
  }

  // Redirect to full-page Login if not authenticated
  if (!userProfile) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 transition-colors duration-500">
      <Navbar />
      <main className="px-6 pb-12">
        {userProfile.role === 'caregiver' ? <CaregiverView /> : <PatientView />}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
