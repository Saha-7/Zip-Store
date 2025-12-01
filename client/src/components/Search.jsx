import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';

const Search = () => {
  const navigate=useNavigate()
  const location = useLocation()
  console.log(location)

  const [searchPage,setSearchPage] = useState(false)

  useEffect(()=>{
    const isSearch = location.pathname==="/search"
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchPage(isSearch)
  },[location])

  console.log(searchPage)


  const redirectedToSearch = () =>{
    navigate("/search")
  }

  return (
    <div  className="w-full  min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 focus-within:border-yellow-300 focus-within:text-yellow-500 transition-all duration-200">
      <button className="flex justify-center h-full items-center p-2 group-focus-within:text-primary-200">
        <FaSearch />
      </button>

      <div className="w-full h-full flex justify-center items-center">
        {!searchPage? (
          <div onClick={redirectedToSearch} className="w-full h-full pr-2 items-center flex justify-start">
         <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        'Search "Milk"',
        1000, // wait 1s before replacing "Mice" with "Hamsters"
        'Search "Eggs"',
        1000,
        'Search "Paneer"',
        1000,
        'Search "Rice"',
        1000
      ]}
      wrapper="span"
      speed={50}
      repeat={Infinity}
    />
      </div>
        ):(
          <div className="w-full h-full">
            <input className="w-full h-full bg-transparent outline-none"
            autoFocus
            type="text"
            placeholder="Search for items"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
