import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import * as monaco from 'monaco-editor'

// const languages = [
//   {
//     id: 1,
//     name: 'TypeScript'
//   },
//   {
//     id: 2,
//     name: 'JavaScript'
//   },
//   {
//     id: 3,
//     name: 'CSS'
//   },
//   {
//     id: 4,
//     name: 'LESS'
//   },
//   {
//     id: 5,
//     name: 'SCSS'
//   },
//   {
//     id: 6,
//     name: 'JSON'
//   },
//   {
//     id: 7,
//     name: 'HTML'
//   },
//   {
//     id: 8,
//     name: 'XML'
//   },
//   {
//     id: 9,
//     name: 'PHP'
//   },
//   {
//     id: 10,
//     name: 'C#'
//   },
//   {
//     id: 11,
//     name: 'C++'
//   },
//   {
//     id: 12,
//     name: 'Razor'
//   },
//   {
//     id: 13,
//     name: 'Markdown'
//   },
//   {
//     id: 14,
//     name: 'Diff'
//   },
//   {
//     id: 15,
//     name: 'Java'
//   },
//   {
//     id: 16,
//     name: 'VB'
//   },
//   {
//     id: 17,
//     name: 'CoffeeScript'
//   },
//   {
//     id: 18,
//     name: 'HandleBars'
//   },
//   {
//     id: 19,
//     name: 'Batch'
//   },
//   {
//     id: 20,
//     name: 'Pug'
//   },
//   {
//     id: 21,
//     name: 'F#'
//   },
//   {
//     id: 22,
//     name: 'Lua'
//   },
//   {
//     id: 23,
//     name: 'Powershell'
//   },
//   {
//     id: 24,
//     name: 'Python'
//   },
//   {
//     id: 25,
//     name: 'Ruby'
//   },
//   {
//     id: 26,
//     name: 'SASS'
//   },
//   {
//     id: 27,
//     name: 'R'
//   },
//   {
//     id: 28,
//     name: 'Objective-C'
//   },
// ]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function LanguageSelector({ setLanguage }) {
  const [selected, setSelected] = useState('javascript')
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    // Fetch all supported languages from Monaco Editor
    const monacoLanguages = monaco.languages.getLanguages();
    // Extract language names from language objects
    const languageNames = monacoLanguages.map(lang => lang.id);
    setLanguages(languageNames);
    // Set default language if not selected
    if (!selected && languageNames.length > 0) {
      setSelected(languageNames[0]);
      setLanguage(languageNames[0]);
    }
  }, []);

  const handleLanguageChange = (selectedLanguage) => {
    setSelected(selectedLanguage)
    setLanguage(selectedLanguage)
  }

  return (
    <Listbox value={selected} onChange={handleLanguageChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-white mr-10">{selected}</Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 px-20 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                <span className="block truncate">{selected}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {languages.map((lang, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={lang}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                        className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                        >
                        {lang}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}