import { gql, useQuery } from '@apollo/client'
import ProductCard from '../components/ProductCard'

const PRODUCT_QUERY = gql`
    query Products {
        products {
            currency
            description
            id
            price
            title
        }
    }
`

interface Product {
    currency: string
    description: string
    id: string
    price: number
    title: string
}

const Products = () => {
    const { loading, error, data } = useQuery(PRODUCT_QUERY)
    console.log("DATA: ", data)
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    const products: Product[] = data?.products

    if (!products) {
        return ''
    }

    return (
        <div>
            <h1 className='text-black'>Products</h1>
            <div className='flex flex-row'>
                {
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            currency={product.currency}
                            description={product.description}
                            id={product.id}
                            imageUrl=''
                            price={product.price}
                            title={product.title}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Products