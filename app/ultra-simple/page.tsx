"use client";

export default function UltraSimplePage() {
  return (
    <div>
      <h1>Ultra Simple Test - No CSS</h1>
      
      <p>This page has no CSS, no Tailwind, no complex configurations.</p>
      
      <h2>Test 1: Basic Button</h2>
      <button onClick={() => alert("Button works!")}>
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
      />
      
      <h2>Test 3: Console Test</h2>
      <button onClick={() => {
        console.log("Console test - button clicked");
        alert("Check console for logs");
      }}>
        Test Console
      </button>
      
      <h2>Test 4: Direct DOM Test</h2>
      <button onClick={() => {
        const testDiv = document.createElement('div');
        testDiv.textContent = 'DOM manipulation works!';
        testDiv.style.color = 'red';
        document.body.appendChild(testDiv);
        setTimeout(() => testDiv.remove(), 3000);
      }}>
        Test DOM
      </button>
      
      <hr />
      <p><strong>Status:</strong> If you can see this text and click buttons, the page is working.</p>
    </div>
  );
}
