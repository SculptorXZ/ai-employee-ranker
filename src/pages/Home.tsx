import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calculator, BarChart3, Sparkles, ArrowRight } from 'lucide-react';
import { useEmployees } from '@/contexts/EmployeeContext';

const Home = () => {
  const navigate = useNavigate();
  const { employees } = useEmployees();

  const features = [
    {
      icon: Users,
      title: 'Manajemen Karyawan',
      description: 'Kelola data karyawan dengan mudah. Tambah, edit, atau hapus data kapan saja.',
      action: () => navigate('/employees'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Calculator,
      title: 'Evaluasi WP',
      description: 'Tentukan bobot kriteria dan hitung skor menggunakan metode Weighted Point.',
      action: () => navigate('/evaluation'),
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      icon: BarChart3,
      title: 'Hasil & Ranking',
      description: 'Lihat hasil perhitungan lengkap dengan ranking dan visualisasi data.',
      action: () => navigate('/results'),
      gradient: 'from-teal-500 to-emerald-500',
    },
    {
      icon: Sparkles,
      title: 'AI Insights',
      description: 'Dapatkan rekomendasi dan insight otomatis dari AI untuk pengembangan karyawan.',
      action: () => navigate('/results'),
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-primary py-20">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Sistem Pendukung Keputusan
            </h1>
            <p className="text-xl md:text-2xl mb-2 text-white/90">
              Pemilihan Karyawan Terbaik
            </p>
            <p className="text-lg text-white/80 mb-8">
              Metode Weighted Point dengan AI-Powered Insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/employees')}
                className="text-lg"
              >
                Mulai Evaluasi <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              {employees.length > 0 && (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/results')}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg"
                >
                  Lihat Hasil
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Fitur Unggulan</h2>
          <p className="text-muted-foreground text-lg">
            Sistem lengkap untuk evaluasi karyawan yang objektif dan akurat
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/50"
                onClick={feature.action}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                    Buka <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">{employees.length}</div>
                <div className="text-muted-foreground">Karyawan Terdaftar</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-secondary mb-2">6</div>
                <div className="text-muted-foreground">Kriteria Penilaian</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">AI</div>
                <div className="text-muted-foreground">Powered Insights</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
