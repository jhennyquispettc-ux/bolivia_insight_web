import React, { useState } from 'react';
import { I18nProvider } from './data/translations.jsx';
import NavBar from './componentes/NavBar.jsx';
import Landing from './paginas/Landing.jsx';
import ClusterDetail from './paginas/ClusterDetail.jsx';
import TravelGuide from './paginas/TravelGuide.jsx';
import Dashboard from './paginas/Dashboard.jsx';
import { CLUSTERS } from './data/destinos.jsx';
import EmergencyHub from './paginas/EmergencyHub.jsx';
import Auth from './paginas/Auth.jsx';
import BookingPage from './paginas/BookingPage.jsx';
import ProfilePage from './paginas/ProfilePage.jsx';
import RouteCalculator from './paginas/RouteCalculator.jsx';
import AIConcierge from './componentes/AIConcierge.jsx';
import useRouter from './navegacion/useRouter.jsx';

function App() {
  const r = useRouter();
  const [aiOpen, setAiOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bolivia_insight_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const handleLogin = (userData, token) => {
    localStorage.setItem('bolivia_insight_user', JSON.stringify(userData));
    localStorage.setItem('bolivia_insight_token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('bolivia_insight_user');
    localStorage.removeItem('bolivia_insight_token');
    localStorage.removeItem('google_access_token');
    setUser(null);
  };

  return (
    <I18nProvider>
      <div data-screen-label={r.screenLabel}>
        <NavBar current={r.navCurrent} onNav={r.onNav} dark={true} user={user} onLogout={handleLogout} />

        {r.route === 'home' && <Landing heroVariant="A"
          onClusterSelect={r.onClusterSelect}
          onExpress={r.onGuide}
          onDashboard={r.onDashboard}
          onDictionary={r.onDictionary}
          onSos={r.onSos}
          onExpert={r.onExpert}
          onPlanner={() => r.goRoute('planner')} />}
        {r.route === 'cluster' && <ClusterDetail cluster={r.cluster} onBack={r.onBack} onBook={r.onExpert} />}
        {r.route === 'guide' && <TravelGuide onBack={r.onBack} onExpert={r.onExpert} initialTab={r.guideTab} />}
        {r.route === 'dashboard' && (
          <Dashboard
            onBack={r.onBack}
            onExpert={r.onExpert}
            onExploreSector={(sectorId) => {
              const target = CLUSTERS.find(c => c.id === sectorId);
              if (target) r.onClusterSelect(target);
            }} />
        )}
        {r.route === 'sos' && <EmergencyHub onBack={r.onBack} />}
        {r.route === 'auth' && <Auth onBack={r.onBack} onLogin={handleLogin} />}
        {r.route === 'booking' && (
          user
            ? <BookingPage onBack={r.onBack} onProfile={() => r.goRoute('profile')} user={user} />
            // Booking requires a session (the PayPal capture is authenticated).
            // Send guests to login; onSuccess brings them straight back to booking,
            // while "Volver" (onBack) still exits to home.
            : <Auth onBack={r.onBack} onLogin={handleLogin} onSuccess={() => r.goRoute('booking')} />
        )}
        {r.route === 'profile' && <ProfilePage onBack={r.onBack} user={user} />}
        {r.route === 'planner' && <RouteCalculator onBack={r.onBack} />}

        <AIConcierge expanded={aiOpen} onToggle={() => setAiOpen(!aiOpen)} onExpert={r.onExpert} />
      </div>
    </I18nProvider>
  );
}

export default App;
