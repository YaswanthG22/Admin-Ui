function formatDate(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}


export default function ServiceCard({ service }) {

  let statusColor = "gray";
  let statusIcon = "⚪";

  if (service.status === "UP") {
    statusColor = "green";
    statusIcon = "🟢";
  } else if (service.status === "DOWN") {
    statusColor = "red";
    statusIcon = "🔴";
  } else if (service.status === "NOT_RUNNING") {
    statusColor = "orange";
    statusIcon = "🟠";
  }

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "16px",
      width: "300px"
    }}>
      <h3>{statusIcon} {service.serviceName}</h3>

      <p><b>URL:</b> {service.url}</p>

      <p>
        <b>Server:</b>{" "}
        <span style={{ color: statusColor, fontWeight: "bold" }}>
          {service.status}
        </span>
      </p>

      <p>
        <b>Database:</b>{" "}
        <span style={{
            color:
            service.dbStatus === "UP"
                ? "green"
                : service.dbStatus === "DOWN"
                ? "red"
                : "gray",
            fontWeight: "bold"
        }}>
            {service.dbStatus ?? "N/A"}
        </span>
      </p>


      <p style={{ color: service.status === "UP" ? "green" : "red" }}>
        <b>Reason:</b>{" "}
        {service.status === "UP" ? "Healthy" : service.reason}
      </p>


      <p style={{ fontSize: "12px", color: "#555" }}>
        Last Checked: {formatDate(service.checkedAt)}
      </p>

    </div>
  );
}
