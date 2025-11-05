"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { School } from "@/types/school"

interface SchoolSearchProps {
  onSchoolSelect: (school: School) => void
}

export function SchoolSearch({ onSchoolSelect }: SchoolSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<School[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    // TODO: バックエンド実装後にAPIコールを追加
    // 現在はモックデータを表示
    setTimeout(() => {
      setSearchResults([
        {
          id: "school-001",
          name: "東京ピアノアカデミー",
          location: "東京都渋谷区",
        },
        {
          id: "school-002",
          name: "音楽の森ピアノ教室",
          location: "東京都新宿区",
        },
      ])
      setIsSearching(false)
    }, 500)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="スクール名や地域で検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "検索中..." : "検索"}
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2">
          {searchResults.map((school) => (
            <Card
              key={school.id}
              className="cursor-pointer p-4 transition-colors hover:bg-accent"
              onClick={() => onSchoolSelect(school)}
            >
              <h3 className="font-semibold">{school.name}</h3>
              <p className="text-sm text-muted-foreground">{school.location}</p>
              <p className="mt-1 text-xs text-muted-foreground">ID: {school.id}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
