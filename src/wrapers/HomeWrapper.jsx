import Header from "../component/Header"
import Footer from "../component/Footer"
import { Outlet } from "react-router"

const HomeWrapper = () => {
  return (
     <div className="MainLayout grid grid-cols-6 grid-rows-10 min-h-screen">
      <div className="col-span-6 row-span-1 bg-blue-400">
        <Header  />
      </div>
      <div className="col-span-6 row-span-9 bg-#fffff">
        <Outlet  />
      </div>      
      <div className="col-span-6 row-span-1 bg-blue-400">
        <Footer  />
      </div>
    </div>
  )
}

export default HomeWrapper