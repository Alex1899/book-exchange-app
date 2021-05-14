import React from "react";
import "./reviews.styles.scss";
import HorizontalLine from "../horizontal-line/horizontal-line.component";
import UserReview from "../user-review/user-review.component";

const Reviews = ({ reviews }) => {
  console.log("reviews", reviews);

  return (
    <div className="all-reviews">
      <h5 className="font-weight-bold text-center mt-3">Product reviews</h5>
      <HorizontalLine className="mb-3" color="lightgray" />
      <div className="user-reviews-list">
        <div>
        {reviews.length > 0 ? (
          reviews.map((review, i) => <UserReview key={i} review={review} />)
        ) : (
          <p className="text-center"> There are no reviews for this book</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default Reviews;
