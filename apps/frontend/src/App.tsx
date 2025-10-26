import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/not-found';
import Loader from './components/common/loader';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import AuthLayout from './layout/auth-layout';

const Home = lazy(() => import('./pages/home'));
const Main = lazy(() => import('./pages/dashboard/main'));
const Connections = lazy(() => import('./pages/dashboard/connections'));
const Workflows = lazy(() => import('./pages/dashboard/workflows'));
const DashboardLayout = lazy(() => import('./layout/dashboard-layout'));

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Main />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="connections" element={<Connections />} />
        </Route>
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
