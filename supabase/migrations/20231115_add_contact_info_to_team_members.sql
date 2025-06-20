-- Add email and phone number fields to team_members table
ALTER TABLE public.team_members
ADD COLUMN email VARCHAR(255),
ADD COLUMN phone_number VARCHAR(50);

-- Add comment to describe the email field
COMMENT ON COLUMN public.team_members.email IS 'Email address of the team member';

-- Add comment to describe the phone_number field
COMMENT ON COLUMN public.team_members.phone_number IS 'Phone number of the team member'; 