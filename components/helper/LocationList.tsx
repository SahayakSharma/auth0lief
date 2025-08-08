'use client'

import { DocumentData } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Navigation, Clock, Calendar, Globe, MoreHorizontal, ExternalLink } from "lucide-react"

export default function LocationList({ locations }: { locations: DocumentData[] }) {
    
    // Enhanced timestamp handling for both Firestore serverTimestamp and Date objects
    const parseTimestamp = (timestamp: any): Date | null => {
        if (!timestamp) return null
        
        // Handle Firestore Timestamp objects
        if (timestamp && typeof timestamp.toDate === 'function') {
            return timestamp.toDate()
        }
        
        // Handle Firestore Timestamp with seconds/nanoseconds
        if (timestamp && timestamp.seconds) {
            return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000)
        }
        
        // Handle regular Date objects or date strings
        if (timestamp instanceof Date) {
            return timestamp
        }
        
        // Handle date strings or numbers
        try {
            const date = new Date(timestamp)
            return isNaN(date.getTime()) ? null : date
        } catch (error) {
            console.warn('Invalid timestamp format:', timestamp)
            return null
        }
    }
    
    const formatDate = (timestamp: any) => {
        const date = parseTimestamp(timestamp)
        if (!date) return 'N/A'
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatTime = (timestamp: any) => {
        const date = parseTimestamp(timestamp)
        if (!date) return 'N/A'
        
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDateTime = (timestamp: any) => {
        const date = parseTimestamp(timestamp)
        if (!date) return 'N/A'
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatCoordinates = (lat: number, lng: number) => {
        const latDir = lat >= 0 ? 'N' : 'S'
        const lngDir = lng >= 0 ? 'E' : 'W'
        return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lng).toFixed(2)}°${lngDir}`
    }

    const openInMaps = (lat: number, lng: number, city: string, state: string) => {
        const query = encodeURIComponent(`${city}, ${state}`)
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${query}`
        window.open(url, '_blank')
    }

    // Helper function to get relative time
    const getRelativeTime = (timestamp: any) => {
        const date = parseTimestamp(timestamp)
        if (!date) return 'Unknown'
        
        const now = new Date()
        const diffInMs = now.getTime() - date.getTime()
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
        
        if (diffInDays === 0) return 'Today'
        if (diffInDays === 1) return 'Yesterday'
        if (diffInDays < 7) return `${diffInDays} days ago`
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
        return `${Math.floor(diffInDays / 365)} years ago`
    }

    if (!locations || locations.length === 0) {
        return (
            <main className="min-h-screen p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No locations found</h3>
                        <p className="text-gray-600">Add locations to see them displayed here.</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-black mb-4">
                        Our <span className="relative">
                            Locations
                            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-black rounded-full"></div>
                        </span>
                    </h1>
                    <Badge variant="outline" className="mt-4 border-black text-black">
                        {locations.length} Active {locations.length === 1 ? 'Location' : 'Locations'}
                    </Badge>
                </div>

                {/* Locations Grid - Optimized for 4-5 items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {locations.map((location, index) => (
                        <Card 
                            key={location.id || index} 
                            className="group relative overflow-hidden border-2 border-gray-200 hover:border-black transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 bg-white"
                        >
                            {/* Animated Background Pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-black/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Decorative Map-like Pattern */}
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                <div className="absolute inset-0 bg-black rounded-full scale-50 group-hover:scale-75 transition-transform duration-500"></div>
                                <div className="absolute inset-4 border-2 border-black rounded-full"></div>
                                <div className="absolute inset-8 border border-black rounded-full"></div>
                            </div>

                            <CardHeader className="relative z-10 pb-4">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-black group-hover:bg-gray-800 transition-colors duration-300 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-black group-hover:text-gray-900 transition-colors">
                                                {location.city}
                                            </CardTitle>
                                            <CardDescription className="text-gray-600 font-medium">
                                                {location.state}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge 
                                        variant="secondary" 
                                        className="bg-green-100 text-green-800 group-hover:bg-green-500 group-hover:text-white transition-all duration-300"
                                    >
                                        Active
                                    </Badge>
                                </div>

                                <Separator className="group-hover:bg-black/20 transition-colors duration-300" />
                            </CardHeader>

                            <CardContent className="relative z-10 space-y-4">
                                {/* Coordinates */}
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 group-hover:bg-gray-100 rounded-lg transition-colors duration-300">
                                    <Navigation className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Coordinates</p>
                                        <p className="text-sm text-gray-600 font-mono">
                                            {formatCoordinates(location.lat, location.long)}
                                        </p>
                                    </div>
                                </div>

                                {/* Creation Date with Relative Time */}
                                <div className="flex items-center space-x-3 text-sm">
                                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900">Registered</span>
                                            <Badge variant="outline" className="text-xs">
                                                {getRelativeTime(location.created_at)}
                                            </Badge>
                                        </div>
                                        <span className="text-gray-600">{formatDate(location.created_at)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 text-sm">
                                    <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900">Last Updated</span>
                                            <Badge variant="outline" className="text-xs">
                                                {getRelativeTime(location.updated_at)}
                                            </Badge>
                                        </div>
                                        <span className="text-gray-600">
                                            {formatDateTime(location.updated_at)}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-black/5 group-hover:bg-black/10 rounded-lg p-3 transition-colors duration-300">
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <span className="font-medium text-gray-700">Latitude</span>
                                            <p className="font-mono text-gray-900">{location.lat}°</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Longitude</span>
                                            <p className="font-mono text-gray-900">{location.long}°</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="relative z-10 pt-0 flex gap-3">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                                    onClick={() => openInMaps(location.lat, location.long, location.city, location.state)}
                                >
                                    <Globe className="w-4 h-4 mr-2" />
                                    View on Map
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="hover:bg-gray-100 transition-colors duration-300"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </CardFooter>

                            {/* Hover Effect Border */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-black/10 rounded-lg transition-all duration-500 pointer-events-none"></div>
                            
                            {/* Corner Accent */}
                            <div className="absolute top-4 right-4 w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </Card>
                    ))}
                </div>

                {/* Bottom Statistics */}
                {locations.length > 0 && (
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center space-x-8 px-8 py-4 bg-black text-white rounded-full">
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-5 h-5" />
                                <span className="font-medium">{locations.length} Locations</span>
                            </div>
                            <div className="w-px h-6 bg-white/20"></div>
                            <div className="flex items-center space-x-2">
                                <Globe className="w-5 h-5" />
                                <span className="font-medium">
                                    {[...new Set(locations.map(loc => loc.state))].length} 
                                    {[...new Set(locations.map(loc => loc.state))].length === 1 ? ' State' : ' States'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
