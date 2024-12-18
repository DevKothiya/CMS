import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategories } from '../services'
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    getCategories().then((newCategories) => setCategories(newCategories));
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category); // Set the clicked category as selected
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mb-8 pb-12">
      <h3 className='text-xl mb-8 font-semibold border-b pb-4'>
        Categories
      </h3>
      {/* {categories.map((category)=>(
        <Link key={category.slug} href={`/category/${category.slug}`}>
          <span className='cursor-pointer block pb-3 mb-3'>
            {category.name}
          </span>

        </Link>
      ))} */}
      {categories.map((category) => (
        <Link key={category.slug} href={`/category/${category.slug}`}>
          <span
            onClick={() => handleCategoryClick(category)} // Add click handler
            className={`cursor-pointer block pb-3 mb-3 ${
              selectedCategory?.slug === category.slug
                ? 'text-yellow-800 font-semibold' // Selected category style
                : 'text-gray-700' // Default style
            }`}
          >
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  )
}

export default Categories

