# Action Equation 🎯

> An interactive tool to visualize and understand the invisible forces behind human action and inaction.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Part of Project Akrasia](https://img.shields.io/badge/Part%20of-Project%20Akrasia-blue)](https://github.com/AffanShaikhsurab/Project-Akrasia)

## 🌟 What is This?

**Action Equation** is an open-source behavioral debugging tool that helps you understand **why you take action** and **why you don't**. 

We often feel stuck, procrastinate, or fail to act on our goals, but we don't know *exactly* why. This tool turns the invisible battle in your brain into something you can see, adjust, and fix.

## 🧠 The Science Behind It

At the core of this project is the **Behavioral Probability Equation**:

```
P(Action) = σ( β · Z + MoodBias )
```

Where **Z (Latent Potential)** is defined as:

```
Z = [Net Drive] - [Sum of Blockers]

Net Drive = Urgency × (Loot - Comfort) × Why
Sum of Blockers = Fog + Difficulty + Fear + Friction + Habit
```

This equation models the psychological forces that determine whether you'll take action or stay stuck.

## 🎮 How It Works

1. **Adjust Your Drivers**: Set your Urgency, Loot Value (reward), and Why (meaning)
2. **Set Your Blockers**: Configure Fog (uncertainty), Difficulty, Fear, Friction, and Habit
3. **Apply Status Effects**: Choose your mood state (Buffed/Normal/Cursed)
4. **See Your Probability**: Watch in real-time how likely you are to take action

When your probability crosses **80%**, action becomes automatic. Below that? Something needs to change.

## 🔗 Part of Project Akrasia

This project is a module of [**Project Akrasia**](https://github.com/AffanShaikhsurab/Project-Akrasia) — a community-driven initiative to understand, fight, and overcome procrastination through education, research, and practical tools.

### Project Akrasia's Mission
- 🌐 Educate people about procrastination and its psychology
- 🛠️ Build digital tools to track and overcome inaction
- 📚 Provide research-backed techniques for focus and discipline
- 🤝 Foster a community of people conquering procrastination

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AffanShaikhsurab/action-equation.git

# Navigate to the project
cd action-equation

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

- **React** + **TypeScript** - Component framework
- **Vite** - Build tool
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Tailwind CSS** - Styling

## 📖 Understanding the Variables

| Variable | What It Means | Examples |
|----------|---------------|----------|
| **Urgency** | How soon this needs to happen | Low: No rush / High: Deadline today |
| **Loot Value** | How much you want the reward | Low: Don't care / High: Must have |
| **Spirit (Why)** | How meaningful this is to you | Low: Just a chore / High: Life purpose |
| **Comfort Zone** | How cozy your current state is | Low: Unbearable / High: Too comfortable |
| **Fog (Clarity)** | How clear the steps are | Low: Crystal clear / High: No idea where to start |
| **Difficulty** | How hard the task actually is | Low: Trivial / High: Hercules-level |
| **Dread (Fear)** | How much you fear doing it | Low: Fearless / High: Paralyzed |
| **Terrain (Friction)** | Environmental obstacles | Low: Smooth sailing / High: Red tape everywhere |
| **Curse (Habit)** | Strength of opposing habits | Low: No habit / High: Deep addiction |

## 🤝 Contributing

We welcome contributions! Whether it's:
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Research & References

This tool is inspired by:
- Behavioral economics (Kahneman, Tversky)
- Temporal Motivation Theory (Piers Steel)
- Logistic regression models in psychology
- Research on procrastination and akrasia (weakness of will)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Part of the [Project Akrasia](https://github.com/AffanShaikhsurab/Project-Akrasia) ecosystem
- Built with ❤️ for anyone who's ever wondered "Why can't I just do the thing?"

---

**Made for humans who want to debug their own behavior.**

If this helped you understand yourself better, ⭐ star the repo and share it with someone who's stuck!
