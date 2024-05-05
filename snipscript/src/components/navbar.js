import icon from '../images/snipscript_icon_transparent.png';
import logo from '../images/snipscript_logo_transparent.png';
import { Link } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/', current: true },
  { name: 'Explore', href: '/board', current: false },
  { name: 'Bookmarks', href: '/bookmarks', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

// export default function Navbar() {
//   return (
//     <nav className="p-4">
//         <div className="bg-gradient-to-r from-green-700 to-green-500">
//             <div class="container mx-auto flex justify-between items-center">
//                 <div className="flex items-center">
//                     <img src={icon} alt="Icon" className="h-14 w-14 mr-5" />
//                     <img src={logo} alt="Logo" className="h-6" />
//                 </div>

//                 <div class="flex space-x-4">
//                     {navigation.map((item) => (
//                         <a
//                         key={item.name}
//                         href={item.href}
//                         className={classNames(
//                             item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
//                             'rounded-md px-3 py-2 text-sm font-medium'
//                         )}
//                         aria-current={item.current ? 'page' : undefined}
//                         >
//                         {item.name}
//                         </a>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     </nav>          
//   );
// };

export default function Navbar() {
    return (
      <nav className="p-4 bg-violet-900 bg-opacity-25">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={icon} alt="Icon" className="h-14 w-14 mr-5" />
            <img src={logo} alt="Logo" className="h-6" />
          </div>
  
          <div className="flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  item.current ? 'bg-violet-100 text-black' : 'text-white hover:bg-violet-100 hover:text-black',
                  'rounded-md px-3 py-2 text-sm font-medium'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    );
  };
  
