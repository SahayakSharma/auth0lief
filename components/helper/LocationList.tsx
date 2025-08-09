'use client'

import { DocumentData } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Navigation, Clock, Calendar, Globe, MoreHorizontal, ExternalLink } from "lucide-react"
import LocationCard from "./LocationCard"

export default function LocationList({ locations,removeLocation }: { locations: DocumentData[],removeLocation:(id:string)=>void }) {

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
                        <LocationCard location={location} key={ index } removeLocation={removeLocation}/>
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
