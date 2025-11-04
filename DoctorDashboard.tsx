import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, LogOut, Heart, User, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDoctor();
    fetchAppointments();
  }, []);

  const checkDoctor = async () => {
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

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'doctor')
        .single();

      if (!roleData) {
        navigate('/patient');
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patient_id(full_name, phone)
      `)
      .order('appointment_date', { ascending: true });

    if (data) setAppointments(data);
  };

  const handleApproveAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'approved',
          doctor_id: profile?.id 
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Appointment approved',
        description: 'The appointment has been approved successfully',
      });

      fetchAppointments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCompleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Appointment completed',
        description: 'The appointment has been marked as completed',
      });

      fetchAppointments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  const pendingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'urgent');
  const approvedAppointments = appointments.filter(a => a.status === 'approved');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">AyanshMed Doctor Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium">Dr. {profile?.full_name}</p>
              <p className="text-sm text-muted-foreground">Doctor</p>
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
          <h2 className="text-3xl font-bold mb-2">Welcome, Dr. {profile?.full_name}</h2>
          <p className="text-muted-foreground">Manage patient appointments and consultations</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Ready for consultation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">All appointments</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Appointments */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Pending Appointments
            </CardTitle>
            <CardDescription>Review and approve patient requests</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No pending appointments</p>
            ) : (
              <div className="space-y-4">
                {pendingAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {apt.patient?.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {apt.patient?.phone}
                        </p>
                      </div>
                      {apt.status === 'urgent' && (
                        <Badge variant="destructive">URGENT</Badge>
                      )}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Scheduled: {new Date(apt.appointment_date).toLocaleString()}</p>
                      <p className="mt-2"><strong>Symptoms:</strong> {apt.symptoms}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleApproveAppointment(apt.id)} className="flex-1">
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approved Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Approved Appointments
            </CardTitle>
            <CardDescription>Ready for consultation</CardDescription>
          </CardHeader>
          <CardContent>
            {approvedAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No approved appointments</p>
            ) : (
              <div className="space-y-4">
                {approvedAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {apt.patient?.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {apt.patient?.phone}
                        </p>
                      </div>
                      <Badge>Approved</Badge>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Scheduled: {new Date(apt.appointment_date).toLocaleString()}</p>
                      <p className="mt-2"><strong>Symptoms:</strong> {apt.symptoms}</p>
                    </div>
                    <Button 
                      onClick={() => handleCompleteAppointment(apt.id)} 
                      variant="outline"
                      className="w-full"
                    >
                      Mark as Completed
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DoctorDashboard;