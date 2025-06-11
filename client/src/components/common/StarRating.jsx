import React from 'react';

const StarRating = ({ 
  rating, 
  maxRating = 5, 
  size = 18, 
  showRating = true, 
  showCount = false, 
  totalReviews = 0,
  className = "",
  starClassName = ""
}) => {
  // Custom Star SVG component that properly fills
  const StarSVG = ({ filled, halfFilled = false }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`${starClassName}`}
    >
      <defs>
        {halfFilled && (
          <linearGradient id="half-fill">
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="50%" stopColor="#6b7280" />
          </linearGradient>
        )}
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={halfFilled ? "url(#half-fill)" : filled ? "#facc15" : "#6b7280"}
        stroke={filled ? "#facc15" : "#6b7280"}
        strokeWidth="1"
        className="drop-shadow-sm"
      />
    </svg>
  );

  const renderStars = () => {
    const stars = [];
    const fullRating = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add filled stars
    for (let i = 1; i <= fullRating; i++) {
      stars.push(
        <StarSVG
          key={`filled-${i}`}
          filled={true}
        />
      );
    }
    
    // Add half star if needed
    if (hasHalfStar && fullRating < maxRating) {
      stars.push(
        <StarSVG
          key="half-star"
          halfFilled={true}
        />
      );
    }
    
    // Add empty stars
    const emptyStars = maxRating - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarSVG
          key={`empty-${i}`}
          filled={false}
        />
      );
    }
    
    return stars;
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center gap-1">
        {totalReviews > 0 ? renderStars() : <span className="text-gray-400 text-sm font-medium">N/A</span>}
      </div>
      
      {/* Rating Text */}
      {showRating && totalReviews > 0 && (
        <span className="ml-2 text-sm text-gray-300 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
      
      {/* Review Count */}
      {showCount && totalReviews > 0 && (
        <span className="ml-1 text-sm text-gray-400">
          ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
        </span>
      )}
    </div>
  );
};

export default StarRating;
