import { useState, useCallback, useEffect, useRef } from 'react'
import { FaCopy } from 'react-icons/fa'

function App() {
  const [length, setLength] = useState(8)
  const [upperCase, setUpperCase] = useState(true)
  const [lowerCase, setLowerCase] = useState(true)
  const [numAllowed, setNumAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState([])

  const passwordRef = useRef(null)

  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = ""

    if (upperCase) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (lowerCase) str += "abcdefghijklmnopqrstuvwxyz"
    if (numAllowed) str += "0123456789"
    if (charAllowed) str += "@#$&*_"

    if (!str.length) {
      setPassword("Select at least one option");
      return;
    }

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length)
      pass += str.charAt(char)
    }
    setPassword(pass)
    setHistory((prev) => [pass, ...prev.slice(0, 4)])

  }, [length, upperCase, lowerCase, numAllowed, charAllowed, setPassword])

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select()
    passwordRef.current?.setSelectionRange(0, 101)
    window.navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }, [password])

  const getStrength = () => {
    let score = 0;

    if (length >= 8) score++;
    if (length >= 12) score++;
    if (numAllowed) score++;
    if (charAllowed) score++;

    if (score <= 1) return "Weak";
    if (score <= 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6">
        <h1 className="text-4xl font-bold text-center text-white mb-6">
          Password Generator 🔐
        </h1>

        <div className="flex bg-white/20 border border-white/20 rounded-xl overflow-hidden mb-4">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-3 px-4 bg-transparent text-white placeholder-gray-300"
            placeholder='Password'
            readOnly
            ref={passwordRef}
          />

          <button
            onClick={copyPasswordToClipboard}
            className="bg-slate-700 hover:bg-slate-800 px-4 text-white transition-colors duration-200 flex items-center gap-2">     
            {copied ? ("✅") : (
              <>
                <FaCopy/>
                Copy
              </>
            )}</button>
        </div>

        <div className="mb-4 text-white">
          <div className="flex justify-between mb-2">
            <span>Password Length</span>
            <span>{length}</span>
          </div>

          <input
            type="range"
            min={6}
            max={20}
            value={length}
            className="w-full cursor-pointer"
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-white mt-4">
          <label className="flex items-center gap-2 bg-white/10 roumded-lg p-3">
            <input
              type="checkbox"
              checked={upperCase}
              onChange={() => setUpperCase((prev) => !prev)}
            />
            Uppercase
          </label>

          <label className="flex items-center gap-2 bg-white/10 roumded-lg p-3">
            <input
              type="checkbox"
              checked={lowerCase}
              onChange={() => setLowerCase((prev) => !prev)}
            />
            Lowercase
          </label>

          <label className="flex items-center gap-2 bg-white/10 roumded-lg p-3">
            <input
              type="checkbox"
              checked={numAllowed}
              onChange={() => setNumAllowed((prev) => !prev)}
            />
            Numbers
          </label>

          <label className="flex items-center gap-2 bg-white/10 roumded-lg p-3">
            <input
              type="checkbox"
              checked={charAllowed}
              onChange={() => setCharAllowed((prev) => !prev)}
            />
            Symbols
          </label>
        </div>

        <button
          onClick={passwordGenerator}
          className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors duration-200 shadow-md">
          Generate Password
        </button>

        <div className="mt-5 text-white text-center">
          <p>
            <strong>Password Strength:</strong> {getStrength()}
          </p>
        </div>

        <div className="mt-5">
          <h2 className="text-white font-semibold mb-2">
            Recent Passwords
          </h2>

          {history.length === 0 ? (
            <p className="text-gray-300">No passwords generated yet.</p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 border border-white/10 text-white p-3 rounded-lg mb-2 break-all"
              >
                {item}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
