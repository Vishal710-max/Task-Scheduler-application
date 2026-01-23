🗓️ Task Scheduler Application

A modern Task Scheduler / To-Do application built with React that helps users manage tasks efficiently with deadlines, priorities, categories, search, filtering, and real-time notifications.

🚀 Features
✅ Core Task Management

Add new tasks with:

Description

Deadline (date & time)

Priority (Low / Medium / High)

Category / Tag

Edit existing tasks

Delete tasks

Mark tasks as completed

⏰ Smart Deadline Handling

Automatically detects:

Overdue tasks

Tasks due within 24 hours

Shows visual indicators:

⚠️ Overdue

⏳ Due soon

✓ Completed

Displays toast notifications for overdue tasks

🔔 Notifications (React Toastify)

Success notification on task add/update

Warning notification for overdue tasks

Info notification on delete or cancel edit

Persistent overdue alerts until acknowledged

📊 Task Statistics & Progress

Total tasks count

Pending tasks count

Completed tasks count

Dynamic progress bar showing completion percentage

🔍 Filtering & Search

View filters:

All Tasks

Pending Tasks

Completed Tasks

Search by:

Task text

Category name

💾 Local Storage Support

Tasks are automatically saved to localStorage

Data persists even after page refresh or browser restart

🎯 Priority-Based Sorting

Tasks are sorted by:

Priority (High → Medium → Low)

Deadline (earliest first)

🛠️ Tech Stack

Frontend: React (Hooks)

State Management: useState, useEffect

Notifications: react-toastify

Storage: Browser LocalStorage

Styling: CSS

📂 Project Structure (Simplified)
src/
├── App.jsx        # Main application logic
├── App.css        # Styling
├── main.jsx
└── index.html

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/task-scheduler-app.git
cd task-scheduler-app

2️⃣ Install dependencies
npm install

3️⃣ Start the development server
npm run dev


The app will run at:

http://localhost:5173

🧠 How It Works (High Level)

Tasks are stored as objects in state and synced to localStorage

Deadline checks run every hour using setInterval

Overdue tasks trigger warning notifications only once

UI updates dynamically based on task status and filters


🔮 Future Enhancements

Dark mode

Drag & drop task reordering

Calendar view

Authentication & cloud sync

Export tasks to CSV / PDF

🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit a pull request.


👨‍💻 Author

Vishal Bhingarde
React Developer | DSA Learner | Frontend Enthusiast

⭐ If you like this project, consider giving it a star! 
