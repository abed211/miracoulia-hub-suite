import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowLeft, Download } from "lucide-react";
import posMockup from "@/assets/pos-mockup.png";

const productFeatures = [
  "نظام نقاط بيع سريع وسهل الاستخدام",
  "دعم تجارة الجملة والتجزئة في نظام واحد",
  "إدارة طلبيات العملاء مع ترحيلها تلقائيًا إلى فواتير",
  "طباعة فواتير احترافية ومتابعة حالة الفواتير",
  "إدارة المديونيات وتسجيل الدفعات الجزئية والكاملة",
  "إدارة مخزون دقيقة مع تنبيهات النقص",
  "تقارير مفصلة للمخزون بعدد القطع وعدد الكراتين",
  "دعم منتجات الوزن والبيع بالميزان",
  "إدارة منتجات متعددة السمات (مقاسات، ألوان، خصائص)",
  "دعم المنتجات المركبة وحساب التكلفة والربح",
];

export function ProductShowcase() {
  return (
    <section className="py-24 bg-gradient-to-b from-accent/50 to-background overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl transform rotate-3" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl transform -rotate-3" />
              
              {/* Main Image */}
              <div className="relative bg-card rounded-3xl p-8 shadow-lg">
                <img
                  src={posMockup}
                  alt="برنامج ميراكوليا للمحاسبة ونقاط البيع"
                  className="w-full"
                />
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-6 -right-6 bg-card rounded-2xl p-4 shadow-lg border border-border">
                <div className="text-2xl font-bold text-primary">+500</div>
                <div className="text-sm text-muted-foreground">مستخدم نشط</div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-primary rounded-2xl p-4 shadow-lg text-primary-foreground">
                <div className="text-2xl font-bold">⭐ 4.9</div>
                <div className="text-sm opacity-90">تقييم العملاء</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              منتجنا الرئيسي
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-tajawal">
              برنامج ميراكوليا
              <br />
              <span className="text-gradient">للمحاسبة ونقاط البيع</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              نظام كاشير ونقاط بيع متكامل لإدارة المحلات التجارية، يجمع بين المبيعات والمخزون والمحاسبة في واجهة سهلة الاستخدام، ويدعم تجارة الجملة والتجزئة.
            </p>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {productFeatures.slice(0, 8).map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products/miracolia-pos">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                  <Download className="h-5 w-5" />
                  تحميل مجاني
                </Button>
              </Link>
              <Link to="/products/miracolia-pos">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  معرفة المزيد
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
