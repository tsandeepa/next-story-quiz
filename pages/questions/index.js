import { getStoryblokApi } from "@storyblok/react";

const Questions = (props) => {


  console.log(props.data);

  return (
    <div>
      <h4>Questions</h4>
    </div>
  );
}

export default Questions;



export async function getStaticProps() {
  // home is the default slug for the homepage in Storyblok
  let slug = "qz/grade-8";

  // load the draft version
  let sbParams = {
    version: "draft", // or 'published'
    // starts_with: "qz/",

  };

  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

  return {
    props: {
      data
    },
    revalidate: 3600, // revalidate every hour
  };
}