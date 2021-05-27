import React, { useState, useEffect } from "react";
import { useStateValue } from "../../contexts/auth.context";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import ProfileBook from "../profile-book/profile-book.component";
import HorizontalLine from "../horizontal-line/horizontal-line.component";
import { useAxios } from "../../contexts/fetch.context";
import Spinner from "../spinner/spinner.component";
import DatePicker from "react-datepicker";
import "./books-display.styles.scss";
import CustomButton from "../custom-button/custom-button.component";

const hm = {
  purchasedBooks: "purchased books",
  soldBooks: "sold books",
  currentlySelling: "currently selling books",
  allBooks: "books",
};

const BooksDisplay = () => {
  const {
    userInfo: { userId },
  } = useStateValue();
  const [fetching, setFetching] = useState(true);
  const { authAxios } = useAxios();
  const [state, setState] = useState({
    books: null,
    filteredBooks: null,
    booksType: "allBooks",
  });
  const [alert, setAlert] = useState({ show: false, text: "" });
  const [selectCustomDates, toggleSelectCustomDates] = useState(false);
  let currDate = new Date();
  const [customDate, setCustomDate] = useState({
    startDate: currDate,
    endDate: currDate,
  });

  useEffect(() => {
    if (!state.books) {
      authAxios
        .get(`/books/${userId}/allBooks`)
        .then((res) => {
          setState({
            ...state,
            books: res.data.books,
            filteredBooks: res.data.books,
          });
          setFetching(!fetching);
        })
        .catch((e) => console.log(e));
    }
  }, [state, authAxios, fetching, userId]);

  const fetchData = (type) => {
    setFetching(true);
    authAxios
      .get(`/books/${userId}/${type}`)
      .then((res) => {
        console.log(res.data);
        setState({
          booksType: type,
          books: res.data.books,
          filteredBooks: res.data.books,
        });
        setFetching(false);
      })
      .catch((e) => console.log(e));
  };

  const handleClick = (e) => {
    const type = e.target.id;
    fetchData(type);
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
        setState({
          ...state,
          filteredBooks: [
            ...state.books.filter(
              ({ date }) => getWeek(new Date(date)) === lastWeek
            ),
          ],
        });
        break;

      case "Last month":
        let lastMonth = currDate.getMonth() - 1;
        setState({
          ...state,
          filteredBooks: [
            ...state.books.filter(
              ({ date }) => new Date(date).getMonth() === lastMonth
            ),
          ],
        });
        break;

      case "Last year":
        let lastYear = currDate.getFullYear() - 1;
        setState({
          ...state,
          filteredBooks: [
            ...state.books.filter(
              ({ date }) => new Date(date).getFullYear() === lastYear
            ),
          ],
        });
        break;
      case "Custom dates":
        toggleSelectCustomDates(!selectCustomDates);
        break;
      default:
        setState({ ...state, filteredBooks: [...state.books] });
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

        if (customDate.startDate.getDate() > customDate.endDate.getDate()) {
          setAlert({
            show: true,
            text: "End date can not come before the start date",
          });
          return;
        }

        // reached here, all good
        console.log("Reached here, all good");
        setFetching(true);
        setTimeout(() => setFetching(false), 200);
        setState({
          ...state,
          filteredBooks: [
            ...state.books.filter(
              ({ date }) =>
                customDate.startDate.getTime() <= new Date(date).getTime() &&
                new Date(date).getTime() <= customDate.endDate.getTime()
            ),
          ],
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
          id="allBooks"
          className={`${state.booksType === "allBooks" && "p-active"} mr-5`}
          onClick={handleClick}
        >
          My Books
        </p>
        <p
          id="purchasedBooks"
          className={`${
            state.booksType === "purchasedBooks" && "p-active"
          } mr-5`}
          onClick={handleClick}
        >
          Purchased
        </p>
        <p
          id="soldBooks"
          className={`${state.booksType === "soldBooks" && "p-active"}`}
          onClick={handleClick}
        >
          Sold
        </p>
        <p
          id="currentlySelling"
          className={`${
            state.booksType === "currentlySelling" && "p-active"
          } ml-5`}
          onClick={handleClick}
        >
          On Sale
        </p>
      </div>
      {(() => {
        switch (true) {
          case state.booksType === "allBooks" ||
            state.booksType === "currentlySelling":
            return;

          case !selectCustomDates:
            return (
              <div className="d-flex align-items-center mt-4 mb-4">
                <p className="mr-2">Filter based on time period </p>
                <select
                  className="select-css"
                  onChange={handleTimePeriodSelect}
                >
                  <option>Select Time Period</option>
                  <option>Last week</option>
                  <option>Last month</option>
                  <option>Last year</option>
                  <option>Custom dates</option>
                </select>
              </div>
            );
          case selectCustomDates:
            return (
              <div className="custom-dates-select">
                <div className="dates-div">
                  <div className="select-date">
                    <p>Select start date: </p>
                    <DatePicker
                      selected={customDate.startDate}
                      maxDate={currDate}
                      onChange={(date) => handleDateChange(date, "start")}
                    />
                  </div>
                  <div className="select-date">
                    <p>Select end date: </p>
                    <DatePicker
                      selected={customDate.endDate}
                      maxDate={currDate}
                      onChange={(date) => handleDateChange(date, "end")}
                    />
                  </div>
                </div>

                <div className="btn-div">
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
            );
          default:
            return null;
        }
      })()}
      {/* List book components */}
      {!fetching ? (
        (() => {
          switch (state.booksType) {
            case "allBooks":
              return (
                <div className="d-flex flex-column align-center mt-4">
                  {state.filteredBooks && state.filteredBooks.length > 0 ? (
                    state.filteredBooks.map((book, i) => (
                      <div key={i}>
                        <ProfileBook data={{ book, type: state.booksType }} />
                        <HorizontalLine color="lightgrey" />
                      </div>
                    ))
                  ) : (
                    <div>User has no {hm[state.booksType]}</div>
                  )}
                </div>
              );
            default:
              return (
                <div className="d-flex flex-column align-center mt-4">
                  {state.filteredBooks && state.filteredBooks.length > 0 ? (
                    state.filteredBooks.map(({ _id, book, date }) => (
                      <div key={_id}>
                        <ProfileBook
                          data={{ book, date, type: state.booksType }}
                        />
                        <HorizontalLine color="lightgrey" />
                      </div>
                    ))
                  ) : (
                    <div>User has no {hm[state.booksType]}</div>
                  )}
                </div>
              );
          }
        })()
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default BooksDisplay;
