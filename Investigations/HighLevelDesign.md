### Idea #1 Monolith Flask and react

#### Design
- Flask handles API and serves react
- React polls Flask for updates of drone (once every second)

#### Pros
- Simple to implement, MVP reached faster

#### Cons
- Polling is inefficient (wastes clock cycles) and introduces latency

### Will this be valuable for our capstone
- It can be valuable to implement a simple version for the MVP
- Latency issues are a big issue for this project, with a high speed drone this can cause issues

### Idea #2 Flask and React with WebSockets

#### Design
- Flask provides API and a WebSocket endpoint
- React connects with websocket receiving real-time drone updates
- Using Flask-SocketIO

#### Pros
- Much lower latency

#### Cons
- A bit more complex of a system. Not complex enough that it cant be done in a reasonable amount of time
- Needs a bit of setup

### Will this be valuable for our capstone
- Solves latency issue
- Slightly more complex but benefits out weight the risks

### WebSockets
Communication protocol that lets a client and server communicate in real-time over a single connection
instead of a usual request response pattern. Client and server can send push at any time without waiting for a request

# High-Speed Quadcopter Web Interface

## Overall Design
This design enables a web-based interface for monitoring and controlling a high-speed quadcopter using a Python (Flask) backend and a React frontend. The system supports real-time telemetry reporting, control commands, and data visualization.

The software system consists of two main components:

## 1. Flask Backend
Flask acts as the central server that bridges the drone and the frontend. It provides REST APIs for standard requests and commands and WebSocket connections for real-time updates.

Responsibilities:
- Connects to MavProxy to receive telemetry from the drone.
- Formats vehicle data into JSON for frontend consumption.
- Accepts commands from React and forwards them to MavProxy.

Vehicle Reports:
- Processes and streams incoming telemetry.
- Generates vehicle properties and streams them to React via WebSocket.
- Supports polling through REST API for non-time-critical requests.

## 2. React Frontend
The React frontend provides a dynamic interface for monitoring and controlling the quadcopter in real-time.

Responsibilities:
- Display live vehicle telemetry (speed, altitude, orientation) via WebSockets.
- Send commands to the drone.
- Use REST API for non-time-critical data and requests.

## Data Flow
1. Real-time telemetry:  
   `Drone -> MavProxy -> Flask -> React (WebSocket)`

2. Non-time-critical requests / polling:  
   `Drone -> MavProxy <-> Flask <-> React (REST API)`

## Key Benefits
- Real-time control and monitoring of the quadcopter.
- Separation of concerns between backend and frontend.
- Scalable architecture for additional drones or features.
- Supports both WebSocket streaming and REST polling for flexible data access.
