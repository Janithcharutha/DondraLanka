"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import type { NewsBanner } from "@/types/news-banner"

export default function NewsBannersPage() {
  const [loading, setLoading] = useState(true)
  const [newsBanners, setNewsBanners] = useState<NewsBanner[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchNewsBanners = async () => {
      try {
        const response = await fetch('/api/news-banners')
        if (!response.ok) throw new Error('Failed to fetch news banners')
        const data = await response.json()
        setNewsBanners(data)
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "Failed to load news banners",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNewsBanners()
  }, [toast])

  const handleDelete = async (bannerId: string) => {
    try {
      const response = await fetch(`/api/news-banners/${bannerId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete banner')
      }

      // Update local state to remove the deleted banner
      setNewsBanners((current) => 
        current.filter((banner) => banner._id !== bannerId)
      )

      toast({
        title: "Success",
        description: "Banner deleted successfully",
      })
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete banner",
        variant: "destructive",
      })
    }
  }

  const DeleteButton = ({ bannerId }: { bannerId: string }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="text-red-600 hover:text-red-800">
          Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the banner.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => handleDelete(bannerId)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">News Banners</h1>
        <Link
          href="/admin/news-banners/new"
          className="px-4 py-2 bg-[#00957a] text-white rounded-md hover:bg-[#007a64] transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add News Banner
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading news banners...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newsBanners.map((banner) => (
                  <tr key={banner._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-24 flex-shrink-0">
                          <img
                            src={banner.imageUrl}
                            alt="Banner"
                            className="h-16 w-24 object-cover rounded"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        banner.status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : banner.status === 'Scheduled'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(banner.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(banner.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* <Link
                        href={`/admin/news-banners/${banner._id}`}
                        className="text-[#00957a] hover:text-[#007a64] mr-4"
                      >
                        <Edit className="h-4 w-4 inline mr-1" />
                        Edit
                      </Link> */}
                      <DeleteButton bannerId={banner._id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}