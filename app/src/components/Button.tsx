import { Link } from 'react-router-dom'

interface ButtonProps {
    className?: string
    disabled?: boolean
    label: string
    onClick?: () => void
    to: string
}

const Button = ({ className, disabled, label, onClick, to }: ButtonProps) => {
    return (
        <Link
            onClick={onClick}
            to={to}
        >
            <button
                className={`bg-judo-purple text-white text-sm/6 py-2 ht-10 rounded-sm w-full ${className}`}
                disabled={disabled}
            >
                {label}
            </button>
        </Link>
    )
}

export default Button