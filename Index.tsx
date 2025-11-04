import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Calendar, Bot, MessageSquare, Shield, Globe, Star, Users, CheckCircle, UserCircle } from 'lucide-react';
import heroImage from '@/assets/hero-medical.jpg';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Consultations',
      titleHindi: 'एआई-संचालित परामर्श',
      description: 'Get instant medical advice from our AI assistant trained on medical knowledge',
      descriptionHindi: 'चिकित्सा ज्ञान पर प्रशिक्षित हमारे एआई सहायक से तुरंत चिकित्सा सलाह प्राप्त करें',
    },
    {
      icon: Globe,
      title: 'Bilingual Support',
      titleHindi: 'द्विभाषी समर्थन',
      description: 'Communicate in Hindi or English - whatever you\'re comfortable with',
      descriptionHindi: 'हिंदी या अंग्रेजी में संवाद करें - जो भी आपको सहज लगे',
    },
    {
      icon: Calendar,
      title: 'Easy Appointments',
      titleHindi: 'आसान अपॉइंटमेंट',
      description: 'Book instant appointments with qualified doctors',
      descriptionHindi: 'योग्य डॉक्टरों के साथ तुरंत अपॉइंटमेंट बुक करें',
    },
    {
      icon: MessageSquare,
      title: 'Urgent Consultations',
      titleHindi: 'तत्काल परामर्श',
      description: 'Get priority support for urgent medical needs',
      descriptionHindi: 'तत्काल चिकित्सा आवश्यकताओं के लिए प्राथमिकता समर्थन प्राप्त करें',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      titleHindi: 'सुरक्षित और निजी',
      description: 'Your medical data is encrypted and completely confidential',
      descriptionHindi: 'आपका चिकित्सा डेटा एन्क्रिप्टेड और पूरी तरह गोपनीय है',
    },
    {
      icon: Heart,
      title: 'Better Healthcare',
      titleHindi: 'बेहतर स्वास्थ्य सेवा',
      description: 'Improving patient adherence and reducing hospital dependency',
      descriptionHindi: 'रोगी अनुपालन में सुधार और अस्पताल निर्भरता को कम करना',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      nameHindi: 'प्रिया शर्मा',
      location: 'Delhi',
      locationHindi: 'दिल्ली',
      rating: 5,
      text: 'AyanshMed helped me get instant advice when I needed it most. The bilingual support made it so easy!',
      textHindi: 'आयांश मेड ने मुझे तब तुरंत सलाह दिलाई जब मुझे इसकी सबसे ज्यादा जरूरत थी। द्विभाषी समर्थन ने इसे बहुत आसान बना दिया!',
    },
    {
      name: 'Dr. Rajesh Kumar',
      nameHindi: 'डॉ. राजेश कुमार',
      location: 'Mumbai',
      locationHindi: 'मुंबई',
      rating: 5,
      text: 'As a doctor, this platform helps me reach more patients efficiently. The AI assistant provides good preliminary guidance.',
      textHindi: 'एक डॉक्टर के रूप में, यह मंच मुझे अधिक रोगियों तक कुशलता से पहुंचने में मदद करता है। एआई सहायक अच्छा प्रारंभिक मार्गदर्शन प्रदान करता है।',
    },
    {
      name: 'Meera Patel',
      nameHindi: 'मीरा पटेल',
      location: 'Gujarat',
      locationHindi: 'गुजरात',
      rating: 5,
      text: 'Finally, a healthcare platform that speaks my language! Easy appointments and helpful AI consultations.',
      textHindi: 'आखिरकार, एक स्वास्थ्य सेवा मंच जो मेरी भाषा बोलता है! आसान अपॉइंटमेंट और सहायक एआई परामर्श।',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Patients', labelHindi: 'मरीज़', icon: Users },
    { number: '500+', label: 'Doctors', labelHindi: 'डॉक्टर', icon: Heart },
    { number: '50,000+', label: 'Consultations', labelHindi: 'परामर्श', icon: MessageSquare },
    { number: '98%', label: 'Satisfaction', labelHindi: 'संतुष्टि', icon: Star },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-glow to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Heart className="h-4 w-4" />
                <span className="text-sm">AI-Powered Healthcare Platform</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                AyanshMed
              </h1>
              <h2 className="text-3xl lg:text-4xl font-semibold opacity-90">
                आयांश मेड
              </h2>
              <p className="text-xl opacity-90 leading-relaxed">
                Bridging the gap between patients and doctors with AI-powered bilingual medical consultations
              </p>
              <p className="text-lg opacity-80">
                एआई-संचालित द्विभाषी चिकित्सा परामर्श के साथ रोगियों और डॉक्टरों के बीच की खाई को पाटना
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="bg-white text-primary hover:bg-white/90 shadow-lg"
                >
                  Get Started • शुरू करें
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  className="border-white text-white hover:bg-white/10"
                >
                  Sign In • साइन इन करें
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl" />
              <img
                src={heroImage}
                alt="Medical professionals"
                className="rounded-3xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose AyanshMed?
            </h2>
            <p className="text-xl text-muted-foreground mb-2">
              Advanced healthcare technology for everyone
            </p>
            <p className="text-lg text-muted-foreground">
              सभी के लिए उन्नत स्वास्थ्य सेवा प्रौद्योगिकी
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg group"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    {feature.titleHindi}
                  </p>
                  <p className="text-muted-foreground mb-2">
                    {feature.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {feature.descriptionHindi}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-trust border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-none bg-transparent">
                <CardContent className="pt-6">
                  <div className="mb-3 flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <p className="text-sm font-medium text-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.labelHindi}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Testimonials • प्रशंसापत्र
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground">
              हमारे उपयोगकर्ता क्या कहते हैं
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              >
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm mb-2 leading-relaxed">{testimonial.text}</p>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {testimonial.textHindi}
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.nameHindi} • {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">HIPAA Compliant</p>
                <p className="text-xs text-muted-foreground">Secure & Private</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="font-semibold">Verified Doctors</p>
                <p className="text-xs text-muted-foreground">Licensed Professionals</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-destructive" />
              <div>
                <p className="font-semibold">24/7 Support</p>
                <p className="text-xs text-muted-foreground">Always Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-xl mb-2 opacity-90">
            बेहतर स्वास्थ्य सेवा का अनुभव करने के लिए तैयार हैं?
          </p>
          <p className="text-lg mb-8 opacity-80">
            Join thousands of patients already using AyanshMed
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-white text-primary hover:bg-white/90 shadow-lg"
          >
            Create Your Account • अपना खाता बनाएं
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">AyanshMed</span>
          </div>
          <p className="text-sm">
            Empowering healthcare through AI and bilingual communication
          </p>
          <p className="text-sm">
            एआई और द्विभाषी संचार के माध्यम से स्वास्थ्य सेवा को सशक्त बनाना
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;