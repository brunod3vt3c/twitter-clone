import React, { useEffect, useState } from 'react'
import { Comment, Tweet } from '../../typings'
import TimeAgo from 'react-timeago';
import { ChatAlt2Icon, HeartIcon, SwitchHorizontalIcon, UploadIcon } from '@heroicons/react/outline'
import { fetchComments } from '../utils/fetchComments';


interface Props {
  tweet: Tweet
}

function TweetComponent({ tweet }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  
  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id);
    setComments(comments);
  }

  useEffect(() => {
    refreshComments();
  }, [])

  console.log(comments);
  return (
    <div className="flex flex-col p-5 space-x-3 border-gray-100 border-y">
      <div className="flex space-x-3">
        <img className="object-cover w-10 h-10 rounded-full" src={tweet.profileImg} alt="" />

        <div>
          <div className="flex items-center space-x-1">
            <p className="mr-1 font-bold">{tweet.username}</p>
            <p className="hidden text-sm text-gray-500 sm:inline">@{tweet.username.replace(/\s+/g, '').toLowerCase()}</p>

            <TimeAgo
              className="text-sm text-gray-500"
              date={tweet._createdAt}
            />
          </div>

          <p>{tweet.text}</p>

          {tweet.image && <img src={tweet.image} alt="" className="object-cover m-5 mb-1 ml-0 rounded-lg shadow-sm max-h-60" />
          }
        </div>
      </div>

      <div className="flex justify-between mt-5">
        <div className="flex items-center space-x-3 text-gray-400 cursor-pointer">
          <ChatAlt2Icon className="w-5 h-5" />
          <p>{comments.length}</p>
        </div>

        <div className="flex items-center space-x-3 text-gray-400 cursor-pointer">
          <SwitchHorizontalIcon className="w-5 h-5" />
        </div>

        <div className="flex items-center space-x-3 text-gray-400 cursor-pointer">
          <HeartIcon className="w-5 h-5" />
        </div>

        <div className="flex items-center space-x-3 text-gray-400 cursor-pointer">
          <UploadIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Comment Box logic */}

      {comments?.length > 0 && (
        <div className="my-2 mt-5 space-y-5 overflow-scroll max-h-44">
          {comments.map(comment => (
            <div key={comment._id} className="flex space-x-2">
              <hr className="absolute h-8 left-5 top-10 border-x border-twitter/30" />
              <img src={comment.profileImg} className="mt-2 border-t-2 border-gray-100 rounded-full object-y-cover h-7 w-7" alt="" />
              <div>
                <div className="flex items-center space-x-1">
                  <p className="mr-1 font-bold">{comment.username}</p>
                  <p className="hidden text-sm text-gray-500 lg:inline">@{tweet.username.replace(/\s+/g, '').toLowerCase()} .</p>
                </div>
                <TimeAgo
                  className="text-sm text-gray-500"
                  date={comment._createdAt}
                />
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TweetComponent