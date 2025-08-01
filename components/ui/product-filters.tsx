'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Store,
  Tag,
} from 'lucide-react';

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  categories: Array<{ id: string; name: string; count: number }>;
  stores: Array<{ id: string; name: string; count: number }>;
  selectedCategories: string[];
  selectedStores: string[];
  priceRange: [number, number];
  onCategoryChange: (categoryId: string) => void;
  onStoreChange: (storeId: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  categories,
  stores,
  selectedCategories,
  selectedStores,
  priceRange,
  onCategoryChange,
  onStoreChange,
  onPriceRangeChange,
  onClearFilters,
  isOpen,
  onToggle,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    stores: true,
    price: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedStores.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000;

  return (
    <div className="mb-6">
      {/* Search Bar */}
      <form onSubmit={onSearchSubmit} className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
        <Button type="button" variant="outline" onClick={onToggle}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 p-0 text-xs">
              {selectedCategories.length +
                selectedStores.length +
                (priceRange[0] > 0 ? 1 : 0) +
                (priceRange[1] < 10000 ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </form>

      {/* Filters Panel */}
      {isOpen && (
        <Card className="mb-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onToggle}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <button
                onClick={() => toggleSection('categories')}
                className="flex items-center justify-between w-full text-left font-medium mb-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categories
                </div>
                {expandedSections.categories ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expandedSections.categories && (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(
                          category.id
                        )}
                        onCheckedChange={() =>
                          onCategoryChange(category.id)
                        }
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer">
                        {category.name}
                      </label>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stores */}
            <div>
              <button
                onClick={() => toggleSection('stores')}
                className="flex items-center justify-between w-full text-left font-medium mb-3">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Stores
                </div>
                {expandedSections.stores ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expandedSections.stores && (
                <div className="space-y-2">
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      className="flex items-center space-x-2">
                      <Checkbox
                        id={`store-${store.id}`}
                        checked={selectedStores.includes(store.id)}
                        onCheckedChange={() =>
                          onStoreChange(store.id)
                        }
                      />
                      <label
                        htmlFor={`store-${store.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer">
                        {store.name}
                      </label>
                      <Badge variant="secondary" className="text-xs">
                        {store.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div>
              <button
                onClick={() => toggleSection('price')}
                className="flex items-center justify-between w-full text-left font-medium mb-3">
                <span>Price Range</span>
                {expandedSections.price ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expandedSections.price && (
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={onPriceRangeChange}
                    max={10000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">
                        Min Price
                      </label>
                      <Input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) =>
                          onPriceRangeChange([
                            parseInt(e.target.value) || 0,
                            priceRange[1],
                          ])
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">
                        Max Price
                      </label>
                      <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) =>
                          onPriceRangeChange([
                            priceRange[0],
                            parseInt(e.target.value) || 10000,
                          ])
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((categoryId) => {
            const category = categories.find(
              (c) => c.id === categoryId
            );
            return category ? (
              <Badge
                key={categoryId}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onCategoryChange(categoryId)}>
                {category.name} <X className="h-3 w-3 ml-1" />
              </Badge>
            ) : null;
          })}

          {selectedStores.map((storeId) => {
            const store = stores.find((s) => s.id === storeId);
            return store ? (
              <Badge
                key={storeId}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onStoreChange(storeId)}>
                {store.name} <X className="h-3 w-3 ml-1" />
              </Badge>
            ) : null;
          })}

          {priceRange[0] > 0 && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onPriceRangeChange([0, priceRange[1]])}>
              Min: ₵{priceRange[0]} <X className="h-3 w-3 ml-1" />
            </Badge>
          )}

          {priceRange[1] < 10000 && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() =>
                onPriceRangeChange([priceRange[0], 10000])
              }>
              Max: ₵{priceRange[1]} <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
