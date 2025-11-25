import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Employee {
  id: string;
  name: string;
  discipline: number;
  productivity: number;
  workQuality: number;
  teamwork: number;
  initiative: number;
  loyalty: number;
}

export interface Weights {
  discipline: number;
  productivity: number;
  workQuality: number;
  teamwork: number;
  initiative: number;
  loyalty: number;
}

interface EmployeeContextType {
  employees: Employee[];
  weights: Weights;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  removeEmployee: (id: string) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  updateWeights: (weights: Weights) => void;
  resetAll: () => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

const defaultWeights: Weights = {
  discipline: 1,
  productivity: 1,
  workQuality: 1,
  teamwork: 1,
  initiative: 1,
  loyalty: 1,
};

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : [];
  });

  const [weights, setWeights] = useState<Weights>(() => {
    const saved = localStorage.getItem('weights');
    return saved ? JSON.parse(saved) : defaultWeights;
  });

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('weights', JSON.stringify(weights));
  }, [weights]);

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
    };
    setEmployees([...employees, newEmployee]);
  };

  const removeEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, ...updates } : emp
    ));
  };

  const updateWeights = (newWeights: Weights) => {
    setWeights(newWeights);
  };

  const resetAll = () => {
    setEmployees([]);
    setWeights(defaultWeights);
    localStorage.removeItem('employees');
    localStorage.removeItem('weights');
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        weights,
        addEmployee,
        removeEmployee,
        updateEmployee,
        updateWeights,
        resetAll,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within EmployeeProvider');
  }
  return context;
};
