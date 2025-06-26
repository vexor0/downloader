import { Play, Download, Clock, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function VideoCard({ video, onPlay, onDownload }) {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-all duration-300 group cursor-pointer">
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-slate-700 rounded-t-lg overflow-hidden">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Duration overlay */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              <Clock className="inline h-3 w-3 mr-1" />
              {formatDuration(video.duration)}
            </div>
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <Button
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-purple-600 hover:bg-purple-700"
              onClick={() => onPlay(video)}
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
            {video.title}
          </h3>
          
          <div className="flex items-center justify-between text-gray-400 text-xs mb-3">
            <div className="flex items-center space-x-4">
              {video.views && (
                <span className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {formatViews(video.views)}
                </span>
              )}
              {video.uploadDate && (
                <span>{video.uploadDate}</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              size="sm"
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={() => onPlay(video)}
            >
              <Play className="h-4 w-4 mr-2" />
              Tonton
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
              onClick={() => onDownload(video)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

