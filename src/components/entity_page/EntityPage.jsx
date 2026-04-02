import { useState, useEffect } from "react";
import ContentWrapper from "../content_wrapper/ContentWrapper";
import SearchBar from "../search_bar/SearchBar";
import CardsGrid from "../cards_grid/CardsGrid";
import Card from "../card/Card";
import PageSelector from "../page_selector/PageSelector";
import "./EntityPage.css";

export default function EntityPage({ fetchData, type }) {
  const cardsPerPage = 8;
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setPage(1);
    setSearch("");
    setLoading(true);
    setError("");

    fetchData().then((data) => {
      if (!isMounted) return;
      if (data && data.error) {
        setError(data.error);
        setItems([]);
        return;
      }
      let list = [];
      if (data && data.items) {
        list = data.items;
      } else if (Array.isArray(data)) {
        list = data;
      }
      setItems(list);
    })
      .catch(() => {
        if (!isMounted) return;
        setError("Данные не получены. Проверьте токен API.");
        setItems([]);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  const filteredItems = items.filter((item) => {
    if (!item || !item.name) return false;
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filteredItems.length / cardsPerPage);
  const safePage = page > totalPages ? 1 : page;

  const start = (safePage - 1) * cardsPerPage;
  const currentPageCards = filteredItems.slice(start, start + cardsPerPage);

  const isLeague = type === "league";

  return (
    <ContentWrapper>
      <div className="page-container">
        <SearchBar
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {error && <div className="status-message">{error}</div>}
        {!error && loading && <div className="status-message">Загрузка...</div>}
        {!error && !loading && filteredItems.length === 0 && (
          <div className="status-message">Ничего не найдено</div>
        )}

        <CardsGrid>
          {currentPageCards.map((item) => (
            <Card
              key={item.id}
              type={type}
              image={isLeague ? item.emblem : item.crest}
              title={item.name}
              subtitle={isLeague && item.area ? item.area.name : null}
              to={isLeague ? "/leagues/" + item.id : "/teams/" + item.id}
            />
          ))}
        </CardsGrid>

        <div className="pagination-container">
          {totalPages > 1 && (
            <PageSelector currentPage={safePage} setPage={setPage} totalPages={totalPages} visiblePagesCount={7} />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
}
