import React,{useState,useRef} from 'react'
import {BsImage} from "react-icons/bs"
import {AiOutlineCloseCircle,AiOutlineGif,AiOutlineSchedule} from "react-icons/ai"
import {FaPollH} from "react-icons/fa"
import {BsEmojiSmile} from "react-icons/bs"
import "emoji-mart/css/emoji-mart.css"
import {Picker} from "emoji-mart"
import {db,storage} from "../firebase"
import {useSession} from "next-auth/react"

import {
  getFirestore,collection,getDocs,
  onSnapshot,
  addDoc,deleteDoc,doc,getDoc,
  query,where,orderBy,serverTimestamp,updateDoc

}from "@firebase/firestore"
import {getDownloadURL,ref,uploadString} from "@firebase/storage"
const Input = () => {
  const {data:session}=useSession()
  // collection ref
  const colRef=collection(db,"posts")
  // const authRef=getAuth()
  const [input,setInput]=useState('')
  const [selectedFile,setSelectedFile]=useState(null)
  const [showEmoji,setShowEmoji]=useState(false)
  const [emojiText,setEmojiText]=useState(null)
  const [loading,setLoading]=useState(false)
  const filePickerRef=useRef(null)
  const emojiReviewRef=useRef(null)

  const handleInput=(e)=>{
    setInput(e.target.value)
  }
  const addEmoji=(event)=>{
    const text=input+event.native
    setInput(text)
  }
  const addImageToPost=(event)=>{
    const file =event.target.files[0]
    const reader=new FileReader()
    if(file)
      reader.readAsDataURL(file)
    reader.onload=(readerEvent)=>{
      setSelectedFile(readerEvent.target.result)
    }

  }
  const sendPostHandler=async()=>{
    if(loading) return
    setLoading(true)
    const docRef=await addDoc(colRef,{
      id:session.user.uid,
      username:session.user.name,
      userImg:session.user.image,
      tag:session.user.tag,
      text:input,
      timestamp:serverTimestamp(),
    })
    const imageRef=ref(storage,`posts/${docRef.id}/image`)
    if(selectedFile){
      await uploadString(imageRef,selectedFile,"data_url")
      .then(async()=>{
        const downloadURL=await getDownloadURL(imageRef)
        await updateDoc(doc(db,"posts",docRef.id),{
          image:downloadURL
        })
      })
    }
    setLoading(false)
    setInput("")
    setSelectedFile(null)
    setShowEmoji(false)

  }
    return (
        <div className={`border-b border-gray-700 p-3 space-x-3 overflow-y-auto min-h- flex
            ${loading && "opacity-60" }`}>
          <img src={session?.user?.image}
            alt="logo"
            className="h-8 w-8 rounded-full cursor-pointer "
          />
          <div className="w-full divide-y divide-gray-700">
            <div className={`${selectedFile && "pb-7"}
              ${input && "space-y-2.5"} `}>
              <textarea value={input} name="" className=" text-[#d9d9d9] w-full overflow-y-auto bg-transparent border-0 outline-none px-1 tracking-wide placeholder-gray-500 min-h-[40px] border-b border-gray-500 "
                onChange={handleInput}
                placeholder="What's happening ?">
              </textarea>
              {selectedFile && (
                <div className="relative">
                  <div
                    className="absolute w-8 h-8   hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-0.1 left-1 cursor-pointer"
                    onClick={()=>{setSelectedFile(null)}}
                  >
                    <AiOutlineCloseCircle size={20} color="#ec092b"/>
                  </div>

                    <img src={selectedFile} className="rounded-2xl max-h-80 w-full object-contain" alt="image"/>


               </div>

             )}


             {/* Icon container */}
              {loading && (
                <div className="flex items-center justify-center pt-2">
                    Posting ............
                </div>
              )}
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
                   <div className="icon" onClick={()=>setShowEmoji(!showEmoji)}>
                     <BsEmojiSmile className="icon-item"/>
                   </div>
                   <div className="icon">
                     <AiOutlineSchedule className="icon-item"/>
                   </div>
                   {/* */}
                   {
                     showEmoji && (
                       <Picker
                          onSelect={addEmoji}
                         style={{
                           position:"absolute",
                           marginTop:"465px",
                           marginRight:40,
                           maxWidth:"320px",
                           borderRadius:"20px"
                         }}
                         theme="dark"
                       />
                     )
                   }
                 </div>
                 <button
                   className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf8] disabled:opacity-50 disabled:cursor-default"
                   disabled={!input.trim() && !selectedFile }
                   onClick={sendPostHandler}
                 >
                     Tweet
                 </button>

               </div>

             )}

             {/* Icon container */}
          </div>
        </div>
      </div>

    )
}

export default Input
