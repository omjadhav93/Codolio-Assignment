# Codolio

**Codolio** is a modern, interactive coding question tracker designed to help developers organize, manage, and track their progress on coding interview preparation. Built with a clean, intuitive interface, Codolio makes it easy to stay on top of your practice routine.

## Our Goal

Preparing for coding interviews can be overwhelming with hundreds of questions scattered across different platforms. **Codolio** aims to simplify this journey by:

- **Centralizing** your coding practice into one organized workspace
- **Tracking** your progress across different topics and difficulty levels
- **Organizing** questions into customizable topics that match your learning path
- **Streamlining** your preparation workflow with an intuitive drag-and-drop interface

Whether you're preparing for FAANG interviews or strengthening your DSA fundamentals, Codolio helps you stay focused, organized, and motivated.



## Features

### Functional Requirements

- **Add Topic**: Users can create and delete custom topics to organize their questions.
- **Add Question**: Users can add, edit, and delete questions under specific topics with details like title, difficulty level, platform, and resource links.
- **Mark Progress**: Users can mark questions as solved or unsolved to track their preparation progress.
- **Reorder Elements**: Users can change the order of topics and questions by dragging and dropping them to the desired position.
- **Platform Links**: Direct links to questions on coding platforms like LeetCode, GeeksforGeeks, and others for quick access.
- **Difficulty Indicators**: Visual indicators for Easy, Medium, and Hard problems to help prioritize practice.
- **Confirmation Dialogs**: Safe deletion with confirmation prompts to prevent accidental data loss.

### Technical Features

- **Modern UI/UX**: Clean, minimalist design with smooth animations and responsive layout that works on desktop, tablet, and mobile devices.
- **Fast Performance**: Built with Zustand for lightning-fast state management and optimized rendering.
- **Drag-and-Drop**: Intuitive drag-and-drop functionality powered by @dnd-kit for seamless reordering.


## Technology Stack

Codolio is built with modern web technologies:

- **React 19** - Latest React with improved performance and features
- **TypeScript** - Type-safe code for better developer experience
- **Vite** - Lightning-fast build tool and dev server
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **@dnd-kit** - Modern drag-and-drop toolkit for React
- **ESLint** - Code quality and consistency

## Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/codolio.git
cd codolio
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

The application will be available at **http://localhost:5173** (or the port shown in your terminal).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Builds the app for production to the `dist` folder |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |

## Usage

1. **Load Questions**: On first load, the app automatically fetches questions from the configured sheet
2. **Create Topics**: Click "New Topic" to add custom topic categories
3. **Add Questions**: Expand a topic and add questions with title, difficulty, and platform links
4. **Reorder Items**: Drag and drop topics or questions to reorganize your sheet
5. **Track Progress**: Click on a question to mark it as solved
6. **Delete Items**: Remove topics or questions with the delete button (with confirmation)

## Acknowledgments

- Questions sourced from [Striver's SDE Sheet](https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/)
- Built with inspiration from modern productivity tools