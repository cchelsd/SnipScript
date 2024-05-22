import Design from '../images/homeDesign.png'
import { useNavigate } from 'react-router-dom';

export default function Landing() {

    const isLoggedIn = localStorage.getItem("Current user id") ? true : false;
    const navigate = useNavigate();

    const handleNav = () => {
        isLoggedIn ? navigate ('/dashboard') : navigate('/authentication')
      };

    return (
        <div className="flex flex-col h-full overflow-y-auto items-center">
            <div className='flex flex-row mt-12 mb-10 items-center'>
                <div className="w-1/2 pl-20">
                    <h1 className="text-6xl text-white font-bold leading-tight mb-4">Manage and discover code snippets in one shared space</h1>
                    <p className="text-white font-semibold mb-8">Say goodbye to scattered code snippets: SnipScript allows developers to easily organize their code snippets and 
                        discover new solutions, streamlining their workflow.</p>
                    <button className="p-4 rounded-lg bg-violet-800 text-white font-semibold" onClick={handleNav}>Get started with SnipScript</button>
                </div>
                <div className="w-1/2 pl-32">
                    <img className='w-10/12' src={Design}></img>
                </div>
            </div>
            <div className='text-white p-20'>
                <h1 className='text-center text-5xl font-bold mb-8'>What is SnipScript?</h1>
                <p className="text-center font-semibold mb-16">SnipScript is the ultimate tool for developers to manage and explore code snippets.
                Designed with productivity in mind, SnipScript offers a seamless experience for organizing and discovering code, ensuring that your
                development process if efficient and hassel-free.</p>
                <h1 className='font-bold text-3xl'>Key Features</h1>
                <div className='grid grid-cols-2 gap-8'>
                    <div>
                        <p className='font-bold mt-4 text-xl'>1. Organized Boards and Lists</p>
                        <p><span className='font-semibold'>• Customizable Boards: </span>Create and manage boards for different projects or categories, making it easy to keep your code organized.</p>
                        <p><span className='font-semibold'>• Structured Lists: </span><p><span className='font-semibold'>• Customizable Boards: </span>Create and manage boards for different 
                        projects or categories, making it easy to keep your code organized.</p></p>
                    </div>
                    <div>
                        <p className='font-bold mt-4 text-xl'>2. Effortless Code Snippet Management</p>
                        <p><span className='font-semibold'>• Detailed Snippet View: </span>Store information for each snippet, including title, description, tags, code content, and code language.
                        With a built-in code editor with IntelliSense, you can even type your code directly in our app.</p>
                        <p><span className='font-semibold'>• Drag and Drop: </span>With a kanban-style interface, easily move snippets between lists with a simple drag-and-drop action.</p>
                    </div>
                    <div>
                        <p className='font-bold mt-4 text-xl'>3. Discover New Solutions</p>
                        <p><span className='font-semibold'>• Explore Snippets: </span>Browse snippets shared by other developers to find new and innovative solutions.</p>
                        <p><span className='font-semibold'>• Search and Trending: </span>Find exactly what you need by searching, or exploring trending snippets or tags.</p>
                    </div>
                    <div>
                        <p className='font-bold mt-4 text-xl'>4. Streamlined Workflow</p>
                        <p><span className='font-semibold'>• Explore Snippets: </span>Keep all your code snippets in one place, ensuring you have the right code at your fingertips.</p>
                        <p><span className='font-semibold'>• Enhanced Productivity: </span>Spend less time searching for code and more time developing.</p>
                    </div>
                </div>
                <p className='text-center mt-12'>Developed by <span className='font-bold'>Chelsea Dacones: </span>chelsjd@uw.edu, <span className='font-bold'>Aryan Damle: </span>adamle@uw.edu, and <span className='font-bold'>Ares Zhang: </span>aresz@uw.edu</p>
            </div>
        </div>
   
    )
}