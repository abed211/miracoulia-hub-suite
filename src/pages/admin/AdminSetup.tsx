import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { Shield, Check } from "lucide-react";

export default function AdminSetup() {
  const [email, setEmail] = useState("admin@miracolia.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("setup-admin", {
        body: { email, password },
      });

      if (error) throw error;
      
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setIsComplete(true);
      toast.success("تم إنشاء حساب الأدمن بنجاح!");
    } catch (error: any) {
      console.error("Setup error:", error);
      toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-8 shadow-lg w-full max-w-md text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4 font-tajawal">
            تم إنشاء حساب الأدمن بنجاح!
          </h1>
          <p className="text-muted-foreground mb-6">
            يمكنك الآن تسجيل الدخول باستخدام البريد: <strong>{email}</strong>
          </p>
          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            onClick={() => navigate("/admin")}
          >
            الذهاب لتسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-8 shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="ميراكوليا" className="h-16 w-auto mx-auto mb-4" />
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-tajawal">إعداد الأدمن</h1>
          </div>
          <p className="text-muted-foreground">إنشاء حساب المدير الأول للموقع</p>
        </div>

        <form onSubmit={handleSetup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              البريد الإلكتروني
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@miracolia.com"
              className="text-right"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              كلمة المرور
            </label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة مرور قوية"
              className="text-right"
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              تأكيد كلمة المرور
            </label>
            <Input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد إدخال كلمة المرور"
              className="text-right"
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "جاري الإنشاء..." : "إنشاء حساب الأدمن"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <a href="/admin" className="text-primary hover:underline">
            لديك حساب بالفعل؟ تسجيل الدخول
          </a>
        </p>
      </div>
    </div>
  );
}
