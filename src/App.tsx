import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { PatientView } from './pages/PatientView';
import { CaregiverView } from './pages/CaregiverView';

const MainLayout: React.FC = () => {
  const { viewMode } = useAppContext();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 transition-colors duration-500">
      <Navbar />
      <main className="px-6 pb-12">
        {viewMode === 'patient' ? <PatientView /> : <CaregiverView />}
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
