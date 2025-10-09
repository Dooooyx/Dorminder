import React, { useState, useEffect, useCallback } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { rulesService } from '../services/rulesService';
import { useAuth } from '../context/AuthContext';

const Rules = () => {
  const { user, loading: authLoading } = useAuth();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [selectedRules, setSelectedRules] = useState([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rules: [''],
    order: 1,
    isActive: true,
    icon: 'checkmark'
  });

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const loadRules = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const result = await rulesService.getRulesByProperty(user.uid);
      
      if (result.success) {
        setRules(result.data);
      } else {
        setError(result.error || 'Failed to load rules');
      }
    } catch (error) {
      console.error('Error loading rules:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  const handleAddRule = () => {
    setFormData({
      title: '',
      description: '',
      rules: [''],
      order: rules.length + 1,
      isActive: true,
      icon: 'checkmark'
    });
    setIsAddModalOpen(true);
  };

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setFormData({
      title: rule.title,
      description: rule.description,
      rules: rule.rules || [''],
      order: rule.order,
      isActive: rule.isActive,
      icon: rule.icon
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        const result = await rulesService.deleteRule(ruleId);
        if (result.success) {
          await loadRules();
        } else {
          alert('Error deleting rule: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting rule:', error);
        alert('Error deleting rule');
      }
    }
  };

  const handleSelectRule = (ruleId) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRules.length === rules.length) {
      setSelectedRules([]);
    } else {
      setSelectedRules(rules.map(rule => rule.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRules.length === 0) {
      alert('Please select rules to delete');
      return;
    }

    if (isDeleting) return; // Prevent double-clicking

    setIsDeleting(true);
    try {
      const deletePromises = selectedRules.map(ruleId => 
        rulesService.deleteRule(ruleId)
      );
      
      const results = await Promise.all(deletePromises);
      const failedDeletes = results.filter(result => !result.success);
      
      if (failedDeletes.length === 0) {
        alert(`Successfully deleted ${selectedRules.length} rule(s)`);
        setSelectedRules([]);
        setIsBulkDeleteModalOpen(false);
        await loadRules();
      } else {
        alert(`Failed to delete ${failedDeletes.length} rule(s)`);
      }
    } catch (error) {
      console.error('Error bulk deleting rules:', error);
      alert('Error deleting rules');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double-clicking
    
    setIsSubmitting(true);
    try {
      const ruleData = {
        ...formData,
        propertyId: user.uid,
        rules: formData.rules.filter(rule => rule.trim() !== '')
      };

      let result;
      if (isEditModalOpen) {
        result = await rulesService.updateRule(selectedRule.id, ruleData);
      } else {
        result = await rulesService.createRule(ruleData);
      }

      if (result.success) {
        await loadRules();
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedRule(null);
      } else {
        alert('Error saving rule: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving rule:', error);
      alert('Error saving rule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addRuleItem = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const removeRuleItem = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const updateRuleItem = (index, value) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const createDefaultRules = async () => {
    if (window.confirm('This will create default rules for your property. Continue?')) {
      try {
        const result = await rulesService.createDefaultRules(user.uid);
        if (result.success) {
          await loadRules();
          alert('Default rules created successfully!');
        } else {
          alert('Error creating default rules: ' + result.error);
        }
      } catch (error) {
        console.error('Error creating default rules:', error);
        alert('Error creating default rules');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex" style={{ fontFamily: 'Newsreader, serif' }}>
        <SideNav />
        <div className="flex-1 flex flex-col" style={{ backgroundColor: '#F0F5FA' }}>
          <TopNav title="Rules" />
          <div className="flex-1 overflow-y-auto p-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading rules...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Newsreader, serif' }}>
      <SideNav />
      <TopNav title="Rules" />
      
      <div className="ml-64 pt-20 min-h-screen" style={{ backgroundColor: '#F0F5FA' }}>
        <div className="p-8">
            <div className="flex justify-between items-center mb-8 mt-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Rules Management</h1>
                <p className="text-gray-600 mt-2">Manage boarding house rules and regulations</p>
              </div>
              
              <div className="flex gap-4">
                {selectedRules.length > 0 && (
                  <button
                    onClick={() => setIsBulkDeleteModalOpen(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Selected ({selectedRules.length})
                  </button>
                )}
                <button
                  onClick={createDefaultRules}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Create Default Rules
                </button>
                <button
                  onClick={handleAddRule}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add New Rule
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {rules.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rules Yet</h3>
                <p className="text-gray-600 mb-6">Create your first rule or use the default template</p>
                <button
                  onClick={createDefaultRules}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Default Rules
                </button>
              </div>
            ) : (
              <div>
                {/* Select All Header */}
                <div className="flex items-center gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={selectedRules.length === rules.length && rules.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedRules.length === rules.length && rules.length > 0 
                      ? 'Deselect All' 
                      : 'Select All'
                    } ({selectedRules.length} selected)
                  </span>
                </div>

                {/* Rules List */}
                <div className="grid gap-6">
                  {rules.map((rule) => (
                    <div key={rule.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedRules.includes(rule.id)}
                            onChange={() => handleSelectRule(rule.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-semibold">
                              {rule.order}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{rule.title}</h3>
                            <p className="text-gray-600">{rule.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rule.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <button
                            onClick={() => handleEditRule(rule)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {rule.rules && rule.rules.map((ruleItem, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span className="text-gray-700">{ruleItem}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Add/Edit Rule Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {isEditModalOpen ? 'Edit Rule' : 'Add New Rule'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rules
                </label>
                <div className="space-y-2">
                  {formData.rules.map((rule, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => updateRuleItem(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Rule ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeRuleItem(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRuleItem}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    + Add Rule
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="checkmark">✓ General</option>
                    <option value="moon">🌙 Quiet Hours</option>
                    <option value="people">👥 Guest Policy</option>
                    <option value="cash">💰 Payment</option>
                    <option value="warning">⚠️ Safety</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active (visible to tenants)
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedRule(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[140px] ${
                    isSubmitting 
                      ? 'bg-blue-600 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditModalOpen ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditModalOpen ? 'Update Rule' : 'Create Rule'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Rules</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete {selectedRules.length} rule(s)? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[180px] ${
                  isDeleting 
                    ? 'bg-red-600 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  `Delete ${selectedRules.length} Rule(s)`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rules;
