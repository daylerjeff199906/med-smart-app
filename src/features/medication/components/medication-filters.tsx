"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import type { MedicationForm, DoseUnit, MedicationFrequency } from "../types/medication"

export interface Medication {
    id: string
    name: string
    form: MedicationForm
    dose_amount: number
    dose_unit: DoseUnit
    frequency: MedicationFrequency
    frequency_interval?: number | null
    frequency_days?: number[] | null
    specific_times?: string[] | null
    times_of_day?: string[] | null
    instructions?: string | null
    current_stock: number
    low_stock_threshold: number
    expiration_date?: string | null
    start_date: string
    end_date?: string | null
    notify_via_email: boolean
    sync_to_calendar: boolean
    is_active: boolean
}

interface MedicationFiltersProps {
    onLoading?: (loading: boolean) => void
}

type FilterType = "all" | "active" | "inactive" | "low_stock" | "expiring_soon"

const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "active", label: "Activos" },
    { value: "inactive", label: "Inactivos" },
    { value: "low_stock", label: "Stock bajo" },
    { value: "expiring_soon", label: "Por caducar" },
]

export function MedicationFilters({ onLoading }: MedicationFiltersProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    const initialQuery = searchParams.get("q") || ""
    const initialFilter = (searchParams.get("filter") as FilterType) || "all"
    
    const [searchQuery, setSearchQuery] = useState(initialQuery)
    const [activeFilter, setActiveFilter] = useState<FilterType>(initialFilter)
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

    const handleSearch = (query: string, filter: FilterType) => {
        let url = pathname
        
        const params = new URLSearchParams()
        if (query) params.set("q", query)
        if (filter && filter !== "all") params.set("filter", filter)
        
        const queryString = params.toString()
        if (queryString) {
            url += "?" + queryString
        }
        
        router.push(url)
        router.refresh()
    }

    const handleFilterClick = (filter: FilterType) => {
        setActiveFilter(filter)
        handleSearch(searchQuery, filter)
    }

    const handleSearchInputChange = (value: string) => {
        setSearchQuery(value)
        
        if (debounceTimer) {
            clearTimeout(debounceTimer)
        }
        
        const timer = setTimeout(() => {
            handleSearch(value, activeFilter)
        }, 500)
        
        setDebounceTimer(timer)
    }

    const handleClearSearch = () => {
        setSearchQuery("")
        handleSearch("", activeFilter)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Buscar medicamentos..."
                        value={searchQuery}
                        onChange={(e) => handleSearchInputChange(e.target.value)}
                        className="pl-10 pr-10 h-10"
                    />
                    {searchQuery && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => handleFilterClick(filter.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeFilter === filter.value
                                ? "bg-primary text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
