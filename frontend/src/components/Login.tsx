import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      if (isSignUp) {
        await register(email, password, fullName || undefined);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a1a1f',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#2f2f3a',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{
          color: '#fff',
          marginBottom: '10px',
          textAlign: 'center',
          fontSize: '28px',
        }}>
          AI Freelance Manager
        </h1>
        <p style={{
          color: '#888',
          marginBottom: '30px',
          textAlign: 'center',
        }}>
          {isSignUp ? 'Create your account' : 'Sign in to continue'}
        </p>

        {error && (
          <div style={{
            backgroundColor: '#ff4444',
            color: '#fff',
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Full Name (optional)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '15px',
                backgroundColor: '#1a1a1f',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '16px',
              }}
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={{
              width: '100%',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: '#1a1a1f',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '16px',
            }}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            style={{
              width: '100%',
              padding: '15px',
              marginBottom: '20px',
              backgroundColor: '#1a1a1f',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '16px',
            }}
          />
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          color: '#888',
        }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: '#4CAF50',
              cursor: loading ? 'not-allowed' : 'pointer',
              textDecoration: 'underline',
              fontSize: '14px',
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}

