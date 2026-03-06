
-- Fix 1: Restrict profiles SELECT to authenticated users only
DROP POLICY "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (true);

-- Fix 2: Revoke UPDATE on rating and review_count from authenticated role
REVOKE UPDATE (rating, review_count) ON public.profiles FROM authenticated;
