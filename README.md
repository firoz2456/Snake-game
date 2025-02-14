# Snake Game
![snake-game](https://github.com/user-attachments/assets/1c9d1287-4a4d-4398-87ff-62a96a462960)

A modern take on the classic Snake game with special powers and obstacles, built using vanilla JavaScript and HTML5 Canvas.

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of running a local server (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/snake-game.git
   ```

2. Navigate to the project directory:
   ```bash
   cd snake-game
   ```

### Running the Game

#### Method 1: Direct File Opening
Simply open the `index.html` file in your web browser.

#### Method 2: Using a Local Server (Recommended)

**Using Python:**
```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```
Then open your browser and go to:
```
http://localhost:8000
```

**Using Node.js:**
```bash
# Install http-server globally
npm install -g http-server

# Run the server
http-server
```
Then open your browser and go to:
```
http://localhost:8080
```

## 🎮 Features

- Smooth circular snake movement
- Multiple types of food with different effects:
  - **Red Food (1 point):** Normal growth
  - **Gold Food (3 points):** Double growth
  - **Purple Food (5 points):** Speed boost
- Special obstacles and power-ups:
  - **Cyan Portals:** Teleportation between two points
  - **Ghost Power:** Phase through walls
  - **Rainbow Power:** Disco effect
- Score tracking system
- Responsive canvas that adapts to window size
- Wrap-around screen edges

## 🎯 How to Play

- Use arrow keys to control the snake's direction
- Eat food to grow and score points:
  - **Red food:** 1 point
  - **Gold food:** 3 points + double growth
  - **Purple food:** 5 points + speed boost
- Collect power-ups:
  - **Cyan portals:** Teleport to the other portal
  - **Ghost power:** Phase through walls
  - **Rainbow power:** Activate disco mode
- Avoid hitting the snake's own body (coming soon)

## 🛠️ Built With

- **HTML5**
- **CSS3**
- **JavaScript**
- **Canvas API**

## 📁 Project Structure

```
snake-game/
│
├── index.html       # Main HTML file
├── style.css        # Styling
├── game.js         # Game logic
└── README.md       # Documentation
```

## 🤝 Contributing

1. **Fork** the project
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE.md](LICENSE.md) file for details.

Happy Coding! 🚀🎮

