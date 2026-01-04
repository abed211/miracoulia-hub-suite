import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Upload, Trash2, Loader2, Download, Copy, FileIcon, Edit, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UploadedFile {
  id: string;
  name: string;
  description: string | null;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  is_public: boolean;
  download_count: number;
  created_at: string | null;
}

export default function AdminFiles() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingFile, setEditingFile] = useState<UploadedFile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from("uploaded_files")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("حدث خطأ في جلب الملفات");
      return;
    }

    setFiles(data || []);
    setIsLoading(false);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);

    if (uploadError) {
      toast.error("حدث خطأ في رفع الملف");
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("uploads")
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from("uploaded_files")
      .insert({
        name: file.name,
        file_path: publicUrl,
        file_type: file.type || fileExt,
        file_size: file.size,
        is_public: true,
      })
      .select()
      .single();

    if (error) {
      toast.error("حدث خطأ في حفظ بيانات الملف");
      setIsUploading(false);
      return;
    }

    setFiles([data, ...files]);
    setIsUploading(false);
    toast.success("تم رفع الملف بنجاح");
    event.target.value = "";
  };

  const handleEdit = (file: UploadedFile) => {
    setEditingFile(file);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingFile) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("uploaded_files")
      .update({
        name: editingFile.name,
        description: editingFile.description,
        is_public: editingFile.is_public,
      })
      .eq("id", editingFile.id);

    if (error) {
      toast.error("حدث خطأ في التحديث");
      setIsSaving(false);
      return;
    }

    setFiles(files.map((f) => (f.id === editingFile.id ? editingFile : f)));
    setIsSaving(false);
    setIsDialogOpen(false);
    toast.success("تم التحديث بنجاح");
  };

  const handleDelete = async (file: UploadedFile) => {
    if (!confirm("هل أنت متأكد من حذف هذا الملف؟")) return;

    // Extract file name from URL
    const fileName = file.file_path.split("/").pop();

    if (fileName) {
      await supabase.storage.from("uploads").remove([fileName]);
    }

    const { error } = await supabase
      .from("uploaded_files")
      .delete()
      .eq("id", file.id);

    if (error) {
      toast.error("حدث خطأ في الحذف");
      return;
    }

    setFiles(files.filter((f) => f.id !== file.id));
    toast.success("تم الحذف بنجاح");
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("تم نسخ الرابط");
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "غير معروف";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFileIcon = (type: string | null) => {
    if (!type) return FileIcon;
    if (type.includes("image")) return FileIcon;
    if (type.includes("pdf")) return FileIcon;
    return FileIcon;
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
        <h1 className="text-2xl font-bold text-foreground font-tajawal">إدارة الملفات</h1>
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <Button asChild disabled={isUploading}>
            <span>
              {isUploading ? (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 ml-2" />
              )}
              {isUploading ? "جاري الرفع..." : "رفع ملف"}
            </span>
          </Button>
        </label>
      </div>

      <div className="space-y-4">
        {files.map((file) => (
          <Card key={file.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <FileIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{file.name}</h3>
                  {file.description && (
                    <p className="text-sm text-muted-foreground">{file.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.file_size)}</span>
                    <span>{formatDate(file.created_at)}</span>
                    <span>{file.download_count || 0} تحميل</span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        file.is_public
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {file.is_public ? "عام" : "خاص"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyLink(file.file_path)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(file.file_path, "_blank")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(file)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(file)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد ملفات. اضغط على "رفع ملف" لرفع ملف جديد.
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل بيانات الملف</DialogTitle>
          </DialogHeader>

          {editingFile && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>اسم الملف</Label>
                <Input
                  value={editingFile.name}
                  onChange={(e) =>
                    setEditingFile({ ...editingFile, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={editingFile.description || ""}
                  onChange={(e) =>
                    setEditingFile({ ...editingFile, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>رابط التحميل</Label>
                <div className="flex gap-2">
                  <Input value={editingFile.file_path} readOnly dir="ltr" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyLink(editingFile.file_path)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingFile.is_public}
                  onCheckedChange={(checked) =>
                    setEditingFile({ ...editingFile, is_public: checked })
                  }
                />
                <Label>ملف عام</Label>
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
