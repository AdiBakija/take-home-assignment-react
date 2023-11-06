interface ProductCardProps {
    currency: string
    description: string
    id: string
    price: number
    title: string
    imageUrl: string
}

const ProductCard = ({
    currency,
    description,
    id,
    price,
    title,
    imageUrl,
}: ProductCardProps) => {
    return (
        <div key={`product-${id}`} className="max-w-xs rounded-md border-2 overflow-hidden shadow-lg">
            <img src={imageUrl} alt={`${title}-${id}`} className="w-full text-black" />
            <div className="px-6 py-4">
                <div className="text-black font-bold text-xl mb-2">{title}</div>
                <p className="text-black text-base">{description}</p>
                <p className="text-black text-2xl">
                    {currency}
                    {price}
                </p>
            </div>
        </div>
    )
}

export default ProductCard
