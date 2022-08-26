import { getStoryblokApi } from "@storyblok/react";
import Link from "next/link";
import { useEffect } from "react";

const Qz = (props) => {

  useEffect(() => {
    document.querySelector('.main-view').classList.remove('answer-won')
    document.querySelector('.main-view').classList.remove('answer-defeated')
  }, []);

  console.log(props.data.stories);
  return (
    <div>
      <h3 className="py-5 text-gray-300">Select question group to start</h3>
      {
        props.data &&
        <div className="flex gap-6 my-5">
          {
            props.data.stories.map((group, i) => (
              <div key={i}>
                <Link href={'/qz/' + group.slug}>
                  <a className="bg-slate-500  text-white text-2xl p-6 border border-slate-500  hover:border-slate-300">
                    <span>{group.name}</span>
                  </a>
                </Link>
              </div>
            ))
          }
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