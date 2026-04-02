const API_KEY = import.meta.env.VITE_API_KEY;

export async function fetchLeaguesData() {
  try {
    const response = await fetch("/api/competitions", {
      method: "GET",
      headers: {
        "X-Auth-Token": API_KEY,
      },
    });

    if (!response.ok) {
      return { items: [], error: "Данные не получены. Проверьте токен API." };
    }

    const data = await response.json();
    const items = data.competitions || [];
    const count = data.count || items.length || 0;
    return { items, count };
  } catch (error) {
    console.error("Ошибка получения лиг:", error);
    return { items: [], error: "Данные не получены. Проверьте токен API." };
  }
}

export async function fetchTeamsData() {
  try {
    const response = await fetch("/api/teams", {
      method: "GET",
      headers: {
        "X-Auth-Token": API_KEY,
      },
    });

    if (!response.ok) {
      return { items: [], error: "Данные не получены. Проверьте токен API." };
    }

    const data = await response.json();
    const items = data.teams || [];
    const count = data.count || items.length || 0;
    return { items, count };
  } catch (error) {
    console.error("Ошибка получения команд:", error);
    return { items: [], error: "Данные не получены. Проверьте токен API." };
  }
}

export async function fetchLeagueMatches({ id, dateFrom, dateTo }) {
  try {
    let query = "";
    if (dateFrom && dateTo) {
      query = `?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    }

    const response = await fetch(`/api/competitions/${id}/matches${query}`, {
      method: "GET",
      headers: {
        "X-Auth-Token": API_KEY,
      },
    });

    if (!response.ok) {
      return { matches: [], error: "Данные не получены. Проверьте токен API." };
    }

    const data = await response.json();
    const matches = data.matches || [];
    const count = data.count || (data.resultSet ? data.resultSet.count : matches.length) || 0;
    const name = (data.competition && data.competition.name) || "";
    return { matches, count, name };
  } catch (error) {
    console.error("Ошибка получения матчей лиги:", error);
    return { matches: [], error: "Данные не получены. Проверьте токен API." };
  }
}

export async function fetchTeamMatches({ id, dateFrom, dateTo }) {
  try {
    let query = "";
    if (dateFrom && dateTo) {
      query = `?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    }

    const response = await fetch(`/api/teams/${id}/matches${query}`, {
      method: "GET",
      headers: {
        "X-Auth-Token": API_KEY,
      },
    });

    if (!response.ok) {
      return { matches: [], error: "Данные не получены. Проверьте токен API." };
    }

    const data = await response.json();
    const matches = data.matches || [];
    const count = data.count || (data.resultSet ? data.resultSet.count : matches.length) || 0;
    return { matches, count };
  } catch (error) {
    console.error("Ошибка получения матчей команды:", error);
    return { matches: [], error: "Данные не получены. Проверьте токен API." };
  }
}

export async function fetchTeamInfo(id) {
  try {
    const response = await fetch(`/api/teams/${id}`, {
      method: "GET",
      headers: {
        "X-Auth-Token": API_KEY,
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка получения данных команды:", error);
    return null;
  }
}
