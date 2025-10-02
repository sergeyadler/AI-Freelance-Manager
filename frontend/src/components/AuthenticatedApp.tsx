import { useAuth } from '../contexts/AuthContext';
import App from '../App';
import { Login } from './Login';

export function AuthenticatedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#1a1a1f',
        color: '#fff',
        fontSize: '18px',
      }}>
        Loading...
      </div>
    );
  }

  return user ? <App /> : <Login />;
}

