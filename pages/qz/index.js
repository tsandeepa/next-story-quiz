import { getStoryblokApi } from "@storyblok/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Qz = (props) => {

  const router = useRouter()
  const audio_theme = useRef(null);
  const audio_letsplay = useRef(null);
  const selected_groups = useRef(null);

  const [viewCountDown, setViewCountDown] = useState(null)
  let [counter, setCounter] = useState(3);

  const playTheme = () => {
    if (audio_theme.current) {
      audio_theme.current.loop = true;
      audio_theme.current.play();
    }
  };
  const playLetsPlay = () => {
    if (audio_letsplay.current) {
      audio_letsplay.current.play();
    }
  };



  const showTimer = () => {
    setViewCountDown(true);
    const intervalId = setInterval(() => {
      setCounter((counter) => counter - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId)
    }, 3900);
  }


  useEffect(() => {
    document.querySelector('.main-view').classList.remove('answer-won');
    document.querySelector('.main-view').classList.remove('answer-defeated');

    playTheme()
  }, []);

  const viewQuiz = (slug) => {
    console.log('selected_groups', selected_groups);
    playLetsPlay();
    showTimer();

    audio_theme.current.pause();
    audio_theme.current.currentTime = 0;
    setTimeout(() => {
      router.push('/qz/' + slug);
    }, 4000);

  }


  console.log(props.data.stories);
  return (
    <div className="mt-28">
      <audio ref={audio_letsplay} src='/audio/lets_play.mp3' />

      {/* <h3 className="py-5 text-gray-300">Select question group to start</h3> */}
      {
        viewCountDown &&
        <div className="counter">
          <p>Lests Start in</p>
          <h3>{counter}</h3>
        </div>
      }
      {
        props.data && !viewCountDown &&
        <div className="flex gap-14 my-5 justify-center " ref={selected_groups}>
          {
            props.data.stories.map((group, i) => (
              <div key={i}>
                {/* <Link href={'/qz/' + group.slug} onClick={()=>viewQuiz(group.slug)}> */}
                <div onClick={() => viewQuiz(group.slug)} className="block h-full hover:cursor-pointer">
                  <div className="block h-full text-center bg-slate-600  text-white text-2xl p-6 border border-slate-500 transition ease-in-out duration-300  hover:border-slate-300 hover:scale-110 ">
                    <span className="block mb-8">{group.name}</span>
                    <img className="w-80" src={group.content.grp_img} alt="" />
                  </div>
                </div>
              </div>
            ))
          }
          <audio ref={audio_theme} src='/audio/main-bg-theme.mp3' />

        </div>
      }
    </div>
  );
}

export default Qz;

export async function getStaticProps() {
  // home is the default slug for the homepage in Storyblok
  let slug = "qz/grade-9";

  // load the draft version
  let sbParams = {
    version: "draft", // or 'published'
    starts_with: "qz/",
    // by_slugs: "blogs/"
  };

  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get(`cdn/stories/`, sbParams);

  return {
    props: {
      data
    },
    revalidate: 3600, // revalidate every hour
  };
}