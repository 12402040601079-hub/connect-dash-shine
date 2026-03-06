
-- Fix all RLS policies to be PERMISSIVE (they were incorrectly created as RESTRICTIVE)

-- PROFILES
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Re-apply rating/review_count protection
REVOKE UPDATE (rating, review_count) ON public.profiles FROM authenticated;

-- TASKS
DROP POLICY IF EXISTS "Tasks are viewable by everyone" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Posters can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Posters can delete their own tasks" ON public.tasks;

CREATE POLICY "Tasks are viewable by everyone" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Users can create tasks" ON public.tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = poster_id);
CREATE POLICY "Posters can update their own tasks" ON public.tasks FOR UPDATE TO authenticated USING (auth.uid() = poster_id);
CREATE POLICY "Posters can delete their own tasks" ON public.tasks FOR DELETE TO authenticated USING (auth.uid() = poster_id);

-- BIDS
DROP POLICY IF EXISTS "Bids viewable by task poster and bidder" ON public.bids;
DROP POLICY IF EXISTS "Helpers can place bids" ON public.bids;
DROP POLICY IF EXISTS "Helpers can update their own bids" ON public.bids;
DROP POLICY IF EXISTS "Helpers can delete their own bids" ON public.bids;

CREATE POLICY "Bids viewable by task poster and bidder" ON public.bids FOR SELECT TO authenticated USING ((auth.uid() = helper_id) OR (auth.uid() IN (SELECT tasks.poster_id FROM tasks WHERE tasks.id = bids.task_id)));
CREATE POLICY "Helpers can place bids" ON public.bids FOR INSERT TO authenticated WITH CHECK (auth.uid() = helper_id);
CREATE POLICY "Helpers can update their own bids" ON public.bids FOR UPDATE TO authenticated USING (auth.uid() = helper_id);
CREATE POLICY "Helpers can delete their own bids" ON public.bids FOR DELETE TO authenticated USING (auth.uid() = helper_id);

-- MESSAGES
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their received messages" ON public.messages;

CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT TO authenticated USING ((auth.uid() = sender_id) OR (auth.uid() = receiver_id));
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their received messages" ON public.messages FOR UPDATE TO authenticated USING (auth.uid() = receiver_id);
