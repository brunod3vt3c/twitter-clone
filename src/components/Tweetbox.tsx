import { CalendarIcon, EmojiHappyIcon, LocationMarkerIcon, PhotographIcon, SearchCircleIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react';
import React, { Dispatch, MouseEvent, SetStateAction, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { Tweet, TweetBody } from '../../typings';
import { fetchTweets } from '../utils/fetchTweets';

interface Props {
  setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>
}

function TweetBox({ setTweets }: Props) {
  const [input, setInput] = useState<string>('');
  const [image, setImage] = useState<string>('');

  const imageInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);

  const addImageToTweet = (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();

    if(!imageInputRef.current?.value) return;

    setImage(imageInputRef.current?.value);
    imageInputRef.current.value = ''
    setImageUrlBoxIsOpen(false)


  }  

  const postTweet = async () => {
    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || 'Unknown User',
      profileImg: session?.user?.image || "https://links.papareact.com/gll",
      image: image
    }

    console.log(tweetInfo)
    const result = await fetch(`/api/addTweet`, {
      body: JSON.stringify(tweetInfo),
      method: 'POST'
    })

    console.log(result)

    const json = await result.json();

    const newTweets = await fetchTweets();
    setTweets(newTweets);

    toast('Tweet Posted', {
      icon: '🚀'
    })

    return json;
  } 


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    postTweet();

    setInput('');
    setImage('');
    setImageUrlBoxIsOpen(false);
  }

  return (
    <div className="flex p-5 space-x-2">
      <img className="object-cover mt-4 rounded-full h-14 w-14" src={session?.user?.image || "https://links.papareact.com/gll"} alt="" />
      <div className="flex items-center flex-1 pl-2">
        <form onSubmit={handleSubmit} action="" className="flex flex-col flex-1">
          <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="What's Happening?" className="w-full h-24 text-xl outline-none placeholder:text-xl" />
          <div className="flex items-center">
            <div className="flex flex-1 space-x-2 text-twitter">
              <PhotographIcon onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)} className="w-5 h-5 transition-transform duration-150 ease-out cursor-pointer hover:scale-150"/>
              <SearchCircleIcon className="w-5 h-5 transition-transform duration-150 ease-out cursor-pointer hover:scale-150"/>
              <EmojiHappyIcon className="w-5 h-5 transition-transform duration-150 ease-out cursor-pointer hover:scale-150"/>
              <CalendarIcon className="w-5 h-5 transition-transform duration-150 ease-out cursor-pointer hover:scale-150"/>
              <LocationMarkerIcon className="w-5 h-5 transition-transform duration-150 ease-out cursor-pointer hover:scale-150"/>
            </div>
            <button disabled={!input || !session} className="px-5 py-2 font-bold text-white rounded-full disabled:opacity-40 bg-twitter">Tweet</button>
          </div>

          {imageUrlBoxIsOpen && (
            <form className="flex px-4 py-2 mt-5 rounded-lg bg-twitter/80">
              <input ref={imageInputRef} className="flex-1 p-2 text-white bg-transparent outline-none placeholder:text-white" type="text" placeholder="Enter Image URL..." />
              <button type="submit" onClick={addImageToTweet} className="font-bold text-white">Add Image</button>
            </form>
          )}

          {image && <img className="object-contain w-full h-40 mt-10 shadow-lg rounded-xl" src={image} alt="" />}
        </form>
      </div>
    </div>
  )
}

export default TweetBox