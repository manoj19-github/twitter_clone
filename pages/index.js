import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Sidebar from "../components/Sidebar"
import Feed from "../components/Feed"
import Modal from "../components/Modal"
import Login from "../components/Login"
import {modalState}  from "../atoms/modalAtom"
import {getProviders,getSession,useSession} from "next-auth/react"
import {useRecoilState} from "recoil"
import Widget from "../components/Widget"

export default function Home({trendingResults,
  followResults,
  providers
  }) {
    const {data:session}=useSession()
    const [isOpen,setIsOpen]=useRecoilState(modalState)
    if(!session) return <Login providers={providers}/>
  return (
    <div className="flex flex-col justify-content-center min-h-screen">
      <Head>
        <title>Twitter</title>
        <link rel="icon" href="https://key0.cc/images/preview/28598_d620cfb9fe318b1c6fdc01dbbb370517.png"/>
      </Head>
      <main className="bg-black min-h-screen flex max-w-[1500px] w-full ">
      {/* sidebar*/}
        <Sidebar/>
      {/*  feed */}
      <Feed/>
      <Widget
        trendingResults={trendingResults}
        followResults={followResults}
      />

      {/* widget */}
      {/* model */}
      {isOpen && <Modal/>}
      </main>
    </div>
  )
}

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
