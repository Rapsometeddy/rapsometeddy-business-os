"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "../../lib/supabase";

export default function Sales() {
  const [supabase, setSupabase] = useState(null);
  const [business, setBusiness] = useState(null);
  const [rows, setRows] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productId, setProductId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const client = getSupabase();
    setSupabase(client);
    if (!client) return;

    async function init() {
      const {
        data: { user },
      } = await client.auth.getUser();

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
      await loadData(client, currentBusiness.id);
    }

    init();
  }, []);

  async function loadData(client, businessId) {
    const [salesResult, productsResult, customersResult] = await Promise.all([
      client
        .from("sales")
        .select("*, customers(name)")
        .eq("business_id", businessId)
        .order("sold_at", { ascending: false }),
      client
        .from("products")
        .select("*")
        .eq("business_id", businessId)
        .eq("active", true)
        .order("name"),
      client
        .from("customers")
        .select("*")
        .eq("business_id", businessId)
        .order("name"),
    ]);

    setRows(salesResult.data || []);
    setProducts(productsResult.data || []);
    setCustomers(customersResult.data || []);
  }

  function chooseProduct(id) {
    setProductId(id);
    const product = products.find((item) => item.id === id);

    if (product) {
      const qty = Math.max(1, Number(quantity) || 1);
      setAmount((Number(product.price) * qty).toFixed(2));

      if (!description) {
        setDescription(product.name);
      }
    }
  }

  function changeQuantity(value) {
    const qty = Math.max(1, Number(value) || 1);
    setQuantity(String(qty));

    const product = products.find((item) => item.id === productId);
    if (product) {
      setAmount((Number(product.price) * qty).toFixed(2));
    }
  }

  async function addSale(event) {
    event.preventDefault();

    if (!supabase || !business) return;

    setBusy(true);
    setMessage("");

    const finalAmount = Number(amount);

    if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
      setMessage("Enter a valid amount.");
      setBusy(false);
      return;
    }

    const product = products.find((item) => item.id === productId);
    const finalDescription =
      description.trim() || (product ? product.name : "Sale");

    const { error } = await supabase.from("sales").insert({
      business_id: business.id,
      customer_id: customerId || null,
      description: finalDescription,
      amount: finalAmount,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setDescription("");
      setAmount("");
      setProductId("");
      setCustomerId("");
      setQuantity("1");
      setMessage("Sale recorded.");
      await loadData(supabase, business.id);
    }

    setBusy(false);
  }

  return (
    <main className="simple">
      <header>
        <button
          className="link"
          type="button"
          onClick={() => {
            location.href = "/";
          }}
        >
          ← Dashboard
        </button>

        <h1>Sales</h1>
        <p>Record sales using your products and customers.</p>
      </header>

      <section className="simpleGrid">
        <form className="panel form" onSubmit={addSale}>
          <h2>Record sale</h2>

          <select
            value={productId}
            onChange={(event) => chooseProduct(event.target.value)}
          >
            <option value="">Choose product or enter custom sale</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} — R {Number(product.price).toFixed(2)}
              </option>
            ))}
          </select>

          <select
            value={customerId}
            onChange={(event) => setCustomerId(event.target.value)}
          >
            <option value="">No customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          {productId && (
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) => changeQuantity(event.target.value)}
              placeholder="Quantity"
            />
          )}

          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
          />

          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Amount (R)"
            required
          />

          <button className="primary" type="submit" disabled={busy}>
            {busy ? "Saving..." : "Save sale"}
          </button>

          {message && <div className="notice">{message}</div>}
        </form>

        <div className="panel">
          <h2>Recent sales</h2>

          {rows.length === 0 ? (
            <div className="empty">
              <strong>No sales yet</strong>
              <p>Your recorded sales will appear here.</p>
            </div>
          ) : (
            rows.map((sale) => (
              <div className="row" key={sale.id}>
                <div>
                  <strong>{sale.description || "Sale"}</strong>
                  <span>
                    {sale.customers?.name || "No customer"} ·{" "}
                    {new Date(sale.sold_at).toLocaleDateString("en-ZA")}
                  </span>
                </div>

                <strong>R {Number(sale.amount).toFixed(2)}</strong>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
