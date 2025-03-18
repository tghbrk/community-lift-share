
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    avatarUrl: "",
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name, avatar_url")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            avatarUrl: data.avatar_url || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error fetching profile",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    };

    getProfile();
  }, [user, toast]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          avatar_url: profile.avatarUrl,
          updated_at: new Date().toISOString(), // Fixed: Converting Date to string
        })
        .eq("id", user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your profile information
              </CardDescription>
            </CardHeader>
            <form onSubmit={updateProfile}>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <img 
                      src={profile.avatarUrl || "https://github.com/shadcn.png"} 
                      alt="Avatar" 
                      className="aspect-square h-full w-full"
                    />
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">Profile picture</h3>
                    <p className="text-sm text-muted-foreground">
                      This will be displayed on your profile
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input 
                      id="firstName" 
                      value={profile.firstName} 
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input 
                      id="lastName" 
                      value={profile.lastName} 
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input 
                    id="avatarUrl" 
                    value={profile.avatarUrl} 
                    onChange={(e) => setProfile({...profile, avatarUrl: e.target.value})}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="rounded-md border border-input bg-background px-3 py-2">
                  {user?.email}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={signOut}>Sign out</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
