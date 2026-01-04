import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Upload, Plus, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeroContent {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  image_url: string | null;
  is_active: boolean;
}

export default function AdminHero() {
  const [heroItems, setHeroItems] = useState<HeroContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    const { data, error } = await supabase
      .from("hero_content")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("حدث خطأ في جلب البيانات");
      return;
    }

    setHeroItems(data || []);
    setIsLoading(false);
  };

  const handleSave = async (item: HeroContent) => {
    setIsSaving(true);
    const { error } = await supabase
      .from("hero_content")
      .update({
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        button_text: item.button_text,
        button_link: item.button_link,
        image_url: item.image_url,
        is_active: item.is_active,
      })
      .eq("id", item.id);

    if (error) {
      toast.error("حدث خطأ في الحفظ");
    } else {
      toast.success("تم الحفظ بنجاح");
    }
    setIsSaving(false);
  };

  const handleAddNew = async () => {
    const { data, error } = await supabase
      .from("hero_content")
      .insert({
        title: "عنوان جديد",
        subtitle: "عنوان فرعي",
        description: "وصف القسم الرئيسي",
        button_text: "اكتشف المزيد",
        button_link: "/products",
        is_active: false,
      })
      .select()
      .single();

    if (error) {
      toast.error("حدث خطأ في الإضافة");
      return;
    }

    setHeroItems([data, ...heroItems]);
    toast.success("تم إضافة عنصر جديد");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const { error } = await supabase.from("hero_content").delete().eq("id", id);

    if (error) {
      toast.error("حدث خطأ في الحذف");
      return;
    }

    setHeroItems(heroItems.filter((item) => item.id !== id));
    toast.success("تم الحذف بنجاح");
  };

  const handleImageUpload = async (id: string, file: File) => {
    setUploadingId(id);
    const fileExt = file.name.split(".").pop();
    const fileName = `hero-${id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);

    if (uploadError) {
      toast.error("حدث خطأ في رفع الصورة");
      setUploadingId(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("uploads")
      .getPublicUrl(fileName);

    setHeroItems(
      heroItems.map((item) =>
        item.id === id ? { ...item, image_url: publicUrl } : item
      )
    );
    setUploadingId(null);
    toast.success("تم رفع الصورة");
  };

  const updateItem = (id: string, field: keyof HeroContent, value: any) => {
    setHeroItems(
      heroItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground font-tajawal">إدارة القسم الرئيسي</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة جديد
        </Button>
      </div>

      <div className="space-y-6">
        {heroItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${item.id}`}>نشط</Label>
                    <Switch
                      id={`active-${item.id}`}
                      checked={item.is_active || false}
                      onCheckedChange={(checked) => updateItem(item.id, "is_active", checked)}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>العنوان الرئيسي</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem(item.id, "title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>العنوان الفرعي</Label>
                  <Input
                    value={item.subtitle || ""}
                    onChange={(e) => updateItem(item.id, "subtitle", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={item.description || ""}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نص الزر</Label>
                  <Input
                    value={item.button_text || ""}
                    onChange={(e) => updateItem(item.id, "button_text", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>رابط الزر</Label>
                  <Input
                    value={item.button_link || ""}
                    onChange={(e) => updateItem(item.id, "button_link", e.target.value)}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>الصورة</Label>
                <div className="flex items-center gap-4">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt="Hero"
                      className="h-20 w-32 object-cover rounded-lg"
                    />
                  )}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(item.id, file);
                      }}
                    />
                    <Button variant="outline" asChild disabled={uploadingId === item.id}>
                      <span>
                        {uploadingId === item.id ? (
                          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 ml-2" />
                        )}
                        {uploadingId === item.id ? "جاري الرفع..." : "رفع صورة"}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave(item)} disabled={isSaving}>
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التغييرات
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {heroItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            لا يوجد محتوى. اضغط على "إضافة جديد" لإضافة محتوى.
          </div>
        )}
      </div>
    </div>
  );
}
