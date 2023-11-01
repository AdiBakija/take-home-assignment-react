import { Link } from 'react-router-dom'

interface ButtonProps {
    className?: string
    label: string
    onClick?: () => void
    to: string
}

const Button = ({ className, label, onClick, to }: ButtonProps) => {
    return (
        <Link
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${className}`}
            onClick={onClick}
            to={to}
        >
            {label}
        </Link>
    )
}

export default Button