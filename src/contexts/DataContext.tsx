import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { studentsAPI, paymentsAPI, usersAPI } from '../services/api';
import { useAuth } from './AuthContext';

// Types
export interface Student {
    id: string;
    student_id: string;
    name: string;
    email: string;
    phone: string;
    gender?: string;
    nationality?: string;
    course: string;
    level: string;
    study_mode: string;
    residential_status: string;
    hall?: string;
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
    addStudent: (student: Student) => Promise<Student>;
    updateStudent: (id: string, student: Student) => Promise<void>;
    deleteStudent: (id: string) => Promise<void>;
    refreshStudents: () => Promise<void>;

    // Payments
    payments: Payment[];
    addPayment: (payment: Payment) => Promise<void>;
    updatePayment: (id: string, payment: Payment) => Promise<void>;
    deletePayment: (id: string) => Promise<void>;
    refreshPayments: () => Promise<void>;

    // Users
    users: User[];
    addUser: (user: User) => Promise<void>;
    updateUser: (id: string, user: User) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    refreshUsers: () => Promise<void>;
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
    const { user, isAuthenticated } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    // Fetch data when user is authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            // Clear data when logged out
            setStudents([]);
            setPayments([]);
            setUsers([]);
            return;
        }

        const fetchData = async () => {
            try {
                const [studentsData, paymentsData, usersData] = await Promise.all([
                    studentsAPI.getAll({ limit: 1000 }).catch(() => []),
                    paymentsAPI.getAll({ limit: 1000 }).catch(() => []),
                    usersAPI.getAll({ limit: 1000 }).catch(() => [])
                ]);
                
                setStudents(studentsData);
                setPayments(paymentsData);
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [isAuthenticated]);

    // Refresh functions
    const refreshStudents = async () => {
        try {
            const data = await studentsAPI.getAll({ limit: 1000 });
            setStudents(data);
        } catch (error) {
            console.error('Error refreshing students:', error);
        }
    };

    const refreshPayments = async () => {
        try {
            const data = await paymentsAPI.getAll({ limit: 1000 });
            setPayments(data);
        } catch (error) {
            console.error('Error refreshing payments:', error);
        }
    };

    const refreshUsers = async () => {
        try {
            const data = await usersAPI.getAll({ limit: 1000 });
            setUsers(data);
        } catch (error) {
            console.error('Error refreshing users:', error);
        }
    };

    // Student functions
    const addStudent = async (student: Student) => {
        try {
            const newStudent = await studentsAPI.create({
                student_id: student.student_id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                gender: student.gender,
                nationality: student.nationality,
                course: student.course,
                level: student.level,
                study_mode: student.study_mode.toUpperCase(),
                residential_status: student.residential_status.toUpperCase(),
                hall: student.hall
            });
            setStudents(prev => [newStudent, ...prev]);
            return newStudent;
        } catch (error) {
            console.error('Error adding student:', error);
            throw error;
        }
    };

    const updateStudent = async (id: string, updatedStudent: Student) => {
        try {
            const updated = await studentsAPI.update(id, {
                student_id: updatedStudent.student_id,
                name: updatedStudent.name,
                email: updatedStudent.email,
                phone: updatedStudent.phone,
                gender: updatedStudent.gender,
                nationality: updatedStudent.nationality,
                course: updatedStudent.course,
                level: updatedStudent.level,
                study_mode: updatedStudent.study_mode.toUpperCase(),
                residential_status: updatedStudent.residential_status.toUpperCase(),
                hall: updatedStudent.hall
            });
            setStudents(prev => prev.map(s => s.id === id ? updated : s));
        } catch (error) {
            console.error('Error updating student:', error);
            throw error;
        }
    };

    const deleteStudent = async (id: string) => {
        try {
            await studentsAPI.delete(id);
            setStudents(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting student:', error);
            throw error;
        }
    };

    // Payment functions
    const addPayment = async (payment: Payment) => {
        try {
            const newPayment = await paymentsAPI.create({
                student_id: payment.student_id,
                amount: payment.amount,
                payment_method: payment.payment_method.toUpperCase(),
                reference_id: payment.reference_id,
                operator: payment.operator
            });
            setPayments(prev => [newPayment, ...prev]);
        } catch (error) {
            console.error('Error adding payment:', error);
            throw error;
        }
    };

    const updatePayment = async (id: string, updatedPayment: Payment) => {
        try {
            const updated = await paymentsAPI.update(id, {
                amount: updatedPayment.amount,
                payment_method: updatedPayment.payment_method.toUpperCase(),
                reference_id: updatedPayment.reference_id,
                operator: updatedPayment.operator
            });
            setPayments(prev => prev.map(p => p.id === id ? updated : p));
        } catch (error) {
            console.error('Error updating payment:', error);
            throw error;
        }
    };

    const deletePayment = async (id: string) => {
        try {
            await paymentsAPI.delete(id);
            setPayments(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting payment:', error);
            throw error;
        }
    };

    // User functions
    const addUser = async (user: User) => {
        try {
            const newUser = await usersAPI.create({
                username: user.username,
                full_name: user.full_name,
                email: '',
                password: 'ChangeMe123!', // Default password
                role: user.role.toUpperCase()
            });
            setUsers(prev => [newUser, ...prev]);
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    };

    const updateUser = async (id: string, updatedUser: User) => {
        try {
            const updated = await usersAPI.update(id, {
                username: updatedUser.username,
                full_name: updatedUser.full_name,
                role: updatedUser.role.toUpperCase(),
                is_active: updatedUser.is_active
            });
            setUsers(prev => prev.map(u => u.id === id ? updated : u));
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    const deleteUser = async (id: string) => {
        try {
            await usersAPI.delete(id);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    };

    return (
        <DataContext.Provider value={{
            students,
            addStudent,
            updateStudent,
            deleteStudent,
            refreshStudents,
            payments,
            addPayment,
            updatePayment,
            deletePayment,
            refreshPayments,
            users,
            addUser,
            updateUser,
            deleteUser,
            refreshUsers
        }}>
            {children}
        </DataContext.Provider>
    );
};