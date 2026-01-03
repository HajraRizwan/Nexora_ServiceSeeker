import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Briefcase, 
  FileCheck, 
  MessageSquare, 
  AlertTriangle, 
  Bell, 
  GraduationCap, 
  Settings,
  X,
  Shield,
  Grid3X3,
  ShoppingBasket,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: UserCheck, label: 'Providers', path: '/providers' },
    { icon: Users, label: 'Seekers', path: '/seekers' },
    { icon: ShoppingBasket, label: 'Shops', path: '/shops' }, // ✅ fixed
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: Grid3X3, label: 'Categories', path: '/categories' },
    { icon: FileCheck, label: 'Verification', path: '/verification' },
    { icon: MessageSquare, label: 'Complaints', path: '/complaints' },
    { icon: AlertTriangle, label: 'Emergency', path: '/emergency' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: GraduationCap, label: 'Training', path: '/training' },
    { icon: HelpCircle, label: 'FAQs', path: '/faqs' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#19034d' }}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-purple-800">
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#05f51d' }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-white text-xl font-bold">Admin Panel</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-white shadow-lg'
                        : 'text-purple-200 hover:text-white hover:bg-purple-800'
                    }`}
                    style={isActive ? { backgroundColor: '#05f51d' } : {}}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;








// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { 
//   LayoutDashboard, 
//   Users, 
//   UserCheck, 
//   Briefcase, 
//   FileCheck, 
//   MessageSquare, 
//   AlertTriangle, 
//   Bell, 
//   GraduationCap, 
//   Settings,
//   X,
//   Shield,
//   Grid3X3,
//   ShoppingBasket,
//   HelpCircle
// } from 'lucide-react';
// import shops from '../../pages/Shops';

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
//   const location = useLocation();

//   const menuItems = [
//     { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
//     { icon: UserCheck, label: 'Providers', path: '/providers' },
//     { icon: Users, label: 'Seekers', path: '/seekers' },
//      { icon: shops, label: 'Shops', path: '/shops' },
//     { icon: Briefcase, label: 'Jobs', path: '/jobs' },
//     { icon: Grid3X3, label: 'Categories', path: '/categories' },
//     { icon: FileCheck, label: 'Verification', path: '/verification' },
//     { icon: MessageSquare, label: 'Complaints', path: '/complaints' },
//     { icon: AlertTriangle, label: 'Emergency', path: '/emergency' },
//     { icon: Bell, label: 'Notifications', path: '/notifications' },
//     { icon: GraduationCap, label: 'Training', path: '/training' },
//     { icon: HelpCircle, label: 'FAQs', path: '/faqs' },
//     { icon: Settings, label: 'Settings', path: '/settings' },
//   ];

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//         style={{ backgroundColor: '#19034d' }}
//       >
//         <div className="flex items-center justify-between h-16 px-6 border-b border-purple-800">
//           <div className="flex items-center space-x-3">
//             <div
//               className="w-8 h-8 rounded-lg flex items-center justify-center"
//               style={{ backgroundColor: '#05f51d' }}
//             >
//               <Shield className="w-5 h-5 text-white" />
//             </div>
//             <h1 className="text-white text-xl font-bold">Admin Panel</h1>
//           </div>
//           <button
//             onClick={onClose}
//             className="lg:hidden text-white hover:text-gray-300 transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <nav className="mt-8 px-4">
//           <ul className="space-y-2">
//             {menuItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;

//               return (
//                 <li key={item.path}>
//                   <Link
//                     to={item.path}
//                     onClick={onClose}
//                     className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//                       isActive
//                         ? 'text-white shadow-lg'
//                         : 'text-purple-200 hover:text-white hover:bg-purple-800'
//                     }`}
//                     style={isActive ? { backgroundColor: '#05f51d' } : {}}
//                   >
//                     <Icon className="w-5 h-5" />
//                     <span className="font-medium">{item.label}</span>
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </div>
//     </>
//   );};


// export default Sidebar;