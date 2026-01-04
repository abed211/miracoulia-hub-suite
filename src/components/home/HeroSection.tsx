import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroBgDefault from "@/assets/hero-bg.jpg";
import posMockupDefault from "@/assets/pos-mockup.png";

export function HeroSection() {
  const { data: heroContent } = useQuery({
    queryKey: ['hero-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const title = heroContent?.title || "حلول برمجية متكاملة";
  const subtitle = heroContent?.subtitle || "لإدارة أعمالك";
  const description = heroContent?.description || "نقدم حلول برمجية متكاملة لإدارة أعمالك بكفاءة عالية، من أنظمة نقاط البيع إلى التسويق الرقمي المتقدم";
  const buttonText = heroContent?.button_text || "تحميل البرنامج";
  const buttonLink = heroContent?.button_link || "/products/miracolia-pos";
  const heroBg = heroContent?.image_url || heroBgDefault;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      </div>

      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-secondary/20 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="container relative z-10 pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-right space-y-8 animate-fade-up">
            <div className="inline-block bg-primary-foreground/10 backdrop-blur-sm rounded-full px-6 py-2 text-primary-foreground/90 text-sm font-medium border border-primary-foreground/20">
              🚀 شريكك التقني لنجاح أعمالك
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight font-tajawal">
              {title}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan to-primary">
                {subtitle}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={buttonLink}>
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  <Download className="h-5 w-5" />
                  {buttonText}
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="hero-outline" size="lg" className="w-full sm:w-auto">
                  تواصل معنا
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-foreground">+500</div>
                <div className="text-primary-foreground/70 text-sm">عميل سعيد</div>
              </div>
              <div className="w-px bg-primary-foreground/20" />
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-foreground">+50</div>
                <div className="text-primary-foreground/70 text-sm">مشروع منجز</div>
              </div>
              <div className="w-px bg-primary-foreground/20" />
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-foreground">24/7</div>
                <div className="text-primary-foreground/70 text-sm">دعم فني</div>
              </div>
            </div>
          </div>

          {/* Mockup Image */}
          <div className="relative hidden lg:block">
            <div className="relative animate-float">
              <img
                src={posMockupDefault}
                alt="برنامج ميراكوليا"
                className="w-full max-w-lg mx-auto drop-shadow-2xl"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-card rounded-2xl p-4 shadow-lg animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">شاهد العرض</div>
                    <div className="text-sm text-muted-foreground">2 دقيقة</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
