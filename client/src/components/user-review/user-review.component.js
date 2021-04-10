import React, { useEffect, useState } from "react";
import { useAxios} from "../../contexts/fetch.context"
import Rating from "@material-ui/lab/Rating";
import "./user-review.styles.scss"
const UserReview = ({ review }) => {
  const { userId, headline, rating, comment, date } = review;
  const [user, setUser] = useState(null);
  const { authAxios } = useAxios();

  useEffect(() => {
    if (!user) {
      authAxios
        .get(`/users/${userId}`)
        .then((res) => setUser(res.data.user))
        .catch((e) => console.log(e));
    }
  }, [userId, authAxios, user]);

  return (
    <div className="user-review-container">
      <div className="d-flex align-items-center">
        <img
          className="rounded-circle mr-2"
          src={user ? user.avatar : ""}
          alt="avatar"
          style={{ width: 50, height: 50 }}
        />
        <p className="font-weight-bold">{user && user.username}</p>
      </div>
      <div>
        <div className="d-flex align-items-center mt-3">
          <Rating name="read-only" value={rating} readOnly />
          <p className="ml-2 font-weight-bold">{headline}</p>
        </div>
        <p>
          <span>Reviewed on </span>
          {new Date(date).toLocaleString("en-us", {
            month: "long",
            year: "numeric",
            day: "numeric",
          })}
        </p>
      </div>

      <p className="mt-2">{comment}</p>
    </div>
  );
};

export default UserReview;
