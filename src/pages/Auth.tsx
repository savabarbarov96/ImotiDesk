import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import logo from '@/assets/logo-footer_2.png';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  // If user is already logged in, redirect to home page
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      await signIn(email, password);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Възникна грешка при вход. Моля, опитайте отново.');
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!fullName) {
      setErrorMessage('Моля, въведете име');
      return;
    }

    if (passphrase !== 'TrendimoForever') {
      setErrorMessage('Невалидна парола за достъп. Моля, опитайте отново.');
      return;
    }
    
    try {
      await signUp(email, password, fullName);
      setActiveTab('login');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Възникна грешка при регистрация. Моля, опитайте отново.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src={logo}
                              alt="Automation Aid Logo"
              className="h-24 w-auto"
            />
          </div>
                      <CardTitle className="text-2xl font-bold">Automation Aid</CardTitle>
          <CardDescription>Влезте в профила си или се регистрирайте</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Имейл</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Парола</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="outline" className="w-full" disabled={loading}>
                  {loading ? 'Изчакайте...' : 'Вход'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Име и фамилия</Label>
                  <Input 
                    id="fullName" 
                    type="text" 
                    placeholder="Иван Иванов" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Имейл</Label>
                  <Input 
                    id="registerEmail" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Парола</Label>
                  <Input 
                    id="registerPassword" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passphrase">Защитна фраза</Label>
                  <Input 
                    id="passphrase" 
                    type="password" 
                    placeholder="Специална фраза за достъп" 
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">За защита срещу злонамерени регистрации, моля въведете предоставената Ви защитна фраза.</p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Изчакайте...' : 'Регистрация'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate('/')}>
            Обратно към начална страница
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
