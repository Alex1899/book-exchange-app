import React from "react";
import Header from "./components/header/header.component";
import Footer from "./components/footer/footer.component";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import HomePage from "./pages/home/home.component";
import ListBook from "./pages/list-books/list-book.component";
import SearchBook from "./pages/search/search.component";
import ProfilePage from "./pages/profile/profile.component";
import { useStateValue } from "./contexts/state.provider";
import AddReview from "./pages/review/add-review.component";
import "./App.css";
import SignInAndSignUpPage from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import BookPage from "./pages/book-page/book-page.component";
import SendVerificationLink from "./pages/send-verification-link/send-verification-link.component";
import VerificationDone from "./pages/verification-done/verification-done.component";

const App = () => {
  const {
    state: { currentUser },
  } = useStateValue();
  const history = useHistory()

  return (
    <div className="App">
      <Header />

      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route
          path="/profile"
          render={() =>
            currentUser ? <ProfilePage /> : <SignInAndSignUpPage />
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
          render={({ match: { params } }) => (
            <AddReview bookId={params.id} userId={currentUser.userId} />
          )}
        />
        <Route
          path="/list-book"
          render={(props) =>
            currentUser ? <ListBook /> : <SignInAndSignUpPage />
          }
        />

        <Route
          path="/signin"
          render={(props) =>
            currentUser ? props.history.goBack() : <SignInAndSignUpPage />
          }
        />
        <Route
          path="/send-verification-link"
          render={({ location: { state } }) =>
            !currentUser ? (
              <SendVerificationLink email={state.email ? state.email : null} />
            ) : (
              <HomePage />
            )
          }
        />

        <Route path="/verify-email/:id/:token" render={({match: {params}}) => <VerificationDone params={params}/>}/>
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
