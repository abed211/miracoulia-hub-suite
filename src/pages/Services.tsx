import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, TrendingUp, Code, Headphones, Palette, Globe } from "lucide-react";

const services = [
  {
    icon: ShoppingCart,
    title: "أنظمة نقاط البيع",
    description: "نظام كاشير متكامل لإدارة المحلات التجارية بكفاءة عالية مع دعم تجارة الجملة والتجزئة وإدارة المخزون والفواتير.",
    features: ["نظام مبيعات متقدم", "إدارة المخزون", "تقارير شاملة", "دعم الباركود"],
  },
  {
    icon: TrendingUp,
    title: "التسويق الرقمي",
    description: "استراتيجيات تسويقية متقدمة لزيادة مبيعاتك وانتشارك على منصات التواصل الاجتماعي مع حملات إعلانية فعالة.",
    features: ["إدارة حسابات التواصل", "حملات إعلانية", "تحسين محركات البحث", "تحليل البيانات"],
  },
  {
    icon: Code,
    title: "تطوير البرمجيات",
    description: "برامج مخصصة حسب احتياجات عملك بأحدث التقنيات وأفضل الممارسات العالمية مع ضمان الجودة والأمان.",
    features: ["تطبيقات ويب", "تطبيقات موبايل", "أنظمة إدارة", "حلول مخصصة"],
  },
  {
    icon: Palette,
    title: "تصميم الهوية البصرية",
    description: "تصميم هوية بصرية متكاملة لعلامتك التجارية تعكس قيمك وتميزك عن المنافسين.",
    features: ["تصميم الشعارات", "الهوية البصرية", "المطبوعات", "الموشن جرافيك"],
  },
  {
    icon: Globe,
    title: "تصميم المواقع",
    description: "تصميم وتطوير مواقع إلكترونية احترافية متجاوبة مع جميع الأجهزة مع تحسين تجربة المستخدم.",
    features: ["مواقع تعريفية", "متاجر إلكترونية", "بوابات إخبارية", "منصات تعليمية"],
  },
  {
    icon: Headphones,
    title: "الدعم الفني",
    description: "دعم فني متواصل على مدار الساعة لضمان استمرارية عملك بدون انقطاع مع فريق متخصص.",
    features: ["دعم 24/7", "صيانة دورية", "تحديثات مستمرة", "تدريب الموظفين"],
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 font-tajawal">
            خدماتنا
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            نقدم مجموعة شاملة من الخدمات التقنية والتسويقية لمساعدتك على تحقيق أهدافك
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/20"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <service.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    اطلب الخدمة
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-primary-foreground text-center md:text-right">
              <h3 className="text-2xl font-bold mb-2">هل تحتاج خدمة مخصصة؟</h3>
              <p className="text-primary-foreground/80">تواصل معنا وسنصمم لك الحل المثالي لاحتياجاتك</p>
            </div>
            <Link to="/contact">
              <Button variant="hero-outline" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                تواصل معنا
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
