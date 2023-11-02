import { ChangeEvent } from 'react'

interface InputProps {
    label: string
    value: string
}

const Input = ({ label, value, ...props }: InputProps) => {
    return (
        <div className="mb-4">
            <label htmlFor={label} className="block text-sm font-bold leading-6 text-black">
                {label}
            </label>
            <div className="mt-2">
                <input
                    {...props}
                    value={value}
                    className="block w-full rounded-md border-0 py-2 px-4 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
            </div>
        </div>
    )
}

export default Input