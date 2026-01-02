import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "أحمد محمد",
    role: "صاحب سوبرماركت",
    company: "ماركت الأمل",
    content: "برنامج رائع سهّل علينا إدارة المحل بشكل كبير، أنصح به كل التجار. الدعم الفني متميز والواجهة سهلة الاستخدام.",
    rating: 5,
  },
  {
    name: "محمود خالد",
    role: "مدير مبيعات",
    company: "شركة النور للملابس",
    content: "أفضل برنامج استخدمته، الدعم الفني ممتاز والواجهة سهلة جداً. ساعدنا على تنظيم المبيعات وتتبع المخزون بدقة.",
    rating: 5,
  },
  {
    name: "سامي حسن",
    role: "صاحب صيدلية",
    company: "صيدلية الشفاء",
    content: "ساعدني البرنامج في تنظيم المخزون ومتابعة المبيعات بدقة عالية. أنصح به كل أصحاب الصيدليات.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-navy text-primary-foreground overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-primary-foreground/10 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            آراء عملائنا
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-tajawal">
            ماذا يقول عملاؤنا؟
          </h2>
          <p className="text-lg text-primary-foreground/70">
            نفتخر بثقة عملائنا ونسعى دائماً لتقديم أفضل الخدمات
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors"
            >
              {/* Quote Icon */}
              <Quote className="h-10 w-10 text-primary mb-6 opacity-50" />
              
              {/* Content */}
              <p className="text-primary-foreground/90 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-primary-foreground/70">
                    {testimonial.role} - {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
