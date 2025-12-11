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
    
    const systemPrompt = `You are a creative UX/UI design challenge generator for "Design Camp" - a platform helping designers build portfolio-worthy projects. Generate engaging, practical design challenges that help designers improve their skills and stand out in the job market.

Your challenges should:
- Be completable in 1-4 hours
- Focus on real-world, portfolio-worthy outcomes
- Include specific constraints to spark creativity
- Be relevant to current design trends and job market needs
- Encourage both visual design and UX thinking`;

    const userPrompt = `Generate a unique daily design challenge for ${today}.

${category ? `Category focus: ${category}` : 'Category: Mix of UI, UX, or Visual Design'}
${difficulty ? `Difficulty level: ${difficulty}` : 'Difficulty: Intermediate'}

Respond with a JSON object containing:
{
  "title": "A catchy, inspiring challenge title (max 60 chars)",
  "description": "A brief 1-2 sentence hook (max 150 chars)",
  "full_description": "Detailed challenge brief with context, goals, and specific requirements (2-3 paragraphs)",
  "category": "UI Design | UX Design | Visual Design | Mobile Design | Web Design",
  "difficulty": "Beginner | Intermediate | Advanced",
  "time_estimate": "1-2 hours | 2-3 hours | 3-4 hours",
  "example_outputs": ["3-4 specific deliverable suggestions"]
}

Make it creative, specific, and inspiring. Include real-world context like designing for a specific type of business or solving a particular user problem.`;

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
