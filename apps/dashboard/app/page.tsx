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
  onUpdate: (id: string, count: number) => void;
}

const ProductListing = ({
  id,
  name,
  inventory_count,
  onUpdate,
}: ProductListingProps) => {
  const [stock, setStock] = useState(inventory_count);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setStock(value);
  };

  const updateStock = async () => {
    try {
      await axios.post(`http://localhost:3002/products/${id}`, {
        inventory_count: stock,
      });
      onUpdate(id, stock);
    } catch (e) {
      console.error(e);
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
        Database stock: <b>{inventory_count}</b>
      </p>
      <small style={{ color: "rgba(0, 0, 0, 0.5)" }}>ID: {id}</small>
      <br />
      <br />
      <input
        type="number"
        value={stock}
        onChange={handleInputChange}
        style={{ fontSize: 16, padding: 6 }}
      />{" "}
      <button
        style={{ fontSize: 16, padding: 6 }}
        onClick={updateStock}
        disabled={Math.ceil(stock) !== stock || stock < 0}
      >
        UPDATE
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
      <h1>Dashboard</h1>
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
          <h2>Product list</h2>
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
              onUpdate={(id, count) => {
                const newProducts = [...products];
                const idx = newProducts.findIndex(
                  (product) => product.id === id
                );
                if (idx >= 0) {
                  newProducts[idx]!.inventory_count = count;
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
