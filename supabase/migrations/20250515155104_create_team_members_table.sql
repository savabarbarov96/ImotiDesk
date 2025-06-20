CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  bio TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some initial sample team members
INSERT INTO team_members (name, position, bio, image_url, order_index, is_active)
VALUES 
('Иван Петров', 'Управител', 'С над 15 години опит в сектора на недвижимите имоти, Иван води компанията към нови хоризонти.', '/placeholder.svg', 1, true),
('Мария Иванова', 'Старши брокер', 'Мария е експерт в луксозните имоти и е помогнала на стотици клиенти да намерят перфектния дом.', '/placeholder.svg', 2, true),
('Георги Димитров', 'Финансов директор', 'Георги се грижи за финансовото здраве на компанията и осигурява изгодни оферти за нашите клиенти.', '/placeholder.svg', 3, true),
('Анна Николова', 'Маркетинг мениджър', 'С креативен подход към маркетинга, Анна помага на Automation Aid да достигне до повече клиенти всеки ден.', '/placeholder.svg', 4, true);
