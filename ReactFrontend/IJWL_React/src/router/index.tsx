import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Homepage from "../RightSideMainView/Homepage";
import Learning from "../RightSideMainView/Learning";
import MyProfile from "../RightSideMainView/MyProfile";
import ScopeChoosing from "../RightSideMainView/ScopeChoosing";
import Test from "../RightSideMainView/Test";
import TestResult from "../RightSideMainView/TestResult";
import TestHistory from "../RightSideMainView/TestHistory";
import WordList from "../RightSideMainView/WordList";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        children: [
            {
                index: true,
                element: <Homepage />,
            },
            {
                path: "learning",
                element: <Learning />,
            },
            {
                path: "myprofile",
                element: <MyProfile />,
            },
            {
                path: "scopechoosing",
                element: <ScopeChoosing />,
            },
            {
                path: "test",
                element: <Test />,
            },
            {
                path: "testresult",
                element: <TestResult />,
            },
            {
                path: "testhistory",
                element: <TestHistory />,
            },
            {
                path: "wordlist",
                element: <WordList />,
            },
        ],
    },
    {
        path: "login",
        element: <Login />,
    },
    {
        path: "register",
        element: <Register />,
    },
],
);

export default router