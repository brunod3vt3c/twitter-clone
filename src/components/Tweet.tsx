import React, { useEffect, useState } from 'react'
import { Comment, CommentBody, Tweet } from '../../typings'
import TimeAgo from 'react-timeago';
import { ChatAlt2Icon, HeartIcon, SwitchHorizontalIcon, UploadIcon } from '@heroicons/react/outline'
import { fetchComments } from '../utils/fetchComments';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Props {
  tweet: Tweet
}

function TweetComponent({ tweet }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const  { data: session } = useSession();
  
  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id);
    setComments(comments);
  }

  useEffect(() => {
    refreshComments();
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const commentToast = toast.loading("Posting Comment...");

    // Comment logic
    const comment: CommentBody = {
      comment: input,
      tweetId: tweet._id,
      username: session?.user?.name || 'Unknown User',
      profileImg: session?.user?.image || "https://links.papareact.com/gll",
    }

    const result = await fetch(`/api/addComment`, {
      body: JSON.stringify(comment),
      method: 'POST'
    })

    toast.success("Comment Posted!", {
      id: commentToast
    })

    setInput("");
    setCommentBoxVisible(false);
    refreshComments();
  }
  
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
        <div onClick={() => session && setCommentBoxVisible(!commentBoxVisible)} className="flex items-center space-x-3 text-gray-400 cursor-pointer">
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

      {commentBoxVisible && (
        <form onSubmit={handleSubmit} className="flex mt-3 space-x-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 p-2 bg-gray-100 rounded-lg outline-none" type="text" placeholder="Write a comment..." />
          <button type="submit" className="text-twitter disabled:text-gray-200">Post</button>
        </form>
      )}

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