import { createBrowserRouter, redirect } from 'react-router';
import RecruiterLayout from './layouts/RecruiterLayout';
import LoginPage from './pages/LoginPage/LoginPage';
import RecruiterRegisterPage from './pages/RecruiterRegisterPage/RecruiterRegisterPage';
import RecruiterHomePage from './pages/RecruiterHomePage/RecruiterHomePage';
import DirectionApplicationsPage from './pages/DirectionApplicationsPage/DirectionApplicationsPage';
import { useAuthStore } from './storage/authStorage';

// Root path loader - redirects to recruiter routes
const rootLoader = async () => {
  const user = useAuthStore.getState().user;

  // Redirect to login if not authenticated
  if (!user) {
    return redirect('/login');
  }

  // Redirect to recruiter home
  return redirect('/recruiter');
};

// Recruiter-specific protected loader
const recruiterProtectedLoader = async () => {
  const user = useAuthStore.getState().user;
  if (!user) {
    return redirect('/login');
  }
  if (user.role !== 'recruiter') {
    return redirect('/login');
  }
  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RecruiterLayout />,
    children: [
      // Root index route - redirects to recruiter home
      {
        index: true,
        loader: rootLoader,
      },

      // Public routes
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register/recruiter',
        element: <RecruiterRegisterPage />,
      },

      // Recruiter routes (protected)
      {
        path: '/recruiter',
        loader: recruiterProtectedLoader,
        children: [
          {
            index: true,
            element: <RecruiterHomePage />,
          },
          {
            path: 'directions/:directionId/applications',
            element: <DirectionApplicationsPage />,
          },
        ],
      },
    ],
  },
]);
