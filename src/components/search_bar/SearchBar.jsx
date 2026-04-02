import "./SearchBar.css";

export default function SearchBar({ value, onChange }) {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div className="search-bar">
        <span className="material-symbols-outlined">search</span>
        <input type="text" placeholder="Поиск" value={value} onChange={onChange} />
      </div>
    </form>
  );
}
