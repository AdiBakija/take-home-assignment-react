import { gql, useQuery } from '@apollo/client'

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
            <h1>Products</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.title} - ${product.price} {product.currency}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Products