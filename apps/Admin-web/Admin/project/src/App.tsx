import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Providers from './pages/Providers';
import Seekers from './pages/Seekers';
import Shops from './pages/Shops';
import Jobs from './pages/Jobs';
import Categories from './pages/Categories';
import Verification from './pages/Verification';
import Complaints from './pages/Complaints';
import Emergency from './pages/Emergency';
import Notifications from './pages/Notifications';
import Training from './pages/Training';
import Settings from './pages/Settings';
import FAQs from './pages/FAQs';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public login route */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Protected routes */}
        {isAuthenticated ? (
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/seekers" element={<Seekers />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/training" element={<Training />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/settings" element={<Settings />} />
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>
        ) : (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;




// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/auth/Login';
// import DashboardLayout from './components/layout/DashboardLayout';
// import Dashboard from './pages/Dashboard';
// import Providers from './pages/Providers';
// import Seekers from './pages/Seekers';
// import Shops from './pages/Shops';
// import Jobs from './pages/Jobs';
// import Categories from './pages/Categories';
// import Verification from './pages/Verification';
// import Complaints from './pages/Complaints';
// import Emergency from './pages/Emergency';
// import Notifications from './pages/Notifications';
// import Training from './pages/Training';
// import Settings from './pages/Settings';
// import FAQs from './pages/FAQs';
// import { AuthProvider, useAuth } from './contexts/AuthContext';

// function AppContent() {
//   const { isAuthenticated } = useAuth();

//   return (
//     <Router>
//       <div className="min-h-screen bg-white">
//         <Routes>
//           <Route 
//             path="/login" 
//             element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
//           />
//           <Route
//             path="/*"
//             element={
//               isAuthenticated ? (
//                 <DashboardLayout>
//                   <Routes>
//                     <Route path="/dashboard" element={<Dashboard />} />
//                     <Route path="/providers" element={<Providers />} />
//                     <Route path="/seekers" element={<Seekers />} />
//                     {/* <Route path="/shops" element={<Shops />} /> */}
//                     <Route path="/jobs" element={<Jobs />} />
//                     <Route path="/categories" element={<Categories />} />
//                     <Route path="/verification" element={<Verification />} />
//                     <Route path="/complaints" element={<Complaints />} />
//                     <Route path="/emergency" element={<Emergency />} />
//                     <Route path="/notifications" element={<Notifications />} />
//                     <Route path="/training" element={<Training />} />
//                     <Route path="/faqs" element={<FAQs />} />
//                     <Route path="/settings" element={<Settings />} />
//                     <Route path="/" element={<Navigate to="/dashboard" />} />
//                   </Routes>
//                 </DashboardLayout>
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }

// export default App;