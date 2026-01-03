import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/categories';

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  _id: string;
  name: string;
  visitCharge?: number;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryCharge, setNewSubcategoryCharge] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editSubcategoryName, setEditSubcategoryName] = useState('');
  const [editSubcategoryCharge, setEditSubcategoryCharge] = useState('');

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // Add Category
  const addCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        const response = await axios.post(API_URL, {
          name: newCategoryName.trim()
        });
        setCategories([...categories, response.data]);
        setNewCategoryName('');
        setShowAddCategory(false);
      } catch (error: any) {
        console.error('Error adding category:', error);
        alert(error.response?.data?.message || 'Failed to add category');
      }
    }
  };

  // Add Subcategory
  const addSubcategory = async (categoryId: string) => {
    if (newSubcategoryName.trim()) {
      try {
        const response = await axios.post(`${API_URL}/${categoryId}/subcategories`, {
          name: newSubcategoryName.trim(),
          visitCharge: parseInt(newSubcategoryCharge) || 0
        });
        setCategories(categories.map(cat =>
          cat._id === categoryId ? response.data : cat
        ));
        setNewSubcategoryName('');
        setNewSubcategoryCharge('');
        setShowAddSubcategory(null);
      } catch (error: any) {
        console.error('Error adding subcategory:', error);
        alert(error.response?.data?.message || 'Failed to add subcategory');
      }
    }
  };

  // Update Category
  const updateCategory = async (categoryId: string) => {
    if (editCategoryName.trim()) {
      try {
        const response = await axios.put(`${API_URL}/${categoryId}`, {
          name: editCategoryName.trim()
        });
        setCategories(categories.map(cat =>
          cat._id === categoryId ? response.data : cat
        ));
        setEditingCategory(null);
        setEditCategoryName('');
      } catch (error: any) {
        console.error('Error updating category:', error);
        alert(error.response?.data?.message || 'Failed to update category');
      }
    }
  };

  // Update Subcategory
  const updateSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (editSubcategoryName.trim()) {
      try {
        const response = await axios.put(
          `${API_URL}/${categoryId}/subcategories/${subcategoryId}`,
          {
            name: editSubcategoryName.trim(),
            visitCharge: parseInt(editSubcategoryCharge) || 0
          }
        );
        setCategories(categories.map(cat =>
          cat._id === categoryId ? response.data : cat
        ));
        setEditingSubcategory(null);
        setEditSubcategoryName('');
        setEditSubcategoryCharge('');
      } catch (error: any) {
        console.error('Error updating subcategory:', error);
        alert(error.response?.data?.message || 'Failed to update subcategory');
      }
    }
  };

  // Delete Category
  const deleteCategory = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category and all its subcategories?')) {
      try {
        await axios.delete(`${API_URL}/${categoryId}`);
        setCategories(categories.filter(cat => cat._id !== categoryId));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  // Delete Subcategory
  const deleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      try {
        const response = await axios.delete(
          `${API_URL}/${categoryId}/subcategories/${subcategoryId}`
        );
        setCategories(categories.map(cat =>
          cat._id === categoryId ? response.data.category : cat
        ));
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        alert('Failed to delete subcategory');
      }
    }
  };

  // Start Edit Category
  const startEditCategory = (category: Category) => {
    setEditingCategory(category._id);
    setEditCategoryName(category.name);
  };

  // Start Edit Subcategory
  const startEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory._id);
    setEditSubcategoryName(subcategory.name);
    setEditSubcategoryCharge(subcategory.visitCharge?.toString() || '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl" style={{ color: '#19034d' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>Categories Management</h1>
        <button
          onClick={() => setShowAddCategory(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
          style={{ backgroundColor: '#05f51d' }}
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#19034d' }}>Add New Category</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={addCategory}
                className="flex-1 py-2 px-4 rounded-lg text-white"
                style={{ backgroundColor: '#05f51d' }}
              >
                Add Category
              </button>
              <button
                onClick={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                }}
                className="flex-1 py-2 px-4 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {showAddSubcategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#19034d' }}>Add New Subcategory</h3>
            <input
              type="text"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              placeholder="Subcategory name"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="number"
              value={newSubcategoryCharge}
              onChange={(e) => setNewSubcategoryCharge(e.target.value)}
              placeholder="Visit charge"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => addSubcategory(showAddSubcategory)}
                className="flex-1 py-2 px-4 rounded-lg text-white"
                style={{ backgroundColor: '#05f51d' }}
              >
                Add Subcategory
              </button>
              <button
                onClick={() => {
                  setShowAddSubcategory(null);
                  setNewSubcategoryName('');
                  setNewSubcategoryCharge('');
                }}
                className="flex-1 py-2 px-4 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              {editingCategory === category._id ? (
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => updateCategory(category._id)}
                    className="p-2 text-white rounded-lg"
                    style={{ backgroundColor: '#05f51d' }}
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setEditCategoryName('');
                    }}
                    className="p-2 bg-gray-500 text-white rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold" style={{ color: '#19034d' }}>{category.name}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditCategory(category)}
                      className="p-2 text-gray-600 hover:text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowAddSubcategory(category._id)}
                      className="px-3 py-1 text-sm rounded-lg text-white"
                      style={{ backgroundColor: '#05f51d' }}
                    >
                      Add Subcategory
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Subcategories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.subcategories.map((subcategory) => (
                <div key={subcategory._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  {editingSubcategory === subcategory._id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editSubcategoryName}
                        onChange={(e) => setEditSubcategoryName(e.target.value)}
                        className="flex-1 p-1 border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        value={editSubcategoryCharge}
                        onChange={(e) => setEditSubcategoryCharge(e.target.value)}
                        className="w-20 p-1 border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => updateSubcategory(category._id, subcategory._id)}
                        className="p-1 text-white rounded"
                        style={{ backgroundColor: '#05f51d' }}
                      >
                        <Save className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingSubcategory(null);
                          setEditSubcategoryName('');
                          setEditSubcategoryCharge('');
                        }}
                        className="p-1 bg-gray-500 text-white rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-700">{subcategory.name}</span>
                      <span className="text-sm text-gray-500">Rs{subcategory.visitCharge ?? 0}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditSubcategory(subcategory)}
                          className="p-1 text-gray-600 hover:text-blue-600"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteSubcategory(category._id, subcategory._id)}
                          className="p-1 text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;