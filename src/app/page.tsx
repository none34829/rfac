"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "https://erqhwzwqldhopwvlopsa.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVycWh3endxbGRob3B3dmxvcHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3Mzc1MDUsImV4cCI6MjA0NDMxMzUwNX0.y8tjp29XaZegl33v_D_b3ffP8fzYweVmGncf6-x8uUI";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [studentsImpacted, setStudentsImpacted] = useState<number | null>(null);
  const [nameOfPerson, setNameOfPerson] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchFundraiserData = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const { data, error } = await supabase
          .from("rfac")
          .select("person, amt")
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          const totalAmount = data.amt || 0;
          const impacted = Math.floor(totalAmount / 75);
          const person = data.person || "Unknown";

          setStudentsImpacted(impacted);
          setNameOfPerson(person);
        } else {
          setErrorMessage("No data found.");
        }
      } catch (err) {
        setErrorMessage("Failed to load fundraiser data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFundraiserData();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Fundraiser Impact</h1>
      {loading ? (
        <p className="loading-text">Loading fundraiser details...</p>
      ) : errorMessage ? (
        <p className="error-text">Error: {errorMessage}</p>
      ) : nameOfPerson && studentsImpacted !== null ? (
        <div className="result-card fade-in">
          <p>
            <span className="highlight">{nameOfPerson}</span> impacted{" "}
            <span className="highlight">{studentsImpacted}</span> students
            through this fundraiser!
          </p>
        </div>
      ) : (
        <p className="no-data-text">No data available.</p>
      )}
    </div>
  );
}
