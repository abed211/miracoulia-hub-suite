
-- Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

-- Site settings table for general configuration
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Hero section content
CREATE TABLE public.hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  button_text TEXT,
  button_link TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Features/Services
CREATE TABLE public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Products (like Miracolia POS)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  image_url TEXT,
  download_link TEXT,
  demo_link TEXT,
  price TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product features
CREATE TABLE public.product_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Blog articles
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  author_name TEXT DEFAULT 'ميراكوليا',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Testimonials/Reviews
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  rating INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Contact submissions
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Uploaded files
CREATE TABLE public.uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  description TEXT,
  download_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User roles table (for admin access)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true);

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Public read policies for website content
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view hero content" ON public.hero_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view features" ON public.features FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view product features" ON public.product_features FOR SELECT USING (true);
CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view public files" ON public.uploaded_files FOR SELECT USING (is_public = true);

-- Public can submit contact forms
CREATE POLICY "Public can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Admin policies for full CRUD
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage hero content" ON public.hero_content FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage features" ON public.features FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage product features" ON public.product_features FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage articles" ON public.articles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage contact submissions" ON public.contact_submissions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage uploaded files" ON public.uploaded_files FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies
CREATE POLICY "Public can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Admins can upload files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON public.hero_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON public.features FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_uploaded_files_updated_at BEFORE UPDATE ON public.uploaded_files FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data
INSERT INTO public.site_settings (key, value) VALUES 
  ('company_name', 'ميراكوليا'),
  ('company_phone', '+970595745980'),
  ('company_email', 'info@miracolia.com'),
  ('company_address', 'فلسطين، الخليل، دورا'),
  ('whatsapp_number', '+970595745980'),
  ('facebook_url', ''),
  ('instagram_url', ''),
  ('twitter_url', '');

INSERT INTO public.hero_content (title, subtitle, description, button_text, button_link, is_active) VALUES 
  ('ميراكوليا للحلول البرمجية', 'شريكك التقني لنجاح أعمالك', 'نقدم حلول برمجية متكاملة لإدارة أعمالك بكفاءة عالية، من أنظمة نقاط البيع إلى التسويق الرقمي المتقدم', 'تواصل معنا', '#contact', true);

INSERT INTO public.features (title, description, icon, order_index, is_active) VALUES 
  ('أنظمة نقاط البيع', 'نظام كاشير متكامل لإدارة المحلات التجارية بكفاءة عالية', 'ShoppingCart', 1, true),
  ('التسويق الرقمي', 'استراتيجيات تسويقية متقدمة لزيادة مبيعاتك وانتشارك', 'TrendingUp', 2, true),
  ('تطوير البرمجيات', 'برامج مخصصة حسب احتياجات عملك بأحدث التقنيات', 'Code', 3, true),
  ('الدعم الفني', 'دعم فني متواصل لضمان استمرارية عملك بدون انقطاع', 'Headphones', 4, true);

INSERT INTO public.products (name, slug, short_description, full_description, is_featured, is_active, order_index) VALUES 
  ('برنامج ميراكوليا', 'miracolia-pos', 'نظام كاشير ونقاط بيع متكامل لإدارة المحلات التجارية', 'برنامج ميراكوليا هو نظام كاشير ونقاط بيع متكامل لإدارة المحلات التجارية، يجمع بين المبيعات والمخزون والمحاسبة في واجهة سهلة الاستخدام، ويدعم تجارة الجملة والتجزئة مع تجربة عملية وسلسة تناسب مختلف أنواع الأنشطة التجارية.', true, true, 1);

INSERT INTO public.product_features (product_id, title, description, icon, order_index) 
SELECT id, 'نظام نقاط بيع سريع', 'واجهة سهلة الاستخدام مع سرعة فائقة في المعاملات', 'Zap', 1 FROM public.products WHERE slug = 'miracolia-pos'
UNION ALL
SELECT id, 'دعم الجملة والتجزئة', 'نظام واحد يدعم جميع أنواع المبيعات', 'Package', 2 FROM public.products WHERE slug = 'miracolia-pos'
UNION ALL
SELECT id, 'إدارة المخزون', 'تتبع دقيق للمخزون مع تنبيهات النقص', 'Warehouse', 3 FROM public.products WHERE slug = 'miracolia-pos'
UNION ALL
SELECT id, 'إدارة المديونيات', 'تسجيل الدفعات الجزئية والكاملة بسهولة', 'CreditCard', 4 FROM public.products WHERE slug = 'miracolia-pos'
UNION ALL
SELECT id, 'تقارير شاملة', 'تقارير مفصلة للمبيعات والأرباح', 'BarChart', 5 FROM public.products WHERE slug = 'miracolia-pos'
UNION ALL
SELECT id, 'دعم الباركود', 'توافق مع الماسحات والطابعات الحرارية', 'Barcode', 6 FROM public.products WHERE slug = 'miracolia-pos';

INSERT INTO public.testimonials (name, role, company, content, rating, is_active, order_index) VALUES 
  ('أحمد محمد', 'صاحب سوبرماركت', 'ماركت الأمل', 'برنامج رائع سهّل علينا إدارة المحل بشكل كبير، أنصح به كل التجار', 5, true, 1),
  ('محمود خالد', 'مدير مبيعات', 'شركة النور للملابس', 'أفضل برنامج استخدمته، الدعم الفني ممتاز والواجهة سهلة جداً', 5, true, 2),
  ('سامي حسن', 'صاحب صيدلية', 'صيدلية الشفاء', 'ساعدني البرنامج في تنظيم المخزون ومتابعة المبيعات بدقة عالية', 5, true, 3);
