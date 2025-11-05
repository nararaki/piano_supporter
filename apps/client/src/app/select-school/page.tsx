"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SchoolSearch } from "./_components/school-search"
import { SchoolIdInput } from "./_components/school-id-input"
import type { School } from "@/types/school"

export default function SelectSchoolPage() {
  const router = useRouter()
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school)

    // スクール選択後の処理（例：次のページへ遷移）
    console.log("[v0] Selected school:", school)

    // TODO: スクール情報を保存してから次のページへ遷移
    // 例: await saveUserSchool(school.id);
    // router.push('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">スクールを選択</CardTitle>
          <CardDescription>通われるピアノ教室を検索するか、スクールIDを入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">スクール検索</TabsTrigger>
              <TabsTrigger value="id">スクールID入力</TabsTrigger>
            </TabsList>
            <TabsContent value="search" className="mt-6">
              <SchoolSearch onSchoolSelect={handleSchoolSelect} />
            </TabsContent>
            <TabsContent value="id" className="mt-6">
              <SchoolIdInput onSchoolSelect={handleSchoolSelect} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
