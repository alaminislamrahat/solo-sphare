import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home";
import Login from "../pages/Authentication/Login";
import Registration from "../pages/Authentication/Register";
import JobDetails from "../pages/JobDetails";
import AddJob from "../pages/AddJob";
import ErrorPage from "../pages/ErrorPage";
import MyPostedJobs from "../pages/MyPostedJobs";
import UpdateJob from "../pages/UpdateJob";
import PrivateRoute from "./PrivateRoute";
import MyBids from "../pages/MyBids";
import BidRequests from "../pages/BidRequests";
import AllJobs from "../pages/AllJobs";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    errorElement : <ErrorPage/>,
    children: [
      {
        index: true,
        element: <Home />,
      
      },
      {
        path : '/login',
        element: <Login/>
      },
      {
        path : '/registration',
        element: <Registration/>
      },
      {
        path : '/registration',
        element: <Registration/>
      },
      {
        path : '/job/:id',
        element: <PrivateRoute><JobDetails/></PrivateRoute>,
        loader : ({params})=> fetch(`${import.meta.env.VITE_API_URL}/job/${params.id}`)

      },
      {
        path : '/update/:id',
        element: <PrivateRoute><UpdateJob/></PrivateRoute>,
        loader : ({params})=> fetch(`${import.meta.env.VITE_API_URL}/job/${params.id}`)

      },
      {
        path : '/add-job',
        element :<PrivateRoute> <AddJob/></PrivateRoute>
      },
      {
        path : '/my-posted-jobs',
        element : <PrivateRoute><MyPostedJobs/></PrivateRoute>
      },
      {
        path : '/my-bids',
        element : <PrivateRoute><MyBids/></PrivateRoute>
      },
      {
        path : '/bid-request',
        element : <PrivateRoute><BidRequests/></PrivateRoute>
      },
      {
        path : '/jobs',
        element : <AllJobs/>
      },
    ]
  }
]);

export default router;