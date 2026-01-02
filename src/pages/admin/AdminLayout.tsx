import { useState, useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Settings, 
  Users, 
  MessageSquare, 
  Image, 
  Upload,
  LogOut,
  Menu,
  X,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/hero", label: "القسم الرئيسي", icon: Home },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/articles", label: "المقالات", icon: FileText },
  { href: "/admin/messages", label: "الرسائل", icon: MessageSquare },
  { href: "/admin/files", label: "الملفات", icon: Upload },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export default function AdminLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin");
        return;
      }

      // Check if user has admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        await supabase.auth.signOut();
        navigate("/admin");
        toast.error("ليس لديك صلاحية الوصول");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    navigate("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } lg:relative`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="ميراكوليا" className="h-10 w-auto brightness-0 invert" />
              <span className="font-bold text-xl text-sidebar-foreground font-tajawal">ميراكوليا</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === link.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between lg:justify-end">
          <button
            className="lg:hidden p-2"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
          <div className="flex items-center gap-4">
            <Link to="/" target="_blank">
              <Button variant="outline" size="sm">
                عرض الموقع
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
