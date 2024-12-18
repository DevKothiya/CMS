import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const categories = [
  { id: 'cm27jz7ya1wua07pf9ayafupq', name: 'Software Development' },
  { id: 'cm29d7lln0pc107o4b0knwj3g', name: 'Cyber Security' },
  { id: 'cm36vi3xm0df407pepyfh2qzw', name: 'Networking and Cloud Computing' },
  { id: 'cm36vh4lj0dmx07pgf3jqjudt', name: 'Data Science and Analytics' },
  { id: 'cm36vevzc0dke07pgqtvi77ym', name: 'Emerging Technologies' },
];
let assetId = '';

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [authorId, setAuthorId] = useState('');
  const [category, setCategory] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');



  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Step 1: Get upload data from createAsset mutation
      const createAssetMutation = `
            mutation {
                createAsset(data: {}) {
                    id
                    url
                    upload {
                        error{
                          code
                          message
                        }
                        requestPostData {
                            url
                            date
                            key
                            policy
                            signature
                            algorithm
                            credential
                            date
                            securityToken
                        }
                    }
                }
            }
        `;

      const createAssetResponse = await fetch('https://ap-south-1.cdn.hygraph.com/content/cm26enik906sq07wemvb5y20r/master', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ``,
        },
        body: JSON.stringify({ query: createAssetMutation }),
      });

      if (!createAssetResponse.ok) {
        const errorResponse = await createAssetResponse.json();
        console.error('Asset creation failed:', errorResponse);
        throw new Error(`Asset creation error: ${createAssetResponse.status}`);
      }

      const assetData = await createAssetResponse.json();
      const postData = assetData.data.createAsset.upload.requestPostData;

      const formData = new FormData();
      formData.append('X-Amz-Date', postData.date);
      formData.append('key', postData.key);

      formData.append('X-Amz-Signature', postData.signature);
      formData.append('X-Amz-Algorithm', postData.algorithm);
      formData.append('policy', postData.policy);
      formData.append('X-Amz-Credential', postData.credential);

      formData.append('X-Amz-Security-Token', postData.securityToken);

      formData.append('file', file);

      const uploadResponse = await fetch(postData.url, { method: 'POST', body: formData });

      if (!uploadResponse.ok) {
        const errorResponse = await uploadResponse.text();
        console.error('Upload to S3 failed:', errorResponse);
        throw new Error(`Upload error: ${uploadResponse.status}`);
      } else {
        console.log('Image uploaded successfully to S3');
      }

      assetId = assetData.data.createAsset.id;
      setFeaturedImage(assetData.data.createAsset.id);
      setErrorMessage(''); // Clear any previous error

    } catch (error) {
      setErrorMessage('Image upload error. Please check the console for details.');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const postSlug = title.replace(/\s+/g, '-').toLowerCase();
    const mutation = `
      mutation {
        createPost(
          data: {
            title: "${title}",
            slug: "${title.replace(/\s+/g, '-').toLowerCase()}",
            excerpt: "${excerpt}",
            detail:"${content}",
            featuredImage: { connect: { id: "${featuredImage}" } },
            featuredPost: true,
            author: { connect: { id: "${authorId}" } },
            category: { connect: { id: "${category}" } }
          }
        ) {
          id
          title
          slug
        }
      }
    `;
    const publishAssetMutation = `
      mutation {
      publishAsset(where: {id: "${assetId}"}, to: PUBLISHED) {
        id
      }
  }
    `;

    const publishAssetResponse = await fetch('https://ap-south-1.cdn.hygraph.com/content/cm26enik906sq07wemvb5y20r/master', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: ``,
      },
      body: JSON.stringify({ query: publishAssetMutation }),
    });

    const publishResult = await publishAssetResponse.json();

    if (publishResult.errors) {
      throw new Error('Publishing asset failed');
    }

    try {
      const response = await fetch('https://ap-south-1.cdn.hygraph.com/content/cm26enik906sq07wemvb5y20r/master', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ``,
        },
        body: JSON.stringify({ query: mutation }),
      });

      const result = await response.json();

      if (result.errors) {
        setErrorMessage('Error creating post. Please try again.');
        console.error(result.errors);
      } else {
        const postId = result.data.createPost.id;
        const publishMutation = `
        mutation {
  publishPost(where: { id: "${postId}" }, to: PUBLISHED) {
    id
  }
}
      `;

        const publishResponse = await fetch('https://ap-south-1.cdn.hygraph.com/content/cm26enik906sq07wemvb5y20r/master', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: ``,
          },
          body: JSON.stringify({ query: publishMutation }),
        });

        const publishResult = await publishResponse.json();

        if (publishResult.errors) {
          setErrorMessage('Error publishing post. Please try again.');
          console.error(publishResult.errors);
        } else {
          setSuccessMessage('Post created successfully!');
          window.location.href = `/post/${postSlug}`;
        }
      }
    } catch (error) {
      setErrorMessage('Error creating post. Please check the console for details.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 max-w-lg mx-auto shadow-md rounded-lg space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Create a New Post</h2>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-100"
      />

      <textarea
        placeholder="Excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-100"
      />

      <ReactQuill
        value={content}
        onChange={setContent}
        placeholder="Content"
        style={{
          minHeight: '100px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '20px',
          maxHeight: 'none',
        }}
        required
        className="rounded-md"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        required
        className="w-full border border-gray-300 p-2 rounded-md"
      />

      <input
        type="text"
        placeholder="Author ID"
        value={authorId}
        onChange={(e) => setAuthorId(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-100"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-100"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button type="submit" className="w-full p-2 bg-yellow-800 text-white font-semibold rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-100">
        Create Post
      </button>
    </form>
  );
};

export default CreatePostForm;