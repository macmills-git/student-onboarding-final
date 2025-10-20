// Centralized mock data for consistent information across all pages

export interface Student {
  id: string;
  student_id: string;
  name: string;
  email: string;
  gender: string;
  nationality: string;
  phone_number: string;
  course: string;
  level: string;
  study_mode: 'regular' | 'distance' | 'city_campus';
  residential_status: 'resident' | 'non_resident';
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

// Mock Students Data
export const mockStudents: Student[] = [
  {
    id: '1',
    student_id: 'STU2024001',
    name: 'Kwame Asante',
    email: 'kwame.asante@st.ug.edu.gh',
    gender: 'Male',
    nationality: 'Ghanaian',
    phone_number: '+233 24 123 4567',
    course: 'Computer Science',
    level: '300',
    study_mode: 'regular',
    residential_status: 'resident',
    registered_by: '1',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    student_id: 'STU2024002',
    name: 'Ama Osei',
    email: 'ama.osei@st.ug.edu.gh',
    gender: 'Female',
    nationality: 'Ghanaian',
    phone_number: '+233 20 234 5678',
    course: 'Information Technology',
    level: '200',
    study_mode: 'regular',
    residential_status: 'non_resident',
    registered_by: '2',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    student_id: 'STU2024003',
    name: 'Kofi Mensah',
    email: 'kofi.mensah@st.ug.edu.gh',
    gender: 'Male',
    nationality: 'Ghanaian',
    phone_number: '+233 26 345 6789',
    course: 'Mathematical Science',
    level: '400',
    study_mode: 'regular',
    residential_status: 'resident',
    registered_by: '1',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    student_id: 'STU2024004',
    name: 'Akosua Boateng',
    email: 'akosua.boateng@st.ug.edu.gh',
    gender: 'Female',
    nationality: 'Ghanaian',
    phone_number: '+233 27 456 7890',
    course: 'Physical Science',
    level: '100',
    study_mode: 'regular',
    residential_status: 'resident',
    registered_by: '2',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    student_id: 'STU2024005',
    name: 'Yaw Oppong',
    email: 'yaw.oppong@st.ug.edu.gh',
    gender: 'Male',
    nationality: 'Ghanaian',
    phone_number: '+233 23 567 8901',
    course: 'Actuarial Science',
    level: '200',
    study_mode: 'regular',
    residential_status: 'non_resident',
    registered_by: '1',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    student_id: 'STU2024006',
    name: 'Efua Adjei',
    email: 'efua.adjei@st.ug.edu.gh',
    gender: 'Female',
    nationality: 'Ghanaian',
    phone_number: '+233 24 678 9012',
    course: 'Education',
    level: '300',
    study_mode: 'distance',
    residential_status: 'non_resident',
    registered_by: '2',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '7',
    student_id: 'STU2024007',
    name: 'Kwaku Owusu',
    email: 'kwaku.owusu@st.ug.edu.gh',
    gender: 'Male',
    nationality: 'Ghanaian',
    phone_number: '+233 25 789 0123',
    course: 'Allied Health',
    level: '100',
    study_mode: 'regular',
    residential_status: 'resident',
    registered_by: '1',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '8',
    student_id: 'STU2024008',
    name: 'Adwoa Frimpong',
    email: 'adwoa.frimpong@st.ug.edu.gh',
    gender: 'Female',
    nationality: 'Ghanaian',
    phone_number: '+233 28 890 1234',
    course: 'Computer Science',
    level: '200',
    study_mode: 'regular',
    residential_status: 'resident',
    registered_by: '2',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

// Mock Payments Data (linked to students)
export const mockPayments: Payment[] = [
  {
    id: '1',
    student_id: '1',
    student_name: 'Kwame Asante',
    amount: 1500,
    payment_method: 'cash',
    reference_id: 'REF2024001',
    recorded_by: '1',
    payment_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    student_id: '2',
    student_name: 'Ama Osei',
    amount: 2000,
    payment_method: 'momo',
    reference_id: 'REF2024002',
    operator: 'MTN',
    recorded_by: '2',
    payment_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    student_id: '3',
    student_name: 'Kofi Mensah',
    amount: 1800,
    payment_method: 'bank',
    reference_id: 'REF2024003',
    recorded_by: '1',
    payment_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    student_id: '4',
    student_name: 'Akosua Boateng',
    amount: 2200,
    payment_method: 'momo',
    reference_id: 'REF2024004',
    operator: 'Vodafone',
    recorded_by: '2',
    payment_date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    student_id: '5',
    student_name: 'Yaw Oppong',
    amount: 1650,
    payment_method: 'cash',
    reference_id: 'REF2024005',
    recorded_by: '1',
    payment_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    student_id: '6',
    student_name: 'Efua Adjei',
    amount: 1900,
    payment_method: 'bank',
    reference_id: 'REF2024006',
    recorded_by: '2',
    payment_date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '7',
    student_id: '7',
    student_name: 'Kwaku Owusu',
    amount: 1750,
    payment_method: 'momo',
    reference_id: 'REF2024007',
    operator: 'AirtelTigo',
    recorded_by: '1',
    payment_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '8',
    student_id: '8',
    student_name: 'Adwoa Frimpong',
    amount: 2100,
    payment_method: 'cash',
    reference_id: 'REF2024008',
    recorded_by: '2',
    payment_date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    full_name: 'System Administrator',
    role: 'admin',
    permissions: {},
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    username: 'clerk',
    full_name: 'System Clerk',
    role: 'clerk',
    permissions: {},
    is_active: true,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Helper functions for data calculations
export const getStudentStats = () => {
  const totalStudents = mockStudents.length;
  const totalRevenue = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const activeUsers = mockUsers.filter(user => user.is_active).length;

  return {
    totalStudents,
    totalRevenue,
    activeUsers
  };
};

export const getCourseDistribution = () => {
  const courseCount: Record<string, number> = {};

  mockStudents.forEach(student => {
    courseCount[student.course] = (courseCount[student.course] || 0) + 1;
  });

  const total = mockStudents.length;

  return Object.entries(courseCount).map(([course, count]) => ({
    course,
    students: count,
    percentage: Number(((count / total) * 100).toFixed(1))
  }));
};

export const getRecentStudents = (limit: number = 5) => {
  return mockStudents
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
};

export const getRecentPayments = (limit: number = 5) => {
  return mockPayments
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
};

export const getUserAnalytics = () => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

  return mockUsers.map(user => {
    const userStudents = mockStudents.filter(s => s.registered_by === user.id);
    const userPayments = mockPayments.filter(p => p.recorded_by === user.id);

    const registeredToday = userStudents.filter(s =>
      new Date(s.created_at) >= todayStart
    ).length;

    const registeredThisWeek = userStudents.filter(s =>
      new Date(s.created_at) >= weekStart
    ).length;

    const revenueToday = userPayments
      .filter(p => new Date(p.payment_date) >= todayStart)
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      user_id: user.id,
      full_name: user.full_name,
      registeredToday,
      revenueToday,
      registeredThisWeek,
      totalRevenue: userPayments.reduce((sum, p) => sum + p.amount, 0)
    };
  });
};