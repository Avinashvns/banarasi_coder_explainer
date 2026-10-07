import "./Header.css";

function Header() {
  return (
    <header className="header">

      {/* BRAND */}
      <div className="header-brand">

        <div className="brand-logo">
          BC
        </div>

        <div className="brand-info">
          <div className="brand-name">
            BANARASI CODER
          </div>

          <div className="brand-subtitle">
            Matplotlib Visual Explainer
          </div>
        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="header-product">
        <span className="product-name">
          MATPLOTLIB
        </span>

        <span className="product-dot">
          •
        </span>

        <span className="product-label">
          VISUAL EXPLAINER
        </span>
      </div>

    </header>
  );
}

export default Header;