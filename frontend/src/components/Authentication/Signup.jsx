import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "@styles/Signup.css";

const Signup = () => {
  // State to hold form data (name, username, email, password, invitation code)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    invitationCode: "",
  });
  // State to hold error message
  const [error, setError] = useState("");
  // State to hold success message after account creation
  const [success, setSuccess] = useState("");
  // State to handle form submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // useNavigate hook to navigate programmatically
  const navigate = useNavigate();

  // Handle change in form input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      setError("");
    }
    if (success) {
      setSuccess("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true); // Set submitting state to true when form is submitted

    // Check if the invitation code matches the valid code before submitting
    const validCode = "axe"; // Secret invitation code for authorized users
    if (formData.invitationCode !== validCode) {
      setError(
        "Invalid invitation code. Only club leaders/presidents or social media managers can sign up."
      );
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    try {
      // Send signup request to the server
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, formData);
      setSuccess("Account created successfully. Redirecting to login...");
      // Redirect to login page after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // Handle error during signup and display message
      console.log("Error during signup:", err);
      setError("Error creating account. Try again.");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="auth-container">
      <section className="auth-panel">
        <header className="auth-panel__header">
          <span className="auth-panel__eyebrow">AxePress Admin</span>
          <h2 className="auth-panel__title">Create your account</h2>
          <p className="auth-panel__description">
            Join the leadership portal to publish notices, share updates, and collaborate with the team.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Display error or success message */}
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          {/* Input fields for user details */}
          <label className="auth-field">
            <span>Full name</span>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              onChange={handleChange}
              required
            />
          </label>

          <label className="auth-field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              onChange={handleChange}
              required
            />
          </label>

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              onChange={handleChange}
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              onChange={handleChange}
              required
            />
          </label>

          <label className="auth-field">
            <span>Invitation code</span>
            <input
              type="text"
              name="invitationCode"
              placeholder="Provided by club leadership"
              onChange={handleChange}
              required
            />
          </label>
          {/* Submit button with loading state */}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Signup"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </div>
  );
};

export default Signup;
