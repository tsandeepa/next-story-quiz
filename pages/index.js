import Head from "next/head"
import styles from "../styles/Home.module.css"

import { getStoryblokApi } from "@storyblok/react"
import { useEffect } from "react";
import Link from "next/link";

export default function Home(props) {
  useEffect(() => {
    document.querySelector('.main-view').classList.remove('answer-won')
    document.querySelector('.main-view').classList.remove('answer-defeated')
  }, []);

  console.log(props.story);
  return (
    <div>
      <Head>
        <title>Quiz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1 className="text-center text-2xl mt-10 mb-6">
          Quiz
        </h1>
      </header>
      <main className="text-center">
        <Link href={'/qz'}><a className="px-8 py-4 border border-solid border-gray-600 hover:bg-slate-600">Lets Start</a></Link>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  // home is the default slug for the homepage in Storyblok
  let slug = "home";

  // load the draft version
  let sbParams = {
    version: "draft", // or 'published'
  };

  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

  return {
    props: {
      story: data ? data.story : false,
      key: data ? data.story.id : false,
    },
    revalidate: 3600, // revalidate every hour
  };
}