const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


// ==================== MODEL ====================
const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  visitCharge: {
    type: Number,
    default: 0,
    min: 0
  }
}, { _id: true });

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  subcategories: [subcategorySchema]
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

// ==================== ROUTES ====================

// Get all categories with subcategories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Get single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
});

// Create new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name: name.trim(),
      subcategories: []
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
});

// Update category name
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if another category with this name exists
    const existingCategory = await Category.findOne({ 
      name: name.trim(), 
      _id: { $ne: req.params.id } 
    });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    category.name = name.trim();
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
});

// Add subcategory to a category
router.post('/:id/subcategories', async (req, res) => {
  try {
    const { name, visitCharge } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Subcategory name is required' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if subcategory already exists in this category
    const existingSubcategory = category.subcategories.find(
      sub => sub.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (existingSubcategory) {
      return res.status(400).json({ message: 'Subcategory already exists in this category' });
    }

    const newSubcategory = {
      name: name.trim(),
      visitCharge: visitCharge || 0
    };

    category.subcategories.push(newSubcategory);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error adding subcategory', error: error.message });
  }
});

// Update subcategory
router.put('/:categoryId/subcategories/:subcategoryId', async (req, res) => {
  try {
    const { name, visitCharge } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Subcategory name is required' });
    }

    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = category.subcategories.id(req.params.subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // Check if another subcategory with this name exists in the same category
    const existingSubcategory = category.subcategories.find(
      sub => sub.name.toLowerCase() === name.trim().toLowerCase() && 
             sub._id.toString() !== req.params.subcategoryId
    );
    if (existingSubcategory) {
      return res.status(400).json({ message: 'Subcategory name already exists in this category' });
    }

    subcategory.name = name.trim();
    subcategory.visitCharge = visitCharge !== undefined ? visitCharge : subcategory.visitCharge;
    
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating subcategory', error: error.message });
  }
});

// Delete subcategory
router.delete('/:categoryId/subcategories/:subcategoryId', async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = category.subcategories.id(req.params.subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    subcategory.deleteOne();
    await category.save();
    res.json({ message: 'Subcategory deleted successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subcategory', error: error.message });
  }
});

// Seed initial categories (optional - run once)
router.post('/seed/initial-data', async (req, res) => {
  try {
    // Check if categories already exist
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      return res.status(400).json({ message: 'Categories already exist' });
    }

    const initialCategories = [
      {
        name: 'Electrical',
        subcategories: [
          { name: 'Wiring & Cabling', visitCharge: 500 },
          { name: 'Switches & Sockets', visitCharge: 300 },
          { name: 'Lighting Installation', visitCharge: 400 },
          { name: 'Fans & Appliances', visitCharge: 350 },
          { name: 'Circuit Breakers & Panels', visitCharge: 600 },
          { name: 'Inverter & UPS Installation', visitCharge: 700 },
          { name: 'Solar Panel Setup', visitCharge: 1000 }
        ]
      },
      {
        name: 'Plumbing',
        subcategories: [
          { name: 'Pipes & Fittings', visitCharge: 300 },
          { name: 'Tap Installation', visitCharge: 250 },
          { name: 'Drain Cleaning', visitCharge: 350 },
          { name: 'Leak Repairs', visitCharge: 200 },
          { name: 'Water Tank Installation', visitCharge: 800 },
          { name: 'Bathroom Fittings', visitCharge: 400 },
          { name: 'Kitchen Plumbing', visitCharge: 450 }
        ]
      }
    ];

    const categories = await Category.insertMany(initialCategories);
    res.status(201).json({ message: 'Initial categories seeded successfully', categories });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding categories', error: error.message });
  }
});

module.exports = router