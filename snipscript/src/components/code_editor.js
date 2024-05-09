import Editor from "@monaco-editor/react"
import { useEffect, useState } from "react"
import * as monaco from 'monaco-editor';

export default function CodeEditor({initialValue, onChange, language}) {
    const defaultLanguage = language !== "" ? language : 'javascript';
    const [editorLanguage, setEditorLanguage] = useState(defaultLanguage);
    
    useEffect(() => {
        // Update the language in the editor when language prop changes
        setEditorLanguage(language);
        console.log("Updated language: ", editorLanguage);
    }, [language]);

    return (
        <>
            <Editor width="100%"
            height="400px"
            theme="vs-dark"
            defaultLanguage={language}
            language={editorLanguage}
            value={initialValue}
            onChange={onChange}/>
        </>
    )
}