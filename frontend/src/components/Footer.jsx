function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} <strong>PoW Predictor</strong> — Predictive Electoral Analytics System.
        Built with React, Node.js, and Machine Learning.
      </p>
    </footer>
  );
}

export default Footer;
