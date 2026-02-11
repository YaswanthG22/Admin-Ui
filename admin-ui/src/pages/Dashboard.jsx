import { useEffect, useState } from "react";
import { getStatuses } from "../services/api";
import ServiceCard from "../components/ServiceCard";

export default function Dashboard() {

  const [services, setServices] = useState([]);

  const fetchStatus = () => {
    getStatuses()
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "20px"
      }}>
        {services.map((s, i) => (
          <ServiceCard key={i} service={s} />
        ))}
      </div>
    </div>
  );
}
