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
    <div  className="w-full min-w-[300px] lg:min-w-[420px] h-12 rounded-lg border overflow-hidden text-neutral-500 flex items-center bg-slate-100">
      <button className="flex justify-center h-full items-center p-2">
        <FaSearch />
      </button>
      <div onClick={redirectedToSearch} className="w-full pr-2">
         <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        'Search "Milk"',
        1000, // wait 1s before replacing "Mice" with "Hamsters"
        'Search "Egg"',
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
    </div>
  )
}

export default Search
