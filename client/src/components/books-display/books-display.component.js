import React, { useState, useEffect } from "react";
import { useStateValue } from "../../contexts/state.provider";
import { ACTION } from "../../reducer/action-types/action-types";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import ProfileBook from "../profile-book/profile-book.component";
import HorizontalLine from "../horizontal-line/horizontal-line.component";
import axios from "axios";
import DatePicker from "react-datepicker";
import "./books-display.styles.scss";
import { Button } from "react-bootstrap";
import CustomButton from "../custom-button/custom-button.component";

const BooksDisplay = () => {
  const {
    state: { currentUser },
    dispatch,
  } = useStateValue();
  const { userId, purchasedBooks, currentlySelling, soldBooks } = currentUser;
  const [books, setBooks] = useState({
    type: "purchasedBooks",
    data: null,
  });
  const [alert, setAlert] = useState({ show: false, text: "" });
  const [selectCustomDates, toggleSelectCustomDates] = useState(false);
  const [customDate, setCustomDate] = useState(null);
  let currDate = new Date();
  console.log("purchasedbooks", purchasedBooks);

  useEffect(() => {
    if (!books.data) {
      axios
        .get(`/users/${userId}/books`)
        .then((res) => {
          console.log("getbooks ", res.data);
          dispatch({ type: ACTION.UPDATE_USER_BOOKS, payload: res.data });
          setBooks({...books, data: [...res.data.purchasedBooks]});
        })
        .catch((e) => console.log(e));
    }
  }, [userId, books, dispatch]);

  const handleClick = (e) => {
    const type = e.target.id;
    switch (type) {
      case "purchasedBooks":
        setBooks({ type, data: purchasedBooks });
        break;

      case "soldBooks":
        setBooks({ type, data: soldBooks });
        break;

      case "currentlySelling":
        setBooks({ type, data: currentlySelling });
        break;
      default:
        console.log("Wrong book type");
        break;
    }
  };

  const getWeek = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(
      ((new Date(date) - onejan) / 86400000 + onejan.getDay() + 1) / 7
    );
  };

  const handleTimePeriodSelect = (e) => {
    const period = e.target.value;
    switch (period) {
      case "Last week":
        let lastWeek = getWeek(currDate) - 1;
        setBooks({
          ...books,
          data: books.data.filter(
            ({ date }) => getWeek(new Date(date)) === lastWeek
          ),
        });
        break;

      case "Last month":
        let lastMonth = currDate.getMonth() - 1;
        setBooks({
          ...books,
          data: books.data.filter(
            ({ date }) => new Date(date).getMonth() === lastMonth
          ),
        });
        break;

      case "Last year":
        let lastYear = currDate.getFullYear() - 1;
        setBooks({
          ...books,
          data: books.data.filter(
            ({ date }) => new Date(date).getFullYear() === lastYear
          ),
        });
        break;
      case "Custom dates":
        toggleSelectCustomDates(!selectCustomDates);
        break;
      default:
        setBooks({ ...books, data: currentUser[books.type] });
        break;
    }
  };

  const handleDateChange = (date, type) => {
    switch (type) {
      case "start":
        setCustomDate({ ...customDate, startDate: date });
        break;
      case "end":
        setCustomDate({ ...customDate, endDate: date });
        break;
      default:
        console.log("wrong date type");
        break;
    }
  };

  const handleCustomDateButtonClick = () => {
    if (customDate) {
      if (customDate.startDate && customDate.endDate) {
        if (customDate.startDate.getDate() === customDate.endDate.getDate()) {
          console.log("Dates are equal");
          setAlert({
            show: true,
            text: "Start and End dates can not be equal",
          });
          return;
        }

        if (customDate.startDate > customDate.endDate) {
          setAlert({
            show: true,
            text: "End date can not come before the start date",
          });
          return;
        }

        // reached here, all good
        console.log("Reached here, all good");
        setBooks({
          ...books,
          data: books.data.filter(
            ({ date }) =>
              new Date(customDate.startDate) >= new Date(date) &&
              new Date(date) <= new Date(customDate.endDate)
          ),
        });
        return;
      } else {
        setAlert({
          show: true,
          text: "Make sure both dates are selected before applying",
        });
      }
    } else {
      setAlert({
        show: true,
        text: "Please select dates before applying",
      });
    }
  };

  return (
    <div className="d-flex flex-column align-items-center display-div">
      {alert.show && (
        <AlertDialog
          show={alert.show}
          text={alert.text}
          handleClose={() => setAlert({ ...alert, show: !alert.show })}
        />
      )}
      {/* <HorizontalLine color="lightGray" /> */}
      <div className="d-flex justify-content-center types-div">
        <p
          id="purchasedBooks"
          className={`${books.type === "purchasedBooks" && "p-active"} mr-5`}
          onClick={handleClick}
        >
          Purchased
        </p>
        <p
          id="soldBooks"
          className={`${books.type === "soldBooks" && "p-active"}`}
          onClick={handleClick}
        >
          Sold
        </p>
        <p
          id="currentlySelling"
          className={`${books.type === "currentlySelling" && "p-active"} ml-5`}
          onClick={handleClick}
        >
          Selling
        </p>
      </div>
      {!selectCustomDates ? (
        <div className="d-flex align-items-center mt-4 mb-4">
          <p className="mr-2">Filter based on time period </p>
          <select className="select-css" onChange={handleTimePeriodSelect}>
            <option>Select Time Period</option>
            <option>Last week</option>
            <option>Last month</option>
            <option>Last year</option>
            <option>Custom dates</option>
          </select>
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center mt-4 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center m-3">
              <p>Select start date: </p>
              <DatePicker
                selected={
                  customDate && customDate.startDate
                    ? customDate.startDate
                    : currDate
                }
                maxDate={currDate}
                onChange={(date) => handleDateChange(date, "start")}
              />
            </div>
            <div className="d-flex align-items-center m-3">
              <p>Select end date: </p>
              <DatePicker
                selected={
                  customDate && customDate.endDate
                    ? customDate.endDate
                    : currDate
                }
                maxDate={currDate}
                onChange={(date) => handleDateChange(date, "end")}
              />
            </div>
          </div>

          <div className="d-flex align-items-center">
            <CustomButton
              style={{ marginRight: 10 }}
              type="submit"
              onClick={handleCustomDateButtonClick}
            >
              Apply
            </CustomButton>
            <CustomButton
              onClick={() => toggleSelectCustomDates(!selectCustomDates)}
            >
              Cancel
            </CustomButton>
          </div>
        </div>
      )}

      {/* List book components */}
      <div className="d-flex flex-column align-center mt-4">
        {books.data &&
          (books.data.length > 0 ? (
            books.data.map(({ book }, i) => (
              <div key={i}>
                <ProfileBook book={book} />
                <HorizontalLine color="lightgrey" />
              </div>
            ))
          ) : (
            <div>User has no {books.type} books</div>
          ))}
      </div>
    </div>
  );
};

export default BooksDisplay;
