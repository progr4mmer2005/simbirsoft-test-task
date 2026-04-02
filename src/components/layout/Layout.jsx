import { fetchLeaguesData, fetchTeamsData } from "../../api/footballAPI";
import EntityPage from "../entity_page/EntityPage";
import Header from "../header/Header";
import CalendarPage from "../calendar_page/CalendarPage";
import { Routes, Route, Navigate } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/leagues" replace />} />

        <Route path="/leagues" element={<EntityPage fetchData={fetchLeaguesData} type="league" />} />
        <Route path="/teams" element={<EntityPage fetchData={fetchTeamsData} type="team" />} />

        <Route path="/leagues/:id" element={<CalendarPage type="league" />} />
        <Route path="/teams/:id" element={<CalendarPage type="team" />} />
      </Routes>
    </>
  );
}
