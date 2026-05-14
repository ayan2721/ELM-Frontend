import { Outlet } from 'react-router-dom';
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Sidebar participates in the flex layout on lg+ (not overlapping the main content) */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 min-h-screen min-w-0 transition-all duration-300 p-4 sm:p-6 lg:p-8 xl:p-12">
        <div className="max-w-full xl:max-w-7xl w-full min-w-0 mx-auto space-y-8 fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};




export default Layout;


