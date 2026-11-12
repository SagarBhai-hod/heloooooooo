const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let students = [];

app.get('/students', (req, res) => {
  if (students.length == 0){
    return res.status(404).json({message:"No student resources"});
  }
  return res.status(200).json(students);
});

app.get('/students/:id', (req, res) => {
  const stId = String(req.params.id);
  const student = students.find(s => String(s.id) === stId);

  if (!student) {
    return res.status(404).json({ message: "No student resource available with specified id" });
  }

  return res.status(200).json(student);
});

app.post('/students', (req, res) => {
  const { id, name, sroll, email } = req.body;

  if (!id || !name) {
    return res.status(400).json({ message: "ID and name are required" });
  }

  const existingStudent = students.find(s => String(s.id) === String(id));
  if (existingStudent) {
    return res.status(409).json({ message: "Student with this ID already exists" });
  }

  const newStudent = {
    id: String(id),
    name,
    sroll: sroll || null,
    email: email || null
  };

  students.push(newStudent);
  return res.status(201).json(newStudent);
});

app.put('/students/:id', (req, res) => {
  const stId = String(req.params.id);
  const studentIndex = students.findIndex(s => String(s.id) === stId);

  if (studentIndex === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const { name, sroll, email } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required for update" });
  }

  students[studentIndex] = {
    ...students[studentIndex],
    name,
    sroll: sroll !== undefined ? sroll : students[studentIndex].sroll,
    email: email !== undefined ? email : students[studentIndex].email
  };

  return res.status(200).json(students[studentIndex]);
});

app.delete('/students/:id', (req, res) => {
  const stId = String(req.params.id);
  const initialLength = students.length;

  students = students.filter(s => String(s.id) !== stId);

  if (students.length === initialLength) {
    return res.status(404).json({ message: "Student not found" });
  }

  return res.status(200).json({ message: "Student deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
