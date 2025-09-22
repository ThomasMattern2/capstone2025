const API_URL = "http://localhost:5000"; // replace with your Flask server URL

export async function armVehicle() {
  try {
    const res = await fetch(`${API_URL}/arm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log(data.message);
    return data;
  } catch (err) {
    console.error("Error arming vehicle:", err);
    throw err;
  }
}

export async function disarmVehicle() {
  try {
    const res = await fetch(`${API_URL}/disarm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log(data.message);
    return data;
  } catch (err) {
    console.error("Error disarming vehicle:", err);
    throw err;
  }
}
