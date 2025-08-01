'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormWizard } from '@/components/form-inputs/wizard';
import { InputTypes } from '@/lib/constants';
import {
  usePostAuthLogin,
  usePostAuthRegister,
} from '@/lib/api/auth/auth';
import { saveTokens } from '@/lib/auth';
import { toast } from 'sonner';
import { User, Lock } from 'lucide-react';

// Zod schemas for validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters'),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onAuthStateChange?: () => void;
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  onAuthStateChange,
}: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  const loginMutation = usePostAuthLogin({
    mutation: {
      onSuccess: (response) => {
        console.log('Login successful:', response.data);
        const { accessToken, refreshToken } = response.data;
        saveTokens(accessToken, refreshToken);
        toast.success('Login successful!');
        onSuccess();
        onClose();
        // Trigger auth state change callback
        if (onAuthStateChange) {
          onAuthStateChange();
        }
        // Force page reload to ensure auth state is properly updated
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      onError: (error) => {
        toast.error('Login failed. Please check your credentials.');
        console.error('Login error:', error);
      },
    },
  });

  const registerMutation = usePostAuthRegister({
    mutation: {
      onSuccess: () => {
        toast.success('Registration successful! Please log in.');
        setIsLogin(true);
        registerForm.reset();
      },
      onError: (error) => {
        toast.error('Registration failed. Please try again.');
        console.error('Registration error:', error);
      },
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    loginMutation.mutate({
      data: {
        email: data.email,
        password: data.password,
      },
    });
  };

  const handleRegister = async (data: RegisterFormData) => {
    registerMutation.mutate({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLogin ? (
              <>
                <Lock className="h-5 w-5" />
                Login to Continue
              </>
            ) : (
              <>
                <User className="h-5 w-5" />
                Create Account
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLogin ? (
          <form
            onSubmit={loginForm.handleSubmit(handleLogin)}
            className="space-y-4">
            <FormWizard
              config={[
                {
                  type: InputTypes.EMAIL,
                  label: 'Email Address',
                  required: true,
                  register: loginForm.register('email'),
                  errors: loginForm.formState.errors,
                  placeholder: 'Enter your email address',
                },
              ]}
            />

            <FormWizard
              config={[
                {
                  type: InputTypes.PASSWORD,
                  label: 'Password',
                  required: true,
                  register: loginForm.register('password'),
                  errors: loginForm.formState.errors,
                  placeholder: 'Enter your password',
                },
              ]}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-sm text-blue-600 hover:underline">
                Don&apos;t have an account? Sign up
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={registerForm.handleSubmit(handleRegister)}
            className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormWizard
                config={[
                  {
                    type: InputTypes.TEXT,
                    label: 'First Name',
                    required: true,
                    register: registerForm.register('firstName'),
                    errors: registerForm.formState.errors,
                    placeholder: 'First name',
                  },
                ]}
              />
              <FormWizard
                config={[
                  {
                    type: InputTypes.TEXT,
                    label: 'Last Name',
                    required: true,
                    register: registerForm.register('lastName'),
                    errors: registerForm.formState.errors,
                    placeholder: 'Last name',
                  },
                ]}
              />
            </div>

            <FormWizard
              config={[
                {
                  type: InputTypes.EMAIL,
                  label: 'Email Address',
                  required: true,
                  register: registerForm.register('email'),
                  errors: registerForm.formState.errors,
                  placeholder: 'Enter your email address',
                },
              ]}
            />

            <FormWizard
              config={[
                {
                  type: InputTypes.TEXT,
                  label: 'Phone Number',
                  required: true,
                  register: registerForm.register('phone'),
                  errors: registerForm.formState.errors,
                  placeholder: 'Enter your phone number',
                },
              ]}
            />

            <FormWizard
              config={[
                {
                  type: InputTypes.PASSWORD,
                  label: 'Password',
                  required: true,
                  register: registerForm.register('password'),
                  errors: registerForm.formState.errors,
                  placeholder: 'Create a password',
                },
              ]}
            />

            <FormWizard
              config={[
                {
                  type: InputTypes.PASSWORD,
                  label: 'Confirm Password',
                  required: true,
                  register: registerForm.register('confirmPassword'),
                  errors: registerForm.formState.errors,
                  placeholder: 'Confirm your password',
                },
              ]}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}>
              {registerMutation.isPending
                ? 'Creating account...'
                : 'Create Account'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-sm text-blue-600 hover:underline">
                Already have an account? Login
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
