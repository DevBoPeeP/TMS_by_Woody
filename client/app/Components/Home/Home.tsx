import React from "react";
import Head from "next/head";

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>TaskHive - Task Management Made Simple</title>
        <meta
          name="description"
          content="Organize your tasks effortlessly with TaskHive"
        />
      </Head>

      <header className="bg-gradient-to-r from-blue-400 to-lilac-500 p-4 flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold">TaskHive</h1>
        <div className="space-x-4">
          <button className="text-blue-500 bg-white py-2 px-4 rounded-3xl hover:bg-blue-100">
            Sign In
          </button>
          <button className="text-white bg-blue-600 py-2 px-4 rounded-3xl hover:bg-blue-700">
            <link rel="stylesheet" href="localhost:3000/register" />
            Sign Up
          </button>
        </div>
      </header>

      <main>
        {/* Introduction Section */}
        <section className="h-screen flex flex-col justify-center items-center bg-white">
          <h2 className="text-4xl md:text-6xl font-bold text-blue-600">
            TaskHive
          </h2>
          <p className="text-lg md:text-2xl text-gray-600 mt-4">
            Organize, prioritize, and conquer your tasks with ease.
          </p>
        </section>

        {/* About Section */}
        <section className="p-8 bg-gray relative h-70rem">
          <div
            className="w-0 h-[11rem] absolute top-0 left-0 px-32
  border-t-[95px] border-t-transparent
  border-l-[115px] border-l-blue-500
  border-b-[95px] border-b-transparent"
          >
            {" "}
          </div>
          <div className="text-center">
            <h3 className="text-2xl md:text-4xl font-semibold text-blue-600 mb-4">
              About TaskHive
            </h3>
            <p className="text-gray-700 max-w-2xl mx-auto text-lg">
              TaskHive is your go-to platform for managing tasks efficiently.
              Whether you’re an individual or a team, our intuitive tools help
              you stay organized and achieve more.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="p-8 bg-white text-center">
          <h3 className="text-2xl md:text-4xl font-semibold text-blue-600 mb-4">
            Contact Us
          </h3>
          <p className="text-gray-700 text-lg mb-4">
            Have questions? Reach out to us at:
          </p>
          <p className="text-blue-600 font-bold">support@taskhive.com</p>
        </section>
      </main>

      <footer className="bg-lilac-500 text-white text-center p-4">
        <p>&copy; {new Date().getFullYear()} TaskHive. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-blue-300">
            Facebook
          </a>
          <a href="#" className="hover:text-blue-300">
            Twitter
          </a>
          <a href="#" className="hover:text-blue-300">
            LinkedIn
          </a>
        </div>
      </footer>
    </>
  );
};

export default Home;
