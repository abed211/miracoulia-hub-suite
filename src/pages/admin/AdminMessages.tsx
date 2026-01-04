import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Trash2, Mail, MailOpen, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string | null;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("حدث خطأ في جلب الرسائل");
      return;
    }

    setMessages(data || []);
    setIsLoading(false);
  };

  const handleView = async (message: Message) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);

    if (!message.is_read) {
      await supabase
        .from("contact_submissions")
        .update({ is_read: true })
        .eq("id", message.id);

      setMessages(
        messages.map((m) =>
          m.id === message.id ? { ...m, is_read: true } : m
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;

    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("حدث خطأ في الحذف");
      return;
    }

    setMessages(messages.filter((m) => m.id !== id));
    toast.success("تم الحذف بنجاح");
  };

  const handleMarkAllRead = async () => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) {
      toast.error("حدث خطأ");
      return;
    }

    setMessages(messages.map((m) => ({ ...m, is_read: true })));
    toast.success("تم تحديد جميع الرسائل كمقروءة");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

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
        <div>
          <h1 className="text-2xl font-bold text-foreground font-tajawal">الرسائل</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} رسالة غير مقروءة
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            <MailOpen className="h-4 w-4 ml-2" />
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`transition-colors ${
              !message.is_read ? "border-primary/50 bg-primary/5" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.is_read ? "bg-muted" : "bg-primary"
                  }`}
                >
                  {message.is_read ? (
                    <MailOpen className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Mail className="h-5 w-5 text-primary-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground">{message.name}</h3>
                    {!message.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  {message.subject && (
                    <p className="text-sm font-medium text-foreground/80">
                      {message.subject}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {message.message}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {message.email && <span>{message.email}</span>}
                    {message.phone && <span dir="ltr">{message.phone}</span>}
                    <span>{formatDate(message.created_at)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleView(message)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(message.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد رسائل.
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>تفاصيل الرسالة</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">الاسم</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">التاريخ</p>
                  <p className="font-medium">{formatDate(selectedMessage.created_at)}</p>
                </div>
                {selectedMessage.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <p className="font-medium">{selectedMessage.email}</p>
                  </div>
                )}
                {selectedMessage.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                    <p className="font-medium" dir="ltr">{selectedMessage.phone}</p>
                  </div>
                )}
              </div>

              {selectedMessage.subject && (
                <div>
                  <p className="text-sm text-muted-foreground">الموضوع</p>
                  <p className="font-medium">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">الرسالة</p>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {selectedMessage.email && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(`mailto:${selectedMessage.email}`, "_blank")
                    }
                  >
                    <Mail className="h-4 w-4 ml-2" />
                    رد بالبريد
                  </Button>
                )}
                {selectedMessage.phone && (
                  <Button
                    onClick={() =>
                      window.open(
                        `https://wa.me/${selectedMessage.phone?.replace(/[^0-9]/g, "")}`,
                        "_blank"
                      )
                    }
                  >
                    رد بالواتساب
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
