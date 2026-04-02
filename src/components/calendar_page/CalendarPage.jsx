import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContentWrapper from "../content_wrapper/ContentWrapper";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import PageSelector from "../page_selector/PageSelector";
import { fetchLeagueMatches, fetchTeamInfo, fetchTeamMatches } from "../../api/footballAPI";
import "./CalendarPage.css";

const matchesPerPage = 10;

const statusMap = {
  SCHEDULED: "Запланирован",
  LIVE: "В прямом эфире",
  IN_PLAY: "В игре",
  PAUSED: "Пауза",
  FINISHED: "Завершен",
  POSTPONED: "Отложен",
  SUSPENDED: "Приостановлен",
  CANCELED: "Отменен",
};

const formatDateTime = (utcDate) => {
  if (!utcDate) {
    return { date: "-", time: "-" };
  }
  const dateObj = new Date(utcDate);
  if (isNaN(dateObj.getTime())) {
    return { date: "-", time: "-" };
  }
  return {
    date: dateObj.toLocaleDateString("ru-RU"),
    time: dateObj.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
  };
};

const buildScore = (score) => {
  const formatPair = (pair) => {
    if (!pair) return "-:-";
    let home = pair.home;
    let away = pair.away;
    if (home === null || home === undefined) home = "-";
    if (away === null || away === undefined) away = "-";
    return home + ":" + away;
  };

  if (!score) {
    return "-:- (-:-) (-:-)";
  }

  const fullTime = formatPair(score.fullTime);
  const extraTime = formatPair(score.extraTime);
  const penalties = formatPair(score.penalties);

  return fullTime + " (" + extraTime + ") (" + penalties + ")";
};

export default function CalendarPage({ type }) {
  const { id } = useParams();
  const [matches, setMatches] = useState([]);
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const rootLabel = type === "league" ? "Лиги" : "Команды";
  const rootPath = type === "league" ? "/leagues" : "/teams";

  useEffect(() => {
    setPage(1);
  }, [id, dateFrom, dateTo]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    const loadMatches = async () => {
      const payload = { id, dateFrom, dateTo };
      let response = null;
      if (type === "league") {
        response = await fetchLeagueMatches(payload);
      } else {
        response = await fetchTeamMatches(payload);
      }
      if (!isMounted) return;
      if (response && response.error) {
        setError(response.error);
        setMatches([]);
        return;
      }
      setMatches((response && response.matches) || []);
      if (type === "league") {
        setName((response && response.name) || "");
      }
    };

    loadMatches()
      .catch(() => {
        if (!isMounted) return;
        setError("Данные не получены. Проверьте токен API.");
        setMatches([]);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id, type, dateFrom, dateTo]);

  useEffect(() => {
    if (type !== "team") return;
    let isMounted = true;
    fetchTeamInfo(id)
      .then((data) => {
        if (isMounted) {
          if (data && data.name) {
            setName(data.name);
          } else {
            setName("");
          }
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [id, type]);

  const totalPages = Math.ceil(matches.length / matchesPerPage);
  const safePage = page > totalPages ? 1 : page;
  const start = (safePage - 1) * matchesPerPage;
  const currentMatches = matches.slice(start, start + matchesPerPage);

  const rows = currentMatches.map((match) => {
    const { date, time } = formatDateTime(match.utcDate);
    let homeName = "-";
    let awayName = "-";
    if (match.homeTeam && match.homeTeam.name) {
      homeName = match.homeTeam.name;
    }
    if (match.awayTeam && match.awayTeam.name) {
      awayName = match.awayTeam.name;
    }
    return {
      id: match.id,
      date,
      time,
      status: statusMap[match.status] || match.status || "-",
      teams: homeName + " - " + awayName,
      score: buildScore(match.score),
    };
  });

  return (
    <div className="calendar-page">
      <div className="wide-wrapper">
        <Breadcrumbs rootLabel={rootLabel} rootPath={rootPath} currentLabel={name || "Календарь"} />
      </div>

      <ContentWrapper>
        <div className="calendar-main">
          <div className="date-filters">
            <span>Матчи с</span>
            <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
            <span>по</span>
            <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
          </div>

          {error && <div className="status-message">{error}</div>}
          {!error && loading && <div className="status-message">Загрузка...</div>}
          {!error && !loading && matches.length === 0 && (
            <div className="status-message">Матчи не найдены</div>
          )}

          <div className="table-wrapper">
            <table className="matches-table">
              <thead>
                <tr>
                  <th className="col-date">Дата</th>
                  <th className="col-time">Время</th>
                  <th className="col-status">Статус</th>
                  <th className="col-teams">Команда А - Команда В</th>
                  <th className="col-score">X:Y (Z:G) (N:M)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="col-date">{row.date}</td>
                    <td className="col-time">{row.time}</td>
                    <td className="col-status">{row.status}</td>
                    <td className="col-teams">{row.teams}</td>
                    <td className="col-score">{row.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-container">
            {totalPages > 1 && (
              <PageSelector
                currentPage={safePage}
                setPage={setPage}
                totalPages={totalPages}
                visiblePagesCount={7}
              />
            )}
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
