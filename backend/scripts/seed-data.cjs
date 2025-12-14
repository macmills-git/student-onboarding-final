// Load environment variables first
require("dotenv").config();

const { sequelize, User, Student, Payment } = require("../models");
const { logger } = require("../config/database");

const seedData = async () => {
  try {
    logger.info("🌱 Starting database seeding...");

    // Ensure database is synced
    await sequelize.sync({ force: false });

    // Check if we already have sample data
    const studentCount = await Student.count();
    if (studentCount > 0) {
      logger.info("📊 Sample data already exists, clearing and re-seeding...");
      // Delete in correct order to avoid foreign key constraints
      await Payment.destroy({ where: {} });
      await Student.destroy({ where: {} });
    }

    // Get admin and clerk users
    const adminUser = await User.findOne({ where: { username: "admin" } });
    const clerkUser = await User.findOne({ where: { username: "clerk" } });

    if (!adminUser || !clerkUser) {
      logger.error("❌ Default users not found. Please run migration first.");
      return;
    }

    // Create sample students
    const sampleStudents = [
      {
        student_id: "11234567",
        name: "John Doe",
        email: "john.doe@st.ug.edu.gh",
        gender: "Male",
        nationality: "Ghanaian",
        phone_number: "+233 24 123 4567",
        course: "Computer Science",
        level: "200",
        study_mode: "regular",
        residential_status: "resident",
        registered_by: adminUser.id,
      },
      {
        student_id: "11234568",
        name: "Jane Smith",
        email: "jane.smith@st.ug.edu.gh",
        gender: "Female",
        nationality: "Ghanaian",
        phone_number: "+233 24 234 5678",
        course: "Information Technology",
        level: "300",
        study_mode: "regular",
        residential_status: "non-resident",
        registered_by: clerkUser.id,
      },
      {
        student_id: "11234569",
        name: "Michael Johnson",
        email: "michael.johnson@st.ug.edu.gh",
        gender: "Male",
        nationality: "Nigerian",
        phone_number: "+233 24 345 6789",
        course: "Mathematical Science",
        level: "100",
        study_mode: "regular",
        residential_status: "resident",
        registered_by: adminUser.id,
      },
      {
        student_id: "11234570",
        name: "Sarah Wilson",
        email: "sarah.wilson@st.ug.edu.gh",
        gender: "Female",
        nationality: "Ghanaian",
        phone_number: "+233 24 456 7890",
        course: "Actuarial Science",
        level: "400",
        study_mode: "regular",
        residential_status: "non-resident",
        registered_by: clerkUser.id,
      },
      {
        student_id: "11234571",
        name: "David Brown",
        email: "david.brown@st.ug.edu.gh",
        gender: "Male",
        nationality: "Ghanaian",
        phone_number: "+233 24 567 8901",
        course: "Physical Science",
        level: "200",
        study_mode: "distance",
        residential_status: "non-resident",
        registered_by: adminUser.id,
      },
    ];

    // Create students
    const createdStudents = [];
    for (const studentData of sampleStudents) {
      const student = await Student.create(studentData);
      createdStudents.push(student);
      logger.info(
        `✅ Created student: ${student.name} (${student.student_id})`
      );
    }

    // Create sample payments
    const samplePayments = [
      {
        student_id: createdStudents[0].id,
        amount: 1500.0,
        payment_method: "momo",
        reference_id: "MTN123456789",
        operator: "MTN",
        recorded_by: adminUser.id,
        payment_date: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(), // 2 days ago
      },
      {
        student_id: createdStudents[1].id,
        amount: 2000.0,
        payment_method: "cash",
        reference_id: "CASH001",
        operator: null,
        recorded_by: clerkUser.id,
        payment_date: new Date(
          Date.now() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(), // 1 day ago
      },
      {
        student_id: createdStudents[2].id,
        amount: 1800.0,
        payment_method: "momo",
        reference_id: "VOD987654321",
        operator: "Vodafone",
        recorded_by: adminUser.id,
        payment_date: new Date().toISOString(), // Today
      },
      {
        student_id: createdStudents[0].id,
        amount: 500.0,
        payment_method: "bank_transfer",
        reference_id: "BANK001234",
        operator: "GCB Bank",
        recorded_by: clerkUser.id,
        payment_date: new Date().toISOString(), // Today
      },
      {
        student_id: createdStudents[3].id,
        amount: 2500.0,
        payment_method: "momo",
        reference_id: "AIRTELTIGO123",
        operator: "AirtelTigo",
        recorded_by: adminUser.id,
        payment_date: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000
        ).toISOString(), // 3 days ago
      },
    ];

    // Create payments
    for (const paymentData of samplePayments) {
      const payment = await Payment.create(paymentData);
      const student = createdStudents.find((s) => s.id === payment.student_id);
      logger.info(
        `✅ Created payment: GH₵${payment.amount} for ${student.name} via ${payment.payment_method}`
      );
    }

    // Summary
    const totalStudents = await Student.count();
    const totalPayments = await Payment.count();
    const totalRevenue = await Payment.sum("amount");

    logger.info("🎉 Database seeding completed successfully!");
    logger.info(`📊 Summary:`);
    logger.info(`   - Students created: ${totalStudents}`);
    logger.info(`   - Payments created: ${totalPayments}`);
    logger.info(`   - Total revenue: GH₵${totalRevenue}`);
    logger.info(
      `   - Courses: Computer Science, Information Technology, Mathematical Science, Actuarial Science, Physical Science`
    );
    logger.info(`   - Payment methods: Mobile Money, Cash, Bank Transfer`);
  } catch (error) {
    logger.error("❌ Database seeding failed:", error);
    throw error;
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedData()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Seeding failed:", error);
      process.exit(1);
    });
}

module.exports = seedData;
