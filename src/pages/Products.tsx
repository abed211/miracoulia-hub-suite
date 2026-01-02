import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import posMockup from "@/assets/pos-mockup.png";

const products = [
  {
    name: "برنامج ميراكوليا",
    slug: "miracolia-pos",
    description: "نظام كاشير ونقاط بيع متكامل لإدارة المحلات التجارية، يجمع بين المبيعات والمخزون والمحاسبة في واجهة سهلة الاستخدام.",
    image: posMockup,
    featured: true,
  },
];

export default function Products() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 font-tajawal">
            منتجاتنا
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            نقدم مجموعة من الحلول البرمجية المتكاملة لمساعدتك على إدارة أعمالك بكفاءة
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={index}
                className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border"
              >
                <div className="aspect-video bg-accent/50 p-6 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  {product.featured && (
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3">
                      المنتج الرئيسي
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex gap-3">
                    <Link to={`/products/${product.slug}`} className="flex-1">
                      <Button variant="default" className="w-full">
                        التفاصيل
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Coming Soon Card */}
            <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border border-dashed">
              <div className="aspect-video bg-muted/50 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-4xl mb-2">🚀</div>
                  <p>قريباً</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3">
                  منتجات جديدة
                </h3>
                <p className="text-muted-foreground mb-6">
                  نعمل على تطوير المزيد من الحلول البرمجية لتلبية احتياجاتكم
                </p>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    تواصل معنا لطلب برنامج مخصص
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
