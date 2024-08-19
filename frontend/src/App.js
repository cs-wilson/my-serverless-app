import React, { useState } from 'react';
import { uploadData } from './Api';
import './App.css';

function App() {
  const [userId, setUserId] = useState('');
  const [textData, setTextData] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await uploadData(userId, textData, imageFile);
      setResponseMessage(response.message);
    } catch (error) {
      setResponseMessage('Error uploading data');
    }
  };

  return (
    <div className="App">
      <h1>Upload User Data</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <textarea
          placeholder="Enter your text"
          value={textData}
          onChange={(e) => setTextData(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default App;