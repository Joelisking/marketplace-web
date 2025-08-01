'use client';
import React, { useState } from 'react';
import {
  usePostAuthLogin,
  usePostAuthRegister,
} from '../../../lib/api/auth/auth';
import type { PostAuthRegisterBodyRole } from '../../../lib/api/marketplaceAPI.schemas';
import { Input } from '@/components/ui';
import { saveTokens } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const roles = [
  { label: 'Customer', value: 'CUSTOMER' },
  { label: 'Vendor', value: 'VENDOR' },
];

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  // Registration form state
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('CUSTOMER');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  const loginMutation = usePostAuthLogin({
    mutation: {
      onError: (err: unknown) => {
        let msg = 'Login failed';
        if (err && typeof err === 'object') {
          const anyErr = err as { [key: string]: unknown };
          if (
            anyErr.response &&
            typeof anyErr.response === 'object' &&
            anyErr.response !== null
          ) {
            const response = anyErr.response as {
              data?: { error?: unknown; message?: unknown };
            };
            if (response.data) {
              if (typeof response.data.error === 'string') {
                msg = response.data.error;
              } else if (typeof response.data.message === 'string') {
                msg = response.data.message;
              } else if (typeof anyErr.message === 'string') {
                msg = anyErr.message as string;
              } else {
                msg = String(err);
              }
            } else if (typeof anyErr.message === 'string') {
              msg = anyErr.message as string;
            } else {
              msg = String(err);
            }
          } else if (typeof anyErr.message === 'string') {
            msg = anyErr.message as string;
          } else {
            msg = String(err);
          }
        }
        setError(msg);
      },
      onSuccess: (data) => {
        setError('');
        // Save tokens from the response
        if (data.data?.accessToken && data.data?.refreshToken) {
          saveTokens(data.data.accessToken, data.data.refreshToken);
          // Redirect based on role
          if (data.data.user?.role === 'VENDOR') {
            router.push('/vendor/dashboard');
          } else {
            router.push('/');
          }
        }
      },
    },
  });

  const registerMutation = usePostAuthRegister({
    mutation: {
      onError: (err: unknown) => {
        let msg = 'Registration failed';
        if (err && typeof err === 'object') {
          const anyErr = err as { [key: string]: unknown };
          if (
            anyErr.response &&
            typeof anyErr.response === 'object' &&
            anyErr.response !== null
          ) {
            const response = anyErr.response as {
              data?: { error?: unknown; message?: unknown };
            };
            if (response.data) {
              if (typeof response.data.error === 'string') {
                msg = response.data.error;
              } else if (typeof response.data.message === 'string') {
                msg = response.data.message;
              } else if (typeof anyErr.message === 'string') {
                msg = anyErr.message as string;
              } else {
                msg = String(err);
              }
            } else if (typeof anyErr.message === 'string') {
              msg = anyErr.message as string;
            } else {
              msg = String(err);
            }
          } else if (typeof anyErr.message === 'string') {
            msg = anyErr.message as string;
          } else {
            msg = String(err);
          }
        }
        setRegError(msg);
        setRegSuccess('');
      },
      onSuccess: () => {
        setRegError('');
        setRegSuccess('Registration successful! You can now log in.');
        setRegEmail('');
        setRegPassword('');
        setRegRole('CUSTOMER');
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({
      data: {
        email,
        password,
      },
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    registerMutation.mutate({
      data: {
        email: regEmail,
        password: regPassword,
        role: regRole as PostAuthRegisterBodyRole,
      },
    });
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '40px auto',
        padding: 24,
        border: '1px solid #eee',
        borderRadius: 8,
      }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}>
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: 12 }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          style={{ width: '100%', padding: 10 }}>
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => setShowRegister(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0070f3',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}>
          Register as a new user or vendor
        </button>
      </div>
      {showRegister && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1000,
          }}
          onClick={() => setShowRegister(false)}>
          <div
            style={{
              background: '#fff',
              maxWidth: 400,
              margin: '60px auto',
              padding: 24,
              borderRadius: 8,
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowRegister(false)}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'none',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
              }}>
              &times;
            </button>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: 12 }}>
                <label>Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Role</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  style={{ width: '100%', padding: 8, marginTop: 4 }}>
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              {regError && (
                <div style={{ color: 'red', marginBottom: 12 }}>
                  {regError}
                </div>
              )}
              {regSuccess && (
                <div style={{ color: 'green', marginBottom: 12 }}>
                  {regSuccess}
                </div>
              )}
              <button
                type="submit"
                disabled={registerMutation.isPending}
                style={{ width: '100%', padding: 10 }}>
                {registerMutation.isPending
                  ? 'Registering...'
                  : 'Register'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
