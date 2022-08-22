ALTER TABLE public.areas ADD hidden varchar(1) NOT NULL DEFAULT 'F'; COMMENT ON COLUMN public.areas.hidden IS 'is the route hidden';
ALTER TABLE public.areas_approval ADD hidden varchar(1) NOT NULL DEFAULT 'F'; COMMENT ON COLUMN public.areas_approval .hidden IS 'is the route hidden';
ALTER TABLE public.routes_approval ADD hidden varchar(1) NOT NULL DEFAULT 'F'; COMMENT ON COLUMN public.routes_approval .hidden IS 'is the route hidden';
ALTER TABLE public.routes ADD hidden varchar(1) NOT NULL DEFAULT 'F'; COMMENT ON COLUMN public.routes .hidden IS 'is the route hidden';
ALTER TABLE public.points ADD hidden varchar(1) NOT NULL DEFAULT 'F'; COMMENT ON COLUMN public.points .hidden IS 'is the route hidden';
ALTER TABLE public.points_approval  ADD hidden varchar(1) NOT NULL DEFAULT 'F'; COMMENT ON COLUMN public.points_approval .hidden IS 'is the route hidden';
