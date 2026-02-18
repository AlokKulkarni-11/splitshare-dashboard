
-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paid_by TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL,
  expense_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Allow public read and write access (no authentication required per user spec)
CREATE POLICY "Anyone can view expenses"
  ON public.expenses FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update expenses"
  ON public.expenses FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete expenses"
  ON public.expenses FOR DELETE
  USING (true);
