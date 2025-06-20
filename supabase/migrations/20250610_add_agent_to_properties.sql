-- Add agent_id to properties table to associate properties with team members
ALTER TABLE public.properties
ADD COLUMN agent_id UUID REFERENCES public.team_members(id);

-- Add comment to describe the agent_id field
COMMENT ON COLUMN public.properties.agent_id IS 'The team member who is the agent for this property';

-- Add index for faster lookups
CREATE INDEX idx_properties_agent_id ON public.properties(agent_id); 