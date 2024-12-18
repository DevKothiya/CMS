import Image from "next/image";
import Head from "next/head";
import { CreatePostPage, PostCard, Categories, PostWidget } from "@/components";
import { getPosts } from '../services'
import { FeaturedPosts } from '../sections'
import Link from 'next/link';

export default function Home({ posts }) {
  return (
    <div className="container mx-auto px-10 md-8">
      <Head>
        <title>CMS Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mb-8 flex justify-center pb-6">
        <p className="text-center">
          {/* Want to add a new post?{' '} */}
          <Link href="/create-post" className="inline-block bg-yellow-800 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-yellow-700 transition-colors duration-300">
            Create a New Post
          </Link>
        </p>
      </div>
      {/* <FeaturedPosts /> */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
        <div className="lg:col-span-8 col-span-1">
          {
            posts.map((post, index) => (
              <PostCard post={post.node} key={post.title} />
            ))}
        </div>

        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
            <PostWidget />
            <Categories />
          </div>
        </div>

      </div>
    </div>
  );
}

export async function getStaticProps() {
  const posts = (await getPosts()) || [];
  return {
    props: { posts }
  }
}