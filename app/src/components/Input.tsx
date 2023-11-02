interface InputProps {
    className?: string
    label: string
    value: string
}

const Input = ({ className, label, value, ...props }: InputProps) => {
    return (
        <div className="mb-4">
            <label htmlFor={label} className="block text-sm/6 font-bold leading-6 text-black">
                {label}
            </label>
            <div className="mt-2">
                <input
                    {...props}
                    value={value}
                    className={`block w-full text-sm/6 border rounded-sm border-[#CCCCCC] bg-white py-2 px-4 text-black ${className}`}
                />
            </div>
        </div>
    )
}

export default Input