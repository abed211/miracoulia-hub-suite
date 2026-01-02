import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "منتجاتنا" },
  { href: "/services", label: "خدماتنا" },
  { href: "/blog", label: "المدونة" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="ميراكوليا" className="h-10 w-auto" />
          <span className={`font-bold text-xl font-tajawal ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}>
            ميراكوليا
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative text-sm font-medium transition-colors hover:text-primary ${
                isScrolled ? "text-foreground" : "text-primary-foreground"
              } ${
                location.pathname === link.href
                  ? "after:absolute after:bottom-[-4px] after:right-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:+970595745980" className="flex items-center gap-2">
            <Button variant={isScrolled ? "default" : "hero-outline"} size="default">
              <Phone className="h-4 w-4" />
              اتصل بنا
            </Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={`h-6 w-6 ${isScrolled ? "text-foreground" : "text-primary-foreground"}`} />
          ) : (
            <Menu className={`h-6 w-6 ${isScrolled ? "text-foreground" : "text-primary-foreground"}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-card shadow-lg transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-96 py-4" : "max-h-0"
        }`}
      >
        <nav className="container flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-foreground font-medium py-2 transition-colors hover:text-primary ${
                location.pathname === link.href ? "text-primary" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a href="tel:+970595745980">
            <Button variant="default" className="w-full mt-2">
              <Phone className="h-4 w-4" />
              اتصل بنا
            </Button>
          </a>
        </nav>
      </div>
    </header>
  );
}
