import { useState } from 'react';
import { LayoutDashboard, Upload as UploadIcon } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import ReviewForm from './components/ReviewForm';
import Dashboard from './components/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'upload', 'review'
  const [analysisResult, setAnalysisResult] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setCurrentView('review');
  };

  const handleSaveEntry = () => {
    setAnalysisResult(null);
    setCurrentView('dashboard');
    setRefreshTrigger(prev => prev + 1); // Trigger dashboard refresh
  };

  const handleCancelReview = () => {
    setAnalysisResult(null);
    setCurrentView('upload');
  };

  const handleNewUpload = () => {
    setAnalysisResult(null);
    setCurrentView('upload');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation - Top */}
      <nav className="hidden md:block bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">LL</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">LoyaltyLens</h1>
                <p className="text-xs text-gray-500">Loyalty Program Manager</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </button>
              <button
                onClick={handleNewUpload}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'upload' || currentView === 'review'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UploadIcon className="w-5 h-5" />
                <span className="font-medium">Upload</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">LL</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">LoyaltyLens</h1>
            <p className="text-xs text-gray-500">Loyalty Program Manager</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        {currentView === 'dashboard' && (
          <Dashboard refreshTrigger={refreshTrigger} />
        )}
        {currentView === 'upload' && (
          <ImageUpload onAnalysisComplete={handleAnalysisComplete} />
        )}
        {currentView === 'review' && analysisResult && (
          <ReviewForm
            analysisData={analysisResult}
            onSave={handleSaveEntry}
            onCancel={handleCancelReview}
          />
        )}
      </main>

      {/* Mobile Navigation - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center gap-1 py-3 transition-colors ${
              currentView === 'dashboard'
                ? 'text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button
            onClick={handleNewUpload}
            className={`flex flex-col items-center gap-1 py-3 transition-colors ${
              currentView === 'upload' || currentView === 'review'
                ? 'text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <UploadIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Upload</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
