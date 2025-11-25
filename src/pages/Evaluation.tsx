import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Save } from 'lucide-react';
import { useEmployees } from '@/contexts/EmployeeContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const Evaluation = () => {
  const { employees, weights, updateWeights } = useEmployees();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [localWeights, setLocalWeights] = useState(weights);

  useEffect(() => {
    setLocalWeights(weights);
  }, [weights]);

  const criteria = [
    { key: 'discipline', label: 'Kedisiplinan', description: 'Ketepatan waktu dan kepatuhan terhadap aturan' },
    { key: 'productivity', label: 'Produktivitas', description: 'Jumlah dan kecepatan penyelesaian pekerjaan' },
    { key: 'workQuality', label: 'Kualitas Kerja', description: 'Tingkat kesempurnaan hasil pekerjaan' },
    { key: 'teamwork', label: 'Kerja Sama Tim', description: 'Kemampuan berkolaborasi dengan rekan kerja' },
    { key: 'initiative', label: 'Inisiatif', description: 'Proaktif dalam mengambil tindakan dan ide baru' },
    { key: 'loyalty', label: 'Loyalitas', description: 'Dedikasi dan komitmen terhadap perusahaan' },
  ];

  const totalWeight = Object.values(localWeights).reduce((sum, w) => sum + w, 0);

  const handleSave = () => {
    if (totalWeight === 0) {
      toast({
        title: "Error",
        description: "Total bobot tidak boleh nol",
        variant: "destructive",
      });
      return;
    }

    updateWeights(localWeights);
    toast({
      title: "Berhasil",
      description: "Bobot kriteria berhasil disimpan",
    });
  };

  const handleCalculate = () => {
    if (employees.length === 0) {
      toast({
        title: "Error",
        description: "Belum ada data karyawan. Tambahkan karyawan terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    if (totalWeight === 0) {
      toast({
        title: "Error",
        description: "Total bobot tidak boleh nol",
        variant: "destructive",
      });
      return;
    }

    updateWeights(localWeights);
    toast({
      title: "Berhasil",
      description: "Menghitung hasil evaluasi...",
    });
    navigate('/results');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Evaluasi & Bobot</h1>
        <p className="text-muted-foreground">Tentukan bobot untuk setiap kriteria penilaian</p>
      </div>

      {employees.length === 0 && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Belum ada data karyawan. Silakan tambahkan data karyawan terlebih dahulu di menu Data Karyawan.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weight Settings */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Bobot Kriteria</CardTitle>
              <CardDescription>
                Tentukan tingkat kepentingan setiap kriteria. Total bobot: <span className="font-bold text-primary">{totalWeight}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {criteria.map((criterion) => (
                <div key={criterion.key} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Label htmlFor={criterion.key} className="text-base font-semibold">
                        {criterion.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {criterion.description}
                      </p>
                    </div>
                    <div className="ml-4 min-w-[60px] text-right">
                      <span className="text-2xl font-bold text-primary">
                        {localWeights[criterion.key as keyof typeof localWeights]}
                      </span>
                    </div>
                  </div>
                  <Input
                    id={criterion.key}
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={localWeights[criterion.key as keyof typeof localWeights]}
                    onChange={(e) => setLocalWeights({ 
                      ...localWeights, 
                      [criterion.key]: parseFloat(e.target.value)
                    })}
                    className="mt-2"
                  />
                </div>
              ))}

              <div className="pt-4 border-t">
                <Button onClick={handleSave} className="w-full" variant="outline" size="lg">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Bobot
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info & Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Karyawan</div>
                <div className="text-3xl font-bold text-primary">{employees.length}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Bobot</div>
                <div className="text-3xl font-bold text-secondary">{totalWeight.toFixed(1)}</div>
              </div>
              <div className="pt-2">
                <div className="text-sm text-muted-foreground mb-2">Distribusi Bobot (%)</div>
                <div className="space-y-1">
                  {criteria.map((criterion) => {
                    const percentage = totalWeight > 0 
                      ? (localWeights[criterion.key as keyof typeof localWeights] / totalWeight * 100).toFixed(1)
                      : '0';
                    return (
                      <div key={criterion.key} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{criterion.label}</span>
                        <span className="font-semibold">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-primary text-white">
            <CardHeader>
              <CardTitle className="text-white">Metode WP</CardTitle>
              <CardDescription className="text-white/80">
                Weighted Point Method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/90 mb-4">
                Metode ini menghitung skor akhir dengan menormalisasi nilai kriteria dan mengalikannya dengan bobot masing-masing.
              </p>
              <Button 
                onClick={handleCalculate}
                className="w-full bg-white text-primary hover:bg-white/90"
                size="lg"
                disabled={employees.length === 0}
              >
                Hitung Hasil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
