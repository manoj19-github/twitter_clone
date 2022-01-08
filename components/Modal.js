import React,{useState,useEffect,Fragment,useRef} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {modalState,postIdState} from "../atoms/modalAtom"
import {useRecoilState} from "recoil"
import {AiOutlineClose} from "react-icons/ai"
import {useSession} from "next-auth/react"
import moment from "moment"
import {useRouter} from "next/router"
import {
  getFirestore,collection,getDocs,
  onSnapshot,
  addDoc,deleteDoc,doc,getDoc,setDoc,
  where,orderBy,serverTimestamp,updateDoc

}from "firebase/firestore"
import {BsImage} from "react-icons/bs"
import {AiOutlineCloseCircle,AiOutlineGif,AiOutlineSchedule} from "react-icons/ai"
import {getDownloadURL,ref,uploadString} from "@firebase/storage"
import {FaPollH} from "react-icons/fa"
import {BsEmojiSmile} from "react-icons/bs"
import "emoji-mart/css/emoji-mart.css"
import {Picker} from "emoji-mart"
import {db,storage} from "../firebase"
const Modal = () => {
  const [isOpen, setIsOpen] =useRecoilState(modalState)
  const [selectedFile,setSelectedFile]=useState(null)
  const [showPicker,setShowPicker]=useState(null)
  const[showEmoji,setShowEmoji]=useState(false)
  const [postId,setPostId]=useRecoilState(postIdState)
  const [comment,setComment]=useState("")
  const [loading,setLoading]=useState(false)
  const {data:session}=useSession()
  console.log("postId",postId)
  const [post,setPost]=useState([])
  const filePickerRef=useRef(null)
  const router=useRouter()
  const closeModal=()=> {
    setIsOpen(false)
  }
  const openModal=()=> {
    setIsOpen(true)
  }
  const addEmoji=(event)=>{
    const text=comment+event.native
    setComment(text)
  }
  useEffect(()=>
    onSnapshot(doc(db,"posts",postId),(snapshot)=>{
      setPost(snapshot.data())
    })

  ,[])
  const addImageToPost=(event)=>{
    const file =event.target.files[0]
    const reader=new FileReader()
    if(file)
      reader.readAsDataURL(file)
    reader.onload=(readerEvent)=>{
      setSelectedFile(readerEvent.target.result)
    }

  }

  //   post your comments
  const sendPostHandler=async(e)=>{
    e.preventDefault()
    if(loading) return
    setLoading(true)
    const docRef=await addDoc(collection(db,"posts",postId,"comments"),{
      comment:comment,
      username:session.user.name,
      tag:session.user.tag,
      userImg:session.user.image,
      timestamp:serverTimestamp()
    })
    const imageRef=ref(storage,`posts/${docRef.id}/image`)
    if(selectedFile){
      await uploadString(imageRef,selectedFile,"data_url")
      .then(async()=>{
        const downloadURL=await getDownloadURL(imageRef)
        await updateDoc(doc(db,"posts",docRef.id,"comments"),{
          image:downloadURL
        })
      })
      setSelectedFile(null)
    }

    setIsOpen(false)
    setComment("")
    setLoading(false)
    router.push(`/${postId}`)
  }


  return (
      <>

        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto "
            onClose={closeModal}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity  " />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"

              >
                <div className={`bg-black inline-block w-full max-w-md   overflow-hidden text-left
                  transition-all transform  shadow-xl rounded-2xl text-white
                overflow-hidden transform transition-all sm:mb-12 sm:align-middle sm:max-w-xl sm:w-full `}>
                  <div className="flex items-center px-1.5 border-b border-gray-700 py-2">
                    <div className="hoverIcon w-9 h-9 flex items-center justify-center xl:px-0"
                      onClick={closeModal}
                    >
                      <AiOutlineClose size={24} className="hover:text-red-700"/>
                    </div>
                  </div>
                  <div className="flex px-5 pt-5 pb-2.5 sm:px-6">
                    <div className="w-full">
                      <div className="text-[#6e767d] flex gap-x-4 relative" >
                        <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600"/>
                        <img src={post?.userImg} className="h-9 w-9 ml-1   rounded-full"/>
                      <div>
                        <div className="inline-block group cursor-pointer">
                          <h3
                            className="inline-block font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline">
                            {post?.username}
                          </h3>
                          <span
                            className="ml-1.5 text-sm sm:text-[15px]">
                            @{post?.tag}
                          </span>
                          {" "}.{" "}


                        </div>
                        {" "}
                        <span className="hover:underline text-sm sm:text-[16px]">{moment(post?.timestamp?.toDate()).fromNow()}</span>
                      </div>
                      </div>
                        <p className="my-2 ml-12 text-[#d9d9d9] text-[15px] sm:text-base">{post?.text}</p>

                    </div>

                  </div>
                  <div className="flex space-x-3 w-full px-6 py-2">
                    <img className="h-10 h-10 rounded-full" src={session?.user?.image} alt=""/>
                    <div className="flex-grow mt-2">
                      <textarea
                        value={comment}
                        onChange={e=>setComment(e.target.value)}
                        placeholder="Tweet your reply"
                        rows="2"
                        className={`bg-transparent outline-none text-[#d9d9d9]
                          text-lg placeholder-gray-500 tracking-wide w-full min-h-[75px]`}
                     />
                   {selectedFile && (
                      <div className="relative">
                         <div className="hoverIcon absolute top-0.5 left-1" onClick={()=>setSelectedFile(null)}>
                           <AiOutlineClose size={26} className="text-red-700"/>
                         </div>

                         <img src={selectedFile} className="rounded-2xl w-full object-contain" alt="image"/>
                       </div>
                    )}
                   <div
                     className="flex items-center justify-between pl-2.5"
                    >


                    {!loading && (
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center ">
                          <div
                          className="icon"
                          onClick={()=>filePickerRef.current.click()}
                          >
                            <BsImage className="icon-item" />
                            <input type="file"
                              hidden
                              accept='image/*'
                              onChange={(e)=>addImageToPost(e)}
                              ref={filePickerRef}

                            />
                          </div>
                          <div className="icon">
                            <AiOutlineGif className="icon-item"/>
                          </div>
                          <div className="icon">
                            <FaPollH className="icon-item"/>
                          </div>
                          <div className="icon" onClick={()=>setShowPicker(!showPicker)}>
                            <BsEmojiSmile className="icon-item"/>
                          </div>
                          <div className="icon">
                            <AiOutlineSchedule className="icon-item"/>
                          </div>
                          {/* */}
                          {
                            showPicker && (
                              <Picker
                                 onSelect={addEmoji}
                                style={{
                                  position:"absolute",
                                  marginLeft:"300px",
                                  marginRight:40,
                                  maxWidth:"320px",
                                  borderRadius:"20px",


                                }}
                                theme="dark"
                                className="z-10"
                              />
                            )
                          }
                        </div>
                        <div className="md:ml-24 sm:ml-12">
                        <button
                          className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf8] disabled:opacity-50 disabled:cursor-default"
                          disabled={!comment.trim() }
                          onClick={sendPostHandler}
                        >
                          Reply
                        </button>
                      </div>

                      </div>

                    )}
                     </div>

                    </div>
                  </div>

                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
)
}


export default Modal
