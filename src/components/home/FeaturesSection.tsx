import { ShoppingCart, TrendingUp, Code, Headphones, Zap, Shield, LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, LucideIcon> = {
  ShoppingCart,
  TrendingUp,
  Code,
  Headphones,
  Zap,
  Shield,
};

const defaultFeatures = [
  {
    icon: "ShoppingCart",
    title: "أنظمة نقاط البيع",
    description: "نظام كاشير متكامل لإدارة المحلات التجارية بكفاءة عالية مع دعم تجارة الجملة والتجزئة",
  },
  {
    icon: "TrendingUp",
    title: "التسويق الرقمي",
    description: "استراتيجيات تسويقية متقدمة لزيادة مبيعاتك وانتشارك على منصات التواصل الاجتماعي",
  },
  {
    icon: "Code",
    title: "تطوير البرمجيات",
    description: "برامج مخصصة حسب احتياجات عملك بأحدث التقنيات وأفضل الممارسات العالمية",
  },
  {
    icon: "Headphones",
    title: "الدعم الفني",
    description: "دعم فني متواصل على مدار الساعة لضمان استمرارية عملك بدون انقطاع",
  },
  {
    icon: "Zap",
    title: "سرعة التنفيذ",
    description: "نلتزم بالمواعيد ونقدم حلولاً سريعة وفعالة تناسب احتياجات السوق المتغيرة",
  },
  {
    icon: "Shield",
    title: "أمان البيانات",
    description: "نظام أمان متقدم لحماية بياناتك ومعلومات عملائك من أي اختراق أو تسريب",
  },
];

export function FeaturesSection() {
  const { data: features } = useQuery({
    queryKey: ['features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const displayFeatures = features && features.length > 0 ? features : defaultFeatures;

  return (
    <section className="py-24 bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            خدماتنا
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-tajawal">
            حلول متكاملة لنجاح أعمالك
          </h2>
          <p className="text-lg text-muted-foreground">
            نقدم مجموعة شاملة من الخدمات التقنية والتسويقية لمساعدتك على تحقيق أهدافك
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFeatures.map((feature, index) => {
            const IconComponent = iconMap[feature.icon || 'Zap'] || Zap;
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/20"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <IconComponent className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
