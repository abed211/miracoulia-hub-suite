import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowLeft, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import posMockupDefault from "@/assets/pos-mockup.png";

const defaultProductFeatures = [
  "نظام نقاط بيع سريع وسهل الاستخدام",
  "دعم تجارة الجملة والتجزئة في نظام واحد",
  "إدارة طلبيات العملاء مع ترحيلها تلقائيًا إلى فواتير",
  "طباعة فواتير احترافية ومتابعة حالة الفواتير",
  "إدارة المديونيات وتسجيل الدفعات الجزئية والكاملة",
  "إدارة مخزون دقيقة مع تنبيهات النقص",
  "تقارير مفصلة للمخزون بعدد القطع وعدد الكراتين",
  "دعم منتجات الوزن والبيع بالميزان",
];

export function ProductShowcase() {
  const { data: featuredProduct } = useQuery({
    queryKey: ['featured-product'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('order_index', { ascending: true })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: productFeatures } = useQuery({
    queryKey: ['product-features', featuredProduct?.id],
    queryFn: async () => {
      if (!featuredProduct?.id) return null;
      const { data, error } = await supabase
        .from('product_features')
        .select('*')
        .eq('product_id', featuredProduct.id)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!featuredProduct?.id
  });

  const productName = featuredProduct?.name || "برنامج ميراكوليا";
  const productSubtitle = "للمحاسبة ونقاط البيع";
  const productDescription = featuredProduct?.short_description || "نظام كاشير ونقاط بيع متكامل لإدارة المحلات التجارية، يجمع بين المبيعات والمخزون والمحاسبة في واجهة سهلة الاستخدام، ويدعم تجارة الجملة والتجزئة.";
  const productImage = featuredProduct?.image_url || posMockupDefault;
  const productSlug = featuredProduct?.slug || "miracolia-pos";
  const downloadLink = featuredProduct?.download_link;

  const displayFeatures = productFeatures && productFeatures.length > 0 
    ? productFeatures.map(f => f.title) 
    : defaultProductFeatures;

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
                  src={productImage}
                  alt={productName}
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
              {productName}
              <br />
              <span className="text-gradient">{productSubtitle}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {productDescription}
            </p>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {displayFeatures.slice(0, 8).map((feature, index) => (
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
              {downloadLink ? (
                <a href={downloadLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                    <Download className="h-5 w-5" />
                    تحميل مجاني
                  </Button>
                </a>
              ) : (
                <Link to={`/products/${productSlug}`}>
                  <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                    <Download className="h-5 w-5" />
                    تحميل مجاني
                  </Button>
                </Link>
              )}
              <Link to={`/products/${productSlug}`}>
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
