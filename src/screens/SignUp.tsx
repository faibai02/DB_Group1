import React, { useState } from 'react';
import { signUp } from '../api/auth';

interface SignUpProps {
  onSignUpSuccess: () => void;
  onNavigate: (screen: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check password match when typing
    if (name === 'password' || name === 'confirmPassword') {
      const pass1 = name === 'password' ? value : formData.password;
      const pass2 = name === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordsMatch(pass1 === pass2);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
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
      await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
      onSignUpSuccess();
      onNavigate('login');
    } catch (err: any) {
      setError(err.message || 'Error during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Create Account</h1>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              style={styles.input}
              required
            />
          </div>

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
              placeholder="At least 6 characters"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
              style={{
                ...styles.input,
                borderColor: !passwordsMatch ? '#ff3333' : '#ddd',
              }}
              required
            />
            {!passwordsMatch && (
              <p style={styles.warningText}>Passwords do not match</p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !passwordsMatch}
            style={{
              ...styles.submitButton,
              opacity: isLoading || !passwordsMatch ? 0.6 : 1,
              cursor: isLoading || !passwordsMatch ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div style={styles.linkContainer}>
          <p style={styles.linkText}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              style={styles.link}
            >
              Sign In
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
    transition: 'border-color 0.3s',
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
  warningText: {
    color: '#ff3333',
    fontSize: '12px',
    marginTop: '4px',
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

export default SignUp;
