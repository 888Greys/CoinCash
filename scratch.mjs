import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kehvkpytopfserchospu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlaHZrcHl0b3Bmc2VyY2hvc3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjk2MTAsImV4cCI6MjA5MTYwNTYxMH0.H8MWySrX9pvfyb0vkeRXtBGIpSdhYEz17Qu9YrZY858";
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from("p2p_orders").select("*");
  console.log("Orders:", JSON.stringify(data, null, 2));
  console.log("Error:", error);
}

check();
