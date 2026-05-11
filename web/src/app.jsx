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
    <div data-screen-label={r.screenLabel}>
      <NavBar current={r.navCurrent} onNav={r.onNav} dark={true} user={user} onLogout={handleLogout}/>

      {r.route === 'home'      && <Landing heroVariant="A"
                                           onClusterSelect={r.onClusterSelect}
                                           onExpress={r.onGuide}
                                           onDashboard={r.onDashboard}
                                           onDictionary={r.onDictionary}
                                           onSos={r.onSos}
                                           onExpert={r.onExpert}/>}
      {r.route === 'cluster'   && <ClusterDetail cluster={r.cluster} onBack={r.onBack} onBook={r.onGuide}/>}
      {r.route === 'guide'     && <TravelGuide onBack={r.onBack} onExpert={r.onExpert} initialTab={r.guideTab}/>}
      {r.route === 'dashboard' && <Dashboard onBack={r.onBack} onExpert={r.onExpert}/>}
      {r.route === 'sos'       && <EmergencyHub onBack={r.onBack}/>}
      {r.route === 'auth'      && <Auth onBack={r.onBack} onLogin={handleLogin}/>}
      {r.route === 'booking'   && <BookingPage onBack={r.onBack} onProfile={() => r.goRoute('profile')} user={user}/>}
      {r.route === 'profile'   && <ProfilePage onBack={r.onBack} user={user}/>}

      <AIConcierge expanded={aiOpen} onToggle={() => setAiOpen(!aiOpen)}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
