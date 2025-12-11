-- Create a function to calculate leaderboard stats
CREATE OR REPLACE FUNCTION public.get_leaderboard(time_filter text DEFAULT 'all')
RETURNS TABLE (
  user_id uuid,
  name text,
  profile_image text,
  submission_count bigint,
  streak_days integer,
  total_points bigint,
  rank bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  start_date timestamp with time zone;
BEGIN
  -- Set the start date based on filter
  IF time_filter = 'week' THEN
    start_date := now() - interval '7 days';
  ELSIF time_filter = 'month' THEN
    start_date := now() - interval '30 days';
  ELSE
    start_date := '1970-01-01'::timestamp with time zone;
  END IF;

  RETURN QUERY
  WITH submission_stats AS (
    SELECT 
      s.user_id,
      COUNT(*)::bigint as sub_count
    FROM submissions s
    WHERE s.created_at >= start_date
    GROUP BY s.user_id
  ),
  streak_stats AS (
    SELECT 
      s.user_id,
      COUNT(DISTINCT DATE(s.created_at))::integer as streak
    FROM submissions s
    WHERE s.created_at >= now() - interval '30 days'
    GROUP BY s.user_id
  ),
  combined AS (
    SELECT 
      p.user_id,
      p.name,
      p.profile_image,
      COALESCE(ss.sub_count, 0) as submission_count,
      COALESCE(st.streak, 0) as streak_days,
      (COALESCE(ss.sub_count, 0) + (COALESCE(st.streak, 0) * 2))::bigint as total_points
    FROM profiles p
    LEFT JOIN submission_stats ss ON p.user_id = ss.user_id
    LEFT JOIN streak_stats st ON p.user_id = st.user_id
    WHERE COALESCE(ss.sub_count, 0) > 0 OR COALESCE(st.streak, 0) > 0
  )
  SELECT 
    c.user_id,
    c.name,
    c.profile_image,
    c.submission_count,
    c.streak_days,
    c.total_points,
    ROW_NUMBER() OVER (ORDER BY c.total_points DESC, c.submission_count DESC)::bigint as rank
  FROM combined c
  ORDER BY rank;
END;
$$;