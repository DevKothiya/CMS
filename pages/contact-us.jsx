import React, { useState } from 'react';
import Head from 'next/head';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example: Handle form submission logic here
    // For now, we will just reset the form and show a success message
    setStatus('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });

    setTimeout(() => {
      setStatus(null);
    }, 4000); // Hide the status after 4 seconds
  };

  return (
    <div className="min-h-screen px-10 py-10 flex justify-center items-center">
      <Head>
        <title>Contact Us | ContentHive</title>
        <meta name="description" content="Get in touch with ContentHive" />
      </Head>

      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-yellow-900 mb-6 text-center">Contact Us</h1>

        {status && (
          <div className="mb-6 p-4 text-green-700 bg-green-100 rounded-lg text-center">
            {status}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-lg text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-yellow-700"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-lg text-gray-700 mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-yellow-700"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-lg text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-yellow-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yellow-800 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition-colors duration-300"
          >
            Send Message
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-lg text-gray-700">
            You can also reach us at <strong>info@contenthive.com</strong> or call us at <strong>(123) 456-7890</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
