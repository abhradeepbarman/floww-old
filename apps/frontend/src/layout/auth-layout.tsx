import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  if (user && user.access_token) {
    return <Navigate to={'/dashboard'} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthLayout;
