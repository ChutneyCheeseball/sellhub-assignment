"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  inventory_count: number;
}

interface ProductListingProps extends Product {
  onOrder: (id: string, count: number) => void;
}

const ProductListing = ({
  id,
  name,
  inventory_count,
  onOrder,
}: ProductListingProps) => {
  const [orderQuantity, setOrderQuantity] = useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setOrderQuantity(value);
  };

  const placeOrder = async () => {
    try {
      const result = await axios.post("http://localhost:3002/orders", {
        id,
        count: orderQuantity,
      });
      onOrder(id, result.data.remaining);
      alert(result.data.message);
    } catch (e: any) {
      if (e.response?.data?.message) {
        alert(e.response.data.message);
      } else {
        console.error(e);
      }
    }
  };

  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.5)",
        padding: 16,
        borderRadius: 16,
      }}
    >
      <p>
        Product: <b>{name}</b>
      </p>
      <p>
        In stock: <b>{inventory_count}</b>
      </p>
      <br />
      <input
        type="number"
        value={orderQuantity}
        onChange={handleInputChange}
        style={{ fontSize: 16, padding: 6 }}
      />{" "}
      <button
        style={{ fontSize: 16, padding: 6 }}
        onClick={placeOrder}
        disabled={orderQuantity < 1 || orderQuantity > inventory_count}
      >
        BUY NOW
      </button>
    </div>
  );
};

export default function Home() {
  const fetchProducts = async () => {
    try {
      const result = await axios.get("http://localhost:3002/products");
      if (result.status === 200) {
        setProducts(
          result.data.sort((a: Product, b: Product) => a.name > b.name)
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    console.log("Fetch products");
    fetchProducts();
  }, []);

  const [products, setProducts] = useState<Product[]>([]);

  return (
    <div className={styles.page}>
      <h1>Store</h1>
      <main
        style={{
          backgroundColor: "#EEEEEE",
          color: "rgba(0, 0, 0, 0.8)",
          width: 1024,
          padding: 40,
          borderRadius: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2>Browse our fine products</h2>
          <button style={{ fontSize: 16, padding: 6 }} onClick={fetchProducts}>
            REFRESH
          </button>
        </div>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {products.map((product) => (
            <ProductListing
              key={product.id + new Date()}
              id={product.id}
              name={product.name}
              inventory_count={product.inventory_count}
              onOrder={(id, remaining) => {
                const newProducts = [...products];
                const idx = newProducts.findIndex(
                  (product) => product.id === id
                );
                if (idx >= 0) {
                  newProducts[idx]!.inventory_count = remaining;
                }
                setProducts(newProducts);
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
