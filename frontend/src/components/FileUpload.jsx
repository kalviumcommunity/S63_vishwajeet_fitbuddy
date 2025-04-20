// src/components/FileUpload.jsx
import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("No file selected");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      alert(`Upload success: ${result.message}`);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="p-4 border rounded-md max-w-md mx-auto mt-8">
      <input type="file" onChange={handleChange} className="mb-4" />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
