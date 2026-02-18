import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [duration, setDuration] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCourse();
    if (user) {
      checkCompletion();
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load course');
      setLoading(false);
    }
  };


const checkCompletion = async () => {
  try {
    await api.get(`/progress/course/${id}/user`);
    setIsCompleted(true);
  } catch (error) {
    if (error.response?.status === 404) {
      setIsCompleted(false); // course not yet completed
    } else {
      console.error("Error checking completion:", error);
    }
  }
};

  const handleMarkAsFinished = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/progress/completed', {
        courseId: parseInt(id),
        duration: duration
      });

      setIsCompleted(true);
      setShowCompletionForm(false);
      setDuration('');
      alert('Course marked as finished!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to mark as finished');
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading course...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-red-600">
          {error || 'Course not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Back Button */}
        <Link
            to="/courses"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline mb-4"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                className="fill-current"
            >
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </svg>

            Back to Courses
        </Link>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE - MAIN CONTENT */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-8">

            {/* Department + Title */}
            <div className="mb-6">
              <span className="text-sm text-blue-600 font-medium">
                {course.department?.name}
              </span>

              <h1 className="text-4xl font-bold text-gray-800 mt-2">
                {course.name}
              </h1>
            </div>

            {/* Completed Banner */}
            {isCompleted && (
              <div className="flex items-center gap-2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 -960 960 960"
                    width="20"
                    fill="currentColor"
                >
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                </svg>
                You have completed this course!
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Skills You'll Learn
              </h2>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE - SIDEBAR */}
          <div className="space-y-6">

            {/* Course Details Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                Course Details
              </h3>

              <p className="text-gray-500 mb-3">
                No reviews yet
              </p>

              {/* Can be implemented later... */}
              {/* <div className="space-y-2 text-gray-600 text-sm">
                <p>Duration: {course.duration || "12 hours"}</p>
                <p>Level: {course.level || "Intermediate"}</p>
              </div> */}

              {course.externalLink && (
                <a
                    href={course.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
                >
                    Go to Course

                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 -960 960 960"
                    width="20"
                    className="fill-current"
                    >
                    <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
                    </svg>
                </a>
                )}

            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                Your Progress
              </h3>

              {!user ? (
                <p className="text-gray-600">
                  <Link
                    to="/login"
                    className="text-blue-600 hover:underline"
                  >
                    Sign in
                  </Link>{' '}
                  to track your progress.
                </p>
              ) : isCompleted ? (
                <p className="flex items-center gap-2 text-green-600 font-medium">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        viewBox="0 -960 960 960"
                        width="20"
                        fill="currentColor"
                    >
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    </svg>
                    Completed
                </p>
              ) : !showCompletionForm ? (
                <button
                  onClick={() => setShowCompletionForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-lg transition"
                >
                  Mark as Finished
                </button>
              ) : (
                <form onSubmit={handleMarkAsFinished} className="space-y-4">
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 10 hours"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Submit'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowCompletionForm(false);
                        setDuration('');
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
