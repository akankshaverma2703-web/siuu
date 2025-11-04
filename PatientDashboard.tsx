import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MessageSquare, FileText, LogOut, Heart, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AIConsultation from '@/components/AIConsultation';
import AppointmentBooking from '@/components/AppointmentBooking';
import MedicalHistory from '@/components/MedicalHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LanguageToggle from '@/components/LanguageToggle';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const toggleLanguage = async () => {
    const newLanguage = profile?.language_preference === 'hindi' ? 'english' : 'hindi';
    
    await supabase
      .from('profiles')
      .update({ language_preference: newLanguage })
      .eq('id', profile?.id);
    
    setProfile({ ...profile, language_preference: newLanguage });
    
    toast({
      title: newLanguage === 'hindi' ? 'भाषा बदली गई' : 'Language changed',
      description: newLanguage === 'hindi' 
        ? 'भाषा हिंदी में बदल दी गई है'
        : 'Language changed to English',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">AyanshMed</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle
              language={profile?.language_preference || 'english'}
              onToggle={toggleLanguage}
            />
            <div className="text-right hidden sm:block">
              <p className="font-medium">{profile?.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {profile?.language_preference === 'hindi' ? 'मरीज़' : 'Patient'}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {profile?.language_preference === 'hindi' 
              ? `स्वागत है, ${profile?.full_name}` 
              : `Welcome, ${profile?.full_name}`}
          </h2>
          <p className="text-muted-foreground">
            {profile?.language_preference === 'hindi'
              ? 'अपना स्वास्थ्य प्रबंधित करें और तुरंत एआई परामर्श प्राप्त करें'
              : 'Manage your health and get instant AI consultations'}
          </p>
        </div>

        <Tabs defaultValue="consultation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="consultation">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Consultation
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="history">
              <FileText className="h-4 w-4 mr-2" />
              Medical History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consultation">
            <AIConsultation userId={profile?.id} language={profile?.language_preference || 'english'} />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentBooking userId={profile?.id} language={profile?.language_preference || 'english'} />
          </TabsContent>

          <TabsContent value="history">
            <MedicalHistory userId={profile?.id} language={profile?.language_preference || 'english'} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PatientDashboard;