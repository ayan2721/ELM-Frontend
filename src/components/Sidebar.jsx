// Sidebar.jsx
// Key fix: on desktop (lg+) the sidebar is a normal flex child (no fixed/static conflict).
// On mobile it stays fixed and slides in/out as before.

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  PlusIcon,
  DocumentMagnifyingGlassIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const employeeMenuItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { path: '/apply-leave', icon: PlusIcon, label: 'Apply Leave' },
    { path: '/leave-history', icon: DocumentMagnifyingGlassIcon, label: 'Leave History' },
  ];

  const managerMenuItems = [
    { path: '/manager', icon: UserGroupIcon, label: 'Manager Dashboard' },
  ];

  const menuItems =
    user?.role === 'manager'
      ? [...employeeMenuItems, ...managerMenuItems]
      : employeeMenuItems;

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleLogout = () => logout();

  return (
    <>
      {/* Mobile hamburger button — only visible below lg */}
      <button
        onClick={toggleSidebar}
        className="fixed z-50 top-6 left-6 p-3 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-slate-200 hover:-translate-y-0.5 transition-all lg:hidden"
      >
        <Bars3Icon className="w-6 h-6 text-slate-700" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/*
        SIDEBAR
        -------
        Mobile  : fixed, full height, slides in/out via translate
        Desktop : relative flex child, always visible, no translate tricks
                  The parent flex container (Layout) gives it natural width.
      */}
      <aside
        className={`
          z-50 min-h-screen w-72 xl:w-80 shrink-0
          flex flex-col bg-white/95 backdrop-blur-xl border-r border-slate-200
          shadow-2xl lg:shadow-xl transition-transform duration-300 ease-in-out

          fixed lg:relative
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* HEADER */}
        <div className="p-6 pb-4 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center">
                <CalendarIcon className="w-7 h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  LeaveSync
                </h2>
                <p className="text-sm text-slate-600 font-medium capitalize">
                  {user?.role}
                </p>
              </div>
            </div>

            {/* Close button — mobile only */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl"
            >
              <XMarkIcon className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* USER CARD */}
        <div className="px-6 py-5">
          <div className="p-5 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-3xl border border-slate-200">
            <div className="flex items-center gap-4">
              <UserCircleIcon className="w-12 h-12 text-indigo-600 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-sm text-slate-600 capitalize">{user?.role} Role</p>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav
          className="
            px-6 pb-6 space-y-2 flex-1
            overflow-y-auto
            [scrollbar-width:none]
            [-ms-overflow-style:none]
          "
        >
          <style>{`nav::-webkit-scrollbar { display: none; }`}</style>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-4 p-5 rounded-3xl transition-all duration-300 font-semibold border
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-xl border-indigo-300'
                      : 'text-slate-700 border-transparent hover:bg-indigo-50 hover:text-slate-900 hover:shadow-md'
                  }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all
                    ${isActive ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-indigo-100'}`}
                >
                  <Icon
                    className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-indigo-600'}`}
                  />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="px-6 py-5 border-t border-slate-200 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-5 rounded-3xl border hover:bg-red-50 hover:border-red-200 transition-all"
          >
            <div className="w-11 h-11 bg-red-500 rounded-2xl flex items-center justify-center shrink-0">
              <ArrowRightOnRectangleIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-left min-w-0">
              <p className="font-bold text-zinc-900">Sign Out</p>
              <p className="text-sm text-slate-500 truncate">{user?.name}</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;