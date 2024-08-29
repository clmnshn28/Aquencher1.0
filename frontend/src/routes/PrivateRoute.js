import { Navigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
