import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: ''
  });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;

      const data = await taskService.getTasks(params);
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      await fetchTasks();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await taskService.updateTask(id, taskData);
      await fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.deleteTask(id);
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
             Welcome back, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Let's manage your tasks and boost productivity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="stat-card border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base text-gray-600 font-medium mb-2">Total Tasks</div>
                <div className="text-4xl font-bold text-gray-900">{stats.total}</div>
              </div>
              <div className="text-5xl"></div>
            </div>
          </div>
          <div className="stat-card border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base text-gray-600 font-medium mb-2">Pending</div>
                <div className="text-4xl font-bold text-yellow-600">{stats.pending}</div>
              </div>
              <div className="text-5xl"></div>
            </div>
          </div>
          <div className="stat-card border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base text-gray-600 font-medium mb-2">In Progress</div>
                <div className="text-4xl font-bold text-blue-600">{stats.inProgress}</div>
              </div>
              <div className="text-5xl"></div>
            </div>
          </div>
          <div className="stat-card border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base text-gray-600 font-medium mb-2">Completed</div>
                <div className="text-4xl font-bold text-green-600">{stats.completed}</div>
              </div>
              <div className="text-5xl"></div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 text-xl">
                  
                </span>
                <input
                  type="text"
                  placeholder="Search tasks by title or description..."
                  className="input pl-12 text-base"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
            <select
              className="input lg:w-56 text-base cursor-pointer"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="pending"> Pending</option>
              <option value="in-progress"> In Progress</option>
              <option value="completed"> Completed</option>
            </select>
            <select
              className="input lg:w-56 text-base cursor-pointer"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="">All Priority</option>
              <option value="low"> Low</option>
              <option value="medium"> Medium</option>
              <option value="high"> High</option>
            </select>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary whitespace-nowrap text-base px-8"
            >
               Add New Task
            </button>
          </div>
        </div>

        {/* Task Form Modal */}
        {showForm && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCancelForm}
          />
        )}

        {/* Task List */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="spinner h-16 w-16 mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Loading your tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;