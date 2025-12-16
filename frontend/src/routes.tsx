import { createBrowserRouter, redirect } from "react-router";
import WithToolbarLayout from "./layouts/WithToolbarLayout";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { useAuthStore } from "./storage/authStorage";

// Protected route loader
const protectedLoader = async () => {
  const user = useAuthStore.getState().user;
  if (!user) {
    return redirect("/login");
  }
  return null;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <WithToolbarLayout/>,
    children: [
      {
        path: "/",
        element: <HomePage/>,
      },
      {
        path: "/login",
        element: <LoginPage/>,
      },
      {
        path: "/register",
        element: <RegisterPage/>,
      },
      {
        path: "/profile",
        element: <ProfilePage/>,
        loader: protectedLoader,
      }

    ],
  },
]);