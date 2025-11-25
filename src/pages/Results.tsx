import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useEmployees } from '@/contexts/EmployeeContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CalculationResult {
  employee: any;
  normalized: Record<string, number>;
  weighted: Record<string, number>;
  totalScore: number;
  rank: number;
}

const Results = () => {
  const { employees, weights } = useEmployees();
  const { toast } = useToast();
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  const criteria = ['discipline', 'productivity', 'workQuality', 'teamwork', 'initiative', 'loyalty'];
  const criteriaLabels = {
    discipline: 'Kedisiplinan',
    productivity: 'Produktivitas',
    workQuality: 'Kualitas Kerja',
    teamwork: 'Kerja Sama Tim',
    initiative: 'Inisiatif',
    loyalty: 'Loyalitas',
  };

  useEffect(() => {
    if (employees.length > 0) {
      calculateResults();
    }
  }, [employees, weights]);

  const calculateResults = () => {
    // Step 1: Normalize weights
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const normalizedWeights: Record<string, number> = {};
    criteria.forEach(c => {
      normalizedWeights[c] = totalWeight > 0 ? weights[c as keyof typeof weights] / totalWeight : 0;
    });

    // Step 2: Calculate for each employee
    const calculated = employees.map(employee => {
      const normalized: Record<string, number> = {};
      const weighted: Record<string, number> = {};
      let totalScore = 0;

      criteria.forEach(c => {
        // Normalize value (0-1 scale)
        const criterionKey = c as keyof typeof employee;
        const value = typeof employee[criterionKey] === 'number' ? employee[criterionKey] : 0;
        normalized[c] = value / 10;
        // Weighted value
        weighted[c] = normalized[c] * normalizedWeights[c];
        totalScore += weighted[c];
      });

      return {
        employee,
        normalized,
        weighted,
        totalScore,
        rank: 0,
      };
    });

    // Step 3: Sort and assign ranks
    calculated.sort((a, b) => b.totalScore - a.totalScore);
    calculated.forEach((result, index) => {
      result.rank = index + 1;
    });

    setResults(calculated);
  };

  const getAiInsights = async () => {
    if (results.length === 0) return;

    setLoadingInsights(true);
    try {
      const topEmployee = results[0];
      const prompt = `Berdasarkan hasil evaluasi karyawan dengan metode Weighted Point:

Karyawan Terbaik: ${topEmployee.employee.name}
Skor Total: ${(topEmployee.totalScore * 100).toFixed(2)}

Nilai per Kriteria:
- Kedisiplinan: ${topEmployee.employee.discipline}/10
- Produktivitas: ${topEmployee.employee.productivity}/10
- Kualitas Kerja: ${topEmployee.employee.workQuality}/10
- Kerja Sama Tim: ${topEmployee.employee.teamwork}/10
- Inisiatif: ${topEmployee.employee.initiative}/10
- Loyalitas: ${topEmployee.employee.loyalty}/10

Karyawan Lainnya:
${results.slice(1).map(r => `${r.rank}. ${r.employee.name} - Skor: ${(r.totalScore * 100).toFixed(2)}`).join('\n')}

Berikan analisis dalam bahasa Indonesia yang mencakup:
1. Penjelasan mengapa karyawan ini menjadi yang terbaik (2-3 kalimat)
2. Kekuatan utama yang dimiliki (bullet points)
3. Rekomendasi pengembangan untuk 2-3 karyawan dengan skor tertinggi berikutnya (singkat dan spesifik)

Format output harus dalam markdown yang rapi.`;

      const { data, error } = await supabase.functions.invoke('ai-insights', {
        body: { prompt }
      });

      if (error) throw error;

      setAiInsights(data.insight);
    } catch (error) {
      console.error('Error getting AI insights:', error);
      toast({
        title: "Error",
        description: "Gagal mendapatkan insight dari AI",
        variant: "destructive",
      });
    } finally {
      setLoadingInsights(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  if (employees.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Belum ada data karyawan. Silakan tambahkan data karyawan terlebih dahulu.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Hasil Evaluasi</h1>
          <p className="text-muted-foreground">Ranking dan analisis lengkap hasil perhitungan WP</p>
        </div>
        <Button 
          onClick={getAiInsights} 
          disabled={loadingInsights || results.length === 0}
          size="lg"
          className="bg-gradient-primary"
        >
          {loadingInsights ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Insights
            </>
          )}
        </Button>
      </div>

      {/* Ranking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {results.slice(0, 3).map((result) => (
          <Card 
            key={result.employee.id}
            className={`${result.rank === 1 ? 'border-2 border-primary shadow-lg' : ''}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                {getRankIcon(result.rank)}
                <span className="text-3xl font-bold text-primary">
                  {(result.totalScore * 100).toFixed(2)}
                </span>
              </div>
              <CardTitle className="text-xl">{result.employee.name}</CardTitle>
              <CardDescription>
                Peringkat {result.rank} dari {results.length} karyawan
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      {aiInsights && (
        <Card className="mb-8 border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Insights & Rekomendasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: aiInsights.replace(/\n/g, '<br/>') }}
            />
          </CardContent>
        </Card>
      )}

      {/* Original Values Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tabel Nilai Asli</CardTitle>
          <CardDescription>Nilai mentah untuk setiap kriteria (skala 1-10)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>Nama</TableHead>
                  {criteria.map(c => (
                    <TableHead key={c} className="text-center">
                      {criteriaLabels[c as keyof typeof criteriaLabels]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.employee.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center justify-center">
                        {getRankIcon(result.rank)}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{result.employee.name}</TableCell>
                    {criteria.map(c => (
                      <TableCell key={c} className="text-center">
                        {result.employee[c]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Normalized Values Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tabel Normalisasi</CardTitle>
          <CardDescription>Nilai yang telah dinormalisasi (skala 0-1)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  {criteria.map(c => (
                    <TableHead key={c} className="text-center">
                      {criteriaLabels[c as keyof typeof criteriaLabels]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.employee.id}>
                    <TableCell className="font-semibold">{result.employee.name}</TableCell>
                    {criteria.map(c => (
                      <TableCell key={c} className="text-center">
                        {result.normalized[c].toFixed(2)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Weighted Values Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tabel Hasil Perhitungan WP</CardTitle>
          <CardDescription>Nilai setelah dikalikan dengan bobot masing-masing kriteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  {criteria.map(c => (
                    <TableHead key={c} className="text-center">
                      {criteriaLabels[c as keyof typeof criteriaLabels]}
                    </TableHead>
                  ))}
                  <TableHead className="text-center font-bold">Total Skor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.employee.id}>
                    <TableCell className="font-semibold">{result.employee.name}</TableCell>
                    {criteria.map(c => (
                      <TableCell key={c} className="text-center">
                        {result.weighted[c].toFixed(4)}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-primary">
                      {(result.totalScore * 100).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
