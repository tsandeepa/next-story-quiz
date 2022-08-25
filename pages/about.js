import { getStoryblokApi } from "@storyblok/react";
import { useState } from "react";

const About = (props) => {

  // console.log(props.story.content.body[0].title_name);
  console.log(props);

  // const [title, settitle] = useState(props.story.content.body[0].title_name);


  return (

    <div>
      {
        props.story &&
        <>
          {/* <h2>{title}</h2> */}
        </>
      }
    </div>
  );
}

export default About;

export async function getStaticProps() {
  // home is the default slug for the homepage in Storyblok
  let slug = "blogs/";

  // load the draft version
  let sbParams = {
    version: "draft", // or 'published'
    // starts_with: "blogs/",
    // by_slugs: "blogs/"
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