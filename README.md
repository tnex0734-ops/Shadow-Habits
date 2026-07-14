# Shadow Habits

A specialized tracking application built as a pnpm workspace with TypeScript. Designed for performance, modularity, and rapid iteration.

## Features

- Monorepo Architecture â€” Built using a robust pnpm workspace structure.
- Strict Typing â€” End-to-end TypeScript configuration across all artifacts and libraries.
- Cloud-Ready â€” Configured for Replit integration and cloud deployments.
- Extensible Libraries â€” Modular lib directory for shared utilities.

## Tech Stack

- Runtime: Node.js
- Language: TypeScript
- Package Manager: pnpm (Workspaces)
- Environment: Replit

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm

### Installation

1. Clone the repository
   git clone https://github.com/tnex0734-ops/Shadow-Habits.git
   cd Shadow-Habits

2. Install dependencies
   pnpm install

3. Typecheck & Build
   pnpm run build

## Project Structure

Shadow-Habits/
â”œâ”€â”€ artifacts/        # Build artifacts and compiled outputs
â”œâ”€â”€ lib/              # Shared libraries and utilities
â”œâ”€â”€ scripts/          # Automation and build scripts
â”œâ”€â”€ package.json      # Workspace root configuration
â”œâ”€â”€ pnpm-workspace.yaml # Workspace definitions
â””â”€â”€ .replit           # Replit environment configuration