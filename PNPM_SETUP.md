# pnpm Setup Guide

## Current Status

Your project currently uses **npm** (package-lock.json exists). If you want to switch to **pnpm**, follow these steps:

## Installing pnpm

### Option 1: Using Homebrew (Recommended for macOS)

```bash
brew install pnpm
```

### Option 2: Using npm (requires sudo)

```bash
sudo npm install -g pnpm
```

### Option 3: Using Corepack (Node.js 16.13+)

```bash
# Enable corepack (may require sudo)
sudo corepack enable

# Prepare pnpm
corepack prepare pnpm@latest --activate
```

### Option 4: Standalone Installation Script

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## Switching from npm to pnpm

Once pnpm is installed:

```bash
# Remove npm lock file
rm package-lock.json

# Install dependencies with pnpm
pnpm install

# This will create pnpm-lock.yaml
```

## Using pnpm Commands

```bash
# Install a package
pnpm add <package-name>

# Install dev dependency
pnpm add -D <package-name>

# Install global package
pnpm add -g <package-name>

# Run scripts
pnpm run dev
pnpm run build

# Update dependencies
pnpm update
```

## Note

- **@vercel/analytics** is already installed and configured using npm
- The package works the same regardless of package manager
- You can continue using npm or switch to pnpm - both work fine!
