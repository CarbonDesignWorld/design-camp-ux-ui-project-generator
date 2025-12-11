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
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error: fetchError } = await supabase
          .from('challenges')
          .select('*')
          .eq('challenge_date', today)
          .maybeSingle();

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setChallenge(data);
        }
      } catch (err) {
        setError('Failed to fetch today\'s challenge');
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysChallenge();
  }, []);

  return { challenge, loading, error };
};
