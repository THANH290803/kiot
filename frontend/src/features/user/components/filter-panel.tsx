'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface FilterPanelProps {
    selectedCategory: string
    selectedSize: string[]
    selectedColor: string[]
    priceRange: [number, number]
    categoryOptions: string[]
    sizeOptions: string[]
    colorOptions: string[]
    maxPrice: number
    onCategoryChange: (category: string) => void
    onSizeChange: (sizes: string[]) => void
    onColorChange: (colors: string[]) => void
    onPriceChange: (range: [number, number]) => void
}

export function FilterPanel({
                                selectedCategory,
                                selectedSize,
                                selectedColor,
                                priceRange,
                                categoryOptions,
                                sizeOptions,
                                colorOptions,
                                maxPrice,
                                onCategoryChange,
                                onSizeChange,
                                onColorChange,
                                onPriceChange,
                            }: FilterPanelProps) {
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        size: true,
        color: true,
        price: true,
    })

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }))
    }

    const sliderMax = Math.max(10000, maxPrice || 0)

    return (
        <div className="bg-white rounded-lg border border-border p-6 space-y-6 h-fit sticky top-24">
            {/* Category Filter */}
            <div>
                <button
                    onClick={() => toggleSection('category')}
                    className="w-full flex items-center justify-between py-2 font-semibold text-foreground hover:text-accent transition-colors"
                >
                    <span>Danh mục</span>
                    <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                            expandedSections.category ? 'transform rotate-180' : ''
                        }`}
                    />
                </button>
                {expandedSections.category && (
                    <div className="mt-3 space-y-2">
                        {categoryOptions.map((category) => (
                            <label key={category} className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="category"
                                    value={category}
                                    checked={selectedCategory === category}
                                    onChange={(e) => onCategoryChange(e.target.value)}
                                    className="w-4 h-4 text-accent rounded focus:ring-2 focus:ring-accent"
                                />
                                <span className="ml-3 text-sm text-foreground hover:text-accent">
                  {category}
                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Size Filter */}
            <div>
                <button
                    onClick={() => toggleSection('size')}
                    className="w-full flex items-center justify-between py-2 font-semibold text-foreground hover:text-accent transition-colors"
                >
                    <span>Kích thước</span>
                    <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                            expandedSections.size ? 'transform rotate-180' : ''
                        }`}
                    />
                </button>
                {expandedSections.size && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {sizeOptions.map((size) => (
                            <button
                                key={size}
                                onClick={() => {
                                    onSizeChange(
                                        selectedSize.includes(size)
                                            ? selectedSize.filter((s) => s !== size)
                                            : [...selectedSize, size]
                                    )
                                }}
                                className={`px-3 py-1 rounded border transition-all ${
                                    selectedSize.includes(size)
                                        ? 'bg-accent text-white border-accent'
                                        : 'bg-white text-foreground border-border hover:border-accent'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Color Filter */}
            <div>
                <button
                    onClick={() => toggleSection('color')}
                    className="w-full flex items-center justify-between py-2 font-semibold text-foreground hover:text-accent transition-colors"
                >
                    <span>Màu sắc</span>
                    <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                            expandedSections.color ? 'transform rotate-180' : ''
                        }`}
                    />
                </button>
                {expandedSections.color && (
                    <div className="mt-3 space-y-2">
                        {colorOptions.map((color) => (
                            <label key={color} className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedColor.includes(color)}
                                    onChange={() => {
                                        onColorChange(
                                            selectedColor.includes(color)
                                                ? selectedColor.filter((c) => c !== color)
                                                : [...selectedColor, color]
                                        )
                                    }}
                                    className="w-4 h-4 text-accent rounded focus:ring-2 focus:ring-accent"
                                />
                                <span className="ml-3 text-sm text-foreground hover:text-accent">
                  {color}
                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Filter */}
            <div>
                <button
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between py-2 font-semibold text-foreground hover:text-accent transition-colors"
                >
                    <span>Giá tiền</span>
                    <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                            expandedSections.price ? 'transform rotate-180' : ''
                        }`}
                    />
                </button>
                {expandedSections.price && (
                    <div className="mt-3 space-y-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={priceRange[0]}
                                onChange={(e) =>
                                    onPriceChange([parseInt(e.target.value) || 0, priceRange[1]])
                                }
                                className="w-1/2 px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Tối thiểu"
                            />
                            <span className="text-foreground">-</span>
                            <input
                                type="number"
                                value={priceRange[1]}
                                onChange={(e) =>
                                    onPriceChange([priceRange[0], parseInt(e.target.value) || sliderMax])
                                }
                                className="w-1/2 px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Tối đa"
                            />
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={sliderMax}
                            value={priceRange[1]}
                            onChange={(e) =>
                                onPriceChange([priceRange[0], parseInt(e.target.value)])
                            }
                            className="w-full"
                        />
                    </div>
                )}
            </div>

            {/* Clear Filters Button */}
            <button
                onClick={() => {
                    onCategoryChange('Tất cả')
                    onSizeChange([])
                    onColorChange([])
                    onPriceChange([0, sliderMax])
                }}
                className="w-full py-2 px-4 bg-secondary text-foreground rounded-lg hover:bg-accent hover:text-white transition-colors font-medium"
            >
                Xóa lọc
            </button>
        </div>
    )
}
