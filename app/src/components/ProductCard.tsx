interface ProductCardProps {
    currency: string
    description: string
    price: number
    title: string
    imageUrl: string
}

const ProductCard = ({
    currency,
    description,
    price,
    title,
    imageUrl,
}: ProductCardProps) => {
    return (
        <div className="relative flex flex-col overflow-hidden rounded-lg border">
            <div className="overflow-hidden">
                <img src={imageUrl} alt={title} className="h-32 w-32 object-cover" />
            </div>
            <div className="my-4 mx-auto flex w-10/12 flex-col items-start justify-between">
                <p className="text-black mr-3 text-sm font-semibold">{title}</p>
                <p className="text-black mr-3 text-sm">{description}</p>
                <p className="text-black mr-3 text-xl font-bold">
                    {currency}{" "}
                    {price}
                </p>
            </div>
        </div>
    )
}

export default ProductCard
