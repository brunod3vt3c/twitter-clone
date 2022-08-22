import React from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Widgets from '../components/Widgets';
import { GetServerSideProps } from 'next';
import { fetchTweets } from '../utils/fetchTweets';
import { Tweet } from '../../typings';
import { Toaster } from 'react-hot-toast';

interface Props {
  tweets: Tweet[];
}

export default function Home({ tweets }: Props ) {
  
  return (
    <div className="mx-auto lg:max-w-6xl">
      <Head>
        <title>Twitter 2.0</title>
      </Head>
      <Toaster/>

      <main className="grid grid-cols-9">
        <Sidebar/>

        <Feed tweets={tweets} />
        
        <Widgets/>
      </main>
    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const tweets = await fetchTweets();
  
  return {
    props: {
      tweets
    }
  }
}