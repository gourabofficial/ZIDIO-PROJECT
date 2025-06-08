import React, { useState, useEffect } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import { addProductReview, updateProductReview } from '../../Api/user';

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  productId, 
  orderId, 
  productName, 
  existingReview = null,
  onReviewAdded 
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    }
  }, [existingReview]);

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    setHoveredRating(starValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewData = {
        productId,
        orderId,
        rating,
        comment: comment.trim()
      };

      let result;
      if (existingReview) {
        result = await updateProductReview(existingReview._id, { rating, comment: comment.trim() });
      } else {
        result = await addProductReview(reviewData);
      }

      if (result.success) {
        onReviewAdded && onReviewAdded(result.review);
        onClose();
        // Reset form
        setRating(0);
        setComment('');
        setError('');
      } else {
        setError(result.message || 'Failed to submit review');
      }
    } catch (error) {
      setError('An error occurred while submitting your review');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(existingReview?.rating || 0);
    setComment(existingReview?.comment || '');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/30 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {existingReview ? 'Edit Review' : 'Write a Review'}
            </h2>
            <button
              onClick={handleClose}
              className="text-purple-300 hover:text-white transition-colors bg-slate-800/50 rounded-lg p-2 hover:bg-slate-700/50"
            >
              <X size={24} />
            </button>
          </div>

          {/* Product Name */}
          <div className="mb-6 bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
            <p className="text-sm text-purple-400 mb-2">Product:</p>
            <p className="font-semibold text-white">{productName}</p>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-purple-300 mb-4">
              Your Rating *
            </label>
            <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-all duration-200 hover:scale-110"
                >
                  <Star
                    size={36}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current drop-shadow-lg'
                        : 'text-slate-600'
                    } hover:text-yellow-400 transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-purple-300 font-medium">
                {rating > 0 && (
                  <>
                    {rating} star{rating !== 1 ? 's' : ''}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-purple-300 mb-3">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 resize-none text-white placeholder-slate-400 transition-all duration-200"
              maxLength={500}
            />
            <div className="text-right text-xs text-purple-400 mt-2">
              {comment.length}/500 characters
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-500/50 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || rating === 0 || !comment.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  {existingReview ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                existingReview ? 'Update Review' : 'Submit Review'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;