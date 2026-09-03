import { useState } from 'react';

function useRouter() {
  const [route, setRoute] = useState('home');
  const [cluster, setCluster] = useState(null);
  const [guideTab, setGuideTab] = useState(null);

  const goRoute = (r) => { setRoute(r); window.scrollTo({ top: 0 }); };
  const goGuide = (tab) => { setGuideTab(tab || null); goRoute('guide'); };

  const onNav = (id) => {
    if (id === 'home') setRoute('home');
    else if (id === 'guides')     goGuide();
    else if (id === 'dashboard')  goRoute('dashboard');
    else if (id === 'dictionary') goGuide('dictionary');
    else if (id === 'sos')        goRoute('sos');
    else if (id === 'planner')    goRoute('planner');
    else if (id === 'expert')     goRoute('booking');
    else if (id === 'booking')    goRoute('booking');
    else if (id === 'profile')    goRoute('profile');
    else if (id === 'auth')       goRoute('auth');
  };

  const onClusterSelect = (c) => { setCluster(c); goRoute('cluster'); };
  const onGuide      = () => goGuide();
  const onExpert     = () => goRoute('booking');
  const onDashboard  = () => goRoute('dashboard');
  const onDictionary = () => goGuide('dictionary');
  const onSos        = () => goRoute('sos');
  const onBack       = () => goRoute('home');

  const screenLabel = {
    home: '01 Landing', cluster: '02 Destination Detail',
    guide: '03 Travel Guide', expert: '04 Talk to Expert',
    dashboard: '05 Live Dashboard', sos: '06 Emergency Hub',
    auth: '07 Authentication', booking: '08 Book Session',
    profile: '09 Profile', planner: '10 Route Planner',
  }[route];

  const navCurrent = ({
    guide: 'guides', expert: 'expert',
    dashboard: 'dashboard', sos: 'sos', planner: 'planner',
  })[route] || (route === 'home' ? '' : '');

  return {
    route, cluster, guideTab, screenLabel, navCurrent,
    goRoute, setCluster,
    onNav, onClusterSelect, onGuide, onExpert,
    onDashboard, onDictionary, onSos, onBack,
  };
}

export default useRouter;
