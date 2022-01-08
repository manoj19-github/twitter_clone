import React,{useState,useEffect} from 'react'
import moment from "moment"
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

const Post = ({id,post,postPage}) => {
  const {data:session}=useSession()
  const [isOpen,setIsOpen]=useRecoilState(modalState)
  const [postId,setPostId]=useRecoilState(postIdState)
  const [comments,setComments]=useState([])
  const [liked,setLiked]=useState(false)
  const [likes,setLikes]=useState([])
  const router=useRouter()
  const delPost=(e)=>{
    e.stopPropagation()
    deleteDoc(doc(db,"posts",id))
    router.push("/")
  }
  const likedPost=async(e)=>{
    e.stopPropagation()
    if(liked){
      await deleteDoc(doc(db,"posts",id,"likes",session.user.uid))
    }else{
      await setDoc(doc(db,"posts",id,"likes",session.user.uid),{
        username:session.user.name
      })
    }

  }
  useEffect(()=>{
    onSnapshot(
      query(collection(db,"posts",id,"comments"),orderBy("timestamp","desc")),
      (snapshot)=>{
        setComments(snapshot.docs)
      }
    )

  },[db,id])
  useEffect(()=>{
    onSnapshot(
      collection(db,"posts",id,"likes"),
      (snapshot)=>{
        setLikes(snapshot.docs)
      }
    )
  },[db,id])


  useEffect(()=>{
    setLiked(likes.findIndex((like)=>like.id===session?.user?.uid)!==-1)
  },[likes])


    return (
        <div
          className="flex p-3 max-w-[1500px] lg:min-w-[600px] w-2xl cursor-pointer border-b border-gray-700"
          onClick={()=>router.push(`/${id}`)}

        >
          {!postPage && (
            <img
              src={post?.userImg}
              alt="userImg"
              className="h-8 w-8 rounded-full mr-4  "
            />
          )}
          <div className="flex flex-col space-y-2 w-full">
            <div className={`flex ${!postPage && "justify-between"}`}>
              {postPage && (
                <img
                  src={post.userImg}
                  alt="Profile pic"
                  className="h-8 w-8 rounded-full mr-4"
                />
              )}
              <div className="text-[#6e767d]">
                <div className="inline-block group">
                  <h4
                    className={`
                      font-bold text-[15px] sm:text-base group-hover:underline
                      ${!postPage && "inline-block"}
                      `
                    }>
                      {post?.username}
                    </h4>
                  <span
                    className={`text-sm sm:text-[15px]
                      ${!postPage && "ml-2"}`}>
                      @{post?.tag}
                  </span>
                </div>{"  "}.{"  "}
                <span className="hover:underline text-sm sm:text-[15px]">
                  {moment(post?.timestamp?.toDate()).fromNow()}
                </span>
                {!postPage && <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                  {post?.text}
                </p>
              }
              </div>
              <div className="icon group flex-shrink-0 ml-auto">
                <BiDotsHorizontalRounded className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]"/>
              </div>
            </div>
            {postPage && <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5 mb-1">
              {post?.text}
            </p>
          }
          <img src={post?.image}
            alt=""
            className="rounded-2xl max-h-[768px]  w-full object-cover "
          />
        <div className={`text-[#6e767d] flex justify-between w-10/12
            ${postPage && "mx-auto" }`}>
            <div
              className="tweetIcon hover:text-sky-600 hover:bg-sky-800 hover:bg-opacity-10 flex items-center space-x-2"
              onClick={(e)=>{
                e.stopPropagation()
                setPostId(id)
                setIsOpen(true)

              }}
            >
              <BsChat/>
                {comments.length >0 && (
                    <span className="text-xs">{comments.length}</span>
                )}
            </div>
            <div
              className="tweetIcon flex items-center space-x-2 hover:text-green-700 hover:bg-green-700 hover:bg-opacity-10">
              <AiOutlineRetweet/>


            </div>
            {session.user.name===post.username &&(
              <div
                className="tweetIcon hover:text-red-700 hover:bg-red-700 hover:bg-opacity-10"
                onClick={delPost}
              >
                <AiOutlineDelete/>
            </div>
            )
          }
            <div className="tweetIcon group flex items-center space-x-2 hover:text-[#CE0B17] hover:bg-[#CE0B17] hover:bg-opacity-10 "
              onClick={likedPost}
            >
              {!liked?(
                <AiOutlineHeart/>

              ):(
                <AiFillHeart className="text-[#CE0B17]"/>
              )}
              {likes.length >0 &&(
                <span className={`group-hover:text-[#CE0B17] text-sm
                    ${liked && "text-[#CE0B17]"}`}
                >
                  {likes.length}


                </span>
              )}

            </div>

            <div className="tweetIcon hover:text-sky-700 hover:bg-sky-600  hover:bg-opacity-10 ">
              <FiShare/>
            </div>
          </div>

          </div>


        </div>
    )
}

export default Post
