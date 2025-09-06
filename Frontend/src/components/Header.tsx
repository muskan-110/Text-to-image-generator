"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'
import { 
  Menu, 
  Settings, 
  UserRound,
  PanelRight
} from 'lucide-react'
import { toast } from 'sonner'

interface ExamplePrompt {
  id: string
  title: string
  prompt: string
}

const examplePrompts: ExamplePrompt[] = [
  {
    id: 'fantasy-quest',
    title: 'Fantasy Quest',
    prompt: 'A young mage discovers an ancient artifact that could save or destroy their kingdom'
  },
  {
    id: 'space-adventure',
    title: 'Space Adventure', 
    prompt: 'The last human colony ship encounters a mysterious alien signal after decades in deep space'
  },
  {
    id: 'detective-mystery',
    title: 'Detective Mystery',
    prompt: 'A detective investigates a series of art thefts where each stolen piece tells part of a larger story'
  },
  {
    id: 'time-travel',
    title: 'Time Travel',
    prompt: 'A historian accidentally activates a time machine and must prevent their own paradox'
  },
  {
    id: 'post-apocalyptic',
    title: 'Post-Apocalyptic',
    prompt: 'Survivors in an underground bunker discover that the surface world has changed in unexpected ways'
  },
  {
    id: 'romantic-comedy',
    title: 'Romantic Comedy',
    prompt: 'Two rival food truck owners are forced to work together at the same festival'
  }
]

interface HeaderSettings {
  defaultStyle: string
  imageSize: string
  contentSafety: boolean
}

export default function Header() {
  const [settings, setSettings] = useState<HeaderSettings>({
    defaultStyle: 'cinematic',
    imageSize: 'medium',
    contentSafety: true
  })

  const handleExampleSelect = (prompt: ExamplePrompt) => {
    navigator.clipboard.writeText(prompt.prompt)
    toast.success(`"${prompt.title}" copied to clipboard`)
  }

  const handleSettingToggle = (key: keyof HeaderSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    if (typeof window !== 'undefined') {
      localStorage.setItem('storyStudioSettings', JSON.stringify(newSettings))
    }
    toast.success('Settings updated')
  }

  const handleNewStory = () => {
    toast.success('Start a new story — your workspace is ready')
  }

  const [isOnline] = useState(true)

  return (
    <header className="h-16 bg-card border-b border-border sticky top-0 z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left: Logo and tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-sm">S</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-heading font-bold text-lg text-foreground">StoryStudio</h1>
            <span className="text-xs text-muted-foreground hidden sm:block">AI-powered storytelling workspace</span>
          </div>
        </div>

        {/* Center: Project title (placeholder for now) */}
        <div className="hidden md:flex flex-1 justify-center max-w-md">
          <div className="text-sm text-muted-foreground">
            Untitled Story
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-2">
          {/* Examples dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Examples
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {examplePrompts.map((example) => (
                <DropdownMenuItem 
                  key={example.id}
                  onClick={() => handleExampleSelect(example)}
                  className="flex flex-col items-start p-3 cursor-pointer"
                >
                  <div className="font-medium text-sm">{example.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {example.prompt}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu for examples */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="sm:hidden">
                <Menu className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {examplePrompts.map((example) => (
                <DropdownMenuItem 
                  key={example.id}
                  onClick={() => handleExampleSelect(example)}
                  className="flex flex-col items-start p-3"
                >
                  <div className="font-medium text-sm">{example.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {example.prompt}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Settings</h4>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Default Style</label>
                    <select 
                      className="w-full mt-1 p-2 text-sm bg-input border border-border rounded-md"
                      value={settings.defaultStyle}
                      onChange={(e) => handleSettingToggle('defaultStyle', e.target.value)}
                    >
                      <option value="cinematic">Cinematic</option>
                      <option value="artistic">Artistic</option>
                      <option value="realistic">Realistic</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground">Image Size</label>
                    <select 
                      className="w-full mt-1 p-2 text-sm bg-input border border-border rounded-md"
                      value={settings.imageSize}
                      onChange={(e) => handleSettingToggle('imageSize', e.target.value)}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Content Safety</label>
                    <button
                      className={`w-10 h-5 rounded-full transition-colors ${
                        settings.contentSafety ? 'bg-primary' : 'bg-muted'
                      }`}
                      onClick={() => handleSettingToggle('contentSafety', !settings.contentSafety)}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.contentSafety ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">N</kbd> New Story
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* New Story button */}
          <Button 
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
            onClick={handleNewStory}
          >
            New Story
          </Button>

          {/* Avatar menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-1">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                  <AvatarFallback>
                    <UserRound className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <UserRound className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PanelRight className="w-4 h-4 mr-2" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}