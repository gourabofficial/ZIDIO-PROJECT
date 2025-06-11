import React from 'react';
import { User, Calendar, Edit, Trash2 } from 'lucide-react';
import StarRating from '../common/StarRating';

const ReviewCard = ({ 
  review, 
  showActions = false, 
  onEdit, 
  onDelete,
  loading = false 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    // Always show stars, never N/A, for individual reviews
    return <StarRating rating={rating} size={18} showRating={false} totalReviews={1} />;
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center border border-gray-600">
            <User size={20} className="text-gray-300" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-lg">
              {review.owner?.fullName || 'Anonymous User'}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar size={14} />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit && onEdit(review)}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50 bg-gray-700 rounded-md hover:bg-gray-600 border border-gray-600"
              title="Edit review"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete && onDelete(review)}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 bg-gray-700 rounded-md hover:bg-gray-600 border border-gray-600"
              title="Delete review"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-4">
        {renderStars(review.rating)}
      </div>

      {/* Comment */}
      <div className="text-gray-300 text-sm leading-relaxed bg-gray-900 rounded-md p-4 border border-gray-700">
        {review.comment}
      </div>

      {/* Product Info (for user's reviews page) */}
      {review.productId && review.productId.name && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Product:</span>
            <span className="text-sm font-medium text-gray-300">
              {review.productId.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;