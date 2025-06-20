import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from '@supabase/supabase-js';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ArrowUpDown,
  Trash2,
  Pencil,
  Plus,
  Loader2
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Custom TikTok icon since it's not available in lucide-react
const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
    <path d="M16 8v8"/>
    <path d="M12 16v-8"/>
    <path d="M18 8a4 4 0 0 0-4-4"/>
    <path d="M16 4h-4"/>
    <path d="M16 8a4 4 0 0 1 4 4v1"/>
  </svg>
);

// Interface for social media links
interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

// Icons mapping
const iconComponents: Record<string, React.ReactNode> = {
  Facebook: <Facebook />,
  Instagram: <Instagram />,
  Twitter: <Twitter />,
  Linkedin: <Linkedin />,
  TikTok: <TikTokIcon />,
};

// Initialize Supabase client
const supabaseUrl = 'https://zanfdpuiblradrbtfzhl.supabase.co';
// IMPORTANT: This is an ANON KEY. RLS policies MUST be in place for security.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbmZkcHVpYmxyYWRyYnRmemhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NDMwMTksImV4cCI6MjA2MjIxOTAxOX0.vOGXgtT7M4Vlrwt5vXIXW69VARao80gZCSfl2kgliZ0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SocialMediaLinksManagement = () => {
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<SocialMediaLink | null>(null);
  const { session } = useAuth();
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon: '',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('social_media_links')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setSocialLinks(data);
        }
      } catch (error: any) {
        console.error('Error fetching social links:', error.message);
        toast.error(`Грешка при зареждане на социални връзки: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEditClick = (link: SocialMediaLink) => {
    setCurrentLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
      is_active: link.is_active,
      display_order: link.display_order,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (link: SocialMediaLink) => {
    setCurrentLink(link);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateClick = () => {
    setFormData({
      platform: '',
      url: '',
      icon: '',
      is_active: true,
      display_order: socialLinks.length > 0 ? Math.max(...socialLinks.map(l => l.display_order)) + 1 : 1,
    });
    setIsCreateDialogOpen(true);
  };

  const moveLink = async (id: string, direction: 'up' | 'down') => {
    try {
      const linksCopy = [...socialLinks];
      const currentIndex = linksCopy.findIndex(link => link.id === id);

      if (currentIndex === -1) return;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= linksCopy.length) return;

      // Swap display_order values
      const tempOrder = linksCopy[currentIndex].display_order;
      linksCopy[currentIndex].display_order = linksCopy[targetIndex].display_order;
      linksCopy[targetIndex].display_order = tempOrder;
      
      // Update local state for immediate feedback, then sort by new display_order
      const updatedStateLinks = linksCopy.map(link => ({...link})); // Create new array of new objects
      updatedStateLinks.sort((a, b) => a.display_order - b.display_order);
      setSocialLinks(updatedStateLinks);

      // Update both affected links in Supabase
      const { error: error1 } = await supabase
        .from('social_media_links')
        .update({ display_order: linksCopy[currentIndex].display_order, updated_at: new Date().toISOString() })
        .eq('id', linksCopy[currentIndex].id);

      const { error: error2 } = await supabase
        .from('social_media_links')
        .update({ display_order: linksCopy[targetIndex].display_order, updated_at: new Date().toISOString() })
        .eq('id', linksCopy[targetIndex].id);

      if (error1) throw error1;
      if (error2) throw error2;
      
      toast.success("Редът е променен успешно");
    } catch (error: any) {
      toast.error(`Грешка при промяна на реда: ${error.message}`);
      // Re-fetch to ensure consistency if error occurs
      const { data, error: fetchError } = await supabase.from('social_media_links').select('*').order('display_order', { ascending: true });
      if (data) setSocialLinks(data.sort((a,b) => a.display_order - b.display_order)); // Ensure sorted after re-fetch
      else if(fetchError) console.error('Error re-fetching links:', fetchError.message);
    }
  };

  const createSocialLink = async () => {
    try {
      if (!formData.platform || !formData.url || !formData.icon) {
        toast.error("Моля, попълнете всички полета");
        return;
      }

      const newLinkData = {
        platform: formData.platform,
        url: formData.url,
        icon: formData.icon,
        is_active: formData.is_active,
        display_order: formData.display_order || (socialLinks.length > 0 ? Math.max(...socialLinks.map(l => l.display_order)) + 1 : 1),
      };

      const { data, error } = await supabase
        .from('social_media_links')
        .insert(newLinkData)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setSocialLinks([...socialLinks, data[0]].sort((a,b) => a.display_order - b.display_order));
        toast.success("Социалната връзка е създадена успешно");
        setIsCreateDialogOpen(false);
      } else {
        throw new Error("Неуспешно създаване на връзка - няма върнати данни.");
      }
    } catch (error: any) {
      toast.error(`Грешка при създаване: ${error.message}`);
    }
  };

  const updateSocialLink = async () => {
    try {
      if (!currentLink) return;
      if (!formData.platform || !formData.url || !formData.icon) {
        toast.error("Моля, попълнете всички полета");
        return;
      }

      const updatedLinkData = {
        platform: formData.platform,
        url: formData.url,
        icon: formData.icon,
        is_active: formData.is_active,
        display_order: Number(formData.display_order), // Ensure display_order is a number
        updated_at: new Date().toISOString(),
      };
      
      console.log('Updating link with data:', updatedLinkData); // Keep for debugging

      const { data, error } = await supabase
        .from('social_media_links')
        .update(updatedLinkData)
        .eq('id', currentLink.id)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setSocialLinks(
          socialLinks.map(link => (link.id === currentLink.id ? data[0] : link))
          .sort((a,b) => a.display_order - b.display_order)
        );
        toast.success("Социалната връзка е обновена успешно");
        setIsEditDialogOpen(false);
      } else {
         throw new Error("Неуспешно обновяване на връзка - няма върнати данни.");
      }
    } catch (error: any) {
      toast.error(`Грешка при обновяване: ${error.message}`);
    }
  };

  const deleteSocialLink = async () => {
    try {
      if (!currentLink) return;

      const { error } = await supabase
        .from('social_media_links')
        .delete()
        .eq('id', currentLink.id);

      if (error) throw error;

      const filteredLinks = socialLinks.filter(link => link.id !== currentLink.id);
      // No need to update display_order of other links here unless specified as a requirement.
      // If re-ordering is needed, it should be a separate batch update or a backend trigger.
      setSocialLinks(filteredLinks);
      toast.success("Социалната връзка е изтрита успешно");
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(`Грешка при изтриване: ${error.message}`);
    }
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      const linkToUpdate = socialLinks.find(link => link.id === id);
      if (!linkToUpdate) return;

      const newStatus = !currentStatus;
      const { data, error } = await supabase
        .from('social_media_links')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
         setSocialLinks(
          socialLinks.map(link => (link.id === id ? data[0] : link))
          .sort((a,b) => a.display_order - b.display_order)
        );
        toast.success("Статусът е променен успешно");
      } else {
        throw new Error("Неуспешна промяна на статус - няма върнати данни.");
      }
    } catch (error: any) {
      toast.error(`Грешка при промяна на статуса: ${error.message}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Управление на социални мрежи</CardTitle>
        <CardDescription>
          Управлявайте връзките към социалните мрежи, които се показват във футъра на сайта
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <Button onClick={handleCreateClick} className="gap-2">
                <Plus className="h-4 w-4" /> Добави връзка
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Икона</TableHead>
                  <TableHead>Платформа</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[160px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socialLinks
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">
                      {link.display_order}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                        {iconComponents[link.icon] || link.icon}
                      </div>
                    </TableCell>
                    <TableCell>{link.platform}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {link.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={link.is_active}
                          onCheckedChange={() =>
                            toggleActiveStatus(link.id, link.is_active)
                          }
                          id={`active-${link.id}`}
                        />
                        <Badge variant={link.is_active ? "default" : "secondary"} className={link.is_active ? "bg-green-500 hover:bg-green-600" : ""}>
                          {link.is_active ? "Активна" : "Неактивна"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => moveLink(link.id, 'up')}
                          disabled={link.display_order <= 1}
                        >
                          <ArrowUpDown className="h-4 w-4 rotate-90" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => moveLink(link.id, 'down')}
                          disabled={link.display_order >= socialLinks.length}
                        >
                          <ArrowUpDown className="h-4 w-4 -rotate-90" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditClick(link)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDeleteClick(link)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {socialLinks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Няма социални връзки. Натиснете "Добави връзка" за да създадете нова.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500">
          Показват се само активните връзки във футъра на сайта
        </p>
        <p className="text-sm text-gray-500 italic">
          Бележка: В момента това е само прототип. Скоро ще бъде свързан с базата данни.
        </p>
      </CardFooter>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактиране на социална връзка</DialogTitle>
            <DialogDescription>
              Променете данните за избраната социална мрежа
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="platform">Платформа</Label>
              <Input
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                placeholder="Напр. Facebook"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL адрес</Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://facebook.com/example"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Икона</Label>
              <Input
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                placeholder="Facebook, Instagram, Twitter, Linkedin, TikTok"
              />
              <p className="text-xs text-gray-500">
                Поддържани икони: Facebook, Instagram, Twitter, Linkedin, TikTok
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="display_order">Ред на показване</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                value={formData.display_order}
                onChange={handleInputChange}
                min={1}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">Активна</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отказ
            </Button>
            <Button onClick={updateSocialLink}>Запази</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавяне на социална връзка</DialogTitle>
            <DialogDescription>
              Създайте нова социална връзка
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="platform">Платформа</Label>
              <Input
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                placeholder="Напр. Facebook"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL адрес</Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://facebook.com/example"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Икона</Label>
              <Input
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                placeholder="Facebook, Instagram, Twitter, Linkedin, TikTok"
              />
              <p className="text-xs text-gray-500">
                Поддържани икони: Facebook, Instagram, Twitter, Linkedin, TikTok
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="display_order">Ред на показване</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                value={formData.display_order}
                onChange={handleInputChange}
                min={1}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">Активна</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Отказ
            </Button>
            <Button onClick={createSocialLink}>Създай</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изтриване на социална връзка</DialogTitle>
            <DialogDescription>
              Сигурни ли сте, че искате да изтриете тази социална връзка? Това действие не може да бъде отменено.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentLink && (
              <div className="flex items-center space-x-3 p-4 rounded-md bg-gray-50">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                  {iconComponents[currentLink.icon] || currentLink.icon}
                </div>
                <div>
                  <p className="font-medium">{currentLink.platform}</p>
                  <p className="text-sm text-gray-500 truncate">{currentLink.url}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отказ
            </Button>
            <Button variant="destructive" onClick={deleteSocialLink}>
              Изтрий
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SocialMediaLinksManagement; 