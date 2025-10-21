const express = require('express');
const router = express.Router();

// Mock students data (to be replaced with database)
let mockStudents = [
  {
    id: '1',
    student_id: '11234567',
    name: 'John Doe',
    email: 'john.doe@st.ug.edu.gh',
    gender: 'Male',
    nationality: 'Ghanaian',
    phone_number: '+233 24 123 4567',
    course: 'Computer Science',
    level: '200',
    study_mode: 'regular',
    residential_status: 'resident',
    registered_by: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// GET /api/students - Get all students
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockStudents,
      count: mockStudents.length
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// GET /api/students/:id - Get single student
router.get('/:id', (req, res) => {
  try {
    const student = mockStudents.find(s => s.id === req.params.id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// POST /api/students - Create new student
router.post('/', (req, res) => {
  try {
    const {
      student_id,
      name,
      email,
      gender,
      nationality,
      phone_number,
      course,
      level,
      study_mode,
      residential_status
    } = req.body;

    // Basic validation
    if (!student_id || !name || !email || !course || !level) {
      return res.status(400).json({ 
        error: 'Missing required fields: student_id, name, email, course, level' 
      });
    }

    // Check if student_id already exists
    const existingStudent = mockStudents.find(s => s.student_id === student_id);
    if (existingStudent) {
      return res.status(409).json({ error: 'Student ID already exists' });
    }

    // Create new student
    const newStudent = {
      id: (mockStudents.length + 1).toString(),
      student_id,
      name,
      email,
      gender,
      nationality,
      phone_number,
      course,
      level,
      study_mode,
      residential_status,
      registered_by: '1', // TODO: Get from JWT token
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockStudents.push(newStudent);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: newStudent
    });

  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// PUT /api/students/:id - Update student
router.put('/:id', (req, res) => {
  try {
    const studentIndex = mockStudents.findIndex(s => s.id === req.params.id);
    
    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update student
    mockStudents[studentIndex] = {
      ...mockStudents[studentIndex],
      ...req.body,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: mockStudents[studentIndex]
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// DELETE /api/students/:id - Delete student
router.delete('/:id', (req, res) => {
  try {
    const studentIndex = mockStudents.findIndex(s => s.id === req.params.id);
    
    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }

    mockStudents.splice(studentIndex, 1);

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;