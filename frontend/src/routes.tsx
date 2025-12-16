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

// Root path loader - redirects based on user role
const rootLoader = async () => {
  const user = useAuthStore.getState().user;

  // Unauthorized users and candidates go to vacancy list
  if (!user || user.role === 'candidate') {
    return redirect('/candidate');
  }

  // Recruiters go to candidate list
  if (user.role === 'recruiter') {
    return redirect('/recruiter');
  }

  // Fallback for unexpected cases
  return redirect('/candidate');
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
      // Root index route - redirects based on role
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
      {
        path: '/register/recruiter',
        element: <RecruiterRegisterPage />,
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
