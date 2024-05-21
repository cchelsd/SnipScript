import Design from '../images/homeDesign.png'
import { useNavigate } from 'react-router-dom';

export default function Landing() {

    const isLoggedIn = localStorage.getItem("Current user id") ? true : false;
    const navigate = useNavigate();

    const handleNav = () => {
        isLoggedIn ? navigate ('/dashboard') : navigate('/authentication')
      };

    return (
        <div className="flex flex-row h-full items-center">
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
   
    )
}