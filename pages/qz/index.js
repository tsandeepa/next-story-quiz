import { getStoryblokApi } from "@storyblok/react";
import Link from "next/link";

const Qz = (props) => {

  console.log(props.data.stories);
  return (
    <div>
      <h3>QZ Select</h3>
      {
        props.data &&
        <div>
          {
            props.data.stories.map((group, i) => (
              <div key={i}>

                <Link href={'/qz/' + group.slug}>
                  <a>
                    <span>{group.name}</span>
                    <span>{group.slug}</span>
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