import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Upload, Plus, Trash2, Loader2, Edit, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  author_name: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string | null;
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("حدث خطأ في جلب المقالات");
      return;
    }

    setArticles(data || []);
    setIsLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-\u0621-\u064A]/g, "")
      .substring(0, 50);
  };

  const handleAddNew = () => {
    setEditingArticle({
      id: "",
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image_url: null,
      author_name: "ميراكوليا",
      is_published: false,
      published_at: null,
      created_at: null,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingArticle) return;
    if (!editingArticle.title.trim()) {
      toast.error("يرجى إدخال عنوان المقال");
      return;
    }

    setIsSaving(true);
    const slug = editingArticle.slug || generateSlug(editingArticle.title);
    const published_at = editingArticle.is_published
      ? editingArticle.published_at || new Date().toISOString()
      : null;

    if (editingArticle.id) {
      const { error } = await supabase
        .from("articles")
        .update({
          title: editingArticle.title,
          slug,
          excerpt: editingArticle.excerpt,
          content: editingArticle.content,
          image_url: editingArticle.image_url,
          author_name: editingArticle.author_name,
          is_published: editingArticle.is_published,
          published_at,
        })
        .eq("id", editingArticle.id);

      if (error) {
        toast.error("حدث خطأ في التحديث");
        setIsSaving(false);
        return;
      }

      setArticles(
        articles.map((a) =>
          a.id === editingArticle.id ? { ...editingArticle, slug, published_at } : a
        )
      );
    } else {
      const { data, error } = await supabase
        .from("articles")
        .insert({
          title: editingArticle.title,
          slug,
          excerpt: editingArticle.excerpt,
          content: editingArticle.content,
          image_url: editingArticle.image_url,
          author_name: editingArticle.author_name,
          is_published: editingArticle.is_published,
          published_at,
        })
        .select()
        .single();

      if (error) {
        toast.error("حدث خطأ في الإضافة");
        setIsSaving(false);
        return;
      }

      setArticles([data, ...articles]);
    }

    toast.success("تم الحفظ بنجاح");
    setIsSaving(false);
    setIsDialogOpen(false);
    setEditingArticle(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      toast.error("حدث خطأ في الحذف");
      return;
    }

    setArticles(articles.filter((a) => a.id !== id));
    toast.success("تم الحذف بنجاح");
  };

  const handleImageUpload = async (file: File) => {
    if (!editingArticle) return;
    setUploadingImage(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `article-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);

    if (uploadError) {
      toast.error("حدث خطأ في رفع الصورة");
      setUploadingImage(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("uploads")
      .getPublicUrl(fileName);

    setEditingArticle({ ...editingArticle, image_url: publicUrl });
    setUploadingImage(false);
    toast.success("تم رفع الصورة");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <h1 className="text-2xl font-bold text-foreground font-tajawal">إدارة المقالات</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة مقال
        </Button>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{article.author_name}</span>
                    <span>{formatDate(article.created_at)}</span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        article.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {article.is_published ? "منشور" : "مسودة"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا يوجد مقالات. اضغط على "إضافة مقال" لكتابة مقال جديد.
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle?.id ? "تعديل المقال" : "إضافة مقال جديد"}
            </DialogTitle>
          </DialogHeader>

          {editingArticle && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>عنوان المقال *</Label>
                  <Input
                    value={editingArticle.title}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>اسم الكاتب</Label>
                  <Input
                    value={editingArticle.author_name || ""}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, author_name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>ملخص المقال</Label>
                <Textarea
                  value={editingArticle.excerpt || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, excerpt: e.target.value })
                  }
                  rows={2}
                  placeholder="ملخص قصير يظهر في قائمة المقالات"
                />
              </div>

              <div className="space-y-2">
                <Label>محتوى المقال</Label>
                <Textarea
                  value={editingArticle.content || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, content: e.target.value })
                  }
                  rows={12}
                  placeholder="اكتب محتوى المقال هنا..."
                />
              </div>

              <div className="space-y-2">
                <Label>صورة المقال</Label>
                <div className="flex items-center gap-4">
                  {editingArticle.image_url && (
                    <img
                      src={editingArticle.image_url}
                      alt="Article"
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
                        if (file) handleImageUpload(file);
                      }}
                    />
                    <Button variant="outline" asChild disabled={uploadingImage}>
                      <span>
                        {uploadingImage ? (
                          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 ml-2" />
                        )}
                        {uploadingImage ? "جاري الرفع..." : "رفع صورة"}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingArticle.is_published}
                  onCheckedChange={(checked) =>
                    setEditingArticle({ ...editingArticle, is_published: checked })
                  }
                />
                <Label>نشر المقال</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                  <Save className="h-4 w-4 ml-2" />
                  حفظ
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
