import type { NextPage } from "next";
import { Layout } from "@/layouts";
import Knowledge from "@/components/Knowledge/Knowledge";
const Home: NextPage = () => {
  return (
    <Layout>
        <Knowledge/>
    </Layout>
  )
};

export default Home;
