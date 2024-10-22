const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
app.use(express.static('public'));

// Body-parser middleware to handle form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Connect to MongoDB Atlas (replace <db_password> with your password)
const uri = "mongodb+srv://leanh962k3:Hoanganh96@cluster0.hbagd.mongodb.net/studentDB";
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  id: String,
  age: Number,
  numberphone: String
});

// Define Student Model
const Student = mongoose.model('Student', studentSchema);

// Home route: Display the list of students
app.get('/', async (req, res) => {
  try {
    const students = await Student.find({});
    res.render('index', { studentsList: students });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving students.');
  }
});

// Route to add a new student
app.post('/add-student', async (req, res) => {
  const newStudent = new Student({
    name: req.body.name,
    id: req.body.id,
    age: req.body.age,
    numberphone: req.body.numberphone
  });
  
  try {
    await newStudent.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error adding student.');
  }
});

// Route to delete a student by ID
app.post('/delete-student', async (req, res) => {
  const studentId = req.body.studentId;

  try {
    await Student.deleteOne({ id: studentId });
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting student.');
  }
});

// Route to update a student
app.post('/update-student', async (req, res) => {
  const studentId = req.body.studentId;
  const updatedData = {
    name: req.body.name,
    age: req.body.age,
    numberphone: req.body.numberphone
  };

  try {
    await Student.updateOne({ id: studentId }, updatedData);
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error updating student.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
