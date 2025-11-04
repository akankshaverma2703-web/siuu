import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileText, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MedicalHistoryProps {
  userId: string;
  language: 'english' | 'hindi';
}

const MedicalHistory = ({ userId, language }: MedicalHistoryProps) => {
  const { toast } = useToast();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    condition: '',
    medications: '',
    allergies: '',
    blood_group: '',
    notes: '',
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('medical_history')
      .select('*')
      .eq('patient_id', userId)
      .order('created_at', { ascending: false });

    if (data) setHistory(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('medical_history').insert({
        patient_id: userId,
        ...formData,
      });

      if (error) throw error;

      toast({
        title: language === 'hindi' ? 'इतिहास जोड़ा गया' : 'History added',
        description: language === 'hindi'
          ? 'चिकित्सा इतिहास सफलतापूर्वक जोड़ा गया'
          : 'Medical history added successfully',
      });

      setFormData({
        condition: '',
        medications: '',
        allergies: '',
        blood_group: '',
        notes: '',
      });
      setOpen(false);
      fetchHistory();
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">
            {language === 'hindi' ? 'चिकित्सा इतिहास' : 'Medical History'}
          </h3>
          <p className="text-muted-foreground">
            {language === 'hindi'
              ? 'अपना चिकित्सा इतिहास प्रबंधित करें'
              : 'Manage your medical history'}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {language === 'hindi' ? 'जोड़ें' : 'Add'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {language === 'hindi' ? 'नया चिकित्सा रिकॉर्ड' : 'New Medical Record'}
              </DialogTitle>
              <DialogDescription>
                {language === 'hindi'
                  ? 'अपनी चिकित्सा जानकारी भरें'
                  : 'Fill in your medical information'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  {language === 'hindi' ? 'स्थिति' : 'Condition'}
                </label>
                <Input
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {language === 'hindi' ? 'दवाएं' : 'Medications'}
                </label>
                <Input
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {language === 'hindi' ? 'एलर्जी' : 'Allergies'}
                </label>
                <Input
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {language === 'hindi' ? 'रक्त समूह' : 'Blood Group'}
                </label>
                <Input
                  value={formData.blood_group}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {language === 'hindi' ? 'नोट्स' : 'Notes'}
                </label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? language === 'hindi' ? 'सहेज रहे हैं...' : 'Saving...'
                  : language === 'hindi' ? 'सहेजें' : 'Save'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-center">
                {language === 'hindi'
                  ? 'अभी तक कोई चिकित्सा इतिहास नहीं है'
                  : 'No medical history yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          history.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <CardTitle>{record.condition}</CardTitle>
                <CardDescription>
                  {new Date(record.created_at).toLocaleDateString(
                    language === 'hindi' ? 'hi-IN' : 'en-US'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {record.medications && (
                  <div>
                    <span className="font-medium">
                      {language === 'hindi' ? 'दवाएं: ' : 'Medications: '}
                    </span>
                    <span className="text-muted-foreground">{record.medications}</span>
                  </div>
                )}
                {record.allergies && (
                  <div>
                    <span className="font-medium">
                      {language === 'hindi' ? 'एलर्जी: ' : 'Allergies: '}
                    </span>
                    <span className="text-muted-foreground">{record.allergies}</span>
                  </div>
                )}
                {record.blood_group && (
                  <div>
                    <span className="font-medium">
                      {language === 'hindi' ? 'रक्त समूह: ' : 'Blood Group: '}
                    </span>
                    <span className="text-muted-foreground">{record.blood_group}</span>
                  </div>
                )}
                {record.notes && (
                  <div>
                    <span className="font-medium">
                      {language === 'hindi' ? 'नोट्स: ' : 'Notes: '}
                    </span>
                    <span className="text-muted-foreground">{record.notes}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;