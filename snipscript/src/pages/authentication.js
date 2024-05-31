import { useState } from "react";
import icon from '../images/snipscript_icon.png'
import { useNavigate } from "react-router-dom";

export default function Auth () {

    const [isLogin, setLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
      event.preventDefault();
      const endpoint = isLogin ? 'https://snipscript-3.wl.r.appspot.com/api/login' : 'https://snipscript-3.wl.r.appspot.com/api/register';
    
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.success) {
          // Authentication successful
          const username = isLogin ? (data.user).username : data.username;
          const id = isLogin ? (data.user).id : data.userId;
          localStorage.setItem("Current username", username);
          localStorage.setItem("Current user id", id);
          // Navigate to the dashboard page upon successful login or register
          navigate('/');
        } else {
          // Authentication failed
          setMessage(data.message);
        }
      })
      .catch(error => {
        // console.error('Error:', error);
      });
    };

    return (
      <div className="flex h-full justify-center items-center">
        <div className="h-3/4 w-3/4 bg-white rounded-2xl">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                className="mx-auto h-24 w-auto"
                src={icon}
                alt="SnipScript"
                />
                <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                {isLogin ? "Welcome back!" : "Create your account"}
                </h2>
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                    Username
                    </label>
                    <div className="mt-2">
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    </div>
                </div>
    
                <div>
                    <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                        Password
                    </label>
                    </div>
                    <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    </div>
                </div>
    
                <div className="flex flex-col">
                    <p className="text-sm text-red-500 mb-2">{message}</p>
                    <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                    {isLogin ? "Sign in" : "Sign up"}
                    </button>
                </div>
                </form>
    
                <p className="mt-10 text-center text-sm text-gray-500">
                {isLogin ? "Not a member? " : "Already a member? "}
                <a href="#" onClick={() => setLogin(!isLogin)} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                {isLogin ? "Sign up" : "Sign in"}
                </a>
                </p>
            </div>
            </div>
        </div>
      </div>
    )
  }  