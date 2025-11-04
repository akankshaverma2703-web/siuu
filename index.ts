import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, language, patientHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Processing AI consultation:', { language, hasHistory: !!patientHistory });

    // Create bilingual system prompt with emphasis on concise, appropriate advice
    const historyContext = patientHistory 
      ? `\n\nPatient History: ${JSON.stringify(patientHistory)}`
      : '';

    const systemPrompt = language === 'hindi'
      ? `आप एक सहायक चिकित्सा सहायक हैं। संक्षिप्त, स्पष्ट और सटीक सलाह दें (2-3 वाक्य)। गंभीर लक्षणों के लिए डॉक्टर से परामर्श की सलाह दें। ${historyContext}`
      : `You are a helpful medical assistant. Provide brief, clear, and accurate advice (2-3 sentences). For serious symptoms, recommend consulting a doctor. ${historyContext}`;

    const userPrompt = language === 'hindi'
      ? `लक्षण: ${query}\n\nकृपया संक्षिप्त सलाह दें (अधिकतम 3 वाक्य)। यदि गंभीर हो तो डॉक्टर से मिलने की सलाह दें।`
      : `Symptoms: ${query}\n\nProvide brief advice (maximum 3 sentences). If serious, recommend seeing a doctor.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI API returned ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI consultation completed successfully');

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-consultation:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});