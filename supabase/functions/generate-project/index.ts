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
    const { skillLevel, projectType, platform, duration } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert UX/UI career coach for "Design Camp". Generate concise, structured portfolio project prompts that are scannable and actionable.

Keep all content SHORT and CLEAR:
- Background: 2-3 sentences max
- Deliverables: Clear bullet points
- Constraints: 2-3 creative limitations
- Challenges: Key problems to solve`;

    const userPrompt = `Generate a unique portfolio project for a UX/UI designer.

Filters:
- Skill Level: ${skillLevel || 'Intermediate'}
- Project Type: ${projectType || 'Any'}
- Platform: ${platform || 'Any'}
- Duration: ${duration || 'Medium (1-2 weeks)'}

Respond with a JSON object containing:
{
  "title": "Compelling project title (max 50 chars)",
  "background_context": "2-3 sentences: fictional company name, their business, the problem to solve",
  "skill_level": "Beginner | Intermediate | Advanced",
  "project_type": "Landing Page | Mobile App | Dashboard | E-commerce | SaaS | Portfolio Piece",
  "platform": "Web | Mobile | Cross-platform",
  "duration": "Quick (2-3 days) | Medium (1-2 weeks) | Extended (3-4 weeks)",
  "time_estimate": "Specific hours like '8-12 hours'",
  "deliverables": ["4-5 specific deliverables as short bullet points"],
  "constraints": ["2-3 creative constraints to guide the design"],
  "challenges": ["3-4 key design challenges to consider"],
  "tools_recommended": ["3-4 recommended tools"],
  "market_relevance": "One sentence on why this project is valuable for the job market"
}

Be specific and actionable. Use a realistic fictional brand context.`;

    console.log('Generating project with Lovable AI...');
    
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
    let project;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1]?.trim() || content.trim();
      project = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Add metadata
    project.id = crypto.randomUUID();
    project.created_at = new Date().toISOString();

    console.log('Generated project:', project.title);

    return new Response(JSON.stringify(project), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating project:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
