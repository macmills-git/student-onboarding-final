import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Student {
    id: string;
    student_id: string;
    name: string;
    email: string;
    phone: string;
    course: string;
    level: string;
    study_mode: string;
    residential_status: string;
    registered_by: string;
    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: string;
    student_id: string;
    student_name: string;
    amount: number;
    payment_method: 'cash' | 'momo' | 'bank';
    reference_id: string;
    operator?: string;
    recorded_by: string;
    payment_date: string;
    created_at: string;
}

export interface User {
    id: string;
    username: string;
    full_name: string;
    role: 'admin' | 'clerk';
    permissions: Record<string, any>;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface DataContextType {
    // Students
    students: Student[];
    addStudent: (student: Student) => void;
    updateStudent: (id: string, student: Student) => void;
    deleteStudent: (id: string) => void;

    // Payments
    payments: Payment[];
    addPayment: (payment: Payment) => void;
    updatePayment: (id: string, payment: Payment) => void;
    deletePayment: (id: string) => void;

    // Users
    users: User[];
    addUser: (user: User) => void;
    updateUser: (id: string, user: User) => void;
    deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
    // Initial data
    const [students, setStudents] = useState<Student[]>([
        {
            id: '1',
            student_id: 'STU001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+233123456789',
            course: 'Computer Science',
            level: '300',
            study_mode: 'regular',
            residential_status: 'resident',
            registered_by: 'mcmills',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '2',
            student_id: 'STU002',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+233987654321',
            course: 'Information Technology',
            level: '200',
            study_mode: 'regular',
            residential_status: 'non-resident',
            registered_by: 'clerk',
            created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '3',
            student_id: 'STU003',
            name: 'Michael Johnson',
            email: 'michael.johnson@example.com',
            phone: '+233555123456',
            course: 'Mathematical Science',
            level: '400',
            study_mode: 'regular',
            residential_status: 'resident',
            registered_by: 'mcmills',
            created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
    ]);

    const [payments, setPayments] = useState<Payment[]>([
        {
            id: '1',
            student_id: '1',
            student_name: 'John Doe',
            amount: 2500.00,
            payment_method: 'momo',
            reference_id: 'PAY001',
            operator: 'MTN',
            recorded_by: 'mcmills',
            payment_date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '2',
            student_id: '2',
            student_name: 'Jane Smith',
            amount: 1800.00,
            payment_method: 'cash',
            reference_id: 'PAY002',
            operator: '',
            recorded_by: 'clerk',
            payment_date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
    ]);

    const [users, setUsers] = useState<User[]>([
        {
            id: '1',
            username: 'mcmills',
            full_name: 'McMills User',
            role: 'admin',
            permissions: {},
            is_active: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
        },
        {
            id: '2',
            username: 'clerk',
            full_name: 'System Clerk',
            role: 'clerk',
            permissions: {},
            is_active: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
        }
    ]);

    // Student functions
    const addStudent = (student: Student) => {
        setStudents(prev => [student, ...prev]);
    };

    const updateStudent = (id: string, updatedStudent: Student) => {
        setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
    };

    const deleteStudent = (id: string) => {
        setStudents(prev => prev.filter(s => s.id !== id));
    };

    // Payment functions
    const addPayment = (payment: Payment) => {
        setPayments(prev => [payment, ...prev]);
    };

    const updatePayment = (id: string, updatedPayment: Payment) => {
        setPayments(prev => prev.map(p => p.id === id ? updatedPayment : p));
    };

    const deletePayment = (id: string) => {
        setPayments(prev => prev.filter(p => p.id !== id));
    };

    // User functions
    const addUser = (user: User) => {
        setUsers(prev => [user, ...prev]);
    };

    const updateUser = (id: string, updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    };

    const deleteUser = (id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    return (
        <DataContext.Provider value={{
            students,
            addStudent,
            updateStudent,
            deleteStudent,
            payments,
            addPayment,
            updatePayment,
            deletePayment,
            users,
            addUser,
            updateUser,
            deleteUser
        }}>
            {children}
        </DataContext.Provider>
    );
};