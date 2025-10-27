import { Card } from "@/components/ui/card"
import { Sparkles, ImageIcon, Zap, Palette } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "One-Shot Editing",
    description: "Transform your images instantly with a single text prompt. No complex workflows required.",
  },
  {
    icon: ImageIcon,
    title: "Multi-Image Support",
    description: "Process multiple images at once with batch mode. Save time on large projects.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get results in seconds with our optimized AI model. No waiting around.",
  },
  {
    icon: Palette,
    title: "Scene Preservation",
    description: "Maintain consistent characters and backgrounds across edits. Perfect for storytelling.",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4 text-balance">
            Powerful Features
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Everything you need to create stunning AI-edited images
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
