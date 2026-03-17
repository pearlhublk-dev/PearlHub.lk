"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Filter, Star, Heart } from "lucide-react";

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const listingTypes = [
    { id: "all", label: "All", count: 1200 },
    { id: "stay", label: "Stays", count: 500 },
    { id: "vehicle", label: "Vehicles", count: 300 },
    { id: "event", label: "Events", count: 150 },
    { id: "service", label: "Services", count: 250 },
  ];

  const listings = [
    {
      id: 1,
      title: "Luxury Beach Villa - Unawatuna",
      type: "stay",
      location: "Unawatuna, Galle",
      price: 250,
      rating: 4.9,
      reviews: 128,
      image: "/placeholder.jpg",
      amenities: ["Pool", "WiFi", "AC", "Beachfront"],
      featured: true,
    },
    {
      id: 2,
      title: "Toyota Land Cruiser Prado",
      type: "vehicle",
      location: "Colombo",
      price: 120,
      rating: 4.8,
      reviews: 85,
      image: "/placeholder.jpg",
      amenities: ["7 Seats", "AC", "Driver Included"],
      featured: false,
    },
    {
      id: 3,
      title: "Cultural Dance Performance",
      type: "event",
      location: "Kandy",
      price: 45,
      rating: 4.7,
      reviews: 203,
      image: "/placeholder.jpg",
      amenities: ["Traditional", "2 Hours", "VIP Available"],
      featured: true,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Search Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container-custom mx-auto py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Button>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Type Filter */}
      <div className="container-custom mx-auto py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {listingTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.id)}
              className="whitespace-nowrap"
            >
              {type.label}
              <Badge variant="secondary" className="ml-2">
                {type.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="container-custom mx-auto pb-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {listingTypes.find((t) => t.id === selectedType)?.label} Listings
          </h1>
          <p className="text-muted-foreground">Showing {listings.length} results</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="group overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  [Image]
                </div>
                {listing.featured && (
                  <Badge className="absolute top-3 left-3" variant="pearl">
                    Featured
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="mb-2 capitalize">
                      {listing.type}
                    </Badge>
                    <CardTitle className="text-lg">{listing.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {listing.location}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{listing.rating}</span>
                  <span className="text-muted-foreground">({listing.reviews} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {listing.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold">${listing.price}</span>
                    <span className="text-muted-foreground">/night</span>
                  </div>
                  <Button asChild>
                    <Link href={`/listings/${listing.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
