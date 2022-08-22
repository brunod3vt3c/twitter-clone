export interface Tweet extends TweetBody {
  _id: string;
  _type: 'tweet';
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  blockTweet: boolean;
}

export interface TweetBody {
  username: string;
  text: string;
  // approved: boolean;
  profileImg: string;
  image?:string;
}

export interface CommentBody {
  username: string;
  comment: string;
  // approved: boolean;
  profileImg: string;
  image?:string;
}

export interface Comment extends CommentBody{
  _id: string;
  _type: 'tweet';
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  tweet: {
    _rev: string;
    reference
  }
}