import { useState, useEffect } from 'react';
import { Link, useParams, Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { getGalleryCategories, getGalleryCategoryBySlug, GalleryCategory } from '../../lib/firestore';

export function Gallery() {
  return (
    <Routes>
      <Route index element={<GalleryList />} />
      <Route path=":slug" element={<GalleryView />} />
    </Routes>
  );
}

function GalleryList() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getGalleryCategories(true); // Only visible categories
      setCategories(data);
    } catch (error) {
      console.error('Error loading gallery categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-4 px-4">
        <div className="text-center py-8">Loading galleries...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center py-4 px-4">
      <div className="w-full max-w-6xl px-8 py-8 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md rounded-3xl shadow-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
            Photo Galleries
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore my photography collections
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No galleries available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/gallery/${category.slug}`}
                className="block group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {category.coverImage && (
                    <div className="aspect-[16/9] overflow-hidden rounded-t-xl">
                      <img
                        src={category.coverImage}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {category.description}
                      </p>
                    )}
                    {category.imageCount !== undefined && category.imageCount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {category.imageCount} {category.imageCount === 1 ? 'photo' : 'photos'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface Location {
  folder: string;
  displayName: string;
  dateCode: string;
  images: string[];
  imageCount: number;
  coverImage: string;
}

interface LocationsData {
  generatedAt: string;
  totalLocations: number;
  totalImages: number;
  locations: Location[];
}

function GalleryView() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<GalleryCategory | null>(null);
  const [locationsData, setLocationsData] = useState<LocationsData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, [slug]);

  const loadGallery = async () => {
    if (!slug) return;

    try {
      const categoryData = await getGalleryCategoryBySlug(slug);
      if (categoryData) {
        setCategory(categoryData);

        // Try to load locations.json for structured galleries like AsiaTrip
        if (categoryData.folderPath === 'AsiaTrip') {
          try {
            const response = await fetch(`/images/gallery/${categoryData.folderPath}/locations.json`);
            if (response.ok) {
              const data = await response.json();
              setLocationsData(data);
            }
          } catch (error) {
            console.log('No locations.json found, using simple gallery mode');
          }
        }
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-4 px-4">
        <div className="text-center py-8">Loading gallery...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="h-full flex items-center justify-center py-4 px-4">
        <div className="w-full max-w-4xl px-8 py-8 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md rounded-3xl shadow-2xl text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Gallery Not Found</h1>
          <p className="text-muted-foreground mb-6">This gallery doesn't exist or is no longer available.</p>
          <Link
            to="/gallery"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Galleries
          </Link>
        </div>
      </div>
    );
  }

  // If we have locations data (like AsiaTrip), show location-based view
  if (locationsData && !selectedLocation) {
    return (
      <div className="h-full flex items-center justify-center py-4 px-4">
        <div className="w-full max-w-7xl px-8 py-8 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md rounded-3xl shadow-2xl space-y-8">
          <div>
            <Link
              to="/gallery"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-2 inline-block"
            >
              ← Back to Galleries
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-2">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-muted-foreground">{category.description}</p>
            )}
            <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
              <Badge variant="secondary">{locationsData.totalLocations} locations</Badge>
              <Badge variant="secondary">{locationsData.totalImages} photos</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {locationsData.locations.map((location) => (
              <button
                key={location.folder}
                onClick={() => setSelectedLocation(location)}
                className="block group text-left"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="aspect-square overflow-hidden rounded-t-xl">
                    <img
                      src={location.coverImage}
                      alt={location.displayName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {location.displayName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {location.imageCount} {location.imageCount === 1 ? 'photo' : 'photos'}
                    </p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Location detail view (when a location is selected)
  if (selectedLocation) {
    return (
      <div className="h-full flex items-center justify-center py-4 px-4">
        <div className="w-full max-w-7xl px-8 py-8 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md rounded-3xl shadow-2xl space-y-8">
          <div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-2 inline-block"
            >
              ← Back to Locations
            </button>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-2">
              {selectedLocation.displayName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {selectedLocation.imageCount} {selectedLocation.imageCount === 1 ? 'photo' : 'photos'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedLocation.images.map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${selectedLocation.displayName} - ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          {/* Lightbox Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
              <img
                src={selectedImage}
                alt="Full size"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Simple gallery view (for non-structured galleries)
  return (
    <div className="h-full flex items-center justify-center py-4 px-4">
      <div className="w-full max-w-7xl px-8 py-8 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md rounded-3xl shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/gallery"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-2 inline-block"
            >
              ← Back to Galleries
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-muted-foreground mt-2">{category.description}</p>
            )}
          </div>
        </div>

        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <p className="text-muted-foreground">
            Gallery structure not yet loaded. Add a locations.json file or implement custom gallery view.
          </p>
        </div>
      </div>
    </div>
  );
}
