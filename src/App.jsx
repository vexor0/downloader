import { useState, useEffect } from 'react'
import Header from './components/Header'
import VideoCard from './components/VideoCard'
import VideoPlayer from './components/VideoPlayer'
import SettingsModal from './components/SettingsModal'
import DownloadModal from './components/DownloadModal'
import NekopoiAPI from './services/NekopoiAPI'
import { Button } from '@/components/ui/button'
import { AlertCircle, Video, TrendingUp, Loader2 } from 'lucide-react'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('home') // 'home' or 'player'
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showDownload, setShowDownload] = useState(false)
  const [downloadVideo, setDownloadVideo] = useState(null)
  const [videos, setVideos] = useState([])
  const [trendingVideos, setTrendingVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiInstance, setApiInstance] = useState(null)
  const [currentTab, setCurrentTab] = useState('trending') // 'trending' or 'search'

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('streamfree_api_key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  // Create API instance when API key changes
  useEffect(() => {
    if (apiKey) {
      const api = new NekopoiAPI(apiKey)
      setApiInstance(api)
      loadTrendingVideos(api)
    } else {
      setApiInstance(null)
      setTrendingVideos([])
    }
  }, [apiKey])

  // Load trending videos
  const loadTrendingVideos = async (api = apiInstance) => {
    if (!api) return
    
    setLoading(true)
    try {
      const response = await api.getTrendingVideos(8)
      if (response.success) {
        setTrendingVideos(response.data)
      }
    } catch (error) {
      console.error('Error loading trending videos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock video data for demonstration
  const mockVideos = [
    {
      id: 1,
      title: "Sample Video 1 - Demo Content",
      thumbnail: "https://via.placeholder.com/320x180/6366f1/ffffff?text=Video+1",
      duration: 3600,
      views: 1250000,
      uploadDate: "2 hari lalu",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      description: "Ini adalah video demo untuk menunjukkan fitur video player. Video ini menggunakan sample video untuk testing."
    },
    {
      id: 2,
      title: "Sample Video 2 - Another Demo",
      thumbnail: "https://via.placeholder.com/320x180/8b5cf6/ffffff?text=Video+2",
      duration: 2400,
      views: 850000,
      uploadDate: "1 minggu lalu",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      description: "Video demo kedua dengan konten yang berbeda untuk testing fitur streaming."
    },
    {
      id: 3,
      title: "Sample Video 3 - Test Content",
      thumbnail: "https://via.placeholder.com/320x180/ec4899/ffffff?text=Video+3",
      duration: 1800,
      views: 420000,
      uploadDate: "3 hari lalu",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      description: "Video demo ketiga untuk menguji berbagai fitur player dan download."
    },
    {
      id: 4,
      title: "Sample Video 4 - Demo Streaming",
      thumbnail: "https://via.placeholder.com/320x180/f59e0b/ffffff?text=Video+4",
      duration: 4200,
      views: 2100000,
      uploadDate: "5 hari lalu",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      description: "Video demo untuk menunjukkan kualitas streaming dan kontrol player."
    }
  ]

  const handleSearch = async (query) => {
    if (!apiInstance) {
      setShowSettings(true)
      return
    }

    if (!query.trim()) {
      setCurrentTab('trending')
      setVideos([])
      return
    }

    setLoading(true)
    setCurrentTab('search')
    
    try {
      const response = await apiInstance.searchVideos(query)
      if (response.success) {
        setVideos(response.data)
      } else {
        alert('Gagal mencari video. Silakan coba lagi.')
        setVideos([])
      }
    } catch (error) {
      console.error('Error searching videos:', error)
      alert('Terjadi kesalahan saat mencari video.')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  const handlePlayVideo = (video) => {
    setSelectedVideo(video)
    setCurrentView('player')
  }

  const handleDownloadVideo = (video) => {
    if (!apiKey) {
      setShowSettings(true)
      return
    }
    
    setDownloadVideo(video)
    setShowDownload(true)
  }

  const handleSaveApiKey = (newApiKey) => {
    setApiKey(newApiKey)
    localStorage.setItem('streamfree_api_key', newApiKey)
    
    // Load initial videos when API key is set
    if (newApiKey && videos.length === 0) {
      setVideos(mockVideos)
    }
  }

  const handleBackToHome = () => {
    setCurrentView('home')
    setSelectedVideo(null)
  }

  // Load initial videos if API key exists
  useEffect(() => {
    if (apiKey && videos.length === 0) {
      setVideos(mockVideos)
    }
  }, [apiKey])

  if (currentView === 'player' && selectedVideo) {
    return (
      <VideoPlayer
        video={selectedVideo}
        onBack={handleBackToHome}
        onDownload={handleDownloadVideo}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header
        onSearch={handleSearch}
        onSettingsClick={() => setShowSettings(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="container mx-auto px-4 py-8">
        {!apiKey ? (
          // API Key Required Message
          <div className="text-center py-16">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md mx-auto">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-white text-xl font-bold mb-4">API Key Diperlukan</h2>
              <p className="text-gray-300 mb-6">
                Untuk menggunakan StreamFree, Anda perlu memasukkan API key terlebih dahulu.
              </p>
              <Button
                onClick={() => setShowSettings(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Masukkan API Key
              </Button>
            </div>
          </div>
        ) : loading ? (
          // Loading State
          <div className="text-center py-16">
            <Loader2 className="animate-spin h-16 w-16 text-purple-500 mx-auto mb-4" />
            <p className="text-white">
              {currentTab === 'search' ? 'Mencari video...' : 'Memuat video trending...'}
            </p>
          </div>
        ) : (
          // Video Content
          <div>
            {/* Tab Navigation */}
            <div className="flex items-center space-x-4 mb-6">
              <Button
                variant={currentTab === 'trending' ? 'default' : 'outline'}
                onClick={() => {
                  setCurrentTab('trending')
                  setVideos([])
                  setSearchQuery('')
                }}
                className={currentTab === 'trending' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'border-slate-600 text-white hover:bg-slate-800'
                }
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </Button>
              {videos.length > 0 && (
                <Button
                  variant={currentTab === 'search' ? 'default' : 'outline'}
                  onClick={() => setCurrentTab('search')}
                  className={currentTab === 'search' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'border-slate-600 text-white hover:bg-slate-800'
                  }
                >
                  Hasil Pencarian
                </Button>
              )}
            </div>

            {/* Content Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">
                {currentTab === 'trending' 
                  ? 'Video Trending' 
                  : `Hasil pencarian: "${searchQuery}"`
                }
              </h2>
              <span className="text-gray-400">
                {currentTab === 'trending' 
                  ? `${trendingVideos.length} video trending`
                  : `${videos.length} video ditemukan`
                }
              </span>
            </div>
            
            {/* Video Grid */}
            {currentTab === 'trending' ? (
              trendingVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {trendingVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onPlay={handlePlayVideo}
                      onDownload={handleDownloadVideo}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-bold mb-4">Belum Ada Video Trending</h3>
                  <p className="text-gray-300">
                    Video trending akan muncul di sini setelah API key dikonfigurasi.
                  </p>
                </div>
              )
            ) : (
              videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onPlay={handlePlayVideo}
                      onDownload={handleDownloadVideo}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-bold mb-4">Tidak Ada Hasil</h3>
                  <p className="text-gray-300 mb-6">
                    Tidak ditemukan video untuk pencarian "{searchQuery}".
                  </p>
                  <Button
                    onClick={() => {
                      setCurrentTab('trending')
                      setVideos([])
                      setSearchQuery('')
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Lihat Video Trending
                  </Button>
                </div>
              )
            )}
          </div>
        )}
      </main>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <DownloadModal
        isOpen={showDownload}
        onClose={() => setShowDownload(false)}
        video={downloadVideo}
        apiKey={apiKey}
      />
    </div>
  )
}

export default App

