import { useEffect, useState, useRef } from 'react';
import { Search, Filter, Eye, Edit, ChevronDown, Users, Trash2, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { studentsApi, Student } from '../lib/api';

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
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterAndSortStudents();
  }, [students, searchQuery, sortBy, filterCourse]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchStudents = async () => {
    try {
      // Use real API to fetch students
      const response = await studentsApi.getAll();

      if (response.success && response.data) {
        console.log('Loading students from API:', response.data.length);
        setStudents(response.data);
      } else {
        console.error('Failed to fetch students:', response.error);
        setStudents([]);
      }
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
      // Update the student via API
      const response = await studentsApi.update(student.id, student);

      if (response.success && response.data) {
        alert(`Student ${student.name} updated successfully!`);

        // Update state directly to trigger re-render
        setStudents(students.map(s =>
          s.id === student.id ? response.data : s
        ));

        setIsEditing(false);
        setSelectedStudent(null);
      } else {
        alert(`Failed to update student: ${response.error}`);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student. Please try again.');
    }
  };

  const handleDelete = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete student via API
      const response = await studentsApi.delete(studentId);

      if (response.success) {
        alert(`Student ${studentName} deleted successfully!`);

        // Update state directly to trigger re-render
        setStudents(students.filter(s => s.id !== studentId));
      } else {
        alert(`Failed to delete student: ${response.error}`);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student. Please try again.');
    }
  };

  const courses = Array.from(new Set(students.map((s) => s.course || 'Unknown')));

  // Export functions
  const exportToCSV = () => {
    const isFiltered = searchQuery || filterCourse !== 'all';
    const exportType = isFiltered ? 'Filtered' : 'Complete';

    // Calculate comprehensive analytics based on filtered data
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Use filtered data for analytics when filters are applied
    const analyticsSource = isFiltered ? filteredStudents : students;

    const todayRegistrations = analyticsSource.filter(s => new Date(s.created_at) >= todayStart);
    const weekRegistrations = analyticsSource.filter(s => new Date(s.created_at) >= weekStart);
    const monthRegistrations = analyticsSource.filter(s => new Date(s.created_at) >= monthStart);

    // Generate daily breakdown for the last 7 days
    const dailyBreakdown = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayRegistrations = students.filter(s => {
        const regDate = new Date(s.created_at);
        return regDate >= dayStart && regDate < dayEnd;
      });

      const dayMale = dayRegistrations.filter(s => s.gender === 'Male').length;
      const dayFemale = dayRegistrations.filter(s => s.gender === 'Female').length;
      const dayRegular = dayRegistrations.filter(s => s.study_mode === 'regular').length;
      const dayDistance = dayRegistrations.filter(s => s.study_mode === 'distance').length;

      dailyBreakdown.push({
        date: date.toLocaleDateString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        registrations: dayRegistrations.length,
        male: dayMale,
        female: dayFemale,
        regular: dayRegular,
        distance: dayDistance,
        isToday: i === 0
      });
    }

    // Generate weekly breakdown for the last 4 weeks
    const weeklyBreakdown = [];
    for (let i = 3; i >= 0; i--) {
      const weekEndDate = new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekStartDate = new Date(weekEndDate.getTime() - 6 * 24 * 60 * 60 * 1000);

      const weekRegs = students.filter(s => {
        const regDate = new Date(s.created_at);
        return regDate >= weekStartDate && regDate <= weekEndDate;
      });

      const weekMale = weekRegs.filter(s => s.gender === 'Male').length;
      const weekFemale = weekRegs.filter(s => s.gender === 'Female').length;
      const weekRegular = weekRegs.filter(s => s.study_mode === 'regular').length;
      const weekDistance = weekRegs.filter(s => s.study_mode === 'distance').length;

      weeklyBreakdown.push({
        weekRange: `${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()}`,
        registrations: weekRegs.length,
        male: weekMale,
        female: weekFemale,
        regular: weekRegular,
        distance: weekDistance,
        dailyAverage: Math.round(weekRegs.length / 7 * 10) / 10,
        isCurrentWeek: i === 0
      });
    }

    // Course enrollment trends
    const courseAnalytics = courses.map(course => {
      const courseStudents = analyticsSource.filter(s => s.course === course);
      const courseMale = courseStudents.filter(s => s.gender === 'Male').length;
      const courseFemale = courseStudents.filter(s => s.gender === 'Female').length;
      const courseRegular = courseStudents.filter(s => s.study_mode === 'regular').length;
      const courseDistance = courseStudents.filter(s => s.study_mode === 'distance').length;
      const courseRecentWeek = courseStudents.filter(s => new Date(s.created_at) >= weekStart).length;

      return {
        course,
        total: courseStudents.length,
        male: courseMale,
        female: courseFemale,
        regular: courseRegular,
        distance: courseDistance,
        recentWeek: courseRecentWeek,
        percentage: analyticsSource.length > 0 ? Math.round((courseStudents.length / analyticsSource.length) * 100) : 0
      };
    });

    // Create comprehensive header with analytics
    const exportInfo = [
      `COMPSSA Students Export - ${exportType}`,
      `Export Date: ${new Date().toLocaleDateString()}`,
      `Export Time: ${new Date().toLocaleTimeString()}`,
      '',
      '=== STUDENT ANALYTICS ===',
      `Total Students: ${students.length}`,
      `Exported Records: ${filteredStudents.length}${isFiltered ? ` (filtered from ${students.length} total)` : ''}`,
      `Male Students: ${analytics.maleStudents} (${analyticsSource.length > 0 ? Math.round((analytics.maleStudents / analyticsSource.length) * 100) : 0}%)`,
      `Female Students: ${analytics.femaleStudents} (${analyticsSource.length > 0 ? Math.round((analytics.femaleStudents / analyticsSource.length) * 100) : 0}%)`,
      `Regular Students: ${analytics.regularStudents}`,
      `Distance Students: ${analytics.distanceStudents}`,
      `City Campus Students: ${analytics.cityStudents}`,
      `Resident Students: ${analytics.residentStudents}`,
      `Non-Resident Students: ${analytics.nonResidentStudents}`,
      '',
      '=== DAILY REGISTRATIONS (LAST 7 DAYS) ===',
      ...dailyBreakdown.map(day => [
        `${day.dayName} (${day.date})${day.isToday ? ' - TODAY' : ''}`,
        `  New Registrations: ${day.registrations}`,
        `  Male: ${day.male}, Female: ${day.female}`,
        `  Regular: ${day.regular}, Distance: ${day.distance}`,
        ''
      ]).flat(),
      '=== WEEKLY REGISTRATIONS (LAST 4 WEEKS) ===',
      ...weeklyBreakdown.map((week, index) => [
        `Week ${index + 1}: ${week.weekRange}${week.isCurrentWeek ? ' - CURRENT WEEK' : ''}`,
        `  New Registrations: ${week.registrations}`,
        `  Male: ${week.male}, Female: ${week.female}`,
        `  Regular: ${week.regular}, Distance: ${week.distance}`,
        `  Daily Average: ${week.dailyAverage}`,
        ''
      ]).flat(),
      '=== COURSE ENROLLMENT ANALYSIS ===',
      ...courseAnalytics.map(course => [
        `${course.course}:`,
        `  Total Enrolled: ${course.total} (${course.percentage}% of all students)`,
        `  Gender Split: ${course.male} Male, ${course.female} Female`,
        `  Study Mode: ${course.regular} Regular, ${course.distance} Distance`,
        `  Recent Week Registrations: ${course.recentWeek}`,
        ''
      ]).flat(),
      '=== TODAY\'S SUMMARY ===',
      `Today's Registrations: ${todayRegistrations.length}`,
      `This Week's Registrations: ${weekRegistrations.length}`,
      `This Month's Registrations: ${monthRegistrations.length}`,
      `Weekly Average: ${Math.round(weekRegistrations.length / 7 * 10) / 10} per day`,
      '',
      '=== LEVEL DISTRIBUTION ===',
      ...analytics.levelDistribution.map(level => `Level ${level.level}: ${level.count} students`),
      '',
      ...(searchQuery ? [`Search Filter Applied: "${searchQuery}"`] : []),
      ...(filterCourse !== 'all' ? [`Course Filter Applied: ${filterCourse}`] : []),
      ...(sortBy !== 'date' ? [`Sorted By: ${sortBy === 'name' ? 'Name (A-Z)' : 'Course'}`] : []),
      '',
      '=== DETAILED STUDENT DATA ===',
    ];

    const csvHeaders = [
      'Student ID',
      'Name',
      'Email',
      'Gender',
      'Nationality',
      'Phone',
      'Course',
      'Level',
      'Study Mode',
      'Residential Status',
      'Registration Date',
      'Registration Time',
      'Days Since Registration'
    ];

    const csvData = filteredStudents.map(student => {
      const regDate = new Date(student.created_at);
      const daysSince = Math.floor((today.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));

      return [
        student.student_id,
        student.name,
        student.email,
        student.gender,
        student.nationality,
        student.phone_number,
        student.course,
        student.level,
        student.study_mode,
        student.residential_status,
        regDate.toLocaleDateString(),
        regDate.toLocaleTimeString(),
        daysSince
      ];
    });

    // Add summary section at the end
    const summarySection = [
      '',
      '=== EXPORT SUMMARY ===',
      `Total Students Exported: ${filteredStudents.length}`,
      `Export Generated: ${new Date().toLocaleString()}`,
      `System: COMPSSA Student Management System`,
      `Report Type: Complete Student Records with Registration Analytics`,
      `Filter Status: ${isFiltered ? 'Filtered Results' : 'Complete Database'}`,
      `Data Accuracy: Live data as of export time`,
      ''
    ];

    const csvContent = [
      ...exportInfo,
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(',')),
      ...summarySection
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);

    const filename = isFiltered ?
      `students_filtered_export_${new Date().toISOString().split('T')[0]}.csv` :
      `students_complete_export_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const isFiltered = searchQuery || filterCourse !== 'all';
    const exportType = isFiltered ? 'Filtered Students List' : 'Complete Students List';

    // Calculate comprehensive analytics based on filtered data (same as CSV)
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Use filtered data for analytics when filters are applied
    const analyticsSource = isFiltered ? filteredStudents : students;

    const todayRegistrations = analyticsSource.filter(s => new Date(s.created_at) >= todayStart);
    const weekRegistrations = analyticsSource.filter(s => new Date(s.created_at) >= weekStart);
    const monthRegistrations = analyticsSource.filter(s => new Date(s.created_at) >= monthStart);

    // Generate daily breakdown for the last 7 days
    const dailyBreakdown = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayRegistrations = students.filter(s => {
        const regDate = new Date(s.created_at);
        return regDate >= dayStart && regDate < dayEnd;
      });

      const dayMale = dayRegistrations.filter(s => s.gender === 'Male').length;
      const dayFemale = dayRegistrations.filter(s => s.gender === 'Female').length;
      const dayRegular = dayRegistrations.filter(s => s.study_mode === 'regular').length;
      const dayDistance = dayRegistrations.filter(s => s.study_mode === 'distance').length;

      dailyBreakdown.push({
        date: date.toLocaleDateString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        registrations: dayRegistrations.length,
        male: dayMale,
        female: dayFemale,
        regular: dayRegular,
        distance: dayDistance,
        isToday: i === 0
      });
    }

    // Generate weekly breakdown for the last 4 weeks
    const weeklyBreakdown = [];
    for (let i = 3; i >= 0; i--) {
      const weekEndDate = new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekStartDate = new Date(weekEndDate.getTime() - 6 * 24 * 60 * 60 * 1000);

      const weekRegs = students.filter(s => {
        const regDate = new Date(s.created_at);
        return regDate >= weekStartDate && regDate <= weekEndDate;
      });

      const weekMale = weekRegs.filter(s => s.gender === 'Male').length;
      const weekFemale = weekRegs.filter(s => s.gender === 'Female').length;
      const weekRegular = weekRegs.filter(s => s.study_mode === 'regular').length;
      const weekDistance = weekRegs.filter(s => s.study_mode === 'distance').length;

      weeklyBreakdown.push({
        weekRange: `${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()}`,
        registrations: weekRegs.length,
        male: weekMale,
        female: weekFemale,
        regular: weekRegular,
        distance: weekDistance,
        dailyAverage: Math.round(weekRegs.length / 7 * 10) / 10,
        isCurrentWeek: i === 0
      });
    }

    // Course enrollment analytics
    const courseAnalytics = courses.map(course => {
      const courseStudents = analyticsSource.filter(s => s.course === course);
      const courseMale = courseStudents.filter(s => s.gender === 'Male').length;
      const courseFemale = courseStudents.filter(s => s.gender === 'Female').length;
      const courseRegular = courseStudents.filter(s => s.study_mode === 'regular').length;
      const courseDistance = courseStudents.filter(s => s.study_mode === 'distance').length;

      return {
        course,
        total: courseStudents.length,
        male: courseMale,
        female: courseFemale,
        regular: courseRegular,
        distance: courseDistance,
        percentage: analyticsSource.length > 0 ? Math.round((courseStudents.length / analyticsSource.length) * 100) : 0
      };
    });

    // Build filter info
    let filterInfo = '';
    if (isFiltered) {
      const filters = [];
      if (searchQuery) filters.push(`Search: "${searchQuery}"`);
      if (filterCourse !== 'all') filters.push(`Course: ${filterCourse}`);
      if (sortBy !== 'date') filters.push(`Sort: ${sortBy === 'name' ? 'Name (A-Z)' : 'Course'}`);
      filterInfo = filters.length > 0 ? `<div class="filter-info">Filters Applied: ${filters.join(' • ')}</div>` : '';
    }

    // Create comprehensive HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${exportType}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
          h1 { color: #1f2937; text-align: center; margin-bottom: 10px; font-size: 24px; }
          h2 { color: #374151; font-size: 16px; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 11px; }
          th { background-color: #f3f4f6; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .header { text-align: center; margin-bottom: 25px; }
          .export-info { font-size: 13px; color: #374151; margin-bottom: 5px; }
          .export-type { font-size: 16px; color: #1f2937; font-weight: bold; margin-bottom: 10px; }
          .filter-info { font-size: 12px; color: #6b7280; margin-bottom: 10px; font-style: italic; }
          .analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .analytics-card { border: 1px solid #d1d5db; padding: 15px; border-radius: 8px; background-color: #f9fafb; }
          .analytics-title { font-weight: bold; color: #374151; margin-bottom: 10px; font-size: 14px; }
          .stat-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .stat-label { color: #6b7280; }
          .stat-value { font-weight: bold; color: #1f2937; }
          .page-break { page-break-before: always; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>COMPSSA - ${exportType}</h1>
          <div class="export-type">🎓 Complete Export with Analytics</div>
          <div class="export-info">
            Export Date: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}<br>
            Generated by COMPSSA Student Management System
          </div>
          ${filterInfo}
        </div>

        <div class="analytics-grid">
          <div class="analytics-card">
            <div class="analytics-title">📊 Student Summary</div>
            <div class="stat-row">
              <span class="stat-label">Total Students:</span>
              <span class="stat-value">${students.length}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Exported Records:</span>
              <span class="stat-value">${filteredStudents.length}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Male Students:</span>
              <span class="stat-value">${analytics.maleStudents} (${analyticsSource.length > 0 ? Math.round((analytics.maleStudents / analyticsSource.length) * 100) : 0}%)</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Female Students:</span>
              <span class="stat-value">${analytics.femaleStudents} (${analyticsSource.length > 0 ? Math.round((analytics.femaleStudents / analyticsSource.length) * 100) : 0}%)</span>
            </div>
          </div>

          <div class="analytics-card">
            <div class="analytics-title">🎯 Study Modes</div>
            <div class="stat-row">
              <span class="stat-label">Regular Students:</span>
              <span class="stat-value">${analytics.regularStudents}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Distance Students:</span>
              <span class="stat-value">${analytics.distanceStudents}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">City Campus:</span>
              <span class="stat-value">${analytics.cityStudents}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Resident Students:</span>
              <span class="stat-value">${analytics.residentStudents}</span>
            </div>
          </div>
        </div>

        <h2>📈 Course Enrollment Analysis</h2>
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Total Students</th>
              <th>Percentage</th>
              <th>Male</th>
              <th>Female</th>
              <th>Regular</th>
              <th>Distance</th>
            </tr>
          </thead>
          <tbody>
            ${courseAnalytics.map(course => `
              <tr>
                <td>${course.course}</td>
                <td>${course.total}</td>
                <td>${course.percentage}%</td>
                <td>${course.male}</td>
                <td>${course.female}</td>
                <td>${course.regular}</td>
                <td>${course.distance}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>📅 Daily Registration Records (Last 7 Days)</h2>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>New Registrations</th>
              <th>Male</th>
              <th>Female</th>
              <th>Regular</th>
              <th>Distance</th>
            </tr>
          </thead>
          <tbody>
            ${dailyBreakdown.map(day => `
              <tr style="${day.isToday ? 'background-color: #dbeafe; font-weight: bold;' : ''}">
                <td>${day.dayName}${day.isToday ? ' (TODAY)' : ''}</td>
                <td>${day.date}</td>
                <td>${day.registrations}</td>
                <td>${day.male}</td>
                <td>${day.female}</td>
                <td>${day.regular}</td>
                <td>${day.distance}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>📊 Weekly Registration Records (Last 4 Weeks)</h2>
        <table>
          <thead>
            <tr>
              <th>Week Period</th>
              <th>New Registrations</th>
              <th>Male</th>
              <th>Female</th>
              <th>Regular</th>
              <th>Distance</th>
              <th>Daily Average</th>
            </tr>
          </thead>
          <tbody>
            ${weeklyBreakdown.map((week, index) => `
              <tr style="${week.isCurrentWeek ? 'background-color: #dcfce7; font-weight: bold;' : ''}">
                <td>Week ${index + 1}: ${week.weekRange}${week.isCurrentWeek ? ' (CURRENT)' : ''}</td>
                <td>${week.registrations}</td>
                <td>${week.male}</td>
                <td>${week.female}</td>
                <td>${week.regular}</td>
                <td>${week.distance}</td>
                <td>${week.dailyAverage}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>📈 Registration Summary</h2>
        <div class="analytics-grid">
          <div class="analytics-card">
            <div class="analytics-title">🎯 Recent Activity</div>
            <div class="stat-row">
              <span class="stat-label">Today's Registrations:</span>
              <span class="stat-value">${todayRegistrations.length}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">This Week's Registrations:</span>
              <span class="stat-value">${weekRegistrations.length}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">This Month's Registrations:</span>
              <span class="stat-value">${monthRegistrations.length}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Weekly Average:</span>
              <span class="stat-value">${Math.round(weekRegistrations.length / 7 * 10) / 10} per day</span>
            </div>
          </div>
          <div class="analytics-card">
            <div class="analytics-title">📚 Level Distribution</div>
            ${analytics.levelDistribution.map(level => `
              <div class="stat-row">
                <span class="stat-label">Level ${level.level}:</span>
                <span class="stat-value">${level.count} students</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="page-break"></div>
        <h2>🎓 Detailed Student Records</h2>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Level</th>
              <th>Gender</th>
              <th>Study Mode</th>
              <th>Residential</th>
              <th>Registration Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredStudents.map(student => `
              <tr>
                <td>${student.student_id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.course}</td>
                <td>${student.level}</td>
                <td>${student.gender}</td>
                <td>${student.study_mode}</td>
                <td>${student.residential_status}</td>
                <td>${new Date(student.created_at).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 11px;">
          <p>This report was generated by COMPSSA Student Management System</p>
          <p>For questions about this data, contact the system administrator</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  // Calculate analytics from filtered student data (reflects current filters)
  const isFiltered = searchQuery || filterCourse !== 'all';
  const dataSource = isFiltered ? filteredStudents : students;

  const analytics = {
    totalStudents: dataSource?.length || 0,
    maleStudents: dataSource?.filter(s => s.gender === 'Male')?.length || 0,
    femaleStudents: dataSource?.filter(s => s.gender === 'Female')?.length || 0,
    regularStudents: dataSource?.filter(s => s.study_mode === 'regular')?.length || 0,
    distanceStudents: dataSource?.filter(s => s.study_mode === 'distance')?.length || 0,
    cityStudents: dataSource?.filter(s => s.study_mode === 'city_campus')?.length || 0,
    residentStudents: dataSource?.filter(s => s.residential_status === 'resident')?.length || 0,
    nonResidentStudents: dataSource?.filter(s => s.residential_status === 'non_resident')?.length || 0,
    courseDistribution: courses.map(course => ({
      course,
      count: dataSource?.filter(s => s.course === course)?.length || 0
    })),
    levelDistribution: ['100', '200', '300', '400'].map(level => ({
      level,
      count: dataSource?.filter(s => s.level === level)?.length || 0
    }))
  };

  // Calculate full database analytics for comparison (when filtered)
  const fullAnalytics = isFiltered ? {
    totalStudents: students?.length || 0,
    maleStudents: students?.filter(s => s.gender === 'Male')?.length || 0,
    femaleStudents: students?.filter(s => s.gender === 'Female')?.length || 0,
    regularStudents: students?.filter(s => s.study_mode === 'regular')?.length || 0,
    distanceStudents: students?.filter(s => s.study_mode === 'distance')?.length || 0,
    cityStudents: students?.filter(s => s.study_mode === 'city_campus')?.length || 0,
    residentStudents: students?.filter(s => s.residential_status === 'resident')?.length || 0,
    nonResidentStudents: students?.filter(s => s.residential_status === 'non_resident')?.length || 0,
  } : null;

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
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1 md:mb-2">
            Students
            {(searchQuery || filterCourse !== 'all' || sortBy !== 'date') && (
              <span className="text-lg md:text-xl font-normal text-gray-500 dark:text-gray-400 ml-2">
                - {sortBy === 'date' ? 'Recent First' : sortBy === 'name' ? 'A-Z' : 'By Course'}
                {filterCourse !== 'all' && ` • ${filterCourse}`}
                {searchQuery && ` • "${searchQuery}"`}
              </span>
            )}
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            {(searchQuery || filterCourse !== 'all') ? (
              <>
                Showing {filteredStudents.length} filtered result{filteredStudents.length !== 1 ? 's' : ''}
                {searchQuery && filterCourse !== 'all' ?
                  ` matching "${searchQuery}" in ${filterCourse}` :
                  searchQuery ? ` matching "${searchQuery}"` :
                    ` from ${filterCourse}`
                }
              </>
            ) : (
              <>Manage and view all registered students ({students.length} total)</>
            )}
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Export Dropdown */}
          <div className="relative" ref={exportDropdownRef}>
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className={`w-4 h-4 transition-transform ${showExportDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showExportDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  <button
                    onClick={() => {
                      exportToCSV();
                      setShowExportDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-500" />
                    <div className="text-left">
                      <div className="font-medium">Export as CSV</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Spreadsheet format</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      exportToPDF();
                      setShowExportDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-red-500" />
                    <div className="text-left">
                      <div className="font-medium">Export as PDF</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Printable document</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 px-3 md:px-4 py-2 md:py-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {(searchQuery || filterCourse !== 'all') ? 'Filtered Students' : 'Total Students'}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {(searchQuery || filterCourse !== 'all') ? (
                <>{filteredStudents.length} <span className="text-lg text-gray-500 dark:text-gray-400">of {students.length}</span></>
              ) : (
                students.length
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Student Analytics */}
      {isFiltered && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              Analytics below reflect filtered data ({filteredStudents.length} of {students.length} students)
              {fullAnalytics && (
                <span className="ml-2 text-xs">
                  • Full database: {fullAnalytics.maleStudents}M/{fullAnalytics.femaleStudents}F
                </span>
              )}
            </p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-right">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-base md:text-xl font-semibold text-gray-800 dark:text-white">
              Gender Distribution
              {isFiltered && (
                <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                  Filtered
                </span>
              )}
            </h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm md:text-lg">
              <span className="text-gray-600 dark:text-gray-400">Male</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.maleStudents}</span>
            </div>
            <div className="flex justify-between text-sm md:text-lg">
              <span className="text-gray-600 dark:text-gray-400">Female</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.femaleStudents}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-right">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-base md:text-xl font-semibold text-gray-800 dark:text-white">Study Mode</h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600 dark:text-gray-400">Regular</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.regularStudents}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600 dark:text-gray-400">Distance</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.distanceStudents}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600 dark:text-gray-400">City Campus</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.cityStudents}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Residential Status</h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600 dark:text-gray-400">Resident</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.residentStudents}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600 dark:text-gray-400">Non-Resident</span>
              <span className="font-medium text-gray-800 dark:text-white">{analytics.nonResidentStudents}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Level Distribution</h3>
          </div>
          <div className="space-y-1">
            {analytics.levelDistribution.map((level) => (
              <div key={level.level} className="flex justify-between text-lg">
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

        {/* Filter Status */}
        {(searchQuery || filterCourse !== 'all' || sortBy !== 'date') && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active filters:</span>

              {sortBy !== 'date' && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                  Sort: {sortBy === 'name' ? 'Name (A-Z)' : sortBy === 'course' ? 'Course' : 'Recent First'}
                </span>
              )}

              {filterCourse !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                  Course: {filterCourse}
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                  Search: "{searchQuery}"
                </span>
              )}

              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterCourse('all');
                  setSortBy('date');
                }}
                className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Export will include {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-base text-gray-500 dark:text-gray-400">No students found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-base font-semibold text-gray-700 dark:text-gray-300">Student</th>
                  <th className="text-left py-3 px-4 text-base font-semibold text-gray-700 dark:text-gray-300">Student ID</th>
                  <th className="text-left py-3 px-4 text-base font-semibold text-gray-700 dark:text-gray-300">Course</th>
                  <th className="text-left py-3 px-4 text-base font-semibold text-gray-700 dark:text-gray-300">Level</th>
                  <th className="text-left py-3 px-4 text-base font-semibold text-gray-700 dark:text-gray-300">Study Mode</th>
                  <th className="text-right py-3 px-4 text-base font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(showAllStudents ? filteredStudents : filteredStudents.slice(0, 10)).map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-base">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-gray-800 dark:text-white">{student.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-base text-gray-800 dark:text-white">{student.student_id}</td>
                    <td className="py-3 px-4 text-base text-gray-800 dark:text-white">{student.course}</td>
                    <td className="py-3 px-4 text-base text-gray-800 dark:text-white">Level {student.level}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        {student.study_mode === 'regular' ? 'Regular' : student.study_mode === 'distance' ? 'Distance' : 'City Campus'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-all flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsEditing(true);
                          }}
                          className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          className="px-3 py-1.5 text-sm bg-transparent text-rose-700 dark:text-rose-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center gap-1 border border-gray-300 dark:border-gray-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredStudents.length > 10 && (
          <div className="text-center pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowAllStudents(!showAllStudents)}
              className="text-base text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              {showAllStudents ? 'View Less' : `View More (${filteredStudents.length - 10} more students)`}
            </button>
          </div>
        )}
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
      )
      }
    </div >
  );
};