const { useState, useRef } = React;

const initialCards = [
  { id: 1, title: "Battery Voltage", icon: "fas fa-bolt" },
  { id: 2, title: "Battery Current", icon: "fas fa-battery-half" },
  { id: 3, title: "Battery Level", icon: "fas fa-battery-full" },
  { id: 4, title: "Latitude", icon: "fas fa-map-marker-alt" },
  { id: 5, title: "Longitude", icon: "fas fa-map-marker-alt" },
  { id: 6, title: "Altitude", icon: "fas fa-mountain" },
  { id: 7, title: "Mode", icon: "fas fa-cogs" },
  { id: 8, title: "Armed", icon: "fas fa-shield-alt" },
  { id: 9, title: "Airspeed", icon: "fas fa-wind" },
];

function mapTelemetryToCards(data) {
  return [
    { id: 1, title: "Battery Voltage", value: data.battery.voltage.toFixed(2) + " V", icon: "fas fa-bolt" },
    { id: 2, title: "Battery Current", value: data.battery.current.toFixed(2) + " A", icon: "fas fa-battery-half" },
    { id: 3, title: "Battery Level", value: data.battery.level + " %", icon: "fas fa-battery-full" },
    { id: 4, title: "Latitude", value: data.location.lat.toFixed(6), icon: "fas fa-map-marker-alt" },
    { id: 5, title: "Longitude", value: data.location.lon.toFixed(6), icon: "fas fa-map-marker-alt" },
    { id: 6, title: "Altitude", value: data.location.alt.toFixed(2) + " m", icon: "fas fa-mountain" },
    { id: 7, title: "Mode", value: data.mode, icon: "fas fa-cogs" },
    { id: 8, title: "Armed", value: data.armed ? "Yes" : "No", icon: "fas fa-shield-alt" },
    { id: 9, title: "Airspeed", value: data.airspeed.toFixed(2) + " m/s", icon: "fas fa-wind" },
  ];
}

const dummyTelemetryData = {
  battery: { voltage: 11.1, current: 5.5, level: 75 },
  location: { lat: 37.7749, lon: -122.4194, alt: 15.0 },
  mode: "AUTO",
  armed: true,
  airspeed: 12.34,
};

const dummyTelemetryCards = mapTelemetryToCards(dummyTelemetryData);

function App() {
  const [taskbarCards, setTaskbarCards] = React.useState(dummyTelemetryCards);
  const [playgroundCards, setPlaygroundCards] = React.useState([]);

  const [telemetryCards, setTelemetryCards] = React.useState([]);

  const [connectionStatus, setConnectionStatus] = React.useState("connecting"); // connecting, connected, disconnected

  const dragCardId = React.useRef(null);
  const dataReceived = React.useRef(false);

  React.useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/telemetry");

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnectionStatus("connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        dataReceived.current = true;

        const cards = mapTelemetryToCards(data);

        setTelemetryCards(cards);
      } catch (err) {
        console.error("Error parsing telemetry data:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setConnectionStatus("disconnected");
      if (!dataReceived.current) {
        setTelemetryCards(dummyTelemetryCards);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("disconnected");
      if (!dataReceived.current) {
        setTelemetryCards(dummyTelemetryCards);
      }
    };

    const fallbackTimeout = setTimeout(() => {
      if (!dataReceived.current) {
        setTelemetryCards(dummyTelemetryCards);
      }
    }, 3000);

    return () => {
      clearTimeout(fallbackTimeout);
      ws.close();
    };
  }, []);

  React.useEffect(() => {
    if (telemetryCards.length > 0) {
      setTaskbarCards(telemetryCards);
      setPlaygroundCards([]);
    }
  }, [telemetryCards]);

  function onDragStart(e, cardId) {
    dragCardId.current = cardId;
    e.dataTransfer.effectAllowed = "move";
  }

  function onDrop(e) {
    e.preventDefault();
    const cardId = dragCardId.current;
    if (cardId == null) return;

    if (!playgroundCards.find((c) => c.id === cardId)) {
      const card = taskbarCards.find((c) => c.id === cardId);
      if (card) {
        setPlaygroundCards((prev) => [...prev, card]);
        setTaskbarCards((prev) => prev.filter((c) => c.id !== cardId));
      }
    }
    dragCardId.current = null;
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function getGridTemplateColumns(count) {
    if (count === 0) return "1fr";
    const size = Math.ceil(Math.sqrt(count));
    return Array(size).fill("1fr").join(" ");
  }

  function getGridTemplateRows(count) {
    if (count === 0) return "1fr";
    const size = Math.ceil(Math.sqrt(count));
    return Array(size).fill("1fr").join(" ");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header with connection status */}
      <header className="flex items-center justify-between p-4 bg-gray-800 shadow">
        <h1 className="text-xl font-bold">Drone Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div
            className={`w-4 h-4 rounded-full ${
              connectionStatus === "connected"
                ? "bg-green-500"
                : connectionStatus === "connecting"
                ? "bg-yellow-500 animate-pulse"
                : "bg-red-500"
            }`}
            title={`Connection status: ${connectionStatus}`}
          ></div>
          <span className="text-sm">{connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}</span>
        </div>
      </header>

      <div className="flex flex-row flex-grow overflow-hidden">
        {/* Taskbar */}
        <div className="bg-gray-800 p-2 flex flex-col space-y-2 overflow-y-auto w-20">
          {taskbarCards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col items-center justify-center p-2 rounded cursor-move select-none bg-gray-700 hover:bg-gray-600"
              draggable
              onDragStart={(e) => onDragStart(e, card.id)}
              title={card.title}
            >
              <i className={`${card.icon} text-lg mb-1`}></i>
              <span className="text-xs">{card.title}</span>
            </div>
          ))}
        </div>

        {/* Playground */}
        <div
          className="bg-gray-800 m-4 rounded shadow p-4 grid gap-4 mx-auto flex-grow overflow-auto"
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={{
            gridTemplateColumns: getGridTemplateColumns(playgroundCards.length),
            gridTemplateRows: getGridTemplateRows(playgroundCards.length),
            minHeight: "80vh",
            width: "90vh",
          }}
        >
          {playgroundCards.length === 0 && (
            <div className="col-span-full text-center text-gray-400 self-center">
              Drag cards here to expand
            </div>
          )}
          {playgroundCards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col items-center justify-center p-4 rounded bg-gray-700 cursor-move select-none shadow-lg"
              draggable
              onDragStart={(e) => onDragStart(e, card.id)}
              title={card.title}
            >
              <i className={`${card.icon} text-3xl mb-2`}></i>
              <span className="text-lg font-semibold">{card.title}</span>
              <span className="text-sm mt-1">{card.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
