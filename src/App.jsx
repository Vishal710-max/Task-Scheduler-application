import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [editIndex, setEditIndex] = useState(null)
  const [view, setView] = useState('all') // 'all', 'pending', 'completed'
  const [searchTerm, setSearchTerm] = useState('')
  const [newTask, setNewTask] = useState({
    text: '',
    deadline: '',
    priority: 'medium',
    category: '',
    completed: false
  })

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Overdue checks
  useEffect(() => {
    const checkOverdue = () => {
      tasks.forEach(task => {
        if (!task.completed && task.deadline && !task.notifiedOverdue) {
          const isOverdue = new Date(task.deadline) < new Date()
          if (isOverdue) {
            const updatedTasks = tasks.map(t => 
              t.id === task.id ? {...t, notifiedOverdue: true} : t
            )
            setTasks(updatedTasks)
            
            toast.warning(`⚠️ Task Overdue: "${task.text}"`, {
              autoClose: false,
              closeOnClick: false
            })
          }
        }
      })
    }

    const interval = setInterval(checkOverdue, 60 * 60 * 1000)
    checkOverdue()
    
    return () => clearInterval(interval)
  }, [tasks])

  const getTaskStatus = (task) => {
    if (task.completed) return 'completed'
    if (task.deadline && new Date(task.deadline) < new Date()) return 'overdue'
    if (task.deadline && new Date(task.deadline) < new Date(Date.now() + 24 * 60 * 60 * 1000)) return 'due-soon'
    return 'pending'
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (editIndex !== null) {
      setNewTask({...tasks[editIndex], [name]: value})
    } else {
      setNewTask({...newTask, [name]: value})
    }
  }

  const handleAddTask = () => {
    if (newTask.text.trim() !== '') {
      if (editIndex !== null) {
        const updatedTasks = [...tasks]
        updatedTasks[editIndex] = newTask
        setTasks(updatedTasks)
        setEditIndex(null)
        toast.success('Task updated successfully!')
      } else {
        setTasks([...tasks, {...newTask, id: Date.now()}])
        toast.success('Task added successfully!')
      }
      setNewTask({
        text: '',
        deadline: '',
        priority: 'medium',
        category: '',
        completed: false
      })
    } else {
      toast.error('Task description cannot be empty!')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask()
    }
  }

  const handleCompleteTask = (index) => {
    const updatedTasks = [...tasks]
    updatedTasks[index].completed = true
    updatedTasks[index].completedAt = new Date().toISOString()
    setTasks(updatedTasks)
    
    toast.success(`✓ Completed: "${updatedTasks[index].text}"`)
  }

  const handleEditTask = (index) => {
    setNewTask(tasks[index])
    setEditIndex(index)
  }

  const handleDeleteTask = (index) => {
    const taskText = tasks[index].text
    const updatedTasks = tasks.filter((_, i) => i !== index)
    setTasks(updatedTasks)
    toast.info(`Deleted task: "${taskText}"`)
  }

  const filteredTasks = tasks
    .filter(task => {
      const matchesView = 
        view === 'all' || 
        (view === 'pending' && !task.completed) || 
        (view === 'completed' && task.completed)
      
      const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesView && matchesSearch
    })
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return new Date(a.deadline) - new Date(b.deadline)
    })

  const pendingCount = tasks.filter(task => !task.completed).length
  const completedCount = tasks.filter(task => task.completed).length
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <div className="app">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <h1>Task Scheduler Application</h1>
      
      <div className="stats">
        <div>Total: {tasks.length}</div>
        <div>Pending: {pendingCount}</div>
        <div>Completed: {completedCount}</div>
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span>{completionPercentage}% Complete</span>
        </div>
      </div>
      
      <div className="controls">
        <div className="view-buttons">
          <button 
            className={view === 'all' ? 'active' : ''} 
            onClick={() => setView('all')}
          >
            All Tasks
          </button>
          <button 
            className={view === 'pending' ? 'active' : ''} 
            onClick={() => setView('pending')}
          >
            Pending
          </button>
          <button 
            className={view === 'completed' ? 'active' : ''} 
            onClick={() => setView('completed')}
          >
            Completed
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="task-form">
        <input
          type="text"
          name="text"
          value={newTask.text}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Task description"
        />
        
        <input
          type="datetime-local"
          name="deadline"
          value={newTask.deadline}
          onChange={handleInputChange}
        />
        
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleInputChange}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        
        <input
          type="text"
          name="category"
          value={newTask.category}
          onChange={handleInputChange}
          placeholder="Category/Tag"
        />
        
        <button onClick={handleAddTask}>
          {editIndex !== null ? 'Update Task' : 'Add Task'}
        </button>
        
        {editIndex !== null && (
          <button 
            onClick={() => {
              setEditIndex(null)
              setNewTask({
                text: '',
                deadline: '',
                priority: 'medium',
                category: '',
                completed: false
              })
              toast.info('Edit cancelled')
            }}
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </div>
      
      <ul className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => {
            const status = getTaskStatus(task)
            return (
              <li 
                key={task.id || index} 
                className={`task-item ${status} priority-${task.priority}`}
                data-completed={task.completed}
              >
                <div className="task-main">
                  <div className="task-status-indicator">
                    {status === 'completed' && (
                      <span className="checkmark">✓</span>
                    )}
                    {status === 'overdue' && (
                      <span className="warning-icon">⚠️</span>
                    )}
                    {status === 'due-soon' && (
                      <span className="due-soon-icon">⏳</span>
                    )}
                  </div>
                  
                  <div className="task-info">
                    <span className="task-text">
                      {task.text}
                    </span>
                    
                    <div className="task-meta">
                      {task.category && <span className="category">{task.category}</span>}
                      {task.deadline && (
                        <span className="deadline">
                          Due: {new Date(task.deadline).toLocaleString()}
                        </span>
                      )}
                      <span className={`priority ${task.priority}`}>
                        {task.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="task-actions">
                  {!task.completed && (
                    <button 
                      onClick={() => handleCompleteTask(index)}
                      className="complete-btn"
                    >
                      Complete
                    </button>
                  )}
                  <button 
                    onClick={() => handleEditTask(index)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteTask(index)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </li>
            )
          })
        ) : (
          <p className="empty-message">No tasks found. Add a new task above!</p>
        )}
      </ul>
    </div>
  )
}

export default App
