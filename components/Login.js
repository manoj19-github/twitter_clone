import React from 'react'
import {signIn} from "next-auth/react"
import Image from "next/image"

const Login = ({providers}) => {
  const handleClick=(provider)=>{

    signIn(provider.id,{callbackUrl:"/"})

  }
    return (
        <div className="flex justify-center pt-10 items-center flex-col space-y-20">
            <img
              src="https://blog.logomyway.com/wp-content/uploads/2020/12/twitter-logo2.jpg"
              className="w-[240px] sm:w-[350px] lg:w-[400px] max-w-lg h-full"
            />
            <div>
            {Object?.values(providers)?.map(provider=>(
              <div key={provider.name}>
                <a href="#" onClick={()=>handleClick(provider)} className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-md shadow-2xl group">
                  <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-br from-pink-600 via-purple-700 to-blue-400 group-hover:opacity-100"></span>
                  <span className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-5 h-1/3"></span>
                  <span className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5"></span>
                  <span className="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-5"></span>
                  <span className="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent opacity-5"></span>
                  <span className="absolute inset-0 w-full h-full border border-white rounded-md opacity-10"></span>
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-5"></span>
                  <span className="relative">Sign In With {provider.name}</span>
                </a>
              </div>
            ))}
            </div>
        </div>
    )
}

export default Login
