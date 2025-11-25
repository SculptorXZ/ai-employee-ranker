import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployees } from '@/contexts/EmployeeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, TrendingUp, Award, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { employees, weights } = useEmployees();
  const navigate = useNavigate();

  const criteria = [
    { key: 'discipline', label: 'Kedisiplinan' },
    { key: 'productivity', label: 'Produktivitas' },
    { key: 'workQuality', label: 'Kualitas Kerja' },
    { key: 'teamwork', label: 'Kerja Sama Tim' },
    { key: 'initiative', label: 'Inisiatif' },
    { key: 'loyalty', label: 'Loyalitas' },
  ];

  // Calculate average scores per criteria
  const averageScores = criteria.map(criterion => {
    const avg = employees.length > 0
      ? employees.reduce((sum, emp) => {
          const value = emp[criterion.key as keyof typeof emp];
          return sum + (typeof value === 'number' ? value : 0);
        }, 0) / employees.length
      : 0;
    return {
      name: criterion.label,
      value: Number(avg.toFixed(2)),
    };
  });

  // Prepare data for employee comparison chart
  const employeeData = employees.slice(0, 5).map(emp => ({
    name: emp.name.length > 12 ? emp.name.substring(0, 12) + '...' : emp.name,
    Kedisiplinan: emp.discipline,
    Produktivitas: emp.productivity,
    'Kualitas Kerja': emp.workQuality,
    'Kerja Sama': emp.teamwork,
    Inisiatif: emp.initiative,
    Loyalitas: emp.loyalty,
  }));

  // Calculate stats
  const avgOverall = employees.length > 0
    ? employees.reduce((sum, emp) => {
        const total = criteria.reduce((s, c) => {
          const value = emp[c.key as keyof typeof emp];
          return s + (typeof value === 'number' ? value : 0);
        }, 0);
        return sum + total / criteria.length;
      }, 0) / employees.length
    : 0;

  const topEmployee = employees.length > 0
    ? employees.reduce((best, emp) => {
        const empAvg = criteria.reduce((s, c) => {
          const value = emp[c.key as keyof typeof emp];
          return s + (typeof value === 'number' ? value : 0);
        }, 0) / criteria.length;
        const bestAvg = criteria.reduce((s, c) => {
          const value = best[c.key as keyof typeof best];
          return s + (typeof value === 'number' ? value : 0);
        }, 0) / criteria.length;
        return empAvg > bestAvg ? emp : best;
      }, employees[0])
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Analytics</h1>
        <p className="text-muted-foreground">Overview statistik dan visualisasi data karyawan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Karyawan</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{employees.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Data terdaftar dalam sistem
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Skor</CardTitle>
            <TrendingUp className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{avgOverall.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dari skala 1-10
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Karyawan Terbaik</CardTitle>
            <Award className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground truncate">
              {topEmployee ? topEmployee.name : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Skor tertinggi saat ini
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Kriteria</CardTitle>
            <Target className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{criteria.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Parameter penilaian
            </p>
          </CardContent>
        </Card>
      </div>

      {employees.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Belum Ada Data</h3>
            <p className="text-muted-foreground mb-6">
              Mulai dengan menambahkan data karyawan terlebih dahulu
            </p>
            <Button onClick={() => navigate('/employees')} size="lg">
              Tambah Karyawan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Radar Chart - Average Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Profil Rata-rata Tim</CardTitle>
                <CardDescription>
                  Rata-rata skor untuk setiap kriteria penilaian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={averageScores}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 10]}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Radar
                      name="Rata-rata"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Top 5 Employees */}
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Karyawan</CardTitle>
                <CardDescription>
                  Perbandingan skor karyawan terbaik
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={employeeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      domain={[0, 10]}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Kedisiplinan" fill="hsl(217 91% 60%)" />
                    <Bar dataKey="Produktivitas" fill="hsl(188 94% 43%)" />
                    <Bar dataKey="Kualitas Kerja" fill="hsl(142 76% 36%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Criteria Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Skor per Kriteria</CardTitle>
              <CardDescription>
                Perbandingan lengkap semua kriteria untuk setiap karyawan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={employeeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 10]} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Kedisiplinan" fill="hsl(217 91% 60%)" />
                  <Bar dataKey="Produktivitas" fill="hsl(188 94% 43%)" />
                  <Bar dataKey="Kualitas Kerja" fill="hsl(142 76% 36%)" />
                  <Bar dataKey="Kerja Sama" fill="hsl(280 89% 63%)" />
                  <Bar dataKey="Inisiatif" fill="hsl(25 95% 53%)" />
                  <Bar dataKey="Loyalitas" fill="hsl(340 82% 52%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
