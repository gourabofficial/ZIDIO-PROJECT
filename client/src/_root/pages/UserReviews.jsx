import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiEdit3, FiTrash2, FiRefreshCw, FiMessageSquare } from 'react-icons/fi';
import { useAuthdata } from '../../context/AuthContext';
import { getUserReviews, deleteProductReview } from '../../Api/user';
import ReviewCard from '../../components/Review/ReviewCard';
import ReviewModal from '../../components/Review/ReviewModal';
import { useNavigate } from 'react-router-dom';

const UserReviews = () => {
  const { isAuth, isLoaded } = useAuthdata();
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const reviewsPerPage = 10;

  useEffect(() => {
    if (isLoaded && isAuth) {
      fetchUserReviews(1);
    }
  }, [isLoaded, isAuth]);

  const fetchUserReviews = async (page) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await getUserReviews(page, reviewsPerPage);
      
      if (result.success) {
        setReviews(result.reviews);
        setPagination(result.pagination);
        setCurrentPage(page);
      } else {
        setError(result.message || 'Failed to load your reviews');
      }
    } catch (error) {
      setError('An error occurred while loading your reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowEditModal(true);
  };

  const handleDeleteReview = async (review) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setDeleteLoading(review._id);
    
    try {
      const result = await deleteProductReview(review._id);
      
      if (result.success) {
        // Remove the review from the list
        setReviews(prev => prev.filter(r => r._id !== review._id));
      } else {
        setError(result.message || 'Failed to delete review');
      }
    } catch (error) {
      setError('An error occurred while deleting the review');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleReviewUpdated = (updatedReview) => {
    // Update the review in the list
    setReviews(prev => 
      prev.map(review => 
        review._id === updatedReview._id ? updatedReview : review
      )
    );
    
    // Close modal and reset state
    setShowEditModal(false);
    setEditingReview(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUserReviews(newPage);
    }
  };

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#0c0e16] pt-24 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  // Auth check
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#0c0e16] pt-24 flex items-center justify-center">
        <div className="text-center">
          <FiMessageSquare className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">Please log in to view your reviews.</p>
          <button
            onClick={() => navigate("/sign-in")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0e16] pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              My Reviews
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              Manage your product reviews
            </p>
          </div>
          <button
            onClick={() => fetchUserReviews(currentPage)}
            className="p-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/50 transition-all duration-200"
          >
            <FiRefreshCw className="w-5 h-5 text-purple-400" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 && !loading ? (
          <div className="text-center py-16">
            <FiMessageSquare size={64} className="mx-auto text-gray-600 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">No Reviews Yet</h3>
            <p className="text-gray-400 mb-6">
              You haven't written any reviews yet. Purchase and receive products to start reviewing!
            </p>
            <button
              onClick={() => navigate('/orders')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              View My Orders
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-900/30 overflow-hidden"
              >
                <ReviewCard
                  review={review}
                  showActions={true}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                  loading={deleteLoading === review._id}
                />
              </motion.div>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-700 pt-6">
                <div className="text-sm text-gray-400">
                  Showing {((currentPage - 1) * reviewsPerPage) + 1} to {Math.min(currentPage * reviewsPerPage, pagination.totalReviews)} of {pagination.totalReviews} reviews
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage || loading}
                    className="flex items-center px-4 py-2 text-sm text-gray-400 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <span className="text-sm text-gray-400">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage || loading}
                    className="flex items-center px-4 py-2 text-sm text-gray-400 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Review Modal */}
      <ReviewModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingReview(null);
        }}
        productId={editingReview?.productId?._id}
        orderId={editingReview?.orderId}
        productName={editingReview?.productId?.name}
        existingReview={editingReview}
        onReviewAdded={handleReviewUpdated}
      />
    </div>
  );
};

export default UserReviews;
