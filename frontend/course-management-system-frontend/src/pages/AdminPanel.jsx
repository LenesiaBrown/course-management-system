import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  
  const [courseForm, setCourseForm] = useState({
    name: '',
    description: '',
    skills: '',
    externalLink: '',
    departmentId: ''
  });
  
  const [departmentForm, setDepartmentForm] = useState({
    name: ''
  });

  
  const [editCourseForm, setEditCourseForm] = useState({
  name: '',
  description: '',
  skills: '',
  externalLink: '',
  departmentId: ''
});
  
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses');
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const skillsArray = courseForm.skills.split(',').map(s => s.trim()).filter(s => s);
      
      await api.post('/courses', {
        name: courseForm.name,
        description: courseForm.description,
        skills: skillsArray,
        externalLink: courseForm.externalLink,
        departmentId: parseInt(courseForm.departmentId)
      });

      setMessage({ type: 'success', text: 'Course created successfully!' });
      setCourseForm({ name: '', description: '', skills: '', externalLink: '', departmentId: '' });
      setShowCourseForm(false);
      fetchCourses();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to create course' 
      });
    }

    setSubmitting(false);
  };


    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setEditCourseForm({
            name: course.name,
            description: course.description,
            skills: course.skills.join(', '),
            externalLink: course.externalLink,
            departmentId: course.departmentId.toString()
        });
        setShowCourseForm(false);
    };


    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const skillsArray = editCourseForm.skills.split(',').map(s => s.trim()).filter(s => s);
            
            await api.put(`/courses/${editingCourse.id}`, {
            name: editCourseForm.name,
            description: editCourseForm.description,
            skills: skillsArray,
            externalLink: editCourseForm.externalLink,
            departmentId: parseInt(editCourseForm.departmentId)
            });

            setMessage({ type: 'success', text: 'Course updated successfully!' });
            setEditingCourse(null);
            setEditCourseForm({ name: '', description: '', skills: '', externalLink: '', departmentId: '' });
            fetchCourses();
        } catch (error) {
            setMessage({ 
            type: 'error', 
            text: error.response?.data?.error || 'Failed to update course' 
            });
        }

        setSubmitting(false);
    };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/departments', {
        name: departmentForm.name
      });

      setMessage({ type: 'success', text: 'Department created successfully!' });
      setDepartmentForm({ name: '' });
      setShowDepartmentForm(false);
      fetchDepartments();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to create department' 
      });
    }

    setSubmitting(false);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await api.delete(`/courses/${id}`);
      setMessage({ type: 'success', text: 'Course deleted successfully!' });
      fetchCourses();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete course' 
      });
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      await api.delete(`/departments/${id}`);
      setMessage({ type: 'success', text: 'Department deleted successfully!' });
      fetchDepartments();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete department' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Admin Panel
        </h1>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'courses'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Courses ({courses.length})
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'departments'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Departments ({departments.length})
            </button>
          </div>
        </div>

        {activeTab === 'courses' && (
          <div>
            <div className="mb-6">
              {!showCourseForm ? (
                <button
                  onClick={() => setShowCourseForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  + Add New Course
                </button>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Create New Course
                  </h2>
                  <form onSubmit={handleCourseSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Course Name
                      </label>
                      <input
                        type="text"
                        value={courseForm.name}
                        onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Skills (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={courseForm.skills}
                        onChange={(e) => setCourseForm({ ...courseForm, skills: e.target.value })}
                        placeholder="e.g., React, JavaScript, Hooks"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        External Link
                      </label>
                      <input
                        type="url"
                        value={courseForm.externalLink}
                        onChange={(e) => setCourseForm({ ...courseForm, externalLink: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Department
                      </label>
                      <select
                        value={courseForm.departmentId}
                        onChange={(e) => setCourseForm({ ...courseForm, departmentId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
                      >
                        {submitting ? 'Creating...' : 'Create Course'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCourseForm(false);
                          setCourseForm({ name: '', description: '', skills: '', externalLink: '', departmentId: '' });
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="space-y-4">
                {editingCourse ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Edit Course
                    </h2>
                    <form onSubmit={handleUpdateCourse} className="space-y-4">
                        <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Course Name
                        </label>
                        <input
                            type="text"
                            value={editCourseForm.name}
                            onChange={(e) => setEditCourseForm({ ...editCourseForm, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        </div>

                        <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            value={editCourseForm.description}
                            onChange={(e) => setEditCourseForm({ ...editCourseForm, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="4"
                            required
                        />
                        </div>

                        <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Skills (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={editCourseForm.skills}
                            onChange={(e) => setEditCourseForm({ ...editCourseForm, skills: e.target.value })}
                            placeholder="e.g., React, JavaScript, Hooks"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        </div>

                        <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            External Link
                        </label>
                        <input
                            type="url"
                            value={editCourseForm.externalLink}
                            onChange={(e) => setEditCourseForm({ ...editCourseForm, externalLink: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        </div>

                        <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Department
                        </label>
                        <select
                            value={editCourseForm.departmentId}
                            onChange={(e) => setEditCourseForm({ ...editCourseForm, departmentId: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                            ))}
                        </select>
                        </div>

                        <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
                        >
                            {submitting ? 'Updating...' : 'Update Course'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                            setEditingCourse(null);
                            setEditCourseForm({ name: '', description: '', skills: '', externalLink: '', departmentId: '' });
                            }}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
                        >
                            Cancel
                        </button>
                        </div>
                    </form>
                    </div>
                ) : (
                    courses.map(course => (
                    <div
                        key={course.id}
                        className="bg-white rounded-lg shadow-md p-6 flex justify-between items-start"
                    >
                        <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {course.name}
                        </h3>
                        <p className="text-sm text-blue-600 mb-2">
                            {course.department?.name}
                        </p>
                        <p className="text-gray-600 mb-3">
                            {course.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {course.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                                {skill}
                            </span>
                            ))}
                        </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                        <button
                            onClick={() => handleEditCourse(course)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            Delete
                        </button>
                        </div>
                    </div>
                    ))
                )}
                </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div>
            <div className="mb-6">
              {!showDepartmentForm ? (
                <button
                  onClick={() => setShowDepartmentForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  + Add New Department
                </button>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Create New Department
                  </h2>
                  <form onSubmit={handleDepartmentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Department Name
                      </label>
                      <input
                        type="text"
                        value={departmentForm.name}
                        onChange={(e) => setDepartmentForm({ name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
                      >
                        {submitting ? 'Creating...' : 'Create Department'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDepartmentForm(false);
                          setDepartmentForm({ name: '' });
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {departments.map(dept => (
                <div
                  key={dept.id}
                  className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {dept.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {dept._count?.courses || 0} courses
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteDepartment(dept.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;