import "./Card.css";
import { Link } from "react-router-dom";

export default function Card({ image, title, subtitle, type, to }) {
  let shortTitle = title || "";
  if (shortTitle.length > 20) {
    shortTitle = shortTitle.slice(0, 20) + "...";
  }

  const cardContent = (
    <div className={"card " + type + "-card"}>
      <div className="card-image">
        {image ? <img src={image} alt={title} /> : null}
      </div>
      <div className={"card-title " + type + "-title"}>{shortTitle}</div>
      {subtitle && <div className="card-subtitle">{subtitle}</div>}
    </div>
  );

  if (to) {
    return (
      <Link className="card-link" to={to}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
