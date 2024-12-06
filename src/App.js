import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Components/Login";
import Dash from "./Components/Dash";
import { useDispatch } from "react-redux";
import { getAllBatch } from "./Reducer/Reducer";
import AddBatch from "./Components/AddBatch";
import ViewBatch from "./Components/ViewBatch";
import Attandance from "./Components/Attandance";

function App() {
  const dispatch = useDispatch()

  const routes = createBrowserRouter(
    [
      { path: "/", element: <Dash /> },
      { path: "/login", element: <Login /> },
      { path: "/addbatch", element: <AddBatch /> },
      { path: "/viewbatch/:title/:id", element: <ViewBatch /> },
      { path: "/attendancesheet/:batch_title/:batch_id", element: <Attandance /> }
    ]
  )


  function fetchAllData() {
    dispatch(getAllBatch())
  }
  useEffect(() => {
    fetchAllData()
  }, [])
  return (
    <div className="App">
      <RouterProvider router={routes}>
      </RouterProvider>
    </div>
  );
}

export default App;
