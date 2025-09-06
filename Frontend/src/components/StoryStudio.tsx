"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Undo, 
  Workflow, 
  PanelRightDashed, 
  Expand, 
  Rotate3d, 
  LayoutPanelTop, 
  Frame, 
  Grid3x2, 
  Shrink, 
  PanelRight, 
  ImagePlay, 
  ZoomIn, 
  TableOfContents 
} from 'lucide-react';
import { toast } from 'sonner';

interface Scene {
  id: string;
  title: string;
  content: string;
  images: { id: string; url: string; alt: string; seed?: string; model?: string; style?: string; }[];
  expanded: boolean;
}

interface StorySettings {
  length: number;
  sceneCount: number | 'auto';
  visualStyle: string;
  characters: string;
  safetyFilter: boolean;
}

interface GenerationStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  message?: string;
}

const GENRE_PRESETS = [
  'Fantasy', 'Sci-fi', 'Mystery', 'Children', 'Educational', 'Romance', 'Thriller', 'Adventure'
];

const VISUAL_STYLES = [
  'Photorealistic', 'Illustration', 'Watercolor', 'Comic', 'Flat', 'Digital Art', 'Oil Painting'
];

const EXAMPLE_PROMPTS = [
  "A young dragon learns to control their fire magic while protecting a village from an ancient curse.",
  "In a future city, an AI detective solves crimes by reading emotional data from digital memories.",
  "Two rival bakers discover they must work together to save their town's annual festival.",
  "A time-traveling librarian accidentally changes history and must fix the timeline before it's too late."
];

export default function StoryStudio() {
  const [prompt, setPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [settings, setSettings] = useState<StorySettings>({
    length: 2, // 0: short, 1: medium, 2: long
    sceneCount: 'auto',
    visualStyle: 'Illustration',
    characters: '',
    safetyFilter: true
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showLog, setShowLog] = useState(false);
  
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; alt: string; sceneId: string; imageId: string; } | null>(null);
  
  const [snapshots, setSnapshots] = useState<{ id: string; name: string; timestamp: Date; scenes: Scene[]; }[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const initializeGenerationSteps = useCallback(() => {
    return [
      { id: 'planning', label: 'Planning story structure', status: 'pending' as const },
      { id: 'writing', label: 'Writing narrative', status: 'pending' as const },
      { id: 'illustrating', label: 'Generating illustrations', status: 'pending' as const }
    ];
  }, []);

  const simulateGeneration = useCallback(async (isDraft: boolean = false) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    const steps = initializeGenerationSteps();
    setGenerationSteps(steps);
    
    try {
      // Planning phase
      setGenerationSteps(prev => prev.map(step => 
        step.id === 'planning' 
          ? { ...step, status: 'active' }
          : step
      ));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationProgress(33);
      
      setGenerationSteps(prev => prev.map(step => 
        step.id === 'planning' 
          ? { ...step, status: 'complete', message: 'Story outline created' }
          : step
      ));

      // Writing phase
      setGenerationSteps(prev => prev.map(step => 
        step.id === 'writing' 
          ? { ...step, status: 'active' }
          : step
      ));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGenerationProgress(66);
      
      setGenerationSteps(prev => prev.map(step => 
        step.id === 'writing' 
          ? { ...step, status: 'complete', message: `${isDraft ? '3' : '5'} scenes written` }
          : step
      ));

      // Illustrating phase
      setGenerationSteps(prev => prev.map(step => 
        step.id === 'illustrating' 
          ? { ...step, status: 'active' }
          : step
      ));
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      setGenerationProgress(100);
      
      setGenerationSteps(prev => prev.map(step => 
        step.id === 'illustrating' 
          ? { ...step, status: 'complete', message: 'All images generated' }
          : step
      ));

      // Generate mock scenes
      const sceneCount = isDraft ? 3 : 5;
      const mockScenes: Scene[] = Array.from({ length: sceneCount }, (_, i) => ({
        id: `scene-${i + 1}`,
        title: `Scene ${i + 1}`,
        content: `This is the generated content for scene ${i + 1}. ${prompt ? `Based on your prompt: "${prompt}"` : 'A captivating narrative unfolds here.'} The story develops with rich detail and engaging characters, creating an immersive experience for readers.`,
        images: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, j) => ({
          id: `img-${i}-${j}`,
          url: `https://images.unsplash.com/photo-${1500000000000 + Math.random() * 100000000}?w=400&h=300&fit=crop&auto=format`,
          alt: `Illustration for scene ${i + 1}, image ${j + 1}`,
          seed: Math.floor(Math.random() * 1000000).toString(),
          model: 'DALL-E 3',
          style: settings.visualStyle
        })),
        expanded: false
      }));

      setScenes(mockScenes);
      toast.success(`Story generated successfully! ${sceneCount} scenes created.`);
      
    } catch (error) {
      setGenerationSteps(prev => prev.map(step => 
        step.status === 'active' 
          ? { ...step, status: 'error', message: 'Generation failed' }
          : step
      ));
      toast.error('Failed to generate story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, settings, initializeGenerationSteps]);

  const handleGenerate = () => simulateGeneration(false);
  const handleQuickDraft = () => simulateGeneration(true);

  const handleCancel = () => {
    setIsGenerating(false);
    setGenerationProgress(0);
    setGenerationSteps([]);
    toast.info('Generation cancelled');
  };

  const toggleSceneExpansion = (sceneId: string) => {
    setScenes(prev => prev.map(scene => 
      scene.id === sceneId 
        ? { ...scene, expanded: !scene.expanded }
        : scene
    ));
  };

  const saveSnapshot = () => {
    const snapshot = {
      id: `snapshot-${Date.now()}`,
      name: `Snapshot ${snapshots.length + 1}`,
      timestamp: new Date(),
      scenes: [...scenes]
    };
    setSnapshots(prev => [...prev, snapshot]);
    toast.success('Snapshot saved');
  };

  const restoreSnapshot = (snapshotId: string) => {
    const snapshot = snapshots.find(s => s.id === snapshotId);
    if (snapshot) {
      setScenes(snapshot.scenes);
      toast.success('Snapshot restored');
    }
  };

  const fillSurprisePrompt = () => {
    const randomPrompt = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    setPrompt(randomPrompt);
    toast.info('Surprise prompt added!');
  };

  const selectedScene = scenes.find(scene => scene.id === selectedSceneId);

  const draw3DPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedScene?.images.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Simple layered preview
    const layers = selectedScene.images.slice(0, 3);
    layers.forEach((_, index) => {
      const depth = (index + 1) * 0.1;
      const offset = Math.sin(Date.now() * 0.001 + index) * 10 * depth;
      
      ctx.fillStyle = `rgba(26, 26, 26, ${0.8 - depth})`;
      ctx.fillRect(
        50 + offset + index * 20,
        50 + offset + index * 15,
        canvas.width - 100 - index * 40,
        canvas.height - 100 - index * 30
      );
    });
  }, [selectedScene]);

  useEffect(() => {
    if (selectedScene) {
      const interval = setInterval(draw3DPreview, 50);
      return () => clearInterval(interval);
    }
  }, [selectedScene, draw3DPreview]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-gradient-start to-bg-gradient-end">
      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Left Column - Input & Controls */}
        <div className={`lg:w-96 space-y-6 ${isMobile && !showMobileControls ? 'hidden' : ''}`}>
          <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Story Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt">Your Story Idea</Label>
                <Textarea
                  id="prompt"
                  placeholder="A brave knight discovers that the dragon they've been hunting is actually protecting the kingdom from a greater evil..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-24 resize-none"
                  disabled={isGenerating}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fillSurprisePrompt}
                  disabled={isGenerating}
                >
                  Surprise Me
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isGenerating}
                >
                  AI Assist
                </Button>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Genre & Tone</Label>
                <div className="flex flex-wrap gap-2">
                  {GENRE_PRESETS.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedGenre === genre ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    Advanced Controls
                    <PanelRightDashed className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div>
                    <Label className="text-sm font-medium">Story Length</Label>
                    <Slider
                      value={[settings.length]}
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, length: value }))}
                      max={2}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Short</span>
                      <span>Medium</span>
                      <span>Long</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="visual-style">Visual Style</Label>
                    <Select 
                      value={settings.visualStyle} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, visualStyle: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VISUAL_STYLES.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="characters">Characters (optional)</Label>
                    <Input
                      id="characters"
                      placeholder="brave knight, wise dragon, village elder"
                      value={settings.characters}
                      onChange={(e) => setSettings(prev => ({ ...prev, characters: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="safety-filter" className="text-sm font-medium">
                      Safety Filter
                    </Label>
                    <Switch
                      id="safety-filter"
                      checked={settings.safetyFilter}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, safetyFilter: checked }))}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="flex gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Workflow className="h-4 w-4 mr-2" />
                  Generate Story
                </Button>
                <Button
                  variant="outline"
                  onClick={handleQuickDraft}
                  disabled={!prompt.trim() || isGenerating}
                >
                  Quick Draft
                </Button>
              </div>

              {isGenerating && (
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  className="w-full"
                >
                  Cancel Generation
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Generation Progress */}
          {(isGenerating || generationSteps.length > 0) && (
            <Card className="bg-card/95 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Generation Progress</span>
                    <span className="text-sm text-muted-foreground">{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                  
                  <Collapsible open={showLog} onOpenChange={setShowLog}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between">
                        Activity Log
                        <LayoutPanelTop className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 pt-2">
                      {generationSteps.map((step) => (
                        <div key={step.id} className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${
                            step.status === 'complete' ? 'bg-green-500' :
                            step.status === 'active' ? 'bg-blue-500 animate-pulse' :
                            step.status === 'error' ? 'bg-red-500' :
                            'bg-gray-300'
                          }`} />
                          <span className="flex-1">{step.label}</span>
                          {step.message && (
                            <span className="text-xs text-muted-foreground">{step.message}</span>
                          )}
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Snapshots & Export */}
          {scenes.length > 0 && (
            <Card className="bg-card/95 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={saveSnapshot}>
                      <Undo className="h-4 w-4 mr-2" />
                      Save Snapshot
                    </Button>
                    <Select onValueChange={restoreSnapshot}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Restore..." />
                      </SelectTrigger>
                      <SelectContent>
                        {snapshots.map((snapshot) => (
                          <SelectItem key={snapshot.id} value={snapshot.id}>
                            {snapshot.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowExportModal(true)}
                    className="w-full"
                  >
                    <Frame className="h-4 w-4 mr-2" />
                    Export Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Mobile Controls Toggle */}
        {isMobile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileControls(!showMobileControls)}
            className="fixed top-20 left-4 z-50 bg-card/95 backdrop-blur-sm"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        )}

        {/* Right Column - Story Canvas */}
        <div className="flex-1 space-y-6">
          {scenes.length === 0 ? (
            <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <ImagePlay className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-heading text-xl">Ready to Create</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Enter your story idea in the input panel and click "Generate Story" to begin creating your narrative with AI-generated illustrations.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Scene Detail / 3D Preview */}
              {selectedScene && (
                <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Frame className="h-5 w-5" />
                      Scene Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="preview" className="w-full">
                      <TabsList>
                        <TabsTrigger value="preview">3D Preview</TabsTrigger>
                        <TabsTrigger value="edit">Edit Scene</TabsTrigger>
                        <TabsTrigger value="images">Images</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="preview" className="space-y-4">
                        <div className="relative">
                          <canvas
                            ref={canvasRef}
                            className="w-full h-48 bg-muted rounded-lg border"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Button size="sm" variant="outline">
                              <Rotate3d className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="edit" className="space-y-4">
                        <Input
                          value={selectedScene.title}
                          onChange={(e) => {
                            setScenes(prev => prev.map(scene =>
                              scene.id === selectedScene.id
                                ? { ...scene, title: e.target.value }
                                : scene
                            ));
                          }}
                          className="font-medium"
                        />
                        <Textarea
                          value={selectedScene.content}
                          onChange={(e) => {
                            setScenes(prev => prev.map(scene =>
                              scene.id === selectedScene.id
                                ? { ...scene, content: e.target.value }
                                : scene
                            ));
                          }}
                          className="min-h-32"
                        />
                      </TabsContent>
                      
                      <TabsContent value="images" className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedScene.images.map((image) => (
                            <div
                              key={image.id}
                              className="relative group cursor-pointer rounded-lg overflow-hidden"
                              onClick={() => setLightboxImage({
                                url: image.url,
                                alt: image.alt,
                                sceneId: selectedScene.id,
                                imageId: image.id
                              })}
                            >
                              <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <ZoomIn className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Scene List */}
              <div className="space-y-4" ref={scrollAreaRef}>
                {scenes.map((scene, index) => (
                  <Card
                    key={scene.id}
                    className={`bg-card/95 backdrop-blur-sm border-border/50 shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer ${
                      selectedSceneId === scene.id ? 'ring-2 ring-accent' : ''
                    }`}
                    style={{
                      transform: `perspective(1000px) rotateX(${scene.expanded ? '2deg' : '0deg'}) rotateY(${scene.expanded ? '1deg' : '0deg'})`
                    }}
                    onClick={() => setSelectedSceneId(scene.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {index + 1}
                          </Badge>
                          <CardTitle className="text-base font-heading">
                            {scene.title}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSceneExpansion(scene.id);
                            }}
                          >
                            {scene.expanded ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Grid3x2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <p className={`text-sm leading-relaxed ${
                            scene.expanded ? '' : 'line-clamp-2'
                          }`}>
                            {scene.content}
                          </p>
                        </div>
                        
                        <div className="w-48 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {scene.images.slice(0, scene.expanded ? undefined : 4).map((image) => (
                              <div
                                key={image.id}
                                className="relative group cursor-pointer rounded-md overflow-hidden"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLightboxImage({
                                    url: image.url,
                                    alt: image.alt,
                                    sceneId: scene.id,
                                    imageId: image.id
                                  });
                                }}
                              >
                                <img
                                  src={image.url}
                                  alt={image.alt}
                                  className="w-full h-16 object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                  <ZoomIn className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                          {!scene.expanded && scene.images.length > 4 && (
                            <p className="text-xs text-muted-foreground text-center">
                              +{scene.images.length - 4} more
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Story Navigation TOC */}
              <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden xl:block">
                <Card className="bg-card/95 backdrop-blur-sm border-border/50 w-48">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TableOfContents className="h-4 w-4" />
                      Contents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      {scenes.map((scene, index) => (
                        <button
                          key={scene.id}
                          className={`w-full text-left text-xs p-2 rounded transition-colors ${
                            selectedSceneId === scene.id
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedSceneId(scene.id)}
                        >
                          {index + 1}. {scene.title}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Image Details</DialogTitle>
          </DialogHeader>
          {lightboxImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.alt}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Regenerate
                </Button>
                <Button size="sm" variant="outline">
                  Upscale
                </Button>
                <Button size="sm" variant="outline">
                  Download
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>{lightboxImage.alt}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Story</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline">EPUB</Button>
              <Button variant="outline">PDF</Button>
              <Button variant="outline">ZIP</Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-notes">Include author notes</Label>
                <Switch id="include-notes" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-titles">Include scene titles</Label>
                <Switch id="include-titles" defaultChecked />
              </div>
            </div>
            <Button className="w-full">
              <Frame className="h-4 w-4 mr-2" />
              Export Story
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}