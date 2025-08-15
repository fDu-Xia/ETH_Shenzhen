"use client";

import { useState, useEffect } from "react";

export default function TestPage() {
  const [browserInfo, setBrowserInfo] = useState({
    userAgent: "Loading...",
    platform: "Loading...",
    loadedAt: "Loading..."
  });

  useEffect(() => {
    // Set browser info after component mounts (client-side only)
    setBrowserInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      loadedAt: new Date().toLocaleString()
    });
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#1a1a1a", minHeight: "100vh", color: "white" }}>
      <h1>Basic File Input Test</h1>
      
      <p>This is a simple test page to see if file inputs work at all.</p>
      
      <div style={{ margin: "20px 0" }}>
        <h3>Test 1: Basic File Input</h3>
        <input 
          type="file" 
          onChange={(e) => {
            console.log("File input changed:", e.target.files);
            alert(`Files selected: ${e.target.files?.length || 0}`);
          }}
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "10px",
            border: "2px solid blue",
            borderRadius: "5px"
          }}
        />
      </div>
      
      <div style={{ margin: "20px 0" }}>
        <h3>Test 2: Button Test</h3>
        <button 
          onClick={() => {
            console.log("Button clicked");
            alert("Button works!");
          }}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Test Button
        </button>
      </div>
      
      <div style={{ margin: "20px 0" }}>
        <h3>Test 3: Direct File Input</h3>
        <input 
          type="file" 
          id="direct-input"
          style={{ display: "none" }}
          onChange={(e) => {
            console.log("Direct input changed:", e.target.files);
            alert(`Direct input files: ${e.target.files?.length || 0}`);
          }}
        />
        <label 
          htmlFor="direct-input"
          style={{
            backgroundColor: "orange",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "inline-block"
          }}
        >
          Click to Select File
        </label>
      </div>
      
      <div style={{ margin: "20px 0" }}>
        <h3>Test 4: Programmatic File Input</h3>
        <button 
          onClick={() => {
            console.log("Creating programmatic input...");
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              console.log("Programmatic input worked:", target.files);
              alert(`Programmatic input files: ${target.files?.length || 0}`);
            };
            input.click();
            console.log("Programmatic input.click() called");
          }}
          style={{
            backgroundColor: "purple",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Create File Input Programmatically
        </button>
      </div>
      
      <div style={{ margin: "20px 0", padding: "15px", backgroundColor: "#333", borderRadius: "5px" }}>
        <h3>Debug Info:</h3>
        <p>Page loaded at: {browserInfo.loadedAt}</p>
        <p>User Agent: {browserInfo.userAgent}</p>
        <p>Platform: {browserInfo.platform}</p>
      </div>
    </div>
  );
}
