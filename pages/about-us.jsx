import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-10 py-10">
      <h1 className="text-4xl font-bold text-yellow-900 mb-6 text-center">About Us</h1>
      
      <div className="bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-yellow-900 mb-4">Welcome to ContentHive!</h2>
        <p className="text-lg text-gray-700 mb-6">
          At ContentHive, we are dedicated to providing high-quality content and resources to our readers. Our mission is to create an engaging platform for readers who are passionate about learning and staying updated with the latest trends.
        </p>

        <h3 className="text-xl font-semibold text-yellow-900 mb-4">Our Vision</h3>
        <p className="text-lg text-gray-700 mb-6">
          Our vision is to empower individuals with knowledge and information that helps them grow professionally and personally. We believe in creating a platform that fosters creativity, innovation, and learning through diverse content across various industries.
        </p>

        <h3 className="text-xl font-semibold text-yellow-900 mb-4">What We Do</h3>
        <p className="text-lg text-gray-700 mb-6">
          ContentHive is your go-to source for expert insights, tutorials, and articles on various topics, including technology, business, lifestyle, and more. Whether you're looking to stay updated on industry trends or seeking knowledge to help with personal growth, we've got you covered.
        </p>

        <h3 className="text-xl font-semibold text-yellow-900 mb-4">Join Us</h3>
        <p className="text-lg text-gray-700">
          We’re constantly looking for passionate writers, content creators, and contributors. If you have something to share with the world, don’t hesitate to reach out to us and become part of our growing community!
        </p>
      </div>

      <div className="mt-10 text-center">
        <p className="text-lg text-gray-700">
          Want to collaborate? <a href="mailto:info@contenthive.com" className="text-blue-600 hover:underline">Contact Us</a> to discuss opportunities.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
