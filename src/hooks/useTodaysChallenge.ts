import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TodaysChallenge {
  id: string;
  title: string;
  description: string;
  full_description: string | null;
  category: string;
  difficulty: string;
  time_estimate: string | null;
  challenge_date: string;
  example_outputs: string[] | null;
}

export const useTodaysChallenge = () => {
  const [challenge, setChallenge] = useState<TodaysChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodaysChallenge = async () => {
      try {
        // First, try to get from database (cached challenge)
        const today = new Date().toISOString().split('T')[0];
        
        const { data: existingChallenge, error: fetchError } = await supabase
          .from('challenges')
          .select('*')
          .eq('challenge_date', today)
          .maybeSingle();

        if (fetchError) {
          console.error('Database fetch error:', fetchError);
        }

        if (existingChallenge) {
          setChallenge(existingChallenge);
          setLoading(false);
          return;
        }

        // If no challenge in DB, generate one with AI
        console.log('No challenge found for today, generating with AI...');
        
        const { data, error: invokeError } = await supabase.functions.invoke('generate-challenge', {
          body: {}
        });

        if (invokeError) {
          console.error('AI generation error:', invokeError);
          setError('Failed to generate today\'s challenge');
          setLoading(false);
          return;
        }

        if (data?.error) {
          console.error('AI response error:', data.error);
          setError(data.error);
          setLoading(false);
          return;
        }

        setChallenge(data);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Failed to fetch today\'s challenge');
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysChallenge();
  }, []);

  const regenerateChallenge = async (category?: string, difficulty?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('generate-challenge', {
        body: { category, difficulty }
      });

      if (invokeError) {
        console.error('AI generation error:', invokeError);
        setError('Failed to generate challenge');
        return;
      }

      if (data?.error) {
        console.error('AI response error:', data.error);
        setError(data.error);
        return;
      }

      setChallenge(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to generate challenge');
    } finally {
      setLoading(false);
    }
  };

  return { challenge, loading, error, regenerateChallenge };
};
