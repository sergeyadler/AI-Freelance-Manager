import React, { useState, useRef, useEffect } from 'react';
import type { CategoryCarouselProps } from '../types';
import { CategoryIcon } from '../utils/categoryIcons';
import { Settings } from 'lucide-react';

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ 
  categories, 
  onSelect,
  onNavigateToCategories
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8; // 2 rows × 4 columns
  const carouselRef = useRef<HTMLDivElement>(null);

  // Reset to first page when categories change (e.g., when toggling income/expense)
  useEffect(() => {
    setCurrentPage(0);
  }, [categories]);

  // Calculate total pages including the categories button
  const categoriesOnlyPages = Math.ceil(categories.length / itemsPerPage);
  const lastPageHasFullCategories = categories.length % itemsPerPage === 0;
  const totalPages = lastPageHasFullCategories ? categoriesOnlyPages + 1 : categoriesOnlyPages;

  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;
    const element = carouselRef.current;
    
    if (!element) return;

    const handleTouchEnd = (evt: Event) => {
      const touchEvent = evt as TouchEvent;
      const endX = touchEvent.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0 && currentPage < totalPages - 1) {
          setCurrentPage(currentPage + 1);
        } else if (diff < 0 && currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
      }
      
      element.removeEventListener('touchend', handleTouchEnd);
    };

    element.addEventListener('touchend', handleTouchEnd);
  };

  // Get current page items
  const isLastPage = currentPage === totalPages - 1;
  const isCategoriesButtonPage = isLastPage && lastPageHasFullCategories;
  
  let currentCategories: typeof categories = [];
  let showCategoriesButton = false;
  
  if (isCategoriesButtonPage) {
    // This is the dedicated categories button page
    showCategoriesButton = true;
  } else if (isLastPage && !lastPageHasFullCategories) {
    // This is the last page with some categories + categories button
    const startIndex = currentPage * itemsPerPage;
    currentCategories = categories.slice(startIndex);
    showCategoriesButton = true;
  } else {
    // Regular page with only categories
    const startIndex = currentPage * itemsPerPage;
    currentCategories = categories.slice(startIndex, startIndex + itemsPerPage);
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <div 
        ref={carouselRef}
        className="carousel"
        onTouchStart={handleTouchStart}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: 0,
          padding: 0
        }}
      >
        {currentCategories.map((cat) => (
          <div
            key={cat.id}
            className="cat-item"
            onClick={() => onSelect(cat.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 6px',
              borderRadius: 8,
              background: '#2f2f3a',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s ease',
              width: '100%',
              height: '80px',
              minHeight: '80px',
              maxHeight: '80px'
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <CategoryIcon categoryName={cat.name} size={24} />
            </div>
            <span style={{ 
              fontSize: 12, 
              textAlign: 'center', 
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '18vw',
              display: 'block'
            }}>
              {cat.name}
            </span>
          </div>
        ))}
        
        {/* Categories Management Button - only on last page */}
        {showCategoriesButton && (
          <div
            className="cat-item"
            onClick={onNavigateToCategories}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 6px',
              borderRadius: 8,
              background: '#2f2f3a',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s ease',
              width: '100%',
              height: '80px',
              minHeight: '80px',
              maxHeight: '80px'
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <Settings size={24} />
            </div>
            <span style={{ 
              fontSize: 12, 
              textAlign: 'center', 
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
              display: 'block'
            }}>
              Categories
            </span>
          </div>
        )}
        
        {/* Empty placeholders to maintain 2-row layout */}
        {Array.from({ length: Math.max(0, 8 - currentCategories.length - (showCategoriesButton ? 1 : 0)) }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            style={{
              width: '100%',
              height: '80px',
              minHeight: '80px',
              maxHeight: '80px'
            }}
          />
        ))}
      </div>
      
      {/* Dot navigation */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 8, 
          marginTop: 16 
        }}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              style={{
                padding: 0,
                width: 8,
                height: 8,
                borderRadius: '50%',
                border: 'none',
                background: index === currentPage 
                  ? 'rgba(255,255,255,0.8)' 
                  : 'rgba(255,255,255,0.3)',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryCarousel;
