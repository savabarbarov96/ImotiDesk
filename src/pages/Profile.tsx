
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [fullName, setFullName] = useState('');

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProfileData(data as ProfileData);
          setFullName(data.full_name || '');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: 'Грешка при зареждане на профила',
          description: 'Моля, опитайте отново по-късно.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getProfile();
    }
  }, [user]);

  const updateProfile = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: fullName, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Профилът е обновен',
        description: 'Вашите промени са запазени успешно.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Грешка при обновяване на профила',
        description: 'Моля, опитайте отново по-късно.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Моят Профил</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Информация за профила</CardTitle>
                <CardDescription>
                  Вашият имейл: {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Име и фамилия</Label>
                    <Input 
                      id="fullName" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Роля</Label>
                    <div className="p-2 border rounded-md bg-gray-50">
                      {profileData?.role || 'authenticated'}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={updateProfile} 
                    disabled={loading || !fullName} 
                    className="w-full"
                  >
                    {loading ? 'Запазване...' : 'Запази промените'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Моите Дейности</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Информация за вашите дейности ще бъде показана тук.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
