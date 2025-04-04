import { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [compressedImage, setCompressedImage] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setError('');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedFile(null);
      setError('File size too large. Maximum size is 5MB.');
      return;
    }

    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')) {
      setSelectedFile(file);
      setError('');
    } else {
      setSelectedFile(null);
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCompressedImage(response.data.image);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Error uploading image. Please try again.');
      } else if (err.request) {
        setError('No response from server. Please check if the server is running.');
      } else {
        setError('Error uploading image. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!compressedImage) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/images/${compressedImage.id}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `compressed-${compressedImage.originalName}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Error downloading image. Please try again.');
      } else {
        setError('Error downloading image. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-4">Image Compression</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="btn-primary disabled:opacity-50"
          >
            {uploading ? 'Compressing...' : 'Compress Image'}
          </button>
        </div>
      </div>

      {compressedImage && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Compression Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Original Image</h4>
              <p>Size: {(compressedImage.originalSize / 1024).toFixed(2)} KB</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Compressed Image</h4>
              <p>Size: {(compressedImage.compressedSize / 1024).toFixed(2)} KB</p>
              <p>Compression Ratio: {compressedImage.compressionRatio.toFixed(2)}%</p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="btn-secondary mt-4"
          >
            Download Compressed Image
          </button>
        </div>
      )}
    </div>
  );
};

export default Home; 