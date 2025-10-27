import { Card } from "@/components/ui/card"

const showcaseItems = [
  {
    title: "Character Consistency",
    description: "Maintain the same character across multiple scenes",
    image: "/ai-generated-character-in-different-poses.jpg",
  },
  {
    title: "Scene Transformation",
    description: "Change environments while preserving subjects",
    image: "/same-person-in-different-backgrounds.jpg",
  },
  {
    title: "Style Transfer",
    description: "Apply artistic styles to any photograph",
    image: "/photo-transformed-into-artistic-painting.jpg",
  },
  {
    title: "Object Manipulation",
    description: "Add, remove, or modify objects naturally",
    image: "/ai-edited-photo-with-objects-added.jpg",
  },
]

export function Showcase() {
  return (
    <section id="showcase" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4 text-balance">
            Showcase Gallery
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            See what's possible with Nano Banana's AI editing capabilities
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
