import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [sidebarNav, setSidebarNav] = useState(() => {
    const saved = localStorage.getItem('sidebarNav');
    return saved ? JSON.parse(saved) : false;
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('sidebarNav', JSON.stringify(sidebarNav));
  }, [sidebarNav]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebarNav = () => setSidebarNav(!sidebarNav);
  const toggleSidebarOpen = () => setSidebarOpen(!sidebarOpen);

  const value = {
    darkMode,
    sidebarNav,
    sidebarOpen,
    toggleDarkMode,
    toggleSidebarNav,
    toggleSidebarOpen
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
