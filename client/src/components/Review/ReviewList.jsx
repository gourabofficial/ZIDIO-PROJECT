import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import ReviewCard from './ReviewCard';
import StarRating from '../common/StarRating';
import { getProductReviews } from '../../Api/user';

const ReviewList = ({ productId, showTitle = true }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');

  const reviewsPerPage = 5;

  useEffect(() => {
    if (productId) {
      fetchReviews(1);
    }
  }, [productId]);

  const fetchReviews = async (page) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await getProductReviews(productId, page, reviewsPerPage);
      
      if (result.success) {
        setReviews(result.reviews);
        setPagination(result.pagination);
        setStats(result.stats);
        setCurrentPage(page);
      } else {
        setError(result.message || 'Failed to load reviews');
      }
    } catch (error) {
      setError('An error occurred while loading reviews');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchReviews(newPage);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={`${
              star <= rating
                ? 'text-yellow-400 fill-current drop-shadow-sm'
                : 'text-slate-500'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingDistribution = () => {
    if (!stats.ratingDistribution || stats.totalReviews === 0) return null;

    return (
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution[rating] || 0;
          const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center space-x-3 text-sm">
              <span className="w-8 text-purple-300 font-medium">{rating}★</span>
              <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-purple-300 text-right font-medium">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading && currentPage === 1) {
    return (
      <div className="space-y-6">
        {showTitle && <h3 className="text-2xl font-bold text-white mb-6">Customer Reviews</h3>}
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 h-40 rounded-xl border border-purple-500/20"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {showTitle && (
        <div className="border-b border-purple-500/30 pb-6">
          <h3 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Customer Reviews
          </h3>
          
          {/* Average Rating Display */}
          {stats.totalReviews > 0 && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-purple-500/20 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Average Rating */}
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">
                      {stats.averageRating.toFixed(1)}
                    </div>
                    <div className="text-sm text-purple-300">out of 5</div>
                  </div>
                  <div className="flex flex-col items-start">
                    <StarRating 
                      rating={stats.averageRating} 
                      totalReviews={stats.totalReviews}
                      size={24}
                      showRating={false}
                      className="mb-2"
                      starClassName="drop-shadow-md"
                    />
                    <div className="text-sm text-purple-300">
                      Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                {/* Rating Distribution */}
                <div className="flex-1 max-w-md">
                  <h4 className="text-sm font-semibold text-purple-300 mb-3">Rating Breakdown</h4>
                  {renderRatingDistribution()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* No Reviews State */}
      {!loading && !error && reviews.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-purple-500/20">
          <MessageSquare size={64} className="mx-auto text-purple-400 mb-6" />
          <h4 className="text-xl font-semibold text-white mb-3">No Reviews Yet</h4>
          <p className="text-purple-300">Be the first to review this product!</p>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-purple-500/30 pt-6">
          <div className="text-sm text-purple-300">
            Showing {((currentPage - 1) * reviewsPerPage) + 1} to {Math.min(currentPage * reviewsPerPage, pagination.totalReviews)} of {pagination.totalReviews} reviews
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage || loading}
              className="flex items-center px-4 py-2 text-sm text-purple-300 bg-gradient-to-r from-slate-800 to-slate-700 border border-purple-500/30 rounded-lg hover:from-purple-800 hover:to-slate-700 hover:border-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>
            
            <span className="text-sm text-purple-300 px-3 py-2 bg-slate-800/50 rounded-lg border border-purple-500/20">
              Page {currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage || loading}
              className="flex items-center px-4 py-2 text-sm text-purple-300 bg-gradient-to-r from-slate-800 to-slate-700 border border-purple-500/30 rounded-lg hover:from-purple-800 hover:to-slate-700 hover:border-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
