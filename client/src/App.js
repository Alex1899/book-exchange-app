import React from "react";
import Header from "./components/header/header.component";
import Footer from "./components/footer/footer.component";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/home/home.component";
import ListBook from "./pages/list-books/list-book.component";
import SearchBook from "./pages/search/search.component";
import ProfilePage from "./pages/profile/profile.component";
import { useStateValue } from "./contexts/auth.context";
import AddReview from "./pages/review/add-review.component";
import "./App.scss";
import SignInAndSignUpPage from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import BookPage from "./pages/book-page/book-page.component";
import SendVerificationLink from "./pages/send-verification-link/send-verification-link.component";
import VerificationDone from "./pages/verification-done/verification-done.component";
import NotFoundPage from "./pages/404/not-found.component";

const App = () => {
  const { userInfo, isAuthenticated } = useStateValue();

  return (
    <div className="App">
      <Header />

      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route
          path="/profile"
          render={() =>
            isAuthenticated() ? <ProfilePage /> : <SignInAndSignUpPage />
          }
        />
        <Route path="/search" component={SearchBook} />
        <Route
          exact
          path="/book/:id"
          render={({ match: { params } }) => <BookPage id={params.id} />}
        />
        <Route
          path="/book/:id/add-review"
          render={({ match: { params } }) =>
            isAuthenticated() ? (
              <AddReview bookId={params.id} userId={userInfo.userId} />
            ) : (
              <SignInAndSignUpPage />
            )
          }
        />
        <Route
          path="/list-book"
          render={(props) =>
            isAuthenticated() ? <ListBook /> : <SignInAndSignUpPage />
          }
        />

        <Route
          path="/signin"
          render={(props) =>
            isAuthenticated() ? props.history.goBack() : <SignInAndSignUpPage />
          }
        />
        <Route
          path="/send-verification-link"
          render={({ location: { state } }) =>
            !isAuthenticated() ? (
              <SendVerificationLink email={state.email ? state.email : null} />
            ) : (
              <HomePage />
            )
          }
        />

        <Route
          path="/verify-email/:id/:token"
          render={({ match: { params } }) => (
            <VerificationDone params={params} />
          )}
        />
        <Route path="*" component={NotFoundPage} />
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
