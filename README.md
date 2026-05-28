<div align="center">

# 🖥️ Vibe Code Compiler

*A beautiful macOS-inspired online code compiler with a built-in YouTube player*

**Write → Run → Debug — all in your browser**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## ✨ Features

- 🖥️ **macOS-style window manager** — draggable, resizable windows with smooth animations
- 💻 **Multi-language support** — Python, JavaScript, C, C++, Java
- 📝 **Monaco Editor** — the same editor that powers VS Code
- 🎬 **Built-in YouTube Player** — code along while watching tutorials
- 📂 **File import/export** — import local files or download your code
- 🎨 **Beautiful dark UI** — macOS-inspired design with blur, shadows & spring animations
- ⚡ **Real-time execution** — code runs server-side with instant output

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Editor | Monaco Editor |
| Animations | Framer Motion |
| Icons | Lucide React |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed on your machine:

- **Node.js** 18+
- **Python 3** (for running Python code)
- **GCC** (for C)
- **G++** (for C++)
- **JDK** (for Java)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/vibe-code-compiler.git
cd vibe-code-compiler

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start coding!

---

## 🐳 Docker Deployment

```bash
# Build the image
docker build -t vibe-compiler .

# Run the container
docker run -p 3000:3000 vibe-compiler
```

---

## 🚂 Railway Deployment

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → **New Project**
3. Select **"Deploy from GitHub repo"**
4. Choose your repo — Railway will auto-detect the `Dockerfile`
5. Wait for the build to complete
6. Your app is live! 🎉

---

## 📸 Screenshots

*Coming soon*

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using Next.js & Monaco Editor**

</div>
