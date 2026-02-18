import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyProgress = () => {
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompletions();
  }, []);

  const fetchCompletions = async () => {
    try {
      const response = await api.get('/progress/completed');
      setCompletions(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load your progress');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading your progress...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }


  const handleRemoveCompletion = async (courseId) => {
  if (!window.confirm('Are you sure you want to remove this completion?')) {
    return;
  }

  try {
    await api.delete(`/progress/${courseId}`);
    
    // Remove from UI immediately
    setCompletions(completions.filter(c => c.course.id !== courseId));
    
    alert('Completion removed successfully!');
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to remove completion');
  }
};


  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          My Progress
        </h1>

        {completions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">
              You haven't completed any courses yet.
            </p>
            <Link
              to="/courses"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {completions.length}
                </div>
                <div className="text-gray-600">
                  Course{completions.length !== 1 ? 's' : ''} Completed
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completions.map(completion => (
                <div
                    key={completion.id}
                    className="bg-white rounded-lg shadow-md p-6"
                >
                    <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {completion.course.name}
                    </h3>
                    <p className="text-sm text-blue-600">
                        {completion.course.department?.name}
                    </p>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div>
                        <span className="font-medium">Duration:</span>{' '}
                        {completion.duration}
                    </div>
                    <div>
                        <span className="font-medium">Completed:</span>{' '}
                        {new Date(completion.completionDate).toLocaleDateString()}
                    </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                    {completion.course.skills.slice(0, 3).map((skill, index) => (
                        <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                        {skill}
                        </span>
                    ))}
                    {completion.course.skills.length > 3 && (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{completion.course.skills.length - 3}
                        </span>
                    )}
                    </div>

                    <div className="flex gap-3">
                    <Link
                        to={`/courses/${completion.course.id}`}
                        className="text-blue-600 hover:underline text-sm font-medium"
                    >
                        View Course →
                    </Link>
                    
                    <button
                        onClick={() => handleRemoveCompletion(completion.course.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium ml-auto"
                    >
                        Remove
                    </button>
                    </div>
                </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProgress;