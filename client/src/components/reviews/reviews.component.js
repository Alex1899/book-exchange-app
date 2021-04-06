import React from "react";
import "./reviews.styles.scss";
import HorizontalLine from "../horizontal-line/horizontal-line.component"
import UserReview from "../user-review/user-review.component";

const Reviews = ({reviews }) => {
  console.log("reviews", reviews)

  return (
    <div className="d-flex flex-column mt-5 justify-content-center" style={{backgroundColor: "white", padding: 10, border: "1px solid lightgray"}}>
        <h5 className="font-weight-bold text-center">Product reviews</h5>
        <HorizontalLine  className="mb-5" color="lightgray"/>

      {reviews.length > 0 ? (
        reviews.map((review, i) => <UserReview key={i} review={review} />)
      ) : (
        <p className="text-center"> There are no reviews for this book</p>
      )}
    </div>
  );
};

export default Reviews;
