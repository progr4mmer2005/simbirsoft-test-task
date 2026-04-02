import { Link } from "react-router-dom";
import "./Breadcrumbs.css";

export default function Breadcrumbs({ rootLabel, rootPath, currentLabel }) {
  return (
    <div className="breadcrumbs">
      <Link to={rootPath}>{rootLabel}</Link>
      <span className="breadcrumbs-separator">&gt;</span>
      <span className="breadcrumbs-current">{currentLabel}</span>
    </div>
  );
}
