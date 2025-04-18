import { useState } from "react";
import { RevealOnScroll } from "../RevealOnScroll";
import emailjs from "emailjs-com";
import { Github, Linkedin, Facebook, Instagram } from "lucide-react";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        e.target,
        import.meta.env.VITE_PUBLIC_KEY
      )
      .then(() => {
        setStatusMessage({
          type: "success",
          text: "✅ Message sent successfully!",
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        setTimeout(() => setStatusMessage({ type: "", text: "" }), 5000);
      })
      .catch(() => {
        setStatusMessage({
          type: "error",
          text: "❌ Oops! Something went wrong. Please try again.",
        });

        setTimeout(() => setStatusMessage({ type: "", text: "" }), 5000);
      });
  };

  return (
    <section
      id="contact"
      className="min-h-screen flex items-center justify-center py-20"
    >
      <RevealOnScroll>
        <div className="px-4 w-full min-w-[300px] md:w-[500px] sm:w-2/3 p-6">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
            Get In Touch
          </h2>

          {/* ✉️ Status Message */}
          {statusMessage.text && (
            <div
              className={`mb-6 px-4 py-3 rounded text-sm text-center transition duration-300 ${
                statusMessage.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="bcc"
              value="kriteshpokharel100@gmail.com"
            />

            {/* Name Input */}
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5"
                placeholder="Name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5"
                placeholder="example@gmail.com"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Subject Input */}
            <div className="relative">
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5"
                placeholder="Subject"
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </div>

            {/* Message Box */}
            <div className="relative">
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5"
                placeholder="Your Message..."
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-6 rounded font-medium transition relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] cursor-pointer"
            >
              Send Message
            </button>
          </form>

          {/* 🌐 Social Links */}
          <div className="mt-10 flex justify-center gap-6">
            <a
              href="https://github.com/kriteshpokhrel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 transition"
            >
              <Github size={28} />
            </a>
            <a
              href="https://www.linkedin.com/in/kritesh-pokhrel-91b3b4170/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 transition"
            >
              <Linkedin size={28} />
            </a>
            <a
              href="https://facebook.com/kritesh.pokharel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 transition"
            >
              <Facebook size={28} />
            </a>
            <a
              href="https://instagram.com/kritesh_pokharel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 transition"
            >
              <Instagram size={28} />
            </a>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
