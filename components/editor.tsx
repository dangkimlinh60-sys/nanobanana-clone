"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Sparkles } from "lucide-react"

export function Editor() {
  const [prompt, setPrompt] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  return (
    <section id="editor" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4 text-balance">
            Try The AI Editor
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Experience the power of nano-banana's natural language image editing. Transform any photo with simple text
            commands.
          </p>
        </div>

        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Prompt Engine
            </h3>

            <div className="space-y-6">
              <div>
                <Label htmlFor="image-upload" className="mb-2 block text-sm font-medium">
                  Reference Image
                </Label>
                <div className="relative">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload image</span>
                        <span className="text-xs text-muted-foreground">Max 50MB</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="prompt" className="mb-2 block text-sm font-medium">
                  Main Prompt
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="A futuristic city powered by nano technology, golden hour lighting, ultra detailed..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 resize-none"
                />
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Now
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Output Gallery
            </h3>

            <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-border rounded-lg bg-secondary/30">
              <div className="text-center">
                <div className="mb-4 text-6xl">🖼️</div>
                <h4 className="text-lg font-semibold mb-2">Ready for Instant Generation</h4>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Enter your prompt and unleash the power
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
