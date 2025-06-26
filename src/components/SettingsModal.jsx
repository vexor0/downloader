import { useState } from 'react'
import { X, Key, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [tempApiKey, setTempApiKey] = useState(apiKey || '')

  if (!isOpen) return null

  const handleSave = () => {
    onSaveApiKey(tempApiKey)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Pengaturan API
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
          <div>
            <Label htmlFor="apiKey" className="text-white">
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Masukkan API key Anda..."
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
            <p className="text-gray-400 text-sm mt-2">
              API key diperlukan untuk mengakses video. Pastikan API key valid dan aktif.
            </p>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-white hover:bg-slate-700"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

