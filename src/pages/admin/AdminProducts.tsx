import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Upload, Plus, Trash2, Loader2, Edit, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  price: string | null;
  image_url: string | null;
  demo_link: string | null;
  download_link: string | null;
  is_active: boolean;
  is_featured: boolean;
  order_index: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast.error("حدث خطأ في جلب المنتجات");
      return;
    }

    setProducts(data || []);
    setIsLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-\u0621-\u064A]/g, "");
  };

  const handleAddNew = () => {
    setEditingProduct({
      id: "",
      name: "",
      slug: "",
      short_description: "",
      full_description: "",
      price: "",
      image_url: null,
      demo_link: "",
      download_link: "",
      is_active: true,
      is_featured: false,
      order_index: products.length,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    if (!editingProduct.name.trim()) {
      toast.error("يرجى إدخال اسم المنتج");
      return;
    }

    setIsSaving(true);
    const slug = editingProduct.slug || generateSlug(editingProduct.name);

    if (editingProduct.id) {
      const { error } = await supabase
        .from("products")
        .update({
          name: editingProduct.name,
          slug,
          short_description: editingProduct.short_description,
          full_description: editingProduct.full_description,
          price: editingProduct.price,
          image_url: editingProduct.image_url,
          demo_link: editingProduct.demo_link,
          download_link: editingProduct.download_link,
          is_active: editingProduct.is_active,
          is_featured: editingProduct.is_featured,
          order_index: editingProduct.order_index,
        })
        .eq("id", editingProduct.id);

      if (error) {
        toast.error("حدث خطأ في التحديث");
        setIsSaving(false);
        return;
      }

      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...editingProduct, slug } : p
        )
      );
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: editingProduct.name,
          slug,
          short_description: editingProduct.short_description,
          full_description: editingProduct.full_description,
          price: editingProduct.price,
          image_url: editingProduct.image_url,
          demo_link: editingProduct.demo_link,
          download_link: editingProduct.download_link,
          is_active: editingProduct.is_active,
          is_featured: editingProduct.is_featured,
          order_index: editingProduct.order_index,
        })
        .select()
        .single();

      if (error) {
        toast.error("حدث خطأ في الإضافة");
        setIsSaving(false);
        return;
      }

      setProducts([...products, data]);
    }

    toast.success("تم الحفظ بنجاح");
    setIsSaving(false);
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast.error("حدث خطأ في الحذف");
      return;
    }

    setProducts(products.filter((p) => p.id !== id));
    toast.success("تم الحذف بنجاح");
  };

  const handleImageUpload = async (file: File) => {
    if (!editingProduct) return;
    setUploadingImage(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `product-${Date.now()}.${fileExt}`;

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

    setEditingProduct({ ...editingProduct, image_url: publicUrl });
    setUploadingImage(false);
    toast.success("تم رفع الصورة");
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
        <h1 className="text-2xl font-bold text-foreground font-tajawal">إدارة المنتجات</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة منتج
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="font-bold text-foreground mb-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {product.short_description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      product.is_active ? "bg-green-500" : "bg-muted"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {product.is_active ? "نشط" : "غير نشط"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا يوجد منتجات. اضغط على "إضافة منتج" لإضافة منتج جديد.
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct?.id ? "تعديل المنتج" : "إضافة منتج جديد"}
            </DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم المنتج *</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>السعر</Label>
                  <Input
                    value={editingProduct.price || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: e.target.value })
                    }
                    placeholder="مثال: 299 ₪"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>وصف مختصر</Label>
                <Textarea
                  value={editingProduct.short_description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      short_description: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>الوصف الكامل</Label>
                <Textarea
                  value={editingProduct.full_description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      full_description: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رابط العرض التجريبي</Label>
                  <Input
                    value={editingProduct.demo_link || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, demo_link: e.target.value })
                    }
                    dir="ltr"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>رابط التحميل</Label>
                  <Input
                    value={editingProduct.download_link || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        download_link: e.target.value,
                      })
                    }
                    dir="ltr"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>صورة المنتج</Label>
                <div className="flex items-center gap-4">
                  {editingProduct.image_url && (
                    <img
                      src={editingProduct.image_url}
                      alt="Product"
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

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingProduct.is_active}
                    onCheckedChange={(checked) =>
                      setEditingProduct({ ...editingProduct, is_active: checked })
                    }
                  />
                  <Label>نشط</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingProduct.is_featured}
                    onCheckedChange={(checked) =>
                      setEditingProduct({ ...editingProduct, is_featured: checked })
                    }
                  />
                  <Label>مميز</Label>
                </div>
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
