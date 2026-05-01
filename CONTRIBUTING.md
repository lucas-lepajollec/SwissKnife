# Contributing to SwissKnife 🛠️

First off, thank you for considering contributing to SwissKnife! It's people like you that make the open-source community such a great place to learn, inspire, and create.

## 💻 Development Setup

To test your code changes, you need to run the project from source. You cannot use the pre-built GitHub Container Registry image for development.

### Option 1: Local Development (Node & Vite) - *Recommended*
Ideal for active development and instant hot-reloading.
1. Fork and clone the repository.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   
```bash
   npm run dev
   ```
4. The app will be available at `http://localhost:2499`.

### Option 2: Docker (Build from source)
If you want to test how your changes behave inside the final Docker environment:
1. Build the local image:
   ```bash
   docker build -t swissknife-local .
   ```
2. Run the container using your local build:
   ```bash
   docker run -d -p 2501:80 --name swissknife-dev swissknife-local
   ```
3. Open `http://localhost:2501` in your browser.

## 🚀 How to submit a Pull Request

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally.
3. **Create a new branch** for your feature or bugfix: `git checkout -b feat/my-new-feature` or `git checkout -b fix/my-bug-fix`.
4. **Make your changes** and test them.
5. **Commit** your changes using Conventional Commits (e.g., `feat: add new audio converter` or `fix: resolve UI glitch on mobile`).
6. **Push** the branch to your fork: `git push origin feat/my-new-feature`.
7. **Open a Pull Request** against the `main` branch of the original repository.
