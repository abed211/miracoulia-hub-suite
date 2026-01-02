import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";

// Placeholder articles for now - will be loaded from database
const placeholderArticles = [
  {
    id: 1,
    title: "كيف تختار برنامج نقاط البيع المناسب لمحلك التجاري؟",
    excerpt: "دليل شامل لاختيار نظام كاشير يناسب احتياجات عملك ويساعدك على زيادة الكفاءة والأرباح.",
    slug: "how-to-choose-pos-system",
    date: "2024-01-15",
    author: "ميراكوليا",
  },
  {
    id: 2,
    title: "أهمية إدارة المخزون في نجاح المشاريع التجارية",
    excerpt: "تعرف على كيفية إدارة المخزون بشكل فعال لتجنب الخسائر وتحسين التدفق النقدي.",
    slug: "inventory-management-importance",
    date: "2024-01-10",
    author: "ميراكوليا",
  },
  {
    id: 3,
    title: "5 استراتيجيات تسويقية فعالة للمحلات التجارية",
    excerpt: "اكتشف أفضل الاستراتيجيات التسويقية لزيادة مبيعاتك وجذب المزيد من العملاء.",
    slug: "marketing-strategies-retail",
    date: "2024-01-05",
    author: "ميراكوليا",
  },
];

export default function Blog() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 font-tajawal">
            المدونة
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            مقالات ونصائح مفيدة لأصحاب الأعمال والتجار
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24 bg-background">
        <div className="container">
          {placeholderArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {placeholderArticles.map((article) => (
                <article
                  key={article.id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-6xl">📝</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(article.date).toLocaleDateString('ar-EG')}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {article.author}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <Link
                      to={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                    >
                      اقرأ المزيد
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">قريباً</h2>
              <p className="text-muted-foreground">نعمل على إضافة مقالات مفيدة لك</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
