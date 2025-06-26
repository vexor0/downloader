import { Search, Settings, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Header({ onSearch, onSettingsClick, searchQuery, setSearchQuery }) {
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Play className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">StreamFree</h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Cari video..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500"
              />
            </div>
          </form>

          {/* Settings Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onSettingsClick}
            className="border-slate-600 text-white hover:bg-slate-800"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

