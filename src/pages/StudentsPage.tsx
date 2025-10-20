import { useEffect, useState } from 'react';
import { Search, Filter, Eye, Edit, ChevronDown, Users } from 'lucide-react';
import { mockStudents, Student } from '../lib/mockData';

export const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'course'>('date');
  const [filterCourse, setFilterCourse] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAllStudents, setShowAllStudents] = useState(false);


  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterAndSortStudents();
  }, [students, searchQuery, sortBy, filterCourse]);

  const fetchStudents = async () => {
    try {
      // Use centralized mock data
      console.log('Loading students:', mockStudents.length);
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      // Set empty array as fallback
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStudents = () => {
    let filtered = [...students];

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCourse !== 'all') {
      filtered = filtered.filter((s) => s.course === filterCourse);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'course') {
        return a.course.localeCompare(b.course);
      }
      return 0;
    });

    setFilteredStudents(filtered);
  };

  const handleEdit = async (student: Student) => {
    try {
      // Update the student in mock data
      const studentIndex = mockStudents.findIndex(s => s.id === student.id);
      if (studentIndex !== -1) {
        mockStudents[studentIndex] = { ...student, updated_at: new Date().toISOString() };
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      alert(`Student ${student.name} updated successfully!`);

      await fetchStudents();
      setIsEditing(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const courses = Array.from(new Set(students.map((s) => s.course || 'Unknown')));

  // Calculate analytics from student data with safety checks
  const analytics = {
    totalStudents: students?.length || 0,
    maleStudents: students?.filter(s => s.gender === 'Male')?.length || 0,
    femaleStudents: students?.filter(s => s.gender === 'Female')?.length || 0,
    regularStudents: students?.filter(s => s.study_mode === 'regular')?.length || 0,
    distanceStudents: students?.filter(s => s.study_mode === 'distance')?.length || 0,
    cityStudents: students?.filter(s => s.study_mode === 'city_campus')?.length || 0,
    residentStudents: students?.filter(s => s.residential_status === 'resident')?.length || 0,
    nonResidentStudents: students?.filter(s => s.residential_status === 'non_resident')?.length || 0,
    courseDistribution: courses.map(course => ({
      course,
      count: students?.filter(s => s.course === course)?.length || 0
    })),
    levelDistribution: ['100', '200', '300', '400'].map(level => ({
      level,
      count: students?.filter(s => s.level === level)?.length || 0
    }))
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Add error boundary for debugging
  if (!students) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <p className="text-red-600">Error loading students data</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Students</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view all registered students
          </p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/30 px-4 py-3 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {students.length}
          </p>
        </div>
      </div>

      {/* Student Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Gender Distribution</h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Male</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.maleStudents}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Female</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.femaleStudents}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Study Mode</h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Regular</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.regularStudents}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Distance</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.distanceStudents}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">City Campus</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.cityStudents}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Residential Status</h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Resident</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.residentStudents}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Non-Resident</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.nonResidentStudents}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Level Distribution</h3>
          </div>
          <div className="space-y-1">
            {analytics.levelDistribution.map((level) => (
              <div key={level.level} className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Level {level.level}</span>
                <span className="font-medium text-gray-800 dark:text-white">{level.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full pl-6 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="course">Sort by Course</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          {(showAllStudents ? filteredStudents : filteredStudents.slice(0, 3)).map((student) => (
            <div
              key={student.id}
              className="bg-gray-50 dark:bg-gray-900/50 rounded p-3 border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                      {student.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>{student.student_id}</span>
                      <span>•</span>
                      <span>{student.course}</span>
                      <span>•</span>
                      <span>Level {student.level}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-all flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsEditing(true);
                    }}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No students found</p>
            </div>
          )}

          {filteredStudents.length > 3 && (
            <div className="text-center pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAllStudents(!showAllStudents)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                {showAllStudents ? 'View Less' : `View More (${filteredStudents.length - 3} more students)`}
              </button>
            </div>
          )}
        </div>
      </div>



      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {isEditing ? 'Edit Student' : 'Student Details'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={selectedStudent.name}
                      onChange={(e) =>
                        setSelectedStudent({ ...selectedStudent, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={selectedStudent.email}
                      onChange={(e) =>
                        setSelectedStudent({ ...selectedStudent, email: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={selectedStudent.phone_number}
                      onChange={(e) =>
                        setSelectedStudent({ ...selectedStudent, phone_number: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Student ID', value: selectedStudent.student_id },
                    { label: 'Name', value: selectedStudent.name },
                    { label: 'Email', value: selectedStudent.email },
                    { label: 'Phone', value: selectedStudent.phone_number },
                    { label: 'Gender', value: selectedStudent.gender },
                    { label: 'Nationality', value: selectedStudent.nationality },
                    { label: 'Course', value: selectedStudent.course },
                    { label: 'Level', value: selectedStudent.level },
                    { label: 'Study Mode', value: selectedStudent.study_mode },
                    { label: 'Residential Status', value: selectedStudent.residential_status },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{field.label}</p>
                      <p className="font-medium text-gray-800 dark:text-white">{field.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedStudent(null);
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEdit(selectedStudent)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};