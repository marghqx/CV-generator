import React, { useState } from "react";

const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Przygotowanie danych do wysłania
    const data = {
      name,
      email,
      phone,
      summary,
      experience: experience.split(","),
      skills: skills.split(","),
      projects: projects.split(","),
    };

    try {
      // Wysyłanie danych do backendu
      const response = await fetch("https://cv-generator-ojl9.onrender.com/generate_cv/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url); // Zapisz URL do wygenerowanego PDF-a
      } else {
        alert("Błąd podczas generowania CV.");
      }
    } catch (error) {
      console.error("Wystąpił błąd: ", error);
      alert("Wystąpił błąd przy łączeniu z serwerem.");
    }
  };

  return (
    <div>
      <h1>Generator CV</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Imię i nazwisko"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="Podsumowanie"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="Doświadczenie (oddziel przecinkami)"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="Umiejętności (oddziel przecinkami)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="Projekty (oddziel przecinkami)"
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Generuj CV</button>
        </div>
      </form>

      {pdfUrl && (
        <div>
          <a href={pdfUrl} download="CV.pdf">Pobierz swoje CV</a>
        </div>
      )}
    </div>
  );
};

export default App;
