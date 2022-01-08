import React from 'react'
import Image from "next/image"
import SidebarLink from "./SidebarLink"
import {GoHome} from "react-icons/go"
import {BiHash,BiEnvelope,BiBookmark} from "react-icons/bi"
import {BsBell,BsCardList} from "react-icons/bs"
import {CgProfile,CgMoreO} from "react-icons/cg"
import {FiMoreHorizontal} from "react-icons/fi"
import {useSession,signOut} from "next-auth/react"

const Sidebar = () => {
  const {data:session}=useSession()
    return (
        <div
        className="hidden sm:flex flex-col items-center md:items-start sm:w-[200px] md:w-[320px] xl:w-[348px] p-2 sm:px-4 fixed h-full">
          <div className="flex items-center justify-center w-14 h-14 hoverLogo p-0 xl:ml-14">
            <Image
              src="/twitter_clone.png"
              alt="logo"
              width={40}
              height={40}
            />
          </div>
            {/*   sidebar components    */}
          <div className="space-y-1 my-3 xl:ml-[70px] text-white">

            <SidebarLink text="Home" active >
              <GoHome size={25} color="white" className="mr-2"/>
            </SidebarLink>
            <SidebarLink text="Explore">
              <BiHash size={25} color="white" className="mr-2"/>
            </SidebarLink>
            <SidebarLink text="Notifications">
              <div className="relative">
                <span className="absolute text-white bg-[red] px-1 text-xs bottom-2 left-2 rounded-full ">5</span>
                <BsBell size={25} color="white" className="mr-2"/>
              </div>
            </SidebarLink>
            <SidebarLink text="Messages">
              <BiEnvelope size={25} className="mr-3"/>
            </SidebarLink>
            <SidebarLink text="BookMarks">
              <BiBookmark size={25} className="mr-3"/>
            </SidebarLink>
            <SidebarLink text="Lists">
              <BsCardList size={25} className="mr-3"/>
            </SidebarLink>
            <SidebarLink text="Profile">
              <CgProfile size={25} className="mr-3"/>
            </SidebarLink>
            <SidebarLink text="More">
              <CgMoreO size={25} className="mr-3"/>
            </SidebarLink>
          </div>
          <button className="hidden md:inline bg-[#28a3e4] hover:bg-[#1a8cd8] font-bold shadow-md md:w-32 xl:w-36  py-1 text-white xl:ml-12 rounded-full ">
            Tweet
          </button>
          <button className=" md:hidden bg-[#28a3e4]  font-bold shadow-md w-12 h-12 text-white rounded-full ">
              <Image src="/tweet_btn1.jpg" alt="tweet" height={30} width={30}/>
          </button>
          <div
            className=" xl:ml-2 mt-8 hoverIcon text-[#d9d9d9] flex items-center mt-auto"
            onClick={signOut}
          >

            <img src={session?.user?.image}
              alt="logo"
              className="h-7 w-7 rounded-full  cursor-pointer mr-4 "
            />
            <div className="hidden xl:inline leading-5">
              <h4 className="font-bold ">{session?.user?.name}</h4>
              <p className="text-[#6e767d]">@{session?.user?.tag}</p>
            </div>
            <div>
              <FiMoreHorizontal size={24} className="hidden xl:inline mx-4 text-white" color="white"/>
            </div>



          </div>
        <div>
      </div>


    </div>
  )
}

export default Sidebar
