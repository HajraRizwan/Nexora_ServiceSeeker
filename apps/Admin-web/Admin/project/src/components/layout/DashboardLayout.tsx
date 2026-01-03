import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* ✅ Nested routes render here */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;





// import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import Header from './Header';

// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

// const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header onMenuClick={() => setSidebarOpen(true)} />
        
//         <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
//           <div className="max-w-7xl mx-auto">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;