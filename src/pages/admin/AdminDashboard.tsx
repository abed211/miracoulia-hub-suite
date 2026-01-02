import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Package, MessageSquare, Users, Eye, Download } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    products: 0,
    messages: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [articlesRes, productsRes, messagesRes] = await Promise.all([
        supabase.from("articles").select("id", { count: "exact" }),
        supabase.from("products").select("id", { count: "exact" }),
        supabase.from("contact_submissions").select("id, is_read", { count: "exact" }),
      ]);

      const unreadMessages = messagesRes.data?.filter((m) => !m.is_read).length || 0;

      setStats({
        articles: articlesRes.count || 0,
        products: productsRes.count || 0,
        messages: messagesRes.count || 0,
        unreadMessages,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "المنتجات", value: stats.products, icon: Package, color: "bg-primary" },
    { label: "المقالات", value: stats.articles, icon: FileText, color: "bg-secondary" },
    { label: "الرسائل", value: stats.messages, icon: MessageSquare, color: "bg-teal" },
    { label: "رسائل غير مقروءة", value: stats.unreadMessages, icon: MessageSquare, color: "bg-gold" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8 font-tajawal">لوحة التحكم</h1>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold text-foreground">{stat.value}</span>
            </div>
            <p className="text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">إجراءات سريعة</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/articles"
            className="flex items-center gap-3 p-4 rounded-xl bg-accent hover:bg-accent/80 transition-colors"
          >
            <FileText className="h-5 w-5 text-accent-foreground" />
            <span className="text-accent-foreground font-medium">إضافة مقال جديد</span>
          </a>
          <a
            href="/admin/products"
            className="flex items-center gap-3 p-4 rounded-xl bg-accent hover:bg-accent/80 transition-colors"
          >
            <Package className="h-5 w-5 text-accent-foreground" />
            <span className="text-accent-foreground font-medium">إدارة المنتجات</span>
          </a>
          <a
            href="/admin/messages"
            className="flex items-center gap-3 p-4 rounded-xl bg-accent hover:bg-accent/80 transition-colors"
          >
            <MessageSquare className="h-5 w-5 text-accent-foreground" />
            <span className="text-accent-foreground font-medium">عرض الرسائل</span>
          </a>
          <a
            href="/admin/files"
            className="flex items-center gap-3 p-4 rounded-xl bg-accent hover:bg-accent/80 transition-colors"
          >
            <Download className="h-5 w-5 text-accent-foreground" />
            <span className="text-accent-foreground font-medium">رفع ملفات</span>
          </a>
        </div>
      </div>
    </div>
  );
}
