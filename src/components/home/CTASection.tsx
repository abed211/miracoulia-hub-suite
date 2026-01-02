import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 font-tajawal">
            جاهز لتحويل أعمالك إلى نجاح رقمي؟
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            تواصل معنا اليوم واحصل على استشارة مجانية لمعرفة كيف يمكننا مساعدتك في تطوير أعمالك
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                تواصل معنا الآن
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <a href="https://wa.me/970595745980" target="_blank" rel="noopener noreferrer">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                <MessageCircle className="h-5 w-5" />
                واتساب
              </Button>
            </a>
          </div>

          {/* Contact Info */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <a href="tel:+970595745980" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <Phone className="h-5 w-5" />
              <span>+970 595 745 980</span>
            </a>
            <span className="text-primary-foreground/50">|</span>
            <span className="text-primary-foreground/80">فلسطين، الخليل، دورا</span>
          </div>
        </div>
      </div>
    </section>
  );
}
