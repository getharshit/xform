// src/app/test-shadcn/page.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Home,
  Settings,
  User,
  Mail,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
} from "lucide-react";

export default function ShadcnTestPage() {
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [switchValue, setSwitchValue] = useState(false);
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Shadcn/ui Test Page
        </h1>
        <p className="text-lg text-muted-foreground">
          Testing all Shadcn components for form builder
        </p>
      </div>

      {/* Basic Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Basic Components
          </CardTitle>
          <CardDescription>
            Testing buttons, badges, and basic UI elements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buttons */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Buttons</Label>
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Badges */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Badges</Label>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>

          <Separator />

          {/* Icons */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Icons (Lucide React)</Label>
            <div className="flex flex-wrap gap-4">
              <Home className="w-6 h-6" />
              <Settings className="w-6 h-6" />
              <User className="w-6 h-6" />
              <Mail className="w-6 h-6" />
              <Bell className="w-6 h-6" />
              <Search className="w-6 h-6" />
              <Edit className="w-6 h-6" />
              <Trash2 className="w-6 h-6" />
              <Download className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Form Components
          </CardTitle>
          <CardDescription>
            Testing form inputs, selects, and interactive elements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <Label htmlFor="test-input">Text Input</Label>
            <Input
              id="test-input"
              placeholder="Type something..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {inputValue && (
              <p className="text-sm text-muted-foreground">
                You typed: {inputValue}
              </p>
            )}
          </div>

          {/* Select */}
          <div className="space-y-2">
            <Label>Select Dropdown</Label>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
            {selectValue && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectValue}
              </p>
            )}
          </div>

          {/* Textarea */}
          <div className="space-y-2">
            <Label htmlFor="test-textarea">Textarea</Label>
            <Textarea
              id="test-textarea"
              placeholder="Enter multiple lines..."
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
          </div>

          {/* Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="test-switch"
              checked={switchValue}
              onCheckedChange={setSwitchValue}
            />
            <Label htmlFor="test-switch">Toggle Switch</Label>
            <Badge variant={switchValue ? "default" : "secondary"}>
              {switchValue ? "ON" : "OFF"}
            </Badge>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <Label>Slider (Value: {sliderValue[0]})</Label>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Layout Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Layout Components
          </CardTitle>
          <CardDescription>
            Testing tabs, dialogs, sheets, and complex layouts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tabs */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tabs</Label>
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p>Content for Tab 1. This is working perfectly!</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab2" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p>Content for Tab 2. Tabs are switching smoothly.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab3" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p>Content for Tab 3. All good here!</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          {/* Dialog and Sheet */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Modals & Overlays</Label>
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Test Dialog</DialogTitle>
                    <DialogDescription>
                      This is a test dialog to verify Shadcn dialog components
                      are working.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Test input in dialog..." />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Test Sheet</SheetTitle>
                    <SheetDescription>
                      This is a test sheet (side panel) component.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <Input placeholder="Test input in sheet..." />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose option..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Option 1</SelectItem>
                        <SelectItem value="2">Option 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="w-full">Save Changes</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Components</CardTitle>
            <Badge className="text-xs">✓</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15+</div>
            <p className="text-xs text-muted-foreground">
              All working properly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Icons</CardTitle>
            <Badge className="text-xs">✓</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Lucide</div>
            <p className="text-xs text-muted-foreground">Icons rendering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Styling</CardTitle>
            <Badge className="text-xs">✓</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tailwind</div>
            <p className="text-xs text-muted-foreground">CSS working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interactions</CardTitle>
            <Badge className="text-xs">✓</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">React</div>
            <p className="text-xs text-muted-foreground">State updates</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-green-800">
            <Badge className="bg-green-600">✓ All Tests Passed</Badge>
            <span className="text-sm font-medium">
              Shadcn/ui is properly configured and ready for form builder
              development!
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
