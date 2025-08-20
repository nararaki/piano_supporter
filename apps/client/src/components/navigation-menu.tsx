"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  Search,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  Bookmark,
  TrendingUp,
  MessageSquare,
} from "lucide-react"

interface NavigationMenuProps {
  userEmail: string
  onLogout: () => void
}

export default function NavigationMenu({ userEmail, onLogout }: NavigationMenuProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const navigationItems = [
    { icon: Home, label: "ホーム", href: "/home" },
    { icon: Search, label: "検索", href: "/search" },
    { icon: Bell, label: "通知", href: "/notifications" },
    { icon: MessageSquare, label: "メッセージ", href: "/messages" },
    { icon: Bookmark, label: "ブックマーク", href: "/bookmarks" },
    { icon: TrendingUp, label: "トレンド", href: "/trending" },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <nav className="flex items-center gap-6">
          {navigationItems.slice(1, 3).map((item) => (
            <Button key={item.label} variant="ghost" size="sm" className="gap-2">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle className="text-left">メニュー</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => setIsSheetOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              ))}
              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => setIsSheetOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  設定
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => setIsSheetOpen(false)}
                >
                  <HelpCircle className="h-5 w-5" />
                  ヘルプ
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setIsSheetOpen(false)
                    onLogout()
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  ログアウト
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/diverse-user-avatars.png" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">あなた</p>
                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>プロフィール</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>設定</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>ヘルプ</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>ログアウト</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
