import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TodoAppBar from "./Components/Appbar";
import BasicTable from "./Components/Messages";
import ViewOneItem from "./Components/ViewOneItem";
import SignIn from "./Components/SignIn";
import RequireAuth from "./Components/RequiredAuth";
import NotFoundPage from "./Components/NotFoundPage";

function Configuration() {
  return (
    <Router>
      <TodoAppBar />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route element={<RequireAuth/>}>
          <Route path="home" element={<BasicTable />} />
        </Route>
        <Route path="view:name" element={<ViewOneItem />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default Configuration;
