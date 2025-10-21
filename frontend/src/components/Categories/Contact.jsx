import React, { useState } from "react";
import axios from "axios";
import "@styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData);
      setSuccess("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact">
      <div className="contact__layout">
        <aside className="contact__sidebar">
          <header className="contact__sidebar-header">
            <span className="contact__eyebrow">Get In Touch</span>
            <h1 className="contact__headline">We'd love to hear from you.</h1>
            <p className="contact__description">
              Whether you have a campus story, feedback, or want to collaborate, drop us a note. We usually respond within two business days.
            </p>
          </header>

          <div className="contact__details">
            <div className="contact__detail-card">
              <span className="contact__detail-label">Email</span>
              <a className="contact__detail-value" href="mailto:hello@axepress.ca">
                example@axepress.ca
              </a>
            </div>
            <div className="contact__detail-card">
              <span className="contact__detail-label">Office Hours</span>
              <p className="contact__detail-value">Mon-Fri | 9:00 AM - 5:00 PM</p>
            </div>
            <div className="contact__detail-card">
              <span className="contact__detail-label">Location</span>
              <p className="contact__detail-value">Acadia University</p>
            </div>
          </div>
        </aside>

        <section className="contact__card">
          <form className="contact__form" noValidate onSubmit={handleSubmit}>
            <h2 className="contact__form-title">Send us a message</h2>

            {error && (
              <p className="contact__feedback contact__feedback--error" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="contact__feedback contact__feedback--success" role="status">
                {success}
              </p>
            )}

            <label className="contact__field contact__field--half">
              <span className="contact__field-label">Full name</span>
              <input
                type="text"
                name="name"
                placeholder="Jamie Student"
                value={formData.name}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </label>

            <label className="contact__field contact__field--half">
              <span className="contact__field-label">Email address</span>
              <input
                type="email"
                name="email"
                placeholder="you@axepress.ca"
                value={formData.email}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </label>

            <label className="contact__field contact__field--textarea contact__field--full">
              <span className="contact__field-label">How can we help?</span>
              <textarea
                name="message"
                placeholder="Share a story idea, question, or feedback..."
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
                aria-required="true"
              />
            </label>

            <button className="contact__submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;
