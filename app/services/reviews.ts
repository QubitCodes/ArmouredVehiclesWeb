import API from "./api";

// GET reviews for a product
export const fetchProductReviews = async (productId: string | number) => {
  const res = await API.get(`/products/${productId}/reviews`);
  return res.data || [];
};

// POST a review (token auto-attached by interceptor)
export const createProductReview = async (
  productId: string | number,
  payload: {
    rating: number;
    comment: string;
  }
) => {
  const res = await API.post(`/products/${productId}/reviews`, payload);
  return res.data;
};
