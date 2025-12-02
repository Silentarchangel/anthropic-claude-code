# LoyaltyLens

A comprehensive web application for loyalty program managers to catalog, analyze, and manage loyalty program displays using AI-powered OCR.

## Features

### 🤖 AI-Powered OCR & Analysis
- **Image Upload**: Upload photos via file selection or camera
- **Automated Extraction**: Uses OpenRouter API with Google Gemini 2.0 Flash (free) to extract:
  - Retailer
  - Country
  - Loyalty Brand
  - Promotion Period
  - Items
  - Mechanics
  - Price
- **Error Handling**: Robust error messages for analysis failures
- **Clarification Flag**: Automatic flagging of ambiguous entries

### 📊 Data Management & Verification
- **Review Form**: Pre-filled form with AI findings
- **Manual Editing**: Correct or add to AI-generated data
- **Local Storage**: Browser-based persistence

### 🎨 Visual Dashboard (Pinterest-style Board)
- **Masonry Grid Layout**: Visual cards with images as focal points
- **Quick Information**: Displays retailer, brand, country, period, and mechanics
- **Hidden Entries**: Hide/show specific entries

### 🔍 Advanced Filtering
- **Global Search**: Search across retailer names, brands, and items
- **Dropdown Filters**: Quick filters for Retailer, Country, and Loyalty Brand
- **Advanced Filters**: Specific filters for Promotion Period, Items, and Mechanics
- **Real-time Updates**: Instant dashboard updates

### 📱 Responsive Design
- **Mobile**: Bottom navigation bar
- **Desktop**: Top navigation bar
- **Clean Interface**: Modern design with Tailwind CSS

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenRouter API key (free - includes access to Gemini 2.0 Flash)

### Installation

1. Clone the repository:
```bash
cd loyaltylens-app
```

2. Install dependencies:
```bash
npm install
```

3. Get your OpenRouter API key:
   - Visit [OpenRouter](https://openrouter.ai/keys)
   - Sign up for a free account
   - Create a new API key
   - Copy the key (you'll enter it in the app)
   - Note: The app uses the free Gemini 2.0 Flash model via OpenRouter

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Usage

### First Time Setup

1. Navigate to the "Upload" tab
2. Enter your OpenRouter API key (it will be saved in your browser)
3. Upload an image or take a photo of a loyalty program display

### Uploading and Analyzing

1. Click "Upload from Files" to select an image or "Take Photo" to use your camera
2. Wait for the AI to analyze the image
3. Review the extracted information in the form
4. Make any necessary corrections
5. Click "Save Entry" to add it to your dashboard

### Managing Entries

#### Dashboard View
- View all logged programs in a Pinterest-style masonry grid
- Click on any card to see full details
- Use the eye icon to hide/show entries
- Toggle "Show Hidden" to view hidden entries

#### Filtering
- Use the search bar to find entries by retailer, brand, or items
- Click "Filters" to access advanced filtering options
- Filter by dropdown (Retailer, Country, Brand) or text search (Period, Items, Mechanics)

#### Detail View
- Click any entry card to open the detail modal
- View full image and all extracted information
- Click the edit icon to modify information
- Use the hide/show icon to toggle visibility
- Click the trash icon to delete the entry

## API Configuration

The app uses OpenRouter API with the free Google Gemini 2.0 Flash model for image analysis. The API key is stored locally in your browser's localStorage. You only need to enter it once.

**Why OpenRouter?**
- Free access to Gemini 2.0 Flash model
- No need for Google Cloud setup
- Simple REST API
- No credit card required for basic usage

If you need to change your API key:
1. Go to the Upload tab
2. Enter a new API key in the input field
3. The new key will be saved automatically

## Data Storage

All data is stored in your browser's localStorage. This means:
- No backend server required
- Data persists between sessions
- Data is private to your browser
- Clearing browser data will delete all entries

To backup your data:
1. Open browser Developer Tools (F12)
2. Go to Application > Local Storage
3. Copy the `loyaltylens_entries` value
4. Save it to a file for backup

To restore data:
1. Open browser Developer Tools (F12)
2. Go to Application > Local Storage
3. Set `loyaltylens_entries` to your backed up value

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
loyaltylens-app/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main dashboard with masonry grid
│   │   ├── Dashboard.css          # Dashboard styles
│   │   ├── DetailModal.jsx        # Full-screen entry detail modal
│   │   ├── FilterBar.jsx          # Advanced filtering component
│   │   ├── ImageUpload.jsx        # Image upload and AI analysis
│   │   └── ReviewForm.jsx         # Review and edit AI results
│   ├── utils/
│   │   ├── gemini.js              # OpenRouter API integration (using Gemini model)
│   │   └── storage.js             # localStorage utilities
│   ├── App.jsx                    # Main app component
│   ├── index.css                  # Global styles with Tailwind
│   └── main.jsx                   # App entry point
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tailwind.config.js            # Tailwind configuration
├── vite.config.js                # Vite configuration
└── README.md                      # This file
```

## Technologies Used

- **React**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **OpenRouter API**: AI-powered image analysis (using free Gemini 2.0 Flash model)
- **react-masonry-css**: Masonry grid layout

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support (with camera access)

## Troubleshooting

### AI Analysis Fails
- Ensure your OpenRouter API key is correct
- Check that the image is clear and not blurry
- Verify the image contains a loyalty program display
- Check your internet connection
- Verify you have credits in your OpenRouter account (free tier should be sufficient)

### Images Not Displaying
- Images are stored as base64 in localStorage
- Large images may cause storage issues
- Consider limiting image size (browser localStorage limit is typically 5-10MB)

### Data Lost
- Don't clear browser data/localStorage
- Create regular backups using the method described above
- Consider implementing cloud storage for production use

## Future Enhancements

- Cloud storage integration
- Export to CSV/Excel
- Analytics and reporting
- Multi-user support
- Bulk upload
- Image optimization and compression
- Custom fields and categories
- Tagging system

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
