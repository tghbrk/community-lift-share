
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const { signIn, signUp, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    if (!loginEmail || !loginPassword) {
      setAuthError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error) {
      setAuthError(error.message);
    }
    
    setIsSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    if (!registerEmail || !registerPassword || !firstName || !lastName) {
      setAuthError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    const { error } = await signUp(registerEmail, registerPassword, firstName, lastName);
    
    if (error) {
      setAuthError(error.message);
    }
    
    setIsSubmitting(false);
  };

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Welcome to JiranRide
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connect with drivers and passengers in your community
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          {authError && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <div className="space-y-4 rounded-md shadow-sm">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="pl-10"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="mt-8 space-y-6">
              <div className="space-y-4 rounded-md shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first-name">First Name</Label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="first-name"
                        name="firstName"
                        type="text"
                        required
                        className="pl-10"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="last-name">Last Name</Label>
                    <div className="relative mt-1">
                      <Input
                        id="last-name"
                        name="lastName"
                        type="text"
                        required
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10"
                      placeholder="Enter your email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="pl-10"
                      placeholder="Create a password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
