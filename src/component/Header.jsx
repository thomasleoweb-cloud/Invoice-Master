import { Link } from "react-router"

const Header = () => {
    const Menu = [
        {
            name: 'Home',
            path: ''
        },
        {
            name: 'Invoice',
            path: '/invoice'
        },
        {
            name: 'Download',
            path: '/download'
        },
    ]
  return (
      <div className="Header flex flex-col justify-center items-center h-full">
          <nav className="NavBar flex justify-between w-11/12 md:w-10/12">
              <div className="BurgerBox flex items-center justify-center md:hidden">
                  <i class="fa-solid fa-bars"></i>
              </div>
              <h1 className="Logo print:hidden font-bold text-white text-2xl md:text-4xl"><span className="font-extrabold text-blue-950 print:hidden">I</span>nvoice <span className="font-extrabold text-blue-950 print:hidden">M</span>aster</h1>
              <div className="navLinksBox hidden md:block">
                  <ul className="ulNav flex gap-5 font-medium text-xl h-full px-5 lg:gap-20">
                      {
                          Menu?.map(item => 
                              <li key={item?.name} className="liNav cursor-pointer hover:underline mt-2.5">
                                  <Link to={item?.path}>{item?.name}</Link>
                              </li>
                          )
                      }
                  </ul>
              </div>
          </nav>
      </div>
  )
}

export default Header