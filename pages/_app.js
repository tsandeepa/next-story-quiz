import { storyblokInit, apiPlugin } from "@storyblok/react";
import Layout from "../components/layout";
import '../styles/globals.css'
import GlobalStyles from "../styles/styled/global.styled";

storyblokInit({
  accessToken: "3gfrws9MB6oThpwsNMzKsQtt",
  use: [apiPlugin]
});

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <GlobalStyles />
      <Component {...pageProps} />
    </Layout>
  )

}

export default MyApp
