import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ProcurementProvider } from '../../context/ProcurementContext';
import logo from '../../assets/logo-umb.png';

const Layout = ({ children }) => {
  const { user, logout, getRoleLabel } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      roles: ['requesting_unit', 'unit_approver', 'compliance_officer', 'procurement_officer', 'admin']
    },
    {
      path: '/my-requests',
      label: 'My Requests',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      roles: ['requesting_unit', 'admin']
    },
    {
      path: '/create-request',
      label: 'Create Request',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      roles: ['requesting_unit', 'admin']
    },
    {
      path: '/approvals',
      label: 'Approvals',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      roles: ['unit_approver', 'admin']
    },
    {
      path: '/compliance',
      label: 'Compliance Review',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      roles: ['compliance_officer', 'admin']
    },
    {
      path: '/procurement',
      label: 'Procurement Queue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      roles: ['procurement_officer', 'admin']
    },
    {
      path: '/admin',
      label: 'Administration',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      roles: ['admin']
    }
  ];

  const filteredNavItems = navItems.filter(item =>
    item.roles.includes(user?.role)
  );

  return (
    <ProcurementProvider>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 z-40 ${sidebarCollapsed ? 'w-20' : 'w-64'
            }`}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg"> <span className="text-slate-900 font-bold text-lg"> <img src={logo} alt="UMB Bank Logo" className="w-8 h-8" /> </span> </div>
                <div>
                  <h1 className="font-bold text-lg tracking-tight">

                    <span className="text-white italic [text-shadow:0_0_6px_rgba(255,255,255,0.3)]"> Speed</span>
                    <span className="text-amber-400 not-italic [text-shadow:0_0_8px_rgba(245,158,11,0.3)]">Procure</span>
                  </h1>
                  <p className="text-xs text-slate-400">Procurement System</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <svg className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                      ? 'bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/10'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                >
                  <span className={isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center ring-2 ring-slate-600">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{getRoleLabel(user?.role)}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-slate-800">
                {filteredNavItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {user?.name?.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-semibold text-slate-800">{user?.name}</p>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                          {getRoleLabel(user?.role)}
                        </span>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </ProcurementProvider>
  );
};

export default Layout;
