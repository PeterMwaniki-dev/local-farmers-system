import Navbar from './Navbar';
import { useSettings } from '../contexts/SettingsContext';

const Layout = ({ children }) => {
  const { darkMode, sidebarNav, sidebarOpen } = useSettings();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Navbar />
      <main
        className={`transition-all duration-300 ${
          sidebarNav 
            ? sidebarOpen 
              ? 'ml-64' 
              : 'ml-0'
            : ''
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
