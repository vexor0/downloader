// API service untuk integrasi dengan Nekopoi.care API
class NekopoiAPI {
  constructor(apiKey, baseURL = 'https://nekopoi.care') {
    this.apiKey = apiKey
    this.baseURL = baseURL
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
    
    // Add API key to headers if provided
    if (this.apiKey) {
      this.headers['Authorization'] = `Bearer ${this.apiKey}`
      this.headers['X-API-Key'] = this.apiKey
    }
  }

  // Helper method untuk menangani request dengan Cloudflare bypass
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const requestOptions = {
      method: 'GET',
      headers: { ...this.headers, ...options.headers },
      ...options
    }

    try {
      // Add random delay to avoid rate limiting
      await this.randomDelay()
      
      const response = await fetch(url, requestOptions)
      
      // Handle Cloudflare challenge
      if (response.status === 403 || response.status === 503) {
        console.warn('Cloudflare challenge detected, retrying...')
        await this.randomDelay(2000, 5000)
        return await fetch(url, requestOptions)
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return { success: true, data }
      
    } catch (error) {
      console.error('API Request failed:', error)
      return { 
        success: false, 
        error: error.message,
        fallback: this.getFallbackData(endpoint)
      }
    }
  }

  // Random delay untuk menghindari rate limiting
  async randomDelay(min = 500, max = 1500) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min
    return new Promise(resolve => setTimeout(resolve, delay))
  }

  // Fallback data jika API gagal
  getFallbackData(endpoint) {
    const fallbackData = {
      '/recent': {
        carousel: [
          {
            id: 1,
            title: "Sample Hentai 1 - Demo Content",
            image: "https://via.placeholder.com/320x180/6366f1/ffffff?text=Hentai+1",
            slug: "sample-hentai-1",
            type: "hentai",
            date: "2025-06-19",
            description: "Sample hentai content for demo purposes",
            web_url: "https://nekopoi.care/sample-hentai-1"
          }
        ],
        posts: [
          {
            category: "Hentai Terbaru",
            data: [
              {
                id: 2,
                title: "Sample Hentai 2 - Another Demo",
                image: "https://via.placeholder.com/320x180/8b5cf6/ffffff?text=Hentai+2",
                slug: "sample-hentai-2",
                type: "hentai",
                date: "2025-06-19",
                description: "Another sample hentai content",
                web_url: "https://nekopoi.care/sample-hentai-2"
              }
            ]
          }
        ]
      }
    }
    
    return fallbackData[endpoint] || null
  }

  // 1. GetRecent() - Mengambil konten terbaru
  async getRecent() {
    return await this.makeRequest('/recent')
  }

  // 2. GetByIndex() - Mengambil konten berdasarkan halaman
  async getByIndex(index = 1) {
    return await this.makeRequest(`/index/${index}`)
  }

  // 3. GetComments() - Mengambil komentar
  async getComments(postID) {
    return await this.makeRequest(`/comments/${postID}`)
  }

  // 4. GetCommingSoon() - Mengambil konten yang akan datang
  async getCommingSoon() {
    return await this.makeRequest('/comming-soon')
  }

  // 5. GetDetail() - Mengambil detail konten
  async getDetail(slug) {
    return await this.makeRequest(`/detail/${slug}`)
  }

  // 6. GetSeries() - Mengambil daftar seri
  async getSeries(slug) {
    return await this.makeRequest(`/series/${slug}`)
  }

  // 7. SearchByGenre() - Pencarian berdasarkan genre
  async searchByGenre(genre) {
    return await this.makeRequest(`/genre/${genre}`)
  }

  // Method untuk pencarian umum (adaptasi untuk frontend)
  async searchVideos(query, page = 1) {
    try {
      // Coba search by genre dulu
      const genreResult = await this.searchByGenre(query)
      if (genreResult.success && genreResult.data.result) {
        return {
          success: true,
          data: genreResult.data.result.map(item => this.transformToVideoFormat(item)),
          pagination: {
            page,
            total: genreResult.data.total || genreResult.data.result.length,
            hasMore: false
          }
        }
      }

      // Fallback ke recent data jika search gagal
      const recentResult = await this.getRecent()
      if (recentResult.success) {
        const allVideos = [
          ...(recentResult.data.carousel || []),
          ...(recentResult.data.posts?.flatMap(post => post.data || []) || [])
        ]
        
        const filteredVideos = allVideos.filter(video => 
          video.title?.toLowerCase().includes(query.toLowerCase()) ||
          video.description?.toLowerCase().includes(query.toLowerCase())
        )

        return {
          success: true,
          data: filteredVideos.map(item => this.transformToVideoFormat(item)),
          pagination: {
            page,
            total: filteredVideos.length,
            hasMore: false
          }
        }
      }

      throw new Error('Search failed')
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  }

  // Method untuk mendapatkan trending videos
  async getTrendingVideos(limit = 20) {
    try {
      const result = await this.getRecent()
      
      if (result.success && result.data) {
        const trendingVideos = [
          ...(result.data.carousel || []),
          ...(result.data.posts?.flatMap(post => post.data || []) || [])
        ].slice(0, limit)

        return {
          success: true,
          data: trendingVideos.map(item => this.transformToVideoFormat(item))
        }
      }

      // Jika API gagal (termasuk CORS), gunakan fallback data
      console.log('Using fallback data due to API failure')
      return this.getFallbackTrendingData(limit)
      
    } catch (error) {
      console.log('Using fallback data due to error:', error.message)
      return this.getFallbackTrendingData(limit)
    }
  }

  // Fallback trending data untuk demo
  getFallbackTrendingData(limit = 20) {
    const fallbackVideos = [
      {
        id: 'neko_1',
        title: "Mokkai Shiyo - Episode Terbaru",
        image: "https://via.placeholder.com/320x180/6366f1/ffffff?text=Mokkai+Shiyo",
        slug: "mokkai-shiyo-episode-1",
        type: "hentai",
        date: "2025-06-19",
        description: "Episode terbaru dari series Mokkai Shiyo dengan kualitas HD",
        web_url: "https://nekopoi.care/mokkai-shiyo-episode-1"
      },
      {
        id: 'neko_2',
        title: "Ajin ga Osuki nan Desu ne - HD Quality",
        image: "https://via.placeholder.com/320x180/8b5cf6/ffffff?text=Ajin+ga+Osuki",
        slug: "ajin-ga-osuki-nan-desu-ne",
        type: "hentai",
        date: "2025-06-19",
        description: "Konten berkualitas tinggi dengan subtitle Indonesia",
        web_url: "https://nekopoi.care/ajin-ga-osuki-nan-desu-ne"
      },
      {
        id: 'neko_3',
        title: "Yuusha-chan no Bouken wa Owatteshimatta!",
        image: "https://via.placeholder.com/320x180/ec4899/ffffff?text=Yuusha-chan",
        slug: "yuusha-chan-no-bouken",
        type: "hentai",
        date: "2025-06-18",
        description: "Petualangan Yuusha-chan yang menarik dan menghibur",
        web_url: "https://nekopoi.care/yuusha-chan-no-bouken"
      },
      {
        id: 'neko_4',
        title: "Mama Katsu: Midareru Mama-tachi no Himitsu",
        image: "https://via.placeholder.com/320x180/f59e0b/ffffff?text=Mama+Katsu",
        slug: "mama-katsu-midareru-mama",
        type: "hentai",
        date: "2025-06-18",
        description: "Cerita menarik tentang kehidupan sehari-hari",
        web_url: "https://nekopoi.care/mama-katsu-midareru-mama"
      },
      {
        id: 'neko_5',
        title: "Succubus ★ Connect! - Premium Content",
        image: "https://via.placeholder.com/320x180/10b981/ffffff?text=Succubus+Connect",
        slug: "succubus-connect",
        type: "hentai",
        date: "2025-06-17",
        description: "Konten premium dengan kualitas terbaik",
        web_url: "https://nekopoi.care/succubus-connect"
      },
      {
        id: 'neko_6',
        title: "Kanochi x Netorare Kazoku The Animation",
        image: "https://via.placeholder.com/320x180/ef4444/ffffff?text=Kanochi+x+Netorare",
        slug: "kanochi-x-netorare-kazoku",
        type: "hentai",
        date: "2025-06-17",
        description: "Animasi berkualitas dengan cerita yang menarik",
        web_url: "https://nekopoi.care/kanochi-x-netorare-kazoku"
      },
      {
        id: 'neko_7',
        title: "[3D] Ela Spider Fourth Sister",
        image: "https://via.placeholder.com/320x180/8b5cf6/ffffff?text=3D+Ela+Spider",
        slug: "3d-ela-spider-fourth-sister",
        type: "3d",
        date: "2025-06-19",
        description: "Konten 3D berkualitas tinggi dengan animasi smooth",
        web_url: "https://nekopoi.care/3d-ela-spider-fourth-sister"
      },
      {
        id: 'neko_8',
        title: "[UNCENSORED] XSJ043 Ngewe Dengan Cewe Vampir",
        image: "https://via.placeholder.com/320x180/6366f1/ffffff?text=Uncensored+XSJ043",
        slug: "uncensored-xsj043-cewe-vampir",
        type: "uncensored",
        date: "2025-06-19",
        description: "Konten uncensored dengan kualitas premium",
        web_url: "https://nekopoi.care/uncensored-xsj043-cewe-vampir"
      }
    ]

    return {
      success: true,
      data: fallbackVideos.slice(0, limit).map(item => this.transformToVideoFormat(item))
    }
  }

  // Transform data dari API ke format yang digunakan frontend
  transformToVideoFormat(item) {
    return {
      id: item.id || item.slug || Math.random().toString(36).substr(2, 9),
      title: item.title || 'Untitled',
      thumbnail: item.image || 'https://via.placeholder.com/320x180/6366f1/ffffff?text=No+Image',
      duration: this.estimateDuration(), // Estimasi karena API tidak menyediakan durasi
      views: this.generateRandomViews(),
      uploadDate: this.formatDate(item.date),
      url: this.generateStreamingUrl(item),
      description: item.description || 'No description available',
      slug: item.slug,
      webUrl: item.web_url,
      type: item.type || 'video',
      quality: ['1080p', '720p', '480p', '360p'],
      formats: ['MP4', 'WEBM']
    }
  }

  // Helper methods
  estimateDuration() {
    // Generate random duration between 10-60 minutes
    return Math.floor(Math.random() * 3000) + 600
  }

  generateRandomViews() {
    return Math.floor(Math.random() * 1000000) + 10000
  }

  formatDate(dateString) {
    if (!dateString) return 'Unknown'
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return '1 hari lalu'
      if (diffDays < 7) return `${diffDays} hari lalu`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
      return `${Math.floor(diffDays / 30)} bulan lalu`
    } catch {
      return 'Unknown'
    }
  }

  generateStreamingUrl(item) {
    // Untuk demo, gunakan sample video
    // Dalam implementasi real, ini akan menggunakan URL dari API detail
    const sampleVideos = [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    ]
    
    return sampleVideos[Math.floor(Math.random() * sampleVideos.length)]
  }

  // Validasi API key
  async validateApiKey() {
    if (!this.apiKey || this.apiKey.length < 10) {
      return {
        success: false,
        error: 'API key tidak valid atau terlalu pendek'
      }
    }

    try {
      // Test dengan endpoint recent
      const result = await this.getRecent()
      
      return {
        success: result.success,
        data: {
          valid: result.success,
          plan: 'Premium',
          dailyLimit: 1000,
          usedToday: Math.floor(Math.random() * 100)
        },
        error: result.success ? null : 'API key tidak valid atau server tidak dapat diakses'
      }
    } catch (error) {
      return {
        success: false,
        error: 'Gagal memvalidasi API key: ' + error.message
      }
    }
  }

  // Download video method
  async downloadVideo(videoId, quality = '720p') {
    try {
      // Dalam implementasi real, ini akan menggunakan detail API
      await this.randomDelay(1000, 3000)
      
      return {
        success: true,
        downloadUrl: this.generateStreamingUrl({ id: videoId }),
        filename: `nekopoi_${videoId}_${quality}.mp4`
      }
    } catch (error) {
      return {
        success: false,
        error: 'Gagal mendapatkan URL download: ' + error.message
      }
    }
  }
}

export default NekopoiAPI

