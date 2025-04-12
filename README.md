# Regex Labs

An AI-assisted regular expression testing tool to help you create and test regex patterns with ease.

### Motivation
This tool is not meant to auto-generate regex patterns with AI. Instead, it’s built to help you thoroughly validate the patterns you craft yourself. Regex can be complex and confusing at times. However, it is incredibly powerful when used well. There’s real value in mastering how to create regex patterns on your own, and Regex Labs is here to support that.

Present-day generative AI models, for all their strengths, tend to stumble with output errors. These can range from minor slip-ups to wild hallucinations. That makes them unreliable for generating regexes, which necessitate precise output even in the simplest cases. Generating test cases is a particular strength of AI, creating diverse and relevant examples to test against. Regex Labs taps into that strength, using AI not to write patterns for you, but to equip you with comprehensive test suites tailored to your specific use cases.

Paired with real-time feedback, Regex Labs becomes a practical avenue to build, test, and refine regexes. It’s a bridge between your knowledge and a bit of AI-powered help, wrapped in a user-friendly interface.

## Features

- **AI-Generated Test Cases**: Generate relevant test cases based on your description
- **Interactive Testing**: Real-time validation of your regex against test cases
- **Match Highlighting**: Visual highlighting of pattern matches within test strings
- **Capture Groups**: Automatic extraction and display of capture groups
- **Copy to Clipboard**: Easily copy your completed regex pattern to use in your projects
- **Regex Cheat Sheet**: Built-in comprehensive reference for regex syntax and patterns

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/regex-labs.git
   cd regex-labs
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. **Enter a prompt**: Describe what you want your regex to match (e.g., "Match all valid email addresses")
2. **Click "Create Tests"**: AI will generate relevant test cases based on your description
3. **Create your regex pattern**: Enter your regular expression in the pattern field
4. **Test and refine**: Your pattern will be automatically tested against all cases with real-time feedback
5. **Use the cheat sheet**: Click the "Cheat Sheet" dropdown for regex syntax help
6. **Copy when ready**: Click "Copy" to copy your finished regex to clipboard

## Development

### Project Structure
```
regex-labs/
├── public/              # Static frontend files
│   ├── css/             # Stylesheet files
│   ├── fonts/           # Font files
│   ├── js/              # Client-side JavaScript
│   └── index.html       # Main HTML file
├── src/                 # Server-side code
│   ├── routes/          # Express routes
│   ├── utils/           # Utility functions
│   └── server.js        # Express server setup
|── tests/               # Test files
├── .gitignore           # Git ignore file
├── package-lock.json    # Dependency lock file
├── package.json         # Project configuration
└── README.md            # Project documentation
```

### Scripts

- `npm start`: Start the server
- `npm run dev`: Run development server with http-server

## Dependencies

### Production Dependencies
- Express.js (v5.1.0): Web framework for the backend
- Http-server (v14.1.1): Simple, zero-configuration command-line http server

### Development Dependencies
- Ollama (v0.5.14): Library for AI model integration

## License

ISC License