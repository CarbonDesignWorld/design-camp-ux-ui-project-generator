import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, difficulty } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const today = new Date().toISOString().split('T')[0];
    
    const systemPrompt = `You are a creative UX/UI design challenge generator for "Design Camp". Generate concise, structured design challenges that are scannable and actionable.

Keep all content SHORT and CLEAR:
- Background: 1-2 sentences max
- Task: Clear, specific deliverable
- Constraints: 2-3 bullet points
- Bonus: One optional stretch goal`;

    const userPrompt = `Generate a unique daily design challenge for ${today}.

${category ? `Category focus: ${category}` : 'Category: Mix of UI, UX, or Visual Design'}
${difficulty ? `Difficulty level: ${difficulty}` : 'Difficulty: Intermediate'}

Respond with a JSON object containing:
{
  "title": "Catchy challenge title (max 50 chars)",
  "description": "One sentence hook (max 100 chars)",
  "background_context": "1-2 sentences of real-world context about the business/user problem",
  "challenge_task": "Clear, specific task/deliverable in 1-2 sentences",
  "constraints": ["2-3 short creative constraints as bullet points"],
  "bonus_challenge": "One optional stretch goal for extra difficulty",
  "category": "UI Design | UX Design | Visual Design | Mobile Design | Web Design",
  "difficulty": "Beginner | Intermediate | Advanced",
  "time_estimate": "1-2 hours | 2-3 hours | 3-4 hours"
}

Be specific and actionable. Include a fictional but realistic business context.`;

    console.log('Generating challenge with Lovable AI...');
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('Raw AI response:', content);
    
    // Parse JSON from response (handle markdown code blocks)
    let challenge;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1]?.trim() || content.trim();
      challenge = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Add metadata
    challenge.id = crypto.randomUUID();
    challenge.challenge_date = today;
    challenge.created_at = new Date().toISOString();

    console.log('Generated challenge:', challenge.title);

    return new Response(JSON.stringify(challenge), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating challenge:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
