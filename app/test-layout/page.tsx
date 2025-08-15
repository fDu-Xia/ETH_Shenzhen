export default function TestLayoutPage() {
  return (
    <html>
      <head>
        <title>Test Layout Bypass</title>
      </head>
      <body style={{ background: 'white', color: 'black', padding: '20px' }}>
        <h1>Test Layout Bypass - No Providers, No Bg</h1>
        
        <p>This page bypasses the normal layout completely.</p>
        
        <h2>Test 1: Basic Button</h2>
        <button 
          onClick={() => alert('Button works!')}
          style={{ background: 'red', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}
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
          style={{ background: 'white', color: 'black', padding: '10px', border: '2px solid blue', borderRadius: '5px' }}
        />
        
        <h2>Test 3: Console Test</h2>
        <button 
          onClick={() => {
            console.log('Console test - button clicked');
            alert('Check console for logs');
          }}
          style={{ background: 'green', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}
        >
          Test Console
        </button>
        
        <hr />
        <p><strong>Status:</strong> If this works, the issue is in the layout components.</p>
      </body>
    </html>
  );
}
