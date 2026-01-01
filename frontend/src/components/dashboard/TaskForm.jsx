import { useState, useEffect } from 'react';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        tags: task.tags ? task.tags.join(', ') : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.title.length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
      };

      if (task) {
        await onSubmit(task._id, submitData);
      } else {
        await onSubmit(submitData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {task ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-base text-gray-600">
                {task ? 'Update your task details below' : 'Fill in the details to create a new task'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-3xl transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3"></span>
                  <p className="text-base text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                required
                className="input text-base"
                placeholder="e.g., Complete project documentation"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                className="input text-base"
                placeholder="Add more details about this task..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  className="input text-base cursor-pointer"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  name="priority"
                  className="input text-base cursor-pointer"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                className="input text-base cursor-pointer"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                className="input text-base"
                placeholder="e.g., work, urgent, review"
                value={formData.tags}
                onChange={handleChange}
              />
              <p className="mt-2 text-sm text-gray-500">
                Separate tags with commas
              </p>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1 text-base py-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span>
                    {task ? ' Update Task' : ' Create Task'}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary flex-1 text-base py-4"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;