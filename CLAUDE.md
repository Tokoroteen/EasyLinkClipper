# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EasyLinkClipper is a Chrome browser extension that adds copy buttons next to page titles, allowing users to easily copy URLs or formatted title+URL text to the clipboard. The extension focuses on article pages and provides configurable URL pattern matching and extraction.

## Architecture

This is a simple Manifest V3 Chrome extension with the following structure:

### Core Components

- **manifest.json**: Extension configuration with permissions for clipboard, storage, and tabs
- **content.js**: Main content script that injects copy buttons into web pages
- **popup.html/popup.js**: Settings popup for configuring button behavior and appearance
- **styles.css**: CSS for button styling with color themes and toast notifications

### Key Features

1. **Dynamic Button Insertion**: Finds title elements using selectors (`h1`, `.page-title`) and adds copy buttons
2. **Configurable Display**: Uses regex patterns to control when buttons appear (default: pages containing "articles")
3. **URL Processing**: Supports regex-based URL extraction (default: extracts article URLs with pattern `^(.+/articles/\d+)`)
4. **Color Themes**: Six predefined color schemes (default, blue, green, pink, yellow, gray)
5. **Real-time Settings**: Changes in popup are immediately reflected without page reload

### Data Flow

1. Settings stored in `chrome.storage.sync` with default values
2. Content script loads settings on page load and listens for changes
3. Popup sends messages to active tab when settings change
4. Buttons use `navigator.clipboard.writeText()` for copying
5. Toast notifications show copied content briefly

## Development Commands

This extension has no build process - it uses vanilla JavaScript. To develop:

1. Load the extension in Chrome developer mode by pointing to the project directory
2. Make changes to files directly
3. Reload the extension in Chrome extensions page after changes
4. Test on pages matching the URL pattern (contains "articles" by default)

## Configuration Defaults

The extension initializes with these default settings:
- Show pattern: `'articles'` (only show on URLs containing "articles")
- URL extract pattern: `'^(.+/articles/\d+)'` (extract article URL portion)
- Both copy buttons enabled
- Default color theme

## Key Implementation Details

- Uses IIFE pattern to avoid global namespace pollution
- Robust error handling for invalid regex patterns
- DOM mutation observer not used - relies on DOMContentLoaded and manual refresh
- All styles use `!important` to override site CSS
- Toast positioning uses fixed positioning at 33vh from top