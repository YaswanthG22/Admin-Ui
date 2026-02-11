import axios from "axios";

export const getStatuses = () =>
  axios.get("status");
