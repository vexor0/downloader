// API service untuk integrasi dengan video streaming API
class VideoStreamingAPI {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseURL = 'https://api.videostreaming.com/v1' // Placeholder URL
  }

  // Simulasi pencarian video
  async searchVideos(query, page = 1, limit = 20) {
    // Dalam implementasi nyata, ini akan memanggil API eksternal
    // Untuk demo, kita gunakan data mock
    const mockResults = [
      {
        id: `search_${Date.now()}_1`,
        title: `${query} - Video Result 1`,
        thumbnail: `https://via.placeholder.com/320x180/6366f1/ffffff?text=${encodeURIComponent(query)}+1`,
        duration: Math.floor(Math.random() * 7200) + 300,
        views: Math.floor(Math.random() * 10000000),
        uploadDate: this.getRandomDate(),
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: `Video hasil pencarian untuk "${query}". Ini adalah konten demo yang menunjukkan hasil pencarian API.`,
        quality: ['1080p', '720p', '480p', '360p'],
        formats: ['MP4', 'WEBM']
      },
      {
        id: `search_${Date.now()}_2`,
        title: `${query} - Video Result 2`,
        thumbnail: `https://via.placeholder.com/320x180/8b5cf6/ffffff?text=${encodeURIComponent(query)}+2`,
        duration: Math.floor(Math.random() * 7200) + 300,
        views: Math.floor(Math.random() * 10000000),
        uploadDate: this.getRandomDate(),
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        description: `Video hasil pencarian untuk "${query}". Konten demo dengan kualitas streaming tinggi.`,
        quality: ['1080p', '720p', '480p', '360p'],
        formats: ['MP4', 'WEBM']
      },
      {
        id: `search_${Date.now()}_3`,
        title: `${query} - Video Result 3`,
        thumbnail: `https://via.placeholder.com/320x180/ec4899/ffffff?text=${encodeURIComponent(query)}+3`,
        duration: Math.floor(Math.random() * 7200) + 300,
        views: Math.floor(Math.random() * 10000000),
        uploadDate: this.getRandomDate(),
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        description: `Video hasil pencarian untuk "${query}". Demo streaming tanpa iklan.`,
        quality: ['1080p', '720p', '480p', '360p'],
        formats: ['MP4', 'WEBM']
      }
    ]

    // Simulasi delay API
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      success: true,
      data: mockResults,
      pagination: {
        page,
        limit,
        total: mockResults.length,
        hasMore: false
      }
    }
  }

  // Simulasi mendapatkan trending videos
  async getTrendingVideos(limit = 20) {
    const trendingVideos = [
      {
        id: 'trending_1',
        title: "Trending Video 1 - Viral Content",
        thumbnail: "https://via.placeholder.com/320x180/f59e0b/ffffff?text=Trending+1",
        duration: 4200,
        views: 5000000,
        uploadDate: "1 hari lalu",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: "Video trending terpopuler hari ini dengan jutaan views.",
        quality: ['1080p', '720p', '480p', '360p'],
        formats: ['MP4', 'WEBM']
      },
      {
        id: 'trending_2',
        title: "Trending Video 2 - Popular Now",
        thumbnail: "https://via.placeholder.com/320x180/10b981/ffffff?text=Trending+2",
        duration: 3600,
        views: 3200000,
        uploadDate: "2 hari lalu",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        description: "Konten viral yang sedang trending di platform.",
        quality: ['1080p', '720p', '480p', '360p'],
        formats: ['MP4', 'WEBM']
      },
      {
        id: 'trending_3',
        title: "Trending Video 3 - Must Watch",
        thumbnail: "https://via.placeholder.com/320x180/ef4444/ffffff?text=Trending+3",
        duration: 2800,
        views: 2800000,
        uploadDate: "3 hari lalu",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        description: "Video wajib tonton yang sedang viral.",
        quality: ['1080p', '720p', '480p', '360p'],
        formats: ['MP4', 'WEBM']
      },
      {
        id: 'trending_4',
        title: "Trending Video 4 - Hot Topic",
        thumbnail: "https://via.placeholder.com/320x180/8b5cf6/ffffff?text=Trending+4",
        duration: 5400,
        views: 4100000,
        uploadDate: "4 hari lalu",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        description: "Topik hangat yang sedang dibicarakan banyak orang.",
        quality: ['1080p', '720p', '480p', '360p'],
        formats: ['MP4', 'WEBM']
      }
    ]

    await new Promise(resolve => setTimeout(resolve, 800))

    return {
      success: true,
      data: trendingVideos.slice(0, limit)
    }
  }

  // Simulasi mendapatkan detail video
  async getVideoDetails(videoId) {
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      success: true,
      data: {
        id: videoId,
        streamingUrls: {
          '1080p': "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          '720p': "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          '480p': "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          '360p': "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
        },
        downloadUrls: {
          '1080p': "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          '720p': "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          '480p': "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          '360p': "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
        }
      }
    }
  }

  // Simulasi validasi API key
  async validateApiKey() {
    if (!this.apiKey || this.apiKey.length < 10) {
      return {
        success: false,
        error: 'API key tidak valid atau terlalu pendek'
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      success: true,
      data: {
        valid: true,
        plan: 'Premium',
        dailyLimit: 1000,
        usedToday: Math.floor(Math.random() * 100)
      }
    }
  }

  // Helper method untuk generate random date
  getRandomDate() {
    const days = Math.floor(Math.random() * 30) + 1
    return `${days} hari lalu`
  }

  // Simulasi download video
  async downloadVideo(videoId, quality = '720p') {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const details = await this.getVideoDetails(videoId)
    if (details.success) {
      return {
        success: true,
        downloadUrl: details.data.downloadUrls[quality],
        filename: `video_${videoId}_${quality}.mp4`
      }
    }

    return {
      success: false,
      error: 'Gagal mendapatkan URL download'
    }
  }
}

export default VideoStreamingAPI

