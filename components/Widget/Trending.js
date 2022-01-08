import React from 'react'

const Trending = ({result}) => {
    return (
        <div
        className="hover:bg-gray-600 hover-bg-opacity-[0.04]  p-2 cursor-pointer transition duration-200 ease-out flex justify-between ">
        <div className="space-y-1.5">
          <p className="text-[#6e767d] text-xs font-medium">{result.heading}</p>
          <p className="font-bold max-w-[170px]">{result.description}</p>

          <p>{
            result?.tags?.map((tag,index)=>(
              <span key={index} className="tag">{tag}</span>
            ))
          }</p>

        </div>
        {result.img?(
          <img src={result.img}
            className="my-2 ml-3 w-20 h-20 object-cover rounded-2xl"
          />

        ):""
        }


        </div>
    )
}

export default Trending
