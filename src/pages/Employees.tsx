import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { useEmployees } from '@/contexts/EmployeeContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Employees = () => {
  const { employees, addEmployee, removeEmployee } = useEmployees();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    discipline: 5,
    productivity: 5,
    workQuality: 5,
    teamwork: 5,
    initiative: 5,
    loyalty: 5,
  });

  const criteria = [
    { key: 'discipline', label: 'Kedisiplinan' },
    { key: 'productivity', label: 'Produktivitas' },
    { key: 'workQuality', label: 'Kualitas Kerja' },
    { key: 'teamwork', label: 'Kerja Sama Tim' },
    { key: 'initiative', label: 'Inisiatif' },
    { key: 'loyalty', label: 'Loyalitas' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Nama karyawan harus diisi",
        variant: "destructive",
      });
      return;
    }

    addEmployee(formData);
    setFormData({
      name: '',
      discipline: 5,
      productivity: 5,
      workQuality: 5,
      teamwork: 5,
      initiative: 5,
      loyalty: 5,
    });

    toast({
      title: "Berhasil",
      description: "Data karyawan berhasil ditambahkan",
    });
  };

  const handleRemove = (id: string, name: string) => {
    removeEmployee(id);
    toast({
      title: "Berhasil",
      description: `Data ${name} berhasil dihapus`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Data Karyawan</h1>
        <p className="text-muted-foreground">Kelola data karyawan yang akan dievaluasi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Input */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Tambah Karyawan
            </CardTitle>
            <CardDescription>
              Isi data karyawan dan nilai untuk setiap kriteria (skala 1-10)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Karyawan</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama karyawan"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {criteria.map((criterion) => (
                  <div key={criterion.key}>
                    <Label htmlFor={criterion.key} className="flex justify-between">
                      <span>{criterion.label}</span>
                      <span className="text-primary font-semibold">
                        {formData[criterion.key as keyof typeof formData]}
                      </span>
                    </Label>
                    <Input
                      id={criterion.key}
                      type="range"
                      min="1"
                      max="10"
                      value={formData[criterion.key as keyof typeof formData]}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        [criterion.key]: parseInt(e.target.value)
                      })}
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Karyawan
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List Karyawan */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Karyawan ({employees.length})</CardTitle>
              <CardDescription>
                Karyawan yang telah ditambahkan akan tampil di sini
              </CardDescription>
            </CardHeader>
          </Card>

          {employees.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Belum ada karyawan yang ditambahkan. Mulai dengan menambahkan data karyawan pertama.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {employees.map((employee) => (
                <Card key={employee.id} className="group hover:shadow-md transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-3">
                          {employee.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {criteria.map((criterion) => (
                            <div key={criterion.key} className="flex justify-between items-center">
                              <span className="text-muted-foreground">{criterion.label}:</span>
                              <span className="font-semibold text-primary">
                                {employee[criterion.key as keyof typeof employee]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(employee.id, employee.name)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;
