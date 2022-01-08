import moment from "moment"
import React,{useState,useEffect} from 'react'
import {BiDotsHorizontalRounded} from "react-icons/bi"
import {BsChat} from "react-icons/bs"
import {FiShare} from "react-icons/fi"
import {AiOutlineRetweet,AiFillHeart,AiOutlineHeart,AiOutlineDelete} from "react-icons/ai"
import {useRecoilState} from "recoil"
import {useSession} from "next-auth/react"
import {postIdState,modalState} from "../../atoms/modalAtom"
import {useRouter} from "next/router"
import {db} from "../../firebase"
import {
  getFirestore,collection,getDocs,
  onSnapshot,query,
  addDoc,deleteDoc,doc,getDoc,setDoc,
  where,orderBy,serverTimestamp,updateDoc

}from "firebase/firestore"
const Comment = ({id,comment}) => {
  console.log("comments",comment)
    return (
      <div className="py-2 flex flex-col  border-b border-gray-700" >
        <div className="p-3 flex  cursor-pointer">

          <img
            src={comment?.userImg}
            alt="commentimg"
            className="h-10 w-10 rounded-full mr-4"
          />
        <div
          className="flex "
        >
          <div className="flex justify-between ">

            <div className="text-[#6e767d] ">
              <div className="inline-block group">
                <h4 className={`font-bold text-[#d9d9d9]
                     text-[15px] sm:text-base inline-block group-hover:underline`}>
                     {comment?.username}

                </h4>
                <span className="ml-1.5 text-sm sm:text-[15px]">
                  @{comment?.tag}{"  "}
                </span>
              </div>
              <span className=" ml-1.5 hover:underline text-sm sm:text-[15px]">
                {moment(comment?.timestamp?.toDate()).fromNow()}
              </span>
                <p className={`text-[#d9d9d9] mt-0.5
                    max-w-lg overflow-auto text-[15px] sm:text-base`}>
                    {comment?.comment}
                </p>


              </div>

            </div>
            <div className="icon group flex-shrink-0">
              <BiDotsHorizontalRounded color="#6e767d" className="group-hover:text-[#1d9bf0] h-5"/>
            </div>
          </div>

          </div>

        </div>
    )
}

export default Comment
