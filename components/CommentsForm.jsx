import React, { useRef, useState, useEffect } from 'react';

const CommentsForm = ({ slug }) => {
  const [error, setError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const commentEl = useRef();
  const nameEl = useRef();
  const emailEl = useRef();
  const storeDataEl = useRef();

  useEffect(() => {
    nameEl.current.value = window.localStorage.getItem('name');
    emailEl.current.value = window.localStorage.getItem('email');
  }, []);

  const handleCommentSubmission = async () => {
    setError(false);
    const comment = commentEl.current?.value.trim();
  const name = nameEl.current?.value.trim();
  const email = emailEl.current?.value.trim();
  const storeData = storeDataEl.current?.checked;
    console.log(comment+" "+name+" "+email )
   

    const commentObj = { name, email, comment, slug };

    if (storeData) {
      window.localStorage.setItem('name', name);
      window.localStorage.setItem('email', email);
    } else {
      window.localStorage.removeItem('name');
      window.localStorage.removeItem('email');
    }

    const createCommentMutation = `
      mutation CreateComment($name: String!, $email: String!, $comment: String!, $slug: String!) {
        createComment(data: {name: $name, email: $email, comment: $comment, post: {connect: {slug: $slug}}}) { 
          id 
        }
      }
    `;

    const variables = {
      name: commentObj.name,
      email: commentObj.email,
      comment: commentObj.comment,
      slug: commentObj.slug,
    };

    try {
      const createResponse = await fetch("https://ap-south-1.cdn.hygraph.com/content/cm26enik906sq07wemvb5y20r/master", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MjkwMjIyMjYsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmh5Z3JhcGguY29tL3YyL2NtMjZlbmlrOTA2c3EwN3dlbXZiNXkyMHIvbWFzdGVyIiwibWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQtYXAtc291dGgtMS5oeWdyYXBoLmNvbS8iLCJzdWIiOiIxNGJkZDg4MC0wMmEzLTQ4NTEtYjA5Yy1kOWY5NDhjMzU5YTEiLCJqdGkiOiJjbTJhdjZ3ZjgwN252MDdwamZnemY5YnB2In0.4wuCV_ICVohZ_x5vb43VToVCeWq0vkzgCwmIgsPZEr523TsFHIbIGr-PmtCJFFXXyKCRqhZS7L-Mh9YQAlgn0mS5XSrI2vyWyklkFHDROtSmhWkJuEQVO9n3DJlcS4-6sbmnTd4grgHKb0W2yzmMQ-l-E4PPr4bzrdB9O4xrQq3kAu61kBl8dcz88KlZ1G5vFN5VfTAwL__u8IjI39Nbwo2qG7cSQwnEo0gVTxizeSlVr_XnfnV2YwgI5jXI3tW_Q51DDeRAtYVSO119iXE3-q-wIGiQXMcYnTYV6nVuMkgB7ggLR2b84HKciHq7K0FGurwrANI0d3d83bpgeUTff1ORp7v6ctdcKm1lF3jcnhb00q6lld5Ijvz1n3a4fj5riKwa79Vq6bPy5XOcxOHZ4Y60idDFdd_OkuUAedlYgxUdxg_owZkFtzps-4BN7qqas8XmtnFGQdAYnnIKav4PpzvlB0_e52lmgLaJLW0zcRwgeRPckL553cylMZq97OhfD8B6YiFPsWGwrS548EecAG222jEXrNZSBXu8FhPsc-V5D5m3lY-6oI2pMcJ2UXPLnfPDh0C8uJ-8P840PYEZ86-oPNohrUih0pHoDWMSwHHKyKUeE53PUgiR1w_FE8I_SUhTMhtIVRp2oU2GQw953pOpIjQxHLAckSeHCq7SLkk`,
        },
        body: JSON.stringify({ query: createCommentMutation, variables }),
      });

      const createResult = await createResponse.json();
      if (createResult.errors) {
        console.error(createResult.errors);
        setError(true);
        return;
      }

      const commentId = createResult.data.createComment.id;

      // GraphQL mutation to publish the comment
      const publishCommentMutation = `
        mutation {
          publishComment(where: {id: "${commentId}"}, to: PUBLISHED) { 
            id 
          }
        }
      `;

      const publishResponse = await fetch("https://ap-south-1.cdn.hygraph.com/content/cm26enik906sq07wemvb5y20r/master", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MjkwMjIyMjYsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmh5Z3JhcGguY29tL3YyL2NtMjZlbmlrOTA2c3EwN3dlbXZiNXkyMHIvbWFzdGVyIiwibWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQtYXAtc291dGgtMS5oeWdyYXBoLmNvbS8iLCJzdWIiOiIxNGJkZDg4MC0wMmEzLTQ4NTEtYjA5Yy1kOWY5NDhjMzU5YTEiLCJqdGkiOiJjbTJhdjZ3ZjgwN252MDdwamZnemY5YnB2In0.4wuCV_ICVohZ_x5vb43VToVCeWq0vkzgCwmIgsPZEr523TsFHIbIGr-PmtCJFFXXyKCRqhZS7L-Mh9YQAlgn0mS5XSrI2vyWyklkFHDROtSmhWkJuEQVO9n3DJlcS4-6sbmnTd4grgHKb0W2yzmMQ-l-E4PPr4bzrdB9O4xrQq3kAu61kBl8dcz88KlZ1G5vFN5VfTAwL__u8IjI39Nbwo2qG7cSQwnEo0gVTxizeSlVr_XnfnV2YwgI5jXI3tW_Q51DDeRAtYVSO119iXE3-q-wIGiQXMcYnTYV6nVuMkgB7ggLR2b84HKciHq7K0FGurwrANI0d3d83bpgeUTff1ORp7v6ctdcKm1lF3jcnhb00q6lld5Ijvz1n3a4fj5riKwa79Vq6bPy5XOcxOHZ4Y60idDFdd_OkuUAedlYgxUdxg_owZkFtzps-4BN7qqas8XmtnFGQdAYnnIKav4PpzvlB0_e52lmgLaJLW0zcRwgeRPckL553cylMZq97OhfD8B6YiFPsWGwrS548EecAG222jEXrNZSBXu8FhPsc-V5D5m3lY-6oI2pMcJ2UXPLnfPDh0C8uJ-8P840PYEZ86-oPNohrUih0pHoDWMSwHHKyKUeE53PUgiR1w_FE8I_SUhTMhtIVRp2oU2GQw953pOpIjQxHLAckSeHCq7SLkk`,
        },
        body: JSON.stringify({ query: publishCommentMutation }),
      });

      const publishResult = await publishResponse.json();
      if (publishResult.errors) {
        console.error(publishResult.errors);
        setError(true);
        return;
      }

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">Comment</h3>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <textarea 
          ref={commentEl}
          className="p-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700" 
          placeholder="Comment" 
          name="comment"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <input 
          type="text" ref={nameEl} 
          className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700" 
          placeholder="Name" 
          name="name" 
        />
        <input 
          type="email" ref={emailEl}  
          className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700" 
          placeholder="Email" 
          name="email" 
        />
      </div>
      {error && <p className="text-xs text-red-500">All fields are required</p>}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <input ref={storeDataEl} type="checkbox" id="storeData" name="storeData" value="true" />
          <label className="text-gray-500 cursor-pointer ml-2" htmlFor="storeData">
            Save my name, email in this browser for the next time I comment.
          </label>
        </div>
      </div>
      <div className="mt-8">
        <button 
          type="button" 
          onClick={handleCommentSubmission} 
          className="transition duration-500 ease hover:bg-yellow-700 inline-block bg-yellow-800 text-lg rounded-full text-white px-8 py-3 cursor-pointer"
        >
          Post Comment
        </button>
        {showSuccessMessage && <span className="text-xl float-right font-semibold mt-3 text-green-500">
          Comment submitted
        </span>}
      </div>
    </div>
  );
};

export default CommentsForm;
