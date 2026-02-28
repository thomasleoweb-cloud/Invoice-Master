import { createBrowserRouter, RouterProvider } from "react-router"
import HomeWrapper from "./wrapers/HomeWrapper"

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeWrapper />
    }
  ])
  return <RouterProvider  router={router} />
}

export default App