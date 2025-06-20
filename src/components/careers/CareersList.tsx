
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type CareerPosition = {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  is_active: boolean;
  created_at: string;
};

const CareersList = () => {
  const [positions, setPositions] = useState<CareerPosition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPosition, setSelectedPosition] = useState<CareerPosition | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const { data, error } = await supabase
          .from('careers')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setPositions(data || []);
      } catch (error) {
        console.error('Error fetching positions:', error);
        toast({
          title: "Грешка",
          description: "Възникна проблем при зареждането на отворените позиции.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const handleViewDetails = (position: CareerPosition) => {
    setSelectedPosition(position === selectedPosition ? null : position);
  };

  const handleScrollToApplication = () => {
    const applicationForm = document.getElementById('career-application-form');
    if (applicationForm) {
      applicationForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="w-full grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <p className="text-muted-foreground">В момента няма отворени позиции, но можете да изпратите вашата автобиография за бъдещи възможности.</p>
          <Button className="mt-4" onClick={handleScrollToApplication}>
            Изпратете своята кандидатура
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 gap-6">
      {positions.map((position) => (
        <Card key={position.id} className="overflow-hidden transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl">{position.title}</CardTitle>
            <CardDescription className="flex flex-wrap gap-4 text-sm mt-2">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {position.department}
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {position.location}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Публикувана на {new Date(position.created_at).toLocaleDateString('bg-BG')}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="font-medium mb-2">Описание на позицията:</h4>
              <p className="text-muted-foreground">{position.description}</p>
            </div>

            {selectedPosition?.id === position.id && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Изисквания:</h4>
                <p className="text-muted-foreground">{position.requirements}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3 justify-between">
            <Button 
              variant="outline" 
              onClick={() => handleViewDetails(position)}
            >
              {selectedPosition?.id === position.id ? "Скрий детайли" : "Виж повече"}
            </Button>
            <Button 
              onClick={handleScrollToApplication}
              data-position-id={position.id}
            >
              Кандидатствай
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CareersList;
