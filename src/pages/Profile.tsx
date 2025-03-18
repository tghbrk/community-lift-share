
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, LogOut, Save } from 'lucide-react';

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
};

const Profile = () => {
  const { user, signOut, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
      return;
    }

    const getProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile(data);
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
        setError('Error loading profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user, isAuthenticated, isLoading, navigate]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.'
      });
      
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      setError(error.message);
      
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">
                {firstName && lastName 
                  ? `${firstName[0]}${lastName[0]}`
                  : user?.email?.[0].toUpperCase() || <User />}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-gray-500 text-center">{user?.email}</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <form onSubmit={updateProfile}>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save changes'}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
