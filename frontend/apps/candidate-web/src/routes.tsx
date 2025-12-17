import { createBrowserRouter, redirect } from 'react-router';
import CandidateLayout from './layouts/CandidateLayout';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import VacancyDetailPage from './pages/VacancyDetailPage/VacancyDetailPage';
import MyApplicationsPage from './pages/MyApplicationsPage/MyApplicationsPage';
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

      // Candidate routes (public vacancy browsing, protected personal features)
      {
        path: '/candidate',
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'vacancies/:id',
            element: <VacancyDetailPage />,
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
