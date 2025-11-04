import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AppointmentBookingProps {
  userId: string;
  language: 'english' | 'hindi';
}

const AppointmentBooking = ({ userId, language }: AppointmentBookingProps) => {
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:doctor_id(full_name)
      `)
      .eq('patient_id', userId)
      .order('appointment_date', { ascending: false });

    if (data) setAppointments(data);
  };

  const handleBookAppointment = async () => {
    if (!symptoms.trim() || !appointmentDate) {
      toast({
        title: language === 'hindi' ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('appointments').insert({
        patient_id: userId,
        symptoms,
        appointment_date: new Date(appointmentDate).toISOString(),
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: language === 'hindi' ? 'अपॉइंटमेंट बुक हो गया' : 'Appointment booked',
        description: language === 'hindi'
          ? 'आपका अपॉइंटमेंट सफलतापूर्वक बुक हो गया है'
          : 'Your appointment has been booked successfully',
      });

      setSymptoms('');
      setAppointmentDate('');
      fetchAppointments();
    } catch (error: any) {
      toast({
        title: language === 'hindi' ? 'त्रुटि' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: language === 'hindi' ? 'लंबित' : 'Pending', variant: 'secondary', icon: Clock },
      approved: { label: language === 'hindi' ? 'स्वीकृत' : 'Approved', variant: 'default', icon: CheckCircle },
      completed: { label: language === 'hindi' ? 'पूर्ण' : 'Completed', variant: 'default', icon: CheckCircle },
      cancelled: { label: language === 'hindi' ? 'रद्द' : 'Cancelled', variant: 'destructive', icon: XCircle },
      urgent: { label: language === 'hindi' ? 'तत्काल' : 'Urgent', variant: 'destructive', icon: AlertCircle },
    };

    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {language === 'hindi' ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}
          </CardTitle>
          <CardDescription>
            {language === 'hindi'
              ? 'डॉक्टर से मिलने के लिए अपॉइंटमेंट बुक करें'
              : 'Schedule an appointment with a doctor'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'hindi' ? 'लक्षण' : 'Symptoms'}
            </label>
            <Textarea
              placeholder={
                language === 'hindi'
                  ? 'अपने लक्षणों का वर्णन करें...'
                  : 'Describe your symptoms...'
              }
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'hindi' ? 'पसंदीदा दिनांक और समय' : 'Preferred Date & Time'}
            </label>
            <input
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <Button
            onClick={handleBookAppointment}
            disabled={loading}
            className="w-full"
          >
            {loading
              ? language === 'hindi' ? 'बुक कर रहे हैं...' : 'Booking...'
              : language === 'hindi' ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'hindi' ? 'आपके अपॉइंटमेंट' : 'Your Appointments'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {language === 'hindi' ? 'कोई अपॉइंटमेंट नहीं' : 'No appointments yet'}
            </p>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium">
                        {new Date(apt.appointment_date).toLocaleString(
                          language === 'hindi' ? 'hi-IN' : 'en-US'
                        )}
                      </p>
                      {apt.doctor?.full_name && (
                        <p className="text-sm text-muted-foreground">
                          {language === 'hindi' ? 'डॉक्टर: ' : 'Doctor: '}
                          {apt.doctor.full_name}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {apt.symptoms}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentBooking;