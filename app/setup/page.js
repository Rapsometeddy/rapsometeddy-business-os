"use client";

import { useState } from "react";
import { getSupabase } from "../../lib/supabase";

export default function Setup() {
  const [name,setName]=useState("");
  const [status,setStatus]=useState("");
  async function createBusiness(e){
    e.preventDefault();
    const supabase=getSupabase();
    if(!supabase){setStatus("Add the Supabase environment variables first.");return;}
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){setStatus("Please sign in first.");return;}
    const {error}=await supabase.from("businesses").insert({name,owner_id:user.id});
    setStatus(error?error.message:"Business created. You can now use the dashboard.");
  }
  return <main className="setup"><div className="setupCard"><span className="eyebrow">BUSINESS OS</span><h1>Set up your business</h1><p>Start with the name you want to use inside Business OS.</p><form onSubmit={createBusiness}><input value={name} onChange={e=>setName(e.target.value)} placeholder="Business name" required/><button className="primary">Create business</button></form>{status&&<div className="notice">{status}</div>}</div></main>;
}
