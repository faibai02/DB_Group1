import React, { useState } from 'react';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onLoginSuccess: () => void;
  onNavigate: (screen: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: setAuthUser } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      // Save user to context
      setAuthUser({
        email: formData.email,
        name: formData.email.split('@')[0], // Temporary, will be updated from profile API
      });

      setFormData({ email: '', password: '' });
      onLoginSuccess();
      onNavigate('home');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Sign In</h1>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Your password"
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.submitButton,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.linkContainer}>
          <p style={styles.linkText}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              style={styles.link}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
    fontSize: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
    fontSize: '14px',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  submitButton: {
    padding: '12px',
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  errorMessage: {
    backgroundColor: '#ffe0e0',
    color: '#d32f2f',
    padding: '12px',
    borderRadius: '5px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  linkContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: '14px',
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#ff6b35',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: 0,
  },
};

export default Login;
