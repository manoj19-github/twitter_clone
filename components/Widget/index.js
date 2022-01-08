import React from 'react'
import {FiSearch} from "react-icons/fi"
import Trending from "./Trending"
const Widget = ({
      trendingResults,
      followResults
    }) => {
      console.log("trendingResults",trendingResults)
    return (
        <div className="hidden lg:inline  mx-2  py-2 space-y-2 w-8/12 ">
          <div className="sticky top-0 py-1.5 bg-black z-59 w-full mx-2 flex justify-between flex-col">
          <div className="flex items-center mx-auto bg-[#202327]  rounded-full relative focus:border-b focus:border-red-500">
            <div className="icon">
              <FiSearch size={22}/>
            </div>
            <input
            className="bg-transparent placeholder-gray-500 outline-none  text-[#d9d9d9] inset-0 border-0 w-full ease focus:border-b focus:border-[#1b9bf0]"/>
          </div>
        </div>
        <div className="text-[#d9d9d9] space-y-2 bg-[#15181c] rounded-xl w-11/12 mx-auto">
          <h5 className="font-bold text-xl px-5">What's Happening</h5>

          {
            trendingResults.map((result,index)=>(
              <Trending key={index} result={result}/>
            ))
          }
          <button
          className="hover:bg-gray-700 px-4 py-3 cursor-pointer duration-200 ease-out justify-between w-full text-[#1b9bf0] rounded-full"
          >Show More</button>

        </div>
        <div className="text-[#d9d9d9] space-y-2 bg-[#15181c] rounded-xl w-11/12 mx-auto">
          <h5 className="font-bold text-xl px-5">Who To Follow</h5>

          {
            followResults.map((result,index)=>(
              <div
                className="flex hover:bg-gray-700 px-4 py-3 cursor-pointer duration-200 ease-out items-center"
                key={index}
              >
              <img
                src={result.userImg}
                alt="image"
                className="mx-2 w-10 h-10 rounded-full"
                />
                <div
                  className="ml-2 leading-5 group"
                >
                <h4 className="text-[15px] text-gray-500 font-bold group-hover:underline">{result.username}</h4>
                <h5>{result.tag}</h5>
                </div>
                <button className="ml-auto bg-white text-black py-1.5 px-2 font-bold rounded-full text-sm   ">Follow</button>
              </div>
            ))
          }
          <button
          className="hover:bg-gray-700 px-4 py-3 cursor-pointer duration-200 ease-out justify-between w-full text-[#1b9bf0] rounded-full"
          >Show More</button>

        </div>
        </div>
    )
}

export default Widget
