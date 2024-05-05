// App.js
import React, { useState, useEffect } from 'react';
import CodeEditor from './code_editor';
import CodeSnippet from './code_snippet';

const Test = () => {
    const [code, setCode] = useState('');

    useEffect(() => {
      // Load code snippet from local storage if available
      const savedCode = localStorage.getItem('code');
      if (savedCode) {
        setCode(savedCode);
      }
    }, []);
  
    const handleChange = (value) => {
      // Update code state
      setCode(value);
      // Save code to local storage
      localStorage.setItem('code', value);
    };
  
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Code Snippet Editor</h1>
        <div className="mb-4">
          <CodeEditor initialValue={code} onChange={handleChange} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Code Snippet Preview</h2>
          <CodeSnippet code={code} />
        </div>
      </div>
    );
};

export default Test;
