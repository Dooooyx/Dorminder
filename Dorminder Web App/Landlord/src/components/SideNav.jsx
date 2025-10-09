import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo/logo_dorminder.png';
import icDashboard from '../assets/SidenavIcons/ic_dashboard.png';
import icHome from '../assets/SidenavIcons/ic_home.png';
import icTenants from '../assets/SidenavIcons/ic_tenants.png';
import icReport from '../assets/SidenavIcons/ic_report.png';
import icTransactions from '../assets/SidenavIcons/ic_transactions.png';
import icTools from '../assets/SidenavIcons/ic_tools.png';
import icNotifications from '../assets/SidenavIcons/ic_notifications.png';
import icSettings from '../assets/SidenavIcons/ic_settings.png';
import icLogout from '../assets/SidenavIcons/ic_logout.png';

const SideNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [requestsOpen, setRequestsOpen] = useState(location.pathname.startsWith('/requests'));

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: icDashboard },
    { path: '/rooms', label: 'Rooms', icon: icHome },
    { path: '/tenants', label: 'Tenants', icon: icTenants },
    // Requests will be rendered with a dropdown below
    { path: '/requests', label: 'Requests', icon: icReport, hasChildren: true },
    { path: '/rules', label: 'Rules', icon: icTools },
    { path: '/transactions', label: 'Billings', icon: icTransactions },
    { path: '/tools-reports', label: 'Tools & Reports', icon: icTools },
    { path: '/notifications', label: 'Notifications', icon: icNotifications },
  ];

  const bottomItems = [
    { path: '/settings', label: 'Settings', icon: icSettings },
    { path: '/logout', label: 'Logout', icon: icLogout, isLogout: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-white shadow-lg flex flex-col z-50" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Logo Section */}
      <div className="flex items-center justify-center py-6 border-b border-gray-200">
        <img 
          src={logoImage} 
          alt="Dorminder Logo" 
          className="h-12 w-auto"
        />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              {item.hasChildren ? (
                <>
                  <button
                    onClick={() => setRequestsOpen((o) => !o)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      location.pathname.startsWith(item.path)
                        ? 'bg-gray-100 text-gray-800'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <span className="flex items-center space-x-3">
                      <img src={item.icon} alt={item.label} className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${requestsOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {requestsOpen && (
                    <ul className="mt-1 ml-10 space-y-1">
                      <li>
                        <button
                          onClick={() => navigate('/requests?category=request')}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            location.pathname === '/requests' && (new URLSearchParams(location.search).get('category') || 'request') === 'request'
                              ? 'bg-orange-50 text-orange-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          Request
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => navigate('/requests?category=report')}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            location.pathname === '/requests' && new URLSearchParams(location.search).get('category') === 'report'
                              ? 'bg-orange-50 text-orange-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          Report
                        </button>
                      </li>
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-gray-100 text-gray-800'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <img src={item.icon} alt={item.label} className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section - Settings and Logout */}
      <div className="px-4 py-6 border-t border-gray-200">
        <ul className="space-y-2">
          {bottomItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-gray-100 text-gray-800'
                    : item.isLogout
                    ? 'text-orange-500 hover:bg-orange-50 hover:text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <img 
                  src={item.icon} 
                  alt={item.label} 
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </>
  );
};

export default SideNav;
