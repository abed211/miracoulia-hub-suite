import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, MessageCircle, Facebook, Instagram, Twitter } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="ميراكوليا" className="h-12 w-auto brightness-0 invert" />
              <span className="font-bold text-2xl font-tajawal">ميراكوليا</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              شركة رائدة في مجال الحلول البرمجية والتسويق الرقمي، نساعدك على تحويل أعمالك إلى نجاح رقمي متميز.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-primary-foreground/80 hover:text-primary transition-colors">
                  منتجاتنا
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-primary-foreground/80 hover:text-primary transition-colors">
                  خدماتنا
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-primary-foreground/80 hover:text-primary transition-colors">
                  المدونة
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary transition-colors">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-lg mb-6">منتجاتنا</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products/miracolia-pos" className="text-primary-foreground/80 hover:text-primary transition-colors">
                  برنامج ميراكوليا
                </Link>
              </li>
              <li>
                <span className="text-primary-foreground/80">
                  التسويق الرقمي
                </span>
              </li>
              <li>
                <span className="text-primary-foreground/80">
                  تطوير البرمجيات
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                <span className="text-primary-foreground/80">فلسطين، الخليل، دورا</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+970595745980" className="text-primary-foreground/80 hover:text-primary transition-colors">
                  +970 595 745 980
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="https://wa.me/970595745980"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-primary transition-colors"
                >
                  واتساب
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:info@miracolia.com" className="text-primary-foreground/80 hover:text-primary transition-colors">
                  info@miracolia.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} ميراكوليا. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/60">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              شروط الاستخدام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
