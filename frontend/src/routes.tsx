import { createBrowserRouter, redirect } from 'react-router';
import WithToolbarLayout from './layouts/WithToolbarLayout';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import RecruiterRegisterPage from './pages/RecruiterRegisterPage/RecruiterRegisterPage';
import RecruiterHomePage from './pages/RecruiterHomePage/RecruiterHomePage';
import CandidateDetailPage from './pages/CandidateDetailPage/CandidateDetailPage';
import VacancyDetailPage from './pages/VacancyDetailPage/VacancyDetailPage';
import MyApplicationsPage from './pages/MyApplicationsPage/MyApplicationsPage';
import VacancyApplicationsPage from './pages/VacancyApplicationsPage/VacancyApplicationsPage';
import { useAuthStore } from './storage/authStorage';

// Basic protected route loader - checks if user is logged in
const protectedLoader = async () => {
  const user = useAuthStore.getState().user;
  if (!user) {
    return redirect('/login');
  }
  return null;
};

// Candidate-specific protected loader
const candidateProtectedLoader = async () => {
  const user = useAuthStore.getState().user;
  if (!user) {
    return redirect('/login');
  }
  if (user.role !== 'candidate') {
    return redirect('/recruiter');
  }
  return null;
};

// Recruiter-specific protected loader
const recruiterProtectedLoader = async () => {
  const user = useAuthStore.getState().user;
  if (!user) {
    return redirect('/login');
  }
  if (user.role !== 'recruiter') {
    return redirect('/candidate');
  }
  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WithToolbarLayout />,
    children: [
      // Public routes
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/register/recruiter',
        element: <RecruiterRegisterPage />,
      },

      // Candidate routes (protected)
      {
        path: '/candidate',
        loader: candidateProtectedLoader,
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
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },

      // Recruiter routes (protected) - FIXED typo from /recruter
      {
        path: '/recruiter',
        loader: recruiterProtectedLoader,
        children: [
          {
            index: true,
            element: <RecruiterHomePage />,
          },
          {
            path: 'candidates/:id',
            element: <CandidateDetailPage />,
          },
          {
            path: 'vacancies/:id/applications',
            element: <VacancyApplicationsPage />,
          },
        ],
      },
    ],
  },
]);
