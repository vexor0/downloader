import { useState } from 'react'
import { X, Download, FileVideo, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DownloadModal({ isOpen, onClose, video, apiKey }) {
  const [downloading, setDownloading] = useState(null)

  if (!isOpen || !video) return null

  const downloadOptions = [
    { quality: '1080p', size: '~500MB', format: 'MP4', bitrate: '5000 kbps' },
    { quality: '720p', size: '~300MB', format: 'MP4', bitrate: '3000 kbps' },
    { quality: '480p', size: '~150MB', format: 'MP4', bitrate: '1500 kbps' },
    { quality: '360p', size: '~80MB', format: 'MP4', bitrate: '800 kbps' }
  ]

  const handleDownload = async (option) => {
    if (!apiKey) {
      alert('API key diperlukan untuk download')
      return
    }

    setDownloading(option.quality)
    
    try {
      // Simulate download process - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a temporary download link
      const link = document.createElement('a')
      link.href = video.url
      link.download = `${video.title}_${option.quality}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      alert(`Download ${option.quality} dimulai untuk: ${video.title}`)
    } catch (error) {
      alert('Gagal memulai download. Silakan coba lagi.')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Download Video
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Info */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2 line-clamp-2">{video.title}</h3>
            <div className="flex items-center text-gray-300 text-sm space-x-4">
              {video.duration && (
                <span>Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
              )}
              {video.views && (
                <span>Views: {video.views.toLocaleString()}</span>
              )}
            </div>
          </div>

          {/* Download Options */}
          <div className="space-y-3">
            <h4 className="text-white font-medium">Pilih Kualitas Download:</h4>
            {downloadOptions.map((option) => (
              <div
                key={option.quality}
                className="bg-slate-700 p-4 rounded-lg flex items-center justify-between hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileVideo className="h-5 w-5 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">{option.quality}</div>
                    <div className="text-gray-400 text-sm">
                      {option.format} • {option.size} • {option.bitrate}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleDownload(option)}
                  disabled={downloading === option.quality}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  {downloading === option.quality ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="bg-blue-900/20 border border-blue-700 p-3 rounded-lg">
            <p className="text-blue-300 text-sm">
              💡 Download akan dimulai secara otomatis setelah memilih kualitas. 
              Pastikan koneksi internet stabil untuk download yang optimal.
            </p>
          </div>

          {/* Close Button */}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-slate-600 text-white hover:bg-slate-700"
          >
            Tutup
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

