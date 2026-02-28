import { createBrowserRouter, RouterProvider } from "react-router"
import HomeWrapper from "./wrapers/HomeWrapper"
import Home from "./pages/Home"
import Invoice from "./pages/Invoice"

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeWrapper />,
      children: [
        {
          path: '',
          element: <Home />
        },
        {
          path: 'invoice',
          element: <Invoice />
        },
      ]
    }
  ])
  return <RouterProvider  router={router} />
}

export default App