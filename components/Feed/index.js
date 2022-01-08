import React,{useState,useEffect} from 'react'
import {HiOutlineSparkles} from "react-icons/hi"
import Input from "../Input"
import {db} from "../../firebase"
import Post from "./Post"
import {
  collection,onSnapshot,
  query,orderBy
} from "firebase/firestore"
const Feed = () => {
  const colRef=collection(db,"posts")
  const [posts,setPosts]=useState([])
  useEffect(()=>{
    const unsubscribe=onSnapshot(
      query(colRef,orderBy("timestamp","desc")),
      (snapshot)=>{
        let postData=[]
        snapshot.docs.forEach(doc=>{
          postData.push({...doc.data(),id:doc.id})
        })
        setPosts(postData)
      }
    )
    return()=>{
      unsubscribe()
    }
  },[db])

    return (
        <div className="text-white flex-grow border-l border-r border-gray-700 md:max-w-[900px] lg:max-w-xl   sm:ml-32 md:ml-44 xl:ml-64">
          <div className="text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 bg-black border-b border-gray-700">
            <h2 className="text-lg sm:text-xl">Home</h2>
            <div className="hoverIcon xl:px-0 ml-auto">
              <HiOutlineSparkles size={24} color="white"/>
            </div>
          </div>
          <Input/>
          <div className="pb-72">
            {
              posts?.map((postData,index)=>(
                <Post key={postData.id} id={postData.id} post={postData}/>
              ))
            }
          </div>
        </div>
    )
}

export default Feed
