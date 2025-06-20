import React from 'react';
import { Helmet } from 'react-helmet';
import { 
  Home, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  FileText,
  Eye,
  Building2,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Example stat card component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  color = 'blue'
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  description?: string;
  trend?: { value: string; positive: boolean };
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'rose'; 
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    rose: 'bg-rose-100 text-rose-600',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            {trend && (
              <div className={`flex items-center mt-2 text-xs ${trend.positive ? 'text-green-600' : 'text-rose-600'}`}>
                {trend.positive ? <TrendingUp size={12} className="mr-1" /> : <TrendingUp size={12} className="mr-1 rotate-180" />}
                <span>{trend.value} от миналия месец</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Административен панел | Automation Aid</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Административен панел</h1>
        <p className="text-muted-foreground">Добре дошли в администраторския панел на Automation Aid</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Активни имоти" 
          value="124" 
          icon={Home}
          trend={{ value: "+12%", positive: true }}
          color="blue"
        />
        <StatCard 
          title="Регистрирани потребители" 
          value="1,842" 
          icon={Users}
          trend={{ value: "+5.3%", positive: true }}
          color="green"
        />
        <StatCard 
          title="Нови запитвания" 
          value="28" 
          icon={MessageSquare}
          description="За последните 7 дни"
          color="amber"
        />
        <StatCard 
          title="Заявки за продажба" 
          value="16" 
          icon={Building2}
          trend={{ value: "+24%", positive: true }}
          color="purple"
        />
      </div>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Eye className="mr-2 h-5 w-5 text-primary" />
              Най-разглеждани имоти
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="text-sm flex justify-between">
                <span>Луксозен апартамент в центъра</span>
                <span className="font-medium">458 прегледа</span>
              </li>
              <li className="text-sm flex justify-between">
                <span>Триетажна къща с басейн</span>
                <span className="font-medium">320 прегледа</span>
              </li>
              <li className="text-sm flex justify-between">
                <span>Офис сграда на бул. България</span>
                <span className="font-medium">254 прегледа</span>
              </li>
              <li className="text-sm flex justify-between">
                <span>Студио в Студентски град</span>
                <span className="font-medium">198 прегледа</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Последни новини
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="text-sm flex justify-between">
                <span>Как да обзаведете малък апартамент</span>
                <span className="font-medium text-muted-foreground">преди 2 дни</span>
              </li>
              <li className="text-sm flex justify-between">
                <span>Пазарът на имоти през 2025</span>
                <span className="font-medium text-muted-foreground">преди 4 дни</span>
              </li>
              <li className="text-sm flex justify-between">
                <span>Съвети за успешна сделка с имот</span>
                <span className="font-medium text-muted-foreground">преди 1 седмица</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              Последни кандидатури за работа
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="text-sm flex justify-between">
                <span>Иван Петров <span className="text-muted-foreground">(Брокер)</span></span>
                <span className="font-medium text-muted-foreground">преди 1 ден</span>
              </li>
              <li className="text-sm flex justify-between">
                <span>Мария Димитрова <span className="text-muted-foreground">(Маркетинг)</span></span>
                <span className="font-medium text-muted-foreground">преди 3 дни</span>
              </li>
              <li className="text-sm flex justify-between">
                <span>Георги Иванов <span className="text-muted-foreground">(Продажби)</span></span>
                <span className="font-medium text-muted-foreground">преди 5 дни</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
