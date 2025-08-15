"use client";

import { useState } from "react";

export default function DemoPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input change event triggered");
    console.log("Event:", event);
    console.log("Files:", event.target.files);
    
    setDebugInfo(`Event triggered. Files length: ${event.target.files?.length || 0}`);
    
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult("");
      setDebugInfo(`File selected: ${file.name} (${file.size} bytes)`);
      console.log("File selected:", file.name, file.size);
    }
  };

  const testFileInput = () => {
    setDebugInfo("Testing file input...");
    console.log("Test button clicked");
    
    // Try to create a file input programmatically
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      console.log("Programmatic file input change:", target.files);
      setDebugInfo(`Programmatic input worked! Files: ${target.files?.length || 0}`);
    };
    
    // Try to trigger it
    try {
      input.click();
      setDebugInfo("Programmatic input.click() called");
    } catch (error) {
      setDebugInfo(`Error with programmatic input: ${error}`);
      console.error("Programmatic input error:", error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadResult("Please select a file first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult(`Success! IPFS Hash: ${result.ipfsHash}`);
      } else {
        setUploadResult(`Error: ${result.error}`);
      }
    } catch (error) {
      setUploadResult(`Upload failed: ${error}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "white", textAlign: "center", marginBottom: "30px" }}>
        IPFS File Upload Demo - Debug Version
      </h1>
      
      {/* Debug Info */}
      <div style={{ 
        backgroundColor: "#333", 
        padding: "15px", 
        borderRadius: "5px",
        marginBottom: "20px",
        border: "1px solid #666"
      }}>
        <h3 style={{ color: "yellow", margin: "0 0 10px 0" }}>Debug Info:</h3>
        <p style={{ color: "white", margin: "0", fontSize: "14px" }}>
          {debugInfo || "No debug info yet"}
        </p>
      </div>
      
      <div style={{ 
        border: "2px dashed #666", 
        padding: "40px", 
        textAlign: "center",
        borderRadius: "10px",
        backgroundColor: "#2a2a2a",
        marginBottom: "20px"
      }}>
        <p style={{ color: "white", marginBottom: "20px" }}>
          Select a file to upload to IPFS:
        </p>
        
        {/* Method 1: Standard file input */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#ccc", fontSize: "14px", marginBottom: "10px" }}>Method 1: Standard Input</p>
          <input
            type="file"
            onChange={handleFileSelect}
            accept="*/*"
            style={{
              display: "block",
              margin: "0 auto 10px auto",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "white",
              color: "black"
            }}
          />
        </div>
        
        {/* Method 2: Button with label */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#ccc", fontSize: "14px", marginBottom: "10px" }}>Method 2: Label + Hidden Input</p>
          <input
            type="file"
            onChange={handleFileSelect}
            accept="*/*"
            id="hidden-file-input"
            style={{ display: "none" }}
          />
          <label
            htmlFor="hidden-file-input"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              display: "inline-block"
            }}
          >
            Choose File (Label Method)
          </label>
        </div>
        
        {/* Method 3: Programmatic trigger */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#ccc", fontSize: "14px", marginBottom: "10px" }}>Method 3: Programmatic Trigger</p>
          <button
            onClick={testFileInput}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Test Programmatic Input
          </button>
        </div>
        
        {/* File info */}
        {selectedFile && (
          <div style={{ 
            backgroundColor: "#3a3a3a", 
            padding: "15px", 
            borderRadius: "5px",
            marginBottom: "20px"
          }}>
            <p style={{ color: "white", margin: "0" }}>
              <strong>Selected:</strong> {selectedFile.name}
            </p>
            <p style={{ color: "white", margin: "5px 0 0 0" }}>
              <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
        
        {/* Upload button */}
        {selectedFile && (
          <button
            onClick={handleUpload}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
          >
            Upload to IPFS
          </button>
        )}
      </div>
      
      {/* Result display */}
      {uploadResult && (
        <div style={{
          backgroundColor: uploadResult.includes("Success") ? "#28a745" : "#dc3545",
          color: "white",
          padding: "15px",
          borderRadius: "5px",
          textAlign: "center"
        }}>
          {uploadResult}
        </div>
      )}
      
      {/* Instructions */}
      <div style={{ 
        backgroundColor: "#2a2a2a", 
        padding: "20px", 
        borderRadius: "10px",
        marginTop: "20px"
      }}>
        <h3 style={{ color: "white", marginTop: "0" }}>Troubleshooting:</h3>
        <ol style={{ color: "white", textAlign: "left" }}>
          <li>Check browser console for errors</li>
          <li>Try different browsers (Chrome, Firefox, Safari)</li>
          <li>Check if file inputs are blocked by browser settings</li>
          <li>Try the different methods above</li>
          <li>Check if there are any browser extensions blocking file inputs</li>
        </ol>
      </div>
    </div>
  );
}
