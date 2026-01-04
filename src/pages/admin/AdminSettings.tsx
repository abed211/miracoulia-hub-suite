import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Loader2, Upload, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
}

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  image_url: string | null;
  rating: number;
  is_active: boolean;
  order_index: number;
}

interface Feature {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  order_index: number;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [settingsRes, testimonialsRes, featuresRes] = await Promise.all([
      supabase.from("site_settings").select("*"),
      supabase.from("testimonials").select("*").order("order_index"),
      supabase.from("features").select("*").order("order_index"),
    ]);

    if (settingsRes.data) {
      const settingsMap: Record<string, string> = {};
      settingsRes.data.forEach((s) => {
        settingsMap[s.key] = s.value || "";
      });
      setSettings(settingsMap);
    }

    setTestimonials(testimonialsRes.data || []);
    setFeatures(featuresRes.data || []);
    setIsLoading(false);
  };

  const saveSetting = async (key: string, value: string) => {
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", key)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("site_settings")
        .update({ value })
        .eq("id", existing.id);
    } else {
      await supabase.from("site_settings").insert({ key, value });
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await Promise.all(
        Object.entries(settings).map(([key, value]) => saveSetting(key, value))
      );
      toast.success("تم حفظ الإعدادات");
    } catch {
      toast.error("حدث خطأ في الحفظ");
    }
    setIsSaving(false);
  };

  // Testimonials handlers
  const addTestimonial = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        name: "اسم العميل",
        content: "رأي العميل",
        role: "المنصب",
        company: "الشركة",
        rating: 5,
        is_active: false,
        order_index: testimonials.length,
      })
      .select()
      .single();

    if (!error && data) {
      setTestimonials([...testimonials, data]);
      toast.success("تم إضافة شهادة جديدة");
    }
  };

  const updateTestimonial = (id: string, field: keyof Testimonial, value: any) => {
    setTestimonials(
      testimonials.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const saveTestimonial = async (testimonial: Testimonial) => {
    const { error } = await supabase
      .from("testimonials")
      .update({
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        content: testimonial.content,
        image_url: testimonial.image_url,
        rating: testimonial.rating,
        is_active: testimonial.is_active,
        order_index: testimonial.order_index,
      })
      .eq("id", testimonial.id);

    if (error) {
      toast.error("حدث خطأ في الحفظ");
    } else {
      toast.success("تم الحفظ");
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("حذف هذه الشهادة؟")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    setTestimonials(testimonials.filter((t) => t.id !== id));
    toast.success("تم الحذف");
  };

  // Features handlers
  const addFeature = async () => {
    const { data, error } = await supabase
      .from("features")
      .insert({
        title: "ميزة جديدة",
        description: "وصف الميزة",
        icon: "Star",
        is_active: false,
        order_index: features.length,
      })
      .select()
      .single();

    if (!error && data) {
      setFeatures([...features, data]);
      toast.success("تم إضافة ميزة جديدة");
    }
  };

  const updateFeature = (id: string, field: keyof Feature, value: any) => {
    setFeatures(
      features.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const saveFeature = async (feature: Feature) => {
    const { error } = await supabase
      .from("features")
      .update({
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        is_active: feature.is_active,
        order_index: feature.order_index,
      })
      .eq("id", feature.id);

    if (error) {
      toast.error("حدث خطأ في الحفظ");
    } else {
      toast.success("تم الحفظ");
    }
  };

  const deleteFeature = async (id: string) => {
    if (!confirm("حذف هذه الميزة؟")) return;
    await supabase.from("features").delete().eq("id", id);
    setFeatures(features.filter((f) => f.id !== id));
    toast.success("تم الحذف");
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
      <h1 className="text-2xl font-bold text-foreground font-tajawal mb-6">الإعدادات</h1>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">الإعدادات العامة</TabsTrigger>
          <TabsTrigger value="testimonials">آراء العملاء</TabsTrigger>
          <TabsTrigger value="features">المميزات</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم الموقع</Label>
                  <Input
                    value={settings.site_name || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, site_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    value={settings.contact_email || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, contact_email: e.target.value })
                    }
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <Input
                    value={settings.phone || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>رقم الواتساب</Label>
                  <Input
                    value={settings.whatsapp || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsapp: e.target.value })
                    }
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>العنوان</Label>
                <Input
                  value={settings.address || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>وصف الموقع (SEO)</Label>
                <Textarea
                  value={settings.site_description || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, site_description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>رابط تحميل البرنامج الرئيسي</Label>
                <Input
                  value={settings.main_download_link || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, main_download_link: e.target.value })
                  }
                  dir="ltr"
                  placeholder="https://..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>رابط فيسبوك</Label>
                  <Input
                    value={settings.facebook || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, facebook: e.target.value })
                    }
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>رابط انستغرام</Label>
                  <Input
                    value={settings.instagram || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, instagram: e.target.value })
                    }
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>رابط تويتر</Label>
                  <Input
                    value={settings.twitter || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, twitter: e.target.value })
                    }
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                  <Save className="h-4 w-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">آراء العملاء</h2>
            <Button onClick={addTestimonial}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة شهادة
            </Button>
          </div>

          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>الاسم</Label>
                      <Input
                        value={testimonial.name}
                        onChange={(e) =>
                          updateTestimonial(testimonial.id, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>المنصب</Label>
                      <Input
                        value={testimonial.role || ""}
                        onChange={(e) =>
                          updateTestimonial(testimonial.id, "role", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الشركة</Label>
                      <Input
                        value={testimonial.company || ""}
                        onChange={(e) =>
                          updateTestimonial(testimonial.id, "company", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>المحتوى</Label>
                    <Textarea
                      value={testimonial.content}
                      onChange={(e) =>
                        updateTestimonial(testimonial.id, "content", e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={testimonial.is_active}
                          onChange={(e) =>
                            updateTestimonial(testimonial.id, "is_active", e.target.checked)
                          }
                        />
                        <span className="text-sm">نشط</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <Label>التقييم:</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={testimonial.rating}
                          onChange={(e) =>
                            updateTestimonial(testimonial.id, "rating", parseInt(e.target.value))
                          }
                          className="w-16"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => saveTestimonial(testimonial)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTestimonial(testimonial.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">مميزات الموقع</h2>
            <Button onClick={addFeature}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة ميزة
            </Button>
          </div>

          <div className="space-y-4">
            {features.map((feature) => (
              <Card key={feature.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>العنوان</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) =>
                          updateFeature(feature.id, "title", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الأيقونة (اسم Lucide icon)</Label>
                      <Input
                        value={feature.icon || ""}
                        onChange={(e) =>
                          updateFeature(feature.id, "icon", e.target.value)
                        }
                        dir="ltr"
                        placeholder="Star, Check, Zap..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>الوصف</Label>
                    <Textarea
                      value={feature.description || ""}
                      onChange={(e) =>
                        updateFeature(feature.id, "description", e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={feature.is_active}
                        onChange={(e) =>
                          updateFeature(feature.id, "is_active", e.target.checked)
                        }
                      />
                      <span className="text-sm">نشط</span>
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => saveFeature(feature)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteFeature(feature.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
