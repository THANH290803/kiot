'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/features/user/components/header'
import { SearchBar } from '@/features/user/components/search-bar'
import { FilterPanel } from '@/features/user/components/filter-panel'
import { ProductGrid } from '@/features/user/components/product-grid'
import { Footer } from '@/features/user/components/footer'
import { mockProducts } from '@/features/user/lib/mock-data'

export default function ShopPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Tất cả')
    const [selectedSize, setSelectedSize] = useState<string[]>([])
    const [selectedColor, setSelectedColor] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])
    const [sortBy, setSortBy] = useState('latest')

    // Filter and search logic
    const filteredProducts = useMemo(() => {
        let filtered = mockProducts

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Category filter
        if (selectedCategory !== 'Tất cả') {
            filtered = filtered.filter((product) =>
                product.category.includes(selectedCategory)
            )
        }

        // Price filter
        filtered = filtered.filter(
            (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
        )

        // Sort
        if (sortBy === 'price-low') {
            filtered.sort((a, b) => a.price - b.price)
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => b.price - a.price)
        } else if (sortBy === 'popular') {
            filtered.sort((a, b) => b.reviews - a.reviews)
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating)
        }

        return filtered
    }, [searchTerm, selectedCategory, priceRange, sortBy])

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary to-accent text-white py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                        Cửa hàng của chúng tôi
                    </h1>
                    <p className="text-gray-100">
                        Tìm kiếm và khám phá các sản phẩm thời trang yêu thích của bạn
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Bar */}
                <div className="mb-8">
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                </div>

                {/* Products Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <FilterPanel
                            selectedCategory={selectedCategory}
                            selectedSize={selectedSize}
                            selectedColor={selectedColor}
                            priceRange={priceRange}
                            onCategoryChange={setSelectedCategory}
                            onSizeChange={setSelectedSize}
                            onColorChange={setSelectedColor}
                            onPriceChange={setPriceRange}
                        />
                    </aside>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {/* Sort Options */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-sm text-muted-foreground">
                                Tìm thấy <span className="font-semibold text-foreground">{filteredProducts.length}</span> sản phẩm
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                            >
                                <option value="latest">Mới nhất</option>
                                <option value="popular">Phổ biến nhất</option>
                                <option value="rating">Đánh giá cao</option>
                                <option value="price-low">Giá: Thấp đến cao</option>
                                <option value="price-high">Giá: Cao đến thấp</option>
                            </select>
                        </div>

                        {/* Products Grid */}
                        <ProductGrid products={filteredProducts} />

                        {/* Mobile Filters Button */}
                        <div className="lg:hidden mt-8 text-center">
                            <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                                Hiển thị bộ lọc
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
