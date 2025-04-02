import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../styles/Categories.css';
import SearchableDropdown from './SearchableDropdown';

const Categories = ({ setCategoryFilter, setValueFilter, allowCreation = false }) => {
    const [categories, setCategories] = useState([]);
    const [values, setValues] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');
    const [valueSearch, setValueSearch] = useState('');
    const [error, setError] = useState(null);

    // Fetch categories with error handling
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch values when category is selected
    useEffect(() => {
        const fetchValues = async () => {
            if (!selectedCategory?.id) {
                setValues([]);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/categories/${selectedCategory.id}/values`
                );
                setValues(response.data);
            } catch (error) {
                console.error('Error fetching values:', error);
                setError('Failed to load values for this category');
                setValues([]);
            } finally {
                setLoading(false);
            }
        };
        fetchValues();
    }, [selectedCategory]);

    const createCategory = async (name) => {
        try {
            const response = await axios.post('http://localhost:5000/api/categories', { 
                name 
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Category creation failed:", error);
            throw error;
        }
    };

    const createValue = async (name, categoryId) => {
        try {
            const response = await axios.post('http://localhost:5000/api/values', {
                name,
                category_id: categoryId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Value creation failed:", error);
            throw error;
        }
    };

    const handleCategorySelect = async (item) => {
        setLoading(true);
        setError(null);
        try {
            console.log("Searching for category:", item.name, "in", categories);
            
            let category = categories.find(c => c.name === item.name);
            
            if (!category && allowCreation) {
                category = await createCategory(item.name);
                if (!category) throw new Error("Category creation returned null");
                setCategories(prev => [...prev, category]);
            }
    
            if (category) {
                setSelectedCategory(category);
                setCategoryFilter(category.id);
                setCategorySearch(category.name);
                setSelectedValue(null); // Reset value when category changes
                setValueFilter(null);
            } else {
                throw new Error("Category is undefined after lookup/creation");
            }
        } catch (error) {
            console.error("Error in handleCategorySelect:", error);
            setError(error.message || 'Failed to select category');
        } finally {
            setLoading(false);
        }
    };

    const handleValueSelect = async (item) => {
        if (!selectedCategory) {
            setError('Please select a category first');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            let value = values.find(v => v.name === item.name);
            
            if (!value && allowCreation) {
                value = await createValue(item.name, selectedCategory.id);
                setValues(prev => [...prev, value]);
            }
            
            if (value) {
                setSelectedValue(value);
                setValueFilter(value.id);
                setValueSearch(value.name);
            }
        } catch (error) {
            setError('Failed to select value');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="category-filter">
            {error && <div className="error-message">{error}</div>}
            
            <div className="filter-group">
                <label>Category:</label>
                <SearchableDropdown
                    items={categories}
                    onSelect={handleCategorySelect}
                    placeholder={allowCreation ? "Search or create category" : "Filter by category"}
                    isLoading={loading}
                    allowCreate={allowCreation}
                    searchTerm={categorySearch}
                    setSearchTerm={setCategorySearch}
                />
            </div>
            
            {selectedCategory && (
                <div className="filter-group">
                    <label>Value:</label>
                    <SearchableDropdown
                        items={values}
                        onSelect={handleValueSelect}
                        placeholder={allowCreation ? "Search or create value" : "Filter by value"}
                        isLoading={loading}
                        allowCreate={allowCreation}
                        searchTerm={valueSearch}
                        setSearchTerm={setValueSearch}
                    />
                </div>
            )}
        </div>
    );
};

export default Categories;