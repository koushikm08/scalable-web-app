const TaskList = ({ tasks, onEdit, onDelete }) => {
  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-orange-500';
      case 'low':
        return 'border-gray-400';
      default:
        return 'border-gray-300';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="card text-center py-20">
        <div className="text-8xl mb-6"></div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No tasks found</h3>
        <p className="text-lg text-gray-500">Create your first task to get started on your journey!</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {tasks.map((task) => (
        <div 
          key={task._id} 
          className={`task-card ${getPriorityColor(task.priority)} hover:scale-[1.01]`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                <span className={`badge badge-${task.status}`}>
                  {task.status === 'pending' }
                  {task.status === 'in-progress'}
                  {task.status === 'completed'}
                  {' '}
                  {task.status.replace('-', ' ')}
                </span>
                <span className={`badge badge-${task.priority}`}>
                  {task.priority === 'high'}
                  {task.priority === 'medium'}
                  {task.priority === 'low'}
                  {' '}
                  {task.priority}
                </span>
              </div>
              
              {task.description && (
                <p className="text-base text-gray-700 mb-4 leading-relaxed">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center gap-6 text-base text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-xl"></span>
                  <span className="font-medium">{formatDate(task.dueDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl"></span>
                  <span className="font-medium">Created {formatDate(task.createdAt)}</span>
                </div>
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-200"
                    >
                       {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => onEdit(task)}
                className="px-5 py-2.5 text-base font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all duration-200 border-2 border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
              >
                 Edit
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="px-5 py-2.5 text-base font-semibold bg-gradient-to-r from-red-50 to-pink-50 text-red-700 hover:from-red-100 hover:to-pink-100 rounded-xl transition-all duration-200 border-2 border-red-200 hover:border-red-300 shadow-sm hover:shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;