import React, { useState, useEffect } from 'react';

const AnnouncementForm = ({ onSave, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    scheduleType: 'Immediate',
    scheduleFrom: '',
    scheduleUntil: '',
    status: 'active',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        scheduleType: initialData.scheduleType || 'Immediate',
        scheduleFrom: initialData.scheduleFrom ? new Date(initialData.scheduleFrom).toISOString().split('T')[0] : '',
        scheduleUntil: initialData.scheduleUntil ? new Date(initialData.scheduleUntil).toISOString().split('T')[0] : '',
        status: initialData.status || 'active',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    if (formData.scheduleType === 'Scheduled') {
      if (!formData.scheduleFrom || !formData.scheduleUntil) {
        alert('Please select both start and end dates for scheduled announcements');
        return;
      }
      if (new Date(formData.scheduleFrom) > new Date(formData.scheduleUntil)) {
        alert('End date must be after start date');
        return;
      }
    }

    onSave(formData);
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        {initialData ? 'Edit Announcement' : 'Create New Announcement'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter announcement title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter announcement details"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Schedule Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule Type
          </label>
          <select
            name="scheduleType"
            value={formData.scheduleType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Immediate">Post Immediately</option>
            <option value="Scheduled">Schedule for Later</option>
          </select>
        </div>

        {/* Scheduled Date Range */}
        {formData.scheduleType === 'Scheduled' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="scheduleFrom"
                value={formData.scheduleFrom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={formData.scheduleType === 'Scheduled'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Until Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="scheduleUntil"
                value={formData.scheduleUntil}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={formData.scheduleType === 'Scheduled'}
              />
            </div>
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {initialData ? 'Update Announcement' : 'Create Announcement'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;

