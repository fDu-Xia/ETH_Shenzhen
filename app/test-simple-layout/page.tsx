"use client";

export default function TestSimpleLayoutPage() {
  return (
    <div style={{ background: 'white', color: 'black', padding: '20px', minHeight: '100vh' }}>
      <h1>Test Simple Layout - Minimal Styling</h1>
      
      <p>This page uses minimal styling and no complex components.</p>
      
      <h2>Test 1: Basic Button</h2>
      <button 
        onClick={() => alert('Button works!')}
        style={{ background: 'red', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
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
            console.log('File selected:', files[0]);
          }
        }}
        style={{ background: 'white', color: 'black', padding: '10px', border: '2px solid blue', borderRadius: '5px' }}
      />
      
      <h2>Test 3: Console Test</h2>
      <button 
        onClick={() => {
          console.log('Console test - button clicked');
          console.log('Time:', new Date());
          alert('Check console for logs');
        }}
        style={{ background: 'green', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Test Console
      </button>
      
      <h2>Test 4: Direct DOM Test</h2>
      <button 
        onClick={() => {
          const testDiv = document.createElement('div');
          testDiv.textContent = 'DOM manipulation works!';
          testDiv.style.color = 'red';
          testDiv.style.fontSize = '20px';
          testDiv.style.marginTop = '20px';
          document.body.appendChild(testDiv);
          setTimeout(() => testDiv.remove(), 3000);
        }}
        style={{ background: 'purple', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Test DOM
      </button>
      
      <hr />
      <p><strong>Status:</strong> If this works, the issue is in the layout components (Providers, Bg, etc.).</p>
      <p><strong>If this doesn't work:</strong> The issue is deeper in Next.js configuration.</p>
    </div>
  );
}
