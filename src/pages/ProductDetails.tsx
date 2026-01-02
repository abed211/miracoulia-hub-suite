import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Download, ArrowLeft, Play, Monitor, Smartphone, Printer, BarChart3, Package, CreditCard, Users, Shield, Clock } from "lucide-react";
import posMockup from "@/assets/pos-mockup.png";

const allFeatures = [
  { icon: Monitor, title: "نظام نقاط بيع سريع", description: "واجهة سهلة الاستخدام مع سرعة فائقة في المعاملات" },
  { icon: Package, title: "دعم الجملة والتجزئة", description: "نظام واحد يدعم جميع أنواع المبيعات" },
  { icon: BarChart3, title: "إدارة المخزون", description: "تتبع دقيق للمخزون مع تنبيهات النقص التلقائية" },
  { icon: CreditCard, title: "إدارة المديونيات", description: "تسجيل الدفعات الجزئية والكاملة بسهولة" },
  { icon: Printer, title: "طباعة الفواتير", description: "فواتير احترافية مع دعم الطابعات الحرارية" },
  { icon: Users, title: "إدارة العملاء", description: "قاعدة بيانات شاملة للعملاء والموردين" },
  { icon: Shield, title: "صلاحيات المستخدمين", description: "نظام صلاحيات متقدم لحماية البيانات" },
  { icon: Clock, title: "تقارير شاملة", description: "تقارير مفصلة للمبيعات والأرباح والمخزون" },
  { icon: Smartphone, title: "منتجات متعددة السمات", description: "دعم المقاسات والألوان والخصائص المختلفة" },
];

const targetAudience = [
  "السوبرماركت والبقالات",
  "محلات الملابس والأحذية",
  "المطاعم والكافيهات",
  "الصيدليات",
  "تجار الجملة",
  "محلات مواد البناء",
  "محلات الإلكترونيات",
  "أي نشاط تجاري آخر",
];

export default function ProductDetails() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-right text-primary-foreground">
              <span className="inline-block bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                منتجنا الرئيسي
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-tajawal">
                برنامج ميراكوليا
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan to-primary-foreground">
                  للمحاسبة ونقاط البيع
                </span>
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
                نظام كاشير ونقاط بيع متكامل لإدارة المحلات التجارية، يجمع بين المبيعات والمخزون والمحاسبة في واجهة سهلة الاستخدام، ويدعم تجارة الجملة والتجزئة مع تجربة عملية وسلسة تناسب مختلف أنواع الأنشطة التجارية.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg">
                  <Download className="h-5 w-5" />
                  تحميل البرنامج
                </Button>
                <Button variant="hero-outline" size="lg">
                  <Play className="h-5 w-5" />
                  شاهد العرض التوضيحي
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <img
                src={posMockup}
                alt="برنامج ميراكوليا"
                className="w-full drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-tajawal">
              مميزات البرنامج
            </h2>
            <p className="text-lg text-muted-foreground">
              كل ما تحتاجه لإدارة محلك التجاري في برنامج واحد متكامل
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-card rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/20"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-24 bg-accent/50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-tajawal">
                مناسب لجميع الأنشطة التجارية
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                تم تصميم برنامج ميراكوليا ليناسب مختلف أنواع المحلات التجارية والأنشطة الاقتصادية
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {targetAudience.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6">احصل على البرنامج الآن</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-primary" />
                  تجربة مجانية كاملة
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-primary" />
                  دعم فني مجاني
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-primary" />
                  تحديثات مستمرة
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-primary" />
                  تدريب مجاني على البرنامج
                </li>
              </ul>
              <Button variant="gradient" size="lg" className="w-full">
                <Download className="h-5 w-5" />
                تحميل البرنامج مجاناً
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-primary-foreground text-center md:text-right">
              <h3 className="text-2xl font-bold mb-2">هل لديك استفسار؟</h3>
              <p className="text-primary-foreground/80">تواصل معنا الآن وسنساعدك في كل ما تحتاجه</p>
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
