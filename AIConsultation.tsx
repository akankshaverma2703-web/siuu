import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AIConsultationProps {
  userId: string;
  language: 'english' | 'hindi';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIConsultation = ({ userId, language }: AIConsultationProps) => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const commonSymptoms = language === 'hindi' 
    ? ['बुखार', 'सिरदर्द', 'खांसी', 'पेट दर्द', 'थकान']
    : ['Fever', 'Headache', 'Cough', 'Stomach Pain', 'Fatigue'];

  const handleConsultation = async () => {
    if (!query.trim()) {
      toast({
        title: language === 'hindi' ? 'कृपया अपने लक्षण बताएं' : 'Please describe your symptoms',
        variant: 'destructive',
      });
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setQuery('');

    try {
      const { data: historyData } = await supabase
        .from('medical_history')
        .select('*')
        .eq('patient_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data, error } = await supabase.functions.invoke('ai-consultation', {
        body: {
          query: userMessage.content,
          language,
          patientHistory: historyData,
        },
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes('Rate limit')) {
          toast({
            title: language === 'hindi' ? 'कृपया बाद में पुनः प्रयास करें' : 'Please try again later',
            description: language === 'hindi' 
              ? 'बहुत सारे अनुरोध। कृपया थोड़ी देर प्रतीक्षा करें।'
              : 'Too many requests. Please wait a moment.',
            variant: 'destructive',
          });
        } else {
          throw new Error(data.error);
        }
        return;
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      await supabase.from('consultations').insert({
        patient_id: userId,
        consultation_type: 'ai_consultation',
        query: userMessage.content,
        response: data.response,
        language,
      });
    } catch (error: any) {
      console.error('Consultation error:', error);
      toast({
        title: language === 'hindi' ? 'त्रुटि' : 'Error',
        description: error.message || 'Failed to get consultation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Medical Disclaimer - Always visible */}
      <Card className="border-warning/50 bg-gradient-to-r from-warning/5 to-transparent">
        <CardContent className="flex items-start gap-3 pt-4">
          <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {language === 'hindi'
                ? '⚠️ महत्वपूर्ण चिकित्सा अस्वीकरण'
                : '⚠️ Important Medical Disclaimer'}
            </p>
            <p className="text-xs text-muted-foreground">
              {language === 'hindi'
                ? 'यह एआई सलाह केवल सामान्य जानकारी के लिए है। गंभीर लक्षणों, आपातकालीन स्थितियों या चिकित्सा निदान के लिए तुरंत योग्य चिकित्सक से परामर्श करें।'
                : 'This AI advice is for general information only. For serious symptoms, emergencies, or medical diagnosis, please consult a qualified doctor immediately.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {language === 'hindi' ? 'एआई स्वास्थ्य सहायक' : 'AI Health Assistant'}
                </CardTitle>
                <CardDescription className="text-xs flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {language === 'hindi' ? 'चिकित्सा ज्ञान द्वारा संचालित' : 'Powered by Medical Knowledge'}
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
              {language === 'hindi' ? 'ऑनलाइन' : 'Online'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Messages */}
          <div className="space-y-4 min-h-[300px] max-h-[500px] overflow-y-auto mb-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
                <div className="p-4 bg-muted/50 rounded-full">
                  <Bot className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {language === 'hindi'
                      ? 'अपने लक्षणों का वर्णन करके शुरू करें'
                      : 'Start by describing your symptoms'}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {commonSymptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => setQuery(symptom)}
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString(language === 'hindi' ? 'hi-IN' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-muted border rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {language === 'hindi' ? 'विश्लेषण कर रहे हैं...' : 'Analyzing symptoms...'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="space-y-2">
            <Textarea
              placeholder={
                language === 'hindi'
                  ? 'अपने लक्षण यहां बताएं...'
                  : 'Describe your symptoms here...'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleConsultation();
                }
              }}
              rows={3}
              className="resize-none"
              disabled={loading}
            />
            <Button
              onClick={handleConsultation}
              disabled={loading || !query.trim()}
              className="w-full transition-all hover:scale-[1.02]"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'hindi' ? 'विश्लेषण कर रहे हैं...' : 'Analyzing...'}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {language === 'hindi' ? 'परामर्श प्राप्त करें' : 'Get Consultation'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIConsultation;