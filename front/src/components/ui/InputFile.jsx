import { useState, useEffect } from "react";
import "../../styles/inputFile.css";

function InputFile({text, onFileChange}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  
  useEffect(() => {
    setPreviewUrl(null);
  }, []);
  
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      if(onFileChange){
        onFileChange(file);
      }
    }
  }

  return (
    <div className="inputfile-container">
      <label className="inputfile-label">
        {text}
        <input type="file" accept="image/*" onChange={handleFileChange}/>
      </label>
      {previewUrl && (
        <div className="preview-container">
          <img src={previewUrl} alt="Preview" className="preview-image" />
        </div>
      )}
      
    </div>
  );
}
export default InputFile;