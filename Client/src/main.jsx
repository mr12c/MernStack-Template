import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Route } from 'react-router-dom';
import { createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider.jsx';
import { Provider, useSelector } from 'react-redux';
import { RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { store } from './AppStore/index.js';

import Login from './Pages/auth/Login.jsx';
import Logout from './Pages/auth/Logout.jsx';
import Signup from './Pages/auth/Signup.jsx';
import ForgetPassword from './Pages/auth/ForgetPass.jsx';
import Page from './Pages/page.jsx';

// PrivateRoute: Restricts access based on authentication
const PrivateRoute = () => {
  const { accessToken } = useSelector((state) => state.AuthSlice);
  console.log(accessToken);
  return accessToken ? <Outlet /> : <Navigate to="/auth/login" />;
};

// AuthRoute: Redirects authenticated users from auth routes to home
const AuthRoute = () => {
  const { accessToken } = useSelector((state) => state.AuthSlice);
  return accessToken ? <Navigate to="/" /> : <Outlet />;
};

// Router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Private Routes */}
      <Route path="/" element={<PrivateRoute/>} > 

      <Route path="/" element={<Page />} />
      </Route>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthRoute />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/logout" element={<Logout />} />
        <Route path="/auth/forgotPassword" element={<ForgetPassword />} />
        <Route path="/auth/signup" element={<Signup />} />
      </Route>

      {/* Catch-All Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  )
);

// App entry point
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
