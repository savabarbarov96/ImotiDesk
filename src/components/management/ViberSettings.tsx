import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import ViberIcon from '../icons/ViberIcon';

export function ViberSettings() {
  const [groupLink, setGroupLink] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchViberSettings();
  }, []);

  const fetchViberSettings = async () => {
    try {
      console.log('Fetching Viber settings...');
      const { data, error } = await supabase
        .from('viber_settings')
        .select('id, group_link, description')
        .single();

      if (error) {
        console.error('Error fetching Viber settings:', error);
        // If no records exist, we'll create one later
        if (error.code === 'PGRST116') {
          console.log('No Viber settings found, will create on save');
          return;
        }
        throw error;
      }
      
      console.log('Viber settings loaded:', data);
      if (data) {
        setSettingsId(data.id);
        setGroupLink(data.group_link || '');
        setDescription(data.description || '');
      }
    } catch (error: any) {
      console.error('Error fetching Viber settings:', error);
      toast({
        variant: "destructive",
        title: "Грешка",
        description: `Неуспешно зареждане на настройките за Viber: ${error.message || error}`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Saving Viber settings...');
      let result;
      
      // If we have an ID, update existing record
      if (settingsId) {
        console.log(`Updating existing settings with ID: ${settingsId}`);
        result = await supabase
          .from('viber_settings')
          .update({ 
            group_link: groupLink,
            description: description,
            updated_at: new Date().toISOString()
          })
          .eq('id', settingsId);
      } else {
        // Otherwise, insert a new record
        console.log('Creating new Viber settings record');
        result = await supabase
          .from('viber_settings')
          .insert({ 
            group_link: groupLink,
            description: description,
            button_text: 'Присъедини се',
            enabled: true
          })
          .select();
      }

      if (result.error) {
        console.error('Error saving settings:', result.error);
        throw result.error;
      }
      
      // If this was an insert operation and we got data back, store the ID
      if (!settingsId && result.data && result.data.length > 0) {
        setSettingsId(result.data[0].id);
      }

      console.log('Settings saved successfully');
      toast({
        title: "Успех",
        description: "Настройките за Viber са обновени успешно.",
      });
      
      // Reload the settings to ensure everything is in sync
      fetchViberSettings();
    } catch (error: any) {
      console.error('Error updating Viber settings:', error);
      toast({
        variant: "destructive",
        title: "Грешка",
        description: `Неуспешно обновяване на настройките за Viber: ${error.message || error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <ViberIcon className="h-8 w-8 text-[#7360f2]" />
        <h2 className="text-2xl font-bold">Viber Настройки</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Настройки на Viber банера</CardTitle>
            <CardDescription>
              Управлявайте текста и линка към Вашата Viber група
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="viber-settings-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="groupLink" className="text-sm font-medium">
                  Линк към Viber група
                </label>
                <Input
                  id="groupLink"
                  placeholder="https://invite.viber.com/?g=..."
                  value={groupLink}
                  onChange={(e) => setGroupLink(e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">
                  Всеки, който кликне върху банера, ще бъде пренасочен към този линк.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Текст на банера
                </label>
                <Textarea
                  id="description"
                  placeholder="Стани част от нашата Viber общност..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-none"
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  Този текст ще се показва в банера на сайта.
                </p>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              form="viber-settings-form" 
              disabled={isLoading}
              className="bg-gray-600 hover:bg-gray-700"
            >
              {isLoading ? "Запазване..." : "Запази промените"}
            </Button>
          </CardFooter>
        </Card>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Визуализация на банера</CardTitle>
            <CardDescription>
              Така ще изглежда вашият Viber банер
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-500 text-white p-4 rounded-md shadow-md" style={{ background: "linear-gradient(135deg, #6B7280, #9CA3AF)" }}>
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-4">
                  <ViberIcon className="h-8 w-8 text-[#7360f2]" />
                </div>
                <p className="text-sm">
                  {description || "Стани част от нашата Viber общност и получи достъп до най-новите предложения."}
                </p>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="bg-white text-gray-700 px-3 py-1 rounded text-sm font-medium">
                  Присъедини се
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Информация:</h4>
              <ul className="text-sm text-gray-500 space-y-1 list-disc pl-5">
                <li>Банерът се показва в горната част на страницата</li>
                <li>Банерът винаги е видим (без опция за затваряне)</li>
                <li>Стилът на банера не може да бъде променен</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 