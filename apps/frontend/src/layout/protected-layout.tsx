import { Navigate, Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  if (!user && !user?.access_token) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div>
      <div>ProtectedLayout</div>
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
