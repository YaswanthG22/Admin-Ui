import { useEffect, useState, useMemo } from "react";
import axios from "axios";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-GB");
}

export default function App() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortAsc, setSortAsc] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/status");
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching status", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredServices = useMemo(() => {
    let data = [...services];

    if (search) {
      data = data.filter(s =>
        s.serviceName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      data = data.filter(s => s.status === statusFilter);
    }

    data.sort((a, b) =>
      sortAsc
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status)
    );

    return data;
  }, [services, search, statusFilter, sortAsc]);

  const exportCSV = () => {
    const headers = ["Service", "URL", "Server", "Database", "Reason", "Last Checked"];
    const rows = filteredServices.map(s => [
      s.serviceName,
      s.url,
      s.status,
      s.dbStatus ?? "N/A",
      s.reason ?? "",
      formatDate(s.checkedAt)
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(e => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "server-status.csv";
    link.click();
  };

  const getBadgeClass = (status) => {
    if (status === "UP") return "badge bg-success";
    if (status === "DOWN") return "badge bg-danger";
    return "badge bg-warning text-dark";
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <div className="bg-primary bg-gradient text-white py-4 shadow">
        <div className="container">
          <h1 className="fw-bold">🚀 Admin Dashboard</h1>
        </div>
      </div>

      <div className="container mt-4">

        {/* Controls */}
        <div className="card shadow-sm mb-4 p-3">
          <div className="row g-3 align-items-center">

            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Show All</option>
                <option value="UP">Only UP</option>
                <option value="DOWN">Only DOWN</option>
                <option value="NOT_RUNNING">Only NOT_RUNNING</option>
              </select>
            </div>

            <div className="col-md-auto">
              <button
                className="btn btn-warning"
                onClick={() => setSortAsc(!sortAsc)}
              >
                Sort by Status
              </button>
            </div>

            <div className="col-md-auto">
              <button
                className="btn btn-info text-white"
                onClick={exportCSV}
              >
                Export CSV
              </button>
            </div>

          </div>
        </div>

        {/* Table */}
        <div className="card shadow">
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Service</th>
                  <th>URL</th>
                  <th>Server</th>
                  <th>Database</th>
                  <th>Reason</th>
                  <th>Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, index) => (
                  <tr key={index}>
                    <td className="fw-semibold">{service.serviceName}</td>
                    <td className="text-muted">{service.url}</td>

                    <td>
                      <span className={getBadgeClass(service.status)}>
                        {service.status}
                      </span>
                    </td>

                    <td>
                      <span className={
                        service.dbStatus === "UP"
                          ? "badge bg-success"
                          : service.dbStatus === "DOWN"
                          ? "badge bg-danger"
                          : "badge bg-secondary"
                      }>
                        {service.dbStatus ?? "N/A"}
                      </span>
                    </td>

                    <td>
                      {service.status === "UP"
                        ? "Healthy"
                        : <span className="text-danger">{service.reason}</span>}
                    </td>

                    <td className="text-muted">
                      {formatDate(service.checkedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
