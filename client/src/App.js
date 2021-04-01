import React from "react";
import Header from "./components/header/header.component";
import Footer from "./components/footer/footer.component";
import { Switch, Route, Redirect } from "react-router-dom";
import HomePage from "./pages/home/home.component";
import ListBook from "./pages/list-books/list-book.component";
import SearchBook from "./pages/search/search.component";
import ProfilePage from "./pages/profile/profile.component";
import { useStateValue } from "./contexts/state.provider";
import "./App.css";
import SignInAndSignUpPage from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import BookPage from "./pages/book-page/book-page.component";
const App = () => {
  const {
    state: { currentUser },
  } = useStateValue();

  return (
    <div className="App">
      <Header />

      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/profile" render={()=> currentUser ? <ProfilePage /> : <SignInAndSignUpPage />} />
        <Route path="/search" component={SearchBook} />
        <Route
          path="/book/:id"
          render={({location: {state}, match: {params}}) => <BookPage data={{state, id: params.id }}/>}
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
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
