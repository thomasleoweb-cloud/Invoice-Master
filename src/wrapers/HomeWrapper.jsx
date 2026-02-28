import Header from "../component/Header"
import Footer from "../component/Footer"
import { Outlet } from "react-router"

const HomeWrapper = () => {
  return (
     <div className="MainLayout flex flex-col min-h-screen">
      <div className="shrink-0 bg-blue-400 pb-2">
        <Header  />
      </div>
      <div className="grow bg-#fffff">
        <Outlet  />
      </div>      
      <div className="shrink-0 bg-blue-400">
        <Footer  />
      </div>
    </div>
  )
}

export default HomeWrapper