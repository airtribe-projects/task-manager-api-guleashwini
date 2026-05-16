const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store loaded from task.json
const taskData = require('./task.json');
let tasks = taskData.tasks;

const VALID_PRIORITIES = ['low', 'medium', 'high'];

// GET /tasks - retrieve all tasks with optional filtering and sorting
// Query params: ?completed=true|false  ?sort=createdAt
app.get('/tasks', (req, res) => {
    let result = [...tasks];

    // Filter by completion status
    if (req.query.completed !== undefined) {
        const completed = req.query.completed === 'true';
        result = result.filter(t => t.completed === completed);
    }

    // Sort by creation date (tasks without createdAt go to the end)
    if (req.query.sort === 'createdAt') {
        result.sort((a, b) => {
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
    }

    res.status(200).json(result);
});

// GET /tasks/priority/:level - retrieve tasks by priority level
app.get('/tasks/priority/:level', (req, res) => {
    const level = req.params.level;
    if (!VALID_PRIORITIES.includes(level)) {
        return res.status(400).json({ error: 'Invalid priority level. Use low, medium, or high.' });
    }
    const result = tasks.filter(t => t.priority === level);
    res.status(200).json(result);
});

// GET /tasks/:id - retrieve a specific task by ID
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
});

// POST /tasks - create a new task
app.post('/tasks', (req, res) => {
    const { title, description, completed, priority } = req.body;
    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Invalid data. title, description, and completed (boolean) are required.' });
    }
    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority. Use low, medium, or high.' });
    }
    const newTask = {
        id: Math.max(...tasks.map(t => t.id), 0) + 1,
        title,
        description,
        completed,
        priority: priority || 'medium',
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /tasks/:id - update an existing task by ID
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const { title, description, completed, priority } = req.body;
    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Invalid data. title, description, and completed (boolean) are required.' });
    }
    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority. Use low, medium, or high.' });
    }
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        description,
        completed,
        ...(priority !== undefined && { priority })
    };
    res.status(200).json(tasks[taskIndex]);
});

// DELETE /tasks/:id - delete a task by ID
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const deleted = tasks.splice(taskIndex, 1);
    res.status(200).json(deleted[0]);
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});


module.exports = app;