"use client";

export default function SimplePage() {
  return (
    <html>
      <body style={{ backgroundColor: "black", color: "white", padding: "20px", fontFamily: "Arial" }}>
        <h1>Ultra Simple Test</h1>
        
        <p>If you can see this text, Next.js is working.</p>
        
        <h2>Test 1: Basic Button</h2>
        <button 
          onClick={() => alert("Button clicked!")}
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Click Me
        </button>
        
        <h2>Test 2: Basic File Input</h2>
        <input 
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              alert(`File selected: ${files[0].name}`);
            }
          }}
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "10px",
            border: "2px solid blue"
          }}
        />
        
        <h2>Test 3: Console Log</h2>
        <button 
          onClick={() => {
            console.log("Console log test");
            console.log("Button clicked at:", new Date());
            alert("Check browser console for logs");
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
          Test Console
        </button>
        
        <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#333", borderRadius: "5px" }}>
          <h3>Page Status:</h3>
          <p>✅ Page loaded successfully</p>
          <p>✅ HTML rendering works</p>
          <p>❓ JavaScript functionality - testing...</p>
        </div>
      </body>
    </html>
  );
}
