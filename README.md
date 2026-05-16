# Task Manager API

A RESTful API for managing tasks, built with Node.js and Express.js. Supports full CRUD operations, input validation, error handling, filtering, sorting, and task priority levels using in-memory data storage.

---

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd task-manager-api-guleashwini
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node app.js
   ```
   The server will start at `http://localhost:3000`.

### Running Tests
Make sure the server is **not** running before executing tests.
```bash
npm test
```

---

## API Endpoints

### Base URL
```
http://localhost:3000
```

---

### GET /tasks
Retrieve all tasks. Supports optional filtering and sorting via query parameters.

| Query Param | Values | Description |
|---|---|---|
| `completed` | `true` / `false` | Filter by completion status |
| `sort` | `createdAt` | Sort by creation date (oldest first) |

**Examples:**
```
GET /tasks
GET /tasks?completed=true
GET /tasks?completed=false
GET /tasks?sort=createdAt
GET /tasks?completed=false&sort=createdAt
```

**Response: 200 OK**
```json
[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true
  }
]
```

---

### GET /tasks/:id
Retrieve a single task by its ID.

**Example:**
```
GET /tasks/1
```

**Response: 200 OK**
```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true
}
```

**Response: 404 Not Found** (ID does not exist)
```json
{ "error": "Task not found" }
```

---

### GET /tasks/priority/:level
Retrieve all tasks with a specific priority level.

| Level | Values |
|---|---|
| `:level` | `low`, `medium`, `high` |

**Example:**
```
GET /tasks/priority/high
```

**Response: 200 OK**
```json
[
  {
    "id": 16,
    "title": "Fix critical bug",
    "description": "Resolve the login issue",
    "completed": false,
    "priority": "high",
    "createdAt": "2026-05-16T10:00:00.000Z"
  }
]
```

**Response: 400 Bad Request** (invalid level)
```json
{ "error": "Invalid priority level. Use low, medium, or high." }
```

---

### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "priority": "high"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | Yes | Cannot be empty |
| `description` | string | Yes | Cannot be empty |
| `completed` | boolean | Yes | Must be `true` or `false` (not a string) |
| `priority` | string | No | `low`, `medium`, or `high`. Defaults to `medium` |

**Response: 201 Created**
```json
{
  "id": 16,
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-05-16T10:00:00.000Z"
}
```

**Response: 400 Bad Request** (missing or invalid fields)
```json
{ "error": "Invalid data. title, description, and completed (boolean) are required." }
```

---

### PUT /tasks/:id
Update an existing task by its ID.

**Example:**
```
PUT /tasks/1
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "completed": true,
  "priority": "low"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | Yes | Cannot be empty |
| `description` | string | Yes | Cannot be empty |
| `completed` | boolean | Yes | Must be `true` or `false` (not a string) |
| `priority` | string | No | `low`, `medium`, or `high` |

**Response: 200 OK** — returns the updated task

**Response: 404 Not Found** — ID does not exist

**Response: 400 Bad Request** — missing or invalid fields

---

### DELETE /tasks/:id
Delete a task by its ID.

**Example:**
```
DELETE /tasks/1
```

**Response: 200 OK** — returns the deleted task
```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true
}
```

**Response: 404 Not Found** — ID does not exist

---

## Task Schema

```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "priority": "medium",
  "createdAt": "2026-05-16T10:00:00.000Z"
}
```

> Note: `priority` and `createdAt` are only present on tasks created via the API. Tasks pre-loaded from `task.json` do not have these fields.

---

## Error Reference

| Status Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Task created successfully |
| 400 | Invalid input (missing fields, wrong types, invalid priority) |
| 404 | Task not found |
