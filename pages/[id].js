import {useState,useEffect} from 'react'
import Head from "next/head"
import Sidebar from "../components/Sidebar"
import Feed from "../components/Feed"
import Modal from "../components/Modal"
import Post from "../components/Feed/Post"
import Comment from "../components/Feed/Comment"
import {getProviders,getSession,useSession} from "next-auth/react"
import Login from "../components/Login"
import {IoMdArrowBack} from "react-icons/io"
import {
  getFirestore,collection,getDocs,
  onSnapshot,query,
  addDoc,deleteDoc,doc,getDoc,setDoc,
  where,orderBy,serverTimestamp,updateDoc

}from "firebase/firestore"
import {postIdState,modalState} from "../atoms/modalAtom"
import {useRouter} from "next/router"
import {db} from "../firebase"
import {useRecoilState} from "recoil"
import Widget from "../components/Widget"
const PostPage = ({
  trendingResults,
  followResults,
  providers
  }) => {
  const {data:session}=useSession()
  const [post,setPost]=useState([])
  const [comments,setComments]=useState([])
  const router=useRouter()
  const [isOpen,setIsOpen]=useRecoilState(modalState)
  const {id}=router.query

  useEffect(()=>{
    onSnapshot(doc(db,"posts",id),(snapshot)=>{
      setPost(snapshot.data())
    })
  },[db,id])

  useEffect(()=>{
    onSnapshot(
      query(collection(db,"posts",id,"comments"),
      orderBy("timestamp","desc")
    ),
    (snapshot)=>{
      let commentsArray=[]
      snapshot.docs?.forEach(doc=>{
        commentsArray.push({...doc.data(),id:doc.id})
      })
      setComments(commentsArray)
    }
    )
  },[db,id])


  if(!session) return <Login providers={providers}/>
    return (
      <div className="flex flex-col justify-content-center min-h-screen">
        <Head>
          <title>{post?.text?.slice(0,26)}...</title>
          <link rel="icon" href="https://key0.cc/images/preview/28598_d620cfb9fe318b1c6fdc01dbbb370517.png"/>
        </Head>
        <main className="bg-black min-h-screen flex max-w-[1500px] w-full  mx-auto">
        {/* sidebar*/}
          <Sidebar/>
        {/*  feed */}
        <div className="flex-grow border-l border-r border-gray-600 max-w-lg sm:ml-[65px] xl:ml-[350px]">
          <div className={`flex items-center px-1.5 py-2 border-b
             border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky
              top-0 z-50 bg-black`}>
              <div
                className="cursor-pointer hoverIcon w-9 h-9 flex items-center justify-center xl:px-0"
                onClick={()=>router.push("/")}
              >
                <IoMdArrowBack size={25} color="#d9d9d9"/>
              </div>
              Tweet
          </div>
          <Post id={id} post={post}/>
          {
            comments.length>0 && (
              <div className="py-12 px-6  ">
                <p className="text-gray-400 pb-3">{comments.length} Comments</p>
              {
                comments.map(comment=>(
                  <Comment key={comment.id}
                    id={comment.id}
                    comment={comment}
                  />
                ))
              }

              </div>
            )
          }
        </div>



        {/* widget */}
        <Widget
          trendingResults={trendingResults}
          followResults={followResults}
        />
        {/* model */}
        {isOpen && <Modal/>}
        </main>
      </div>
    )
}

export default PostPage

export async function getServerSideProps(context){
  const trendingResults=await fetch(`https://jsonkeeper.com/b/NKEV`).then((res)=>res.json())
  const followResults=await fetch(`https://jsonkeeper.com/b/WWMJ`).then((res)=>res.json())
  const providers=  await getProviders()
  const session=await getSession(context)
  return{
    props:{
      trendingResults,
      followResults,
      providers,
     session
    }
  }
}
