"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "../../lib/supabase";

export default function Products() {
  const [supabase, setSupabase] = useState(null);
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const client = getSupabase();
    setSupabase(client);

    if (!client) return;

    async function init() {
      const { data: { user } } = await client.auth.getUser();

      if (!user) {
        location.href = "/setup";
        return;
      }

      const { data: currentBusiness } = await client
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!currentBusiness) {
        location.href = "/onboarding";
        return;
      }

      setBusiness(currentBusiness);
      await loadProducts(client, currentBusiness.id);
    }

    init();
  }, []);

  async function loadProducts(client, businessId) {
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("business_id", businessId)
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setProducts(data || []);
  }

  async function addProduct(event) {
    event.preventDefault();

    if (!supabase || !business) return;

    setBusy(true);
    setMessage("");

    const { error } = await supabase.from("products").insert({
      business_id: business.id,
      name: name.trim(),
      description: description.trim() || null,
      price: Number(price),
    });

    if (error) {
      setMessage(error.message);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setMessage("Product added.");
      await loadProducts(supabase, business.id);
    }

    setBusy(false);
  }

  async function removeProduct(id) {
    if (!supabase || !business) return;

    const confirmed = window.confirm("Remove this product?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .update({ active: false })
      .eq("id", id)
      .eq("business_id", business.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Product removed.");
    await loadProducts(supabase, business.id);
  }

  return (
    <main className="simple">
      <header>
        <button className="link" onClick={() => (location.href = "/")}>
          ← Dashboard
        </button>
        <h1>Products</h1>
        <p>Manage the products and services you sell.</p>
      </header>

      <section className="simpleGrid">
        <form className="panel form" onSubmit={addProduct}>
          <h2>Add product</h2>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Product or service name"
            maxLength={120}
            required
          />

          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description (optional)"
            maxLength={250}
          />

          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="Price (R)"
            required
          />

          <button className="primary" disabled={busy}>
            {busy ? "Saving..." : "Add product"}
          </button>

          {message && <div className="notice">{message}</div>}
        </form>

        <div className="panel">
          <h2>{products.length} active products</h2>

          {products.length === 0 ? (
            <div className="empty">
              <strong>No products yet</strong>
              <p>Add your first product or service.</p>
            </div>
          ) : (
            products.map((product) => (
              <div className="row" key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.description || "Product or service"}</span>
                </div>

                <strong>R {Number(product.price).toFixed(2)}</strong>

                <button
                  className="link"
                  type="button"
                  onClick={() => removeProduct(product.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
