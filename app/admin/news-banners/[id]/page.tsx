"use client"

import { use, useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Image as ImageIcon, Loader2 } from "lucide-react"
import type { NewsBanner } from "@/types/news-banner"

export default function EditNewsBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [newsBanner, setNewsBanner] = useState<NewsBanner | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchBanner = async () => {
      if (id === 'new') return

      try {
        setLoading(true)
        const response = await fetch(`/api/news-banners/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch banner')
        }

        const data = await response.json()
        setNewsBanner(data)
        setImagePreview(data.imageUrl || '')
      } catch (error) {
        console.error('Error fetching banner:', error)
        toast({
          title: "Error",
          description: "Failed to load banner data",
          variant: "destructive",
        })
        router.push('/admin/news-banners')
      } finally {
        setLoading(false)
      }
    }

    fetchBanner()
  }, [id, toast, router])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadingImage(true)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'tunastore_preset')

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dr5ts47zf/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to upload image')
      }

      const data = await response.json()
      
      if (!data.secure_url) {
        throw new Error('No URL received from Cloudinary')
      }

      setImagePreview(data.secure_url)
      
      // Update the hidden input value
      const imageUrlInput = document.getElementById('imageUrl') as HTMLInputElement
      if (imageUrlInput) {
        imageUrlInput.value = data.secure_url
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        imageUrl: formData.get('imageUrl'),
        startDate: new Date(formData.get('startDate') as string).toISOString(),
        endDate: new Date(formData.get('endDate') as string).toISOString(),
        status: formData.get('status') || 'Active'
      }

      const response = await fetch(
        id === 'new' ? '/api/news-banners' : `/api/news-banners/${id}`,
        {
          method: id === 'new' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save banner')
      }

      toast({
        title: "Success",
        description: `Banner ${id === 'new' ? 'created' : 'updated'} successfully`,
      })

      router.push('/admin/news-banners')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save banner",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/news-banners/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete banner')
      }

      toast({
        title: "Success",
        description: "Banner deleted successfully",
      })

      router.push('/admin/news-banners')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete banner",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id === 'new' ? 'Add Banner' : 'Edit Banner'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <Label htmlFor="image">Banner Image</Label>
          <div className="mt-1 flex items-center space-x-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`
                w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center
                cursor-pointer hover:border-[#00957a] transition-colors
                ${imagePreview ? 'border-[#00957a]' : 'border-gray-300'}
              `}
            >
              {uploadingImage ? (
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              ) : imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              type="hidden"
              id="imageUrl"
              name="imageUrl"
              value={imagePreview || newsBanner?.imageUrl || ''}
            />
            {(imagePreview || newsBanner?.imageUrl) && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview('')
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
                className="text-red-600 hover:text-red-800"
              >
                Remove Image
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Click to upload an image. Maximum file size: 5MB
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="datetime-local"
              defaultValue={newsBanner?.startDate?.slice(0, 16)}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              defaultValue={newsBanner?.endDate?.slice(0, 16)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={newsBanner?.status || 'Active'}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3aaa9e]"
            required
          >
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          {id !== 'new' && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete Banner'}
            </button>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="px-4 py-2 bg-[#00957a] text-white rounded-md hover:bg-[#007a64] transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Banner'}
          </button>
        </div>
      </form>
    </div>
  )
}