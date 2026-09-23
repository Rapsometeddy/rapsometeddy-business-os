"use client";
import {useState} from "react";
import {getSupabase} from "../../lib/supabase";

export default function Auth(){
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[mode,setMode]=useState("signin"),[msg,setMsg]=useState(""),[busy,setBusy]=useState(false);
 async function submit(e){
  e.preventDefault(); setBusy(true); setMsg("");
  const s=getSupabase();
  if(!s){setMsg("Supabase configuration is missing.");setBusy(false);return}
  const r=mode==="signin"?await s.auth.signInWithPassword({email,password}):await s.auth.signUp({email,password});
  if(r.error){setMsg(r.error.message);setBusy(false);return}
  if(mode==="signup"&&!r.data.session){setMsg("Account created. Check your email, then sign in to continue.");setMode("signin");setBusy(false);return}
  if(mode==="signup"||mode==="signin"){
   const user=r.data.user;
   if(user){
    const {data:b}=await s.from("businesses").select("id").eq("owner_id",user.id).limit(1).maybeSingle();
    location.href=b?"/":"/onboarding";
   }
  }
  setBusy(false);
 }
 return <main className="setup"><div className="setupCard"><span className="eyebrow">RAPSOMETTEDY</span><h1>{mode==="signin"?"Welcome back":"Create account"}</h1><p>Securely access your Business OS workspace.</p><form onSubmit={submit}><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required/><button className="primary" disabled={busy}>{busy?"Please wait…":mode==="signin"?"Sign in":"Create account"}</button></form>{msg&&<div className="notice">{msg}</div>}<button className="link" onClick={()=>{setMode(mode==="signin"?"signup":"signin");setMsg("")}}>{mode==="signin"?"Need an account? Sign up":"Already have an account? Sign in"}</button></div></main>
}