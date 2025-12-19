import { createBrowserRouter, redirect } from 'react-router';
import CandidateLayout from './layouts/CandidateLayout';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import DirectionDetailPage from './pages/DirectionDetailPage/DirectionDetailPage';
import MyApplicationsPage from './pages/MyApplicationsPage/MyApplicationsPage';
import TestPage from './pages/TestPage/TestPage';
import { useAuthStore } from './storage/authStorage';

// Root path loader - redirects to candidate routes
const rootLoader = async () => {
  return redirect('/candidate');
};

// Candidate-specific protected loader
const candidateProtectedLoader = async () => {
  const user = useAuthStore.getState().user;
  if (!user) {
    return redirect('/login');
  }
  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CandidateLayout />,
    children: [
      // Root index route - redirects to candidate home
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
        path: '/register',
        element: <RegisterPage />,
      },

      // Candidate routes (public direction browsing, protected personal features)
      {
        path: '/candidate',
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'directions/:id',
            element: <DirectionDetailPage />,
          },
          {
            path: 'test/:attemptId',
            element: <TestPage />,
            loader: candidateProtectedLoader,
          },
          {
            path: 'applications',
            element: <MyApplicationsPage />,
            loader: candidateProtectedLoader,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
            loader: candidateProtectedLoader,
          },
        ],
      },
    ],
  },
]);
