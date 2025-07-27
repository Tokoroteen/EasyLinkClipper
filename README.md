# EasyLinkClipper 🔗

**One-click URL copying made simple** – A Chrome extension that adds convenient copy buttons to any webpage title.

## ✨ Features

- **🎯 Smart Detection**: Automatically finds page titles (h1, .page-title elements)
- **📋 Dual Copy Options**: Copy just the URL or title + URL together
- **🎨 6 Color Themes**: Choose from default, blue, green, pink, yellow, or gray
- **⚙️ Flexible Configuration**: Customize when and where buttons appear with regex patterns
- **🚀 Instant Sync**: Settings sync across all your Chrome browsers
- **💡 Clean Design**: Minimal, non-intrusive buttons that blend with any website

## 🖼️ Preview

The extension adds subtle copy buttons next to page titles:

```
📰 Your Article Title [📋 Copy link] [📋 Copy title & link]
```

## 🚀 Quick Start

1. **Install**: Load the extension in Chrome Developer Mode
2. **Configure**: Click the extension icon to open settings
3. **Copy**: Click the buttons that appear next to page titles

## ⚙️ Configuration Options

### URL Pattern Matching
Control when buttons appear using regular expressions:
- **Default**: `articles` (shows only on URLs containing "articles")
- **All pages**: Leave blank
- **Custom**: Enter your own regex pattern

### URL Extraction
Extract specific parts of URLs before copying:
- **Default**: `^(.+/articles/\d+)` (extracts article URLs)
- **Full URL**: Leave blank
- **Custom**: Define your own extraction pattern

### Appearance
- **6 Color Themes**: Match your browsing style
- **Toggle Buttons**: Show/hide individual copy buttons
- **Reset to Defaults**: One-click restore to original settings

## 🛠️ Development

This is a vanilla JavaScript Manifest V3 Chrome extension:

```bash
# No build process required!
# Just load the directory in Chrome Developer Mode
```

### Project Structure
```
EasyLinkClipper/
├── manifest.json      # Extension configuration
├── content.js         # Main functionality
├── popup.html         # Settings interface
├── popup.js          # Settings logic
└── styles.css        # Button styling
```

## 🎨 Customization

The extension is highly customizable through its settings panel:

- **Smart URL Matching**: Only show buttons on relevant pages
- **URL Processing**: Extract clean URLs from complex page addresses
- **Visual Themes**: Multiple color schemes to match your preference
- **Button Control**: Enable/disable individual copy functions

## 🔧 Technical Details

- **Manifest V3** compatible
- **Chrome Storage API** for settings persistence
- **Clipboard API** for reliable copying
- **Content Script** injection with smart DOM detection
- **Regex-based** URL pattern matching and extraction

## 📄 License

MIT License - Feel free to fork, modify, and use in your own projects!

## 🤝 Contributing

Found a bug or have a feature request? Open an issue or submit a pull request!