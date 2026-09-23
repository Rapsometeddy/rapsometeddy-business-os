"use client";
import {useEffect,useState} from "react";
import {getSupabase} from "../../lib/supabase";

export default function Onboarding(){
 const [name,setName]=useState(""),[msg,setMsg]=useState(""),[busy,setBusy]=useState(false);
 useEffect(()=>{check()},[]);
 async function check(){
  const s=getSupabase(); if(!s)return;
  const {data:{user}}=await s.auth.getUser();
  if(!user){location.href="/setup";return}
  const {data:b}=await s.from("businesses").select("id").eq("owner_id",user.id).limit(1).maybeSingle();
  if(b)location.href="/";
 }
 async function createBusiness(e){
  e.preventDefault(); if(!name.trim())return; setBusy(true);setMsg("");
  const s=getSupabase(); if(!s){setMsg("Supabase configuration is missing.");setBusy(false);return}
  const {data:{user}}=await s.auth.getUser();
  if(!user){location.href="/setup";return}
  const {error}=await s.from("businesses").insert({owner_id:user.id,name:name.trim()});
  if(error){setMsg(error.message);setBusy(false);return}
  location.href="/";
 }
 return <main className="setup"><div className="setupCard"><span className="eyebrow">FIRST STEP</span><h1>Set up your business</h1><p>Give your workspace a name. You can add your products, sales and expenses next.</p><form onSubmit={createBusiness}><input type="text" placeholder="Business name" value={name} onChange={e=>setName(e.target.value)} maxLength={100} required/><button className="primary" disabled={busy}>{busy?"Creating…":"Create business"}</button></form>{msg&&<div className="notice">{msg}</div>}<button className="link" onClick={async()=>{const s=getSupabase();if(s)await s.auth.signOut();location.href="/setup"}}>Sign out</button></div></main>
}