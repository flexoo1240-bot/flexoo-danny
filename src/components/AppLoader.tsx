import flexooLogo from "@/assets/flexoo-logo.png";

const AppLoader = ({ label = "Loading your Flexoo experience…" }: { label?: string }) => (
  <div className="app-loader" role="status" aria-live="polite" aria-label={label}>
    <div className="app-loader__aurora app-loader__aurora--one" />
    <div className="app-loader__aurora app-loader__aurora--two" />
    <div className="app-loader__card">
      <div className="app-loader__logo-wrap">
        <div className="app-loader__ring" />
        <img src={flexooLogo} alt="Flexoo" className="app-loader__logo" />
      </div>
      <div className="app-loader__bar" aria-hidden="true"><span /></div>
      <p className="app-loader__label">{label}</p>
    </div>
  </div>
);

export default AppLoader;
