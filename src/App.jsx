import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventProvider } from './context/EventContext';

import Login from './pages/Login';
import SidebarLayout from './components/SidebarLayout';
import StudentPortal from './pages/StudentPortal';
import StudentRegistered from './pages/StudentRegistered';
import OrganizerPortal from './pages/OrganizerPortal';
import TeacherPortal from './pages/TeacherPortal';
import EventRegistration from './pages/EventRegistration';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If logged in but wrong role, redirect to their own portal (or home)
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<SidebarLayout />}>
              {/* Public Routes - Events Listing */}
              <Route path="/" element={<StudentPortal filterType="all" />} />
              <Route path="/ongoing" element={<StudentPortal filterType="ongoing" />} />
              <Route path="/upcoming" element={<StudentPortal filterType="upcoming" />} />
              <Route path="/past" element={<StudentPortal filterType="past" />} />
              
              {/* Public Registration Route */}
              <Route path="/event/:id/register" element={<EventRegistration />} />
              
              {/* Student Routes - deprecated but left for backwards compat */}
              <Route path="/student/registered" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentRegistered />
                </ProtectedRoute>
              } />
              
              {/* Organizer Routes */}
              <Route path="/organizer/*" element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <OrganizerPortal />
                </ProtectedRoute>
              } />
              
              {/* Teacher Routes */}
              <Route path="/teacher/*" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherPortal />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </EventProvider>
    </AuthProvider>
  );
}
