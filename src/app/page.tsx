"use client";
import { createClient } from "@sanity/client";
import { useEffect, useState } from "react";

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2021-08-31",
});

interface Product {
  _id: string;
  name: string;
  price: number;
  sizes: string[];
  imageUrl?: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = `*[_type == "product"]{
          _id,
          name,
          price,
          sizes,
          "imageUrl": image.asset->url
        }`;
        const data = await client.fetch(query);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);  // Log the error for debugging
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;  // Render error message

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Our Products</h1>
      <ul style={styles.grid}>
        {products.map((product) => (
          <li key={product._id} style={styles.card}>
            <h2 style={styles.productName}>{product.name}</h2>
            <p style={styles.price}>Price: ${product.price}</p>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={styles.image}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    listStyleType: "none",
    padding: 0,
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  productName: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  price: {
    fontSize: "1.2rem",
    marginBottom: "10px",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "8px",
  },
};

export default ProductsPage;
