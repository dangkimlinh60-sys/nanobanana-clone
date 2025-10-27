import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Digital Artist",
    content:
      "Nano Banana has completely transformed my workflow. The character consistency feature is a game-changer for my comic projects.",
    rating: 5,
    avatar: "/professional-woman-portrait.png",
  },
  {
    name: "Marcus Rodriguez",
    role: "Content Creator",
    content:
      "I've tried many AI image editors, but nothing comes close to the quality and speed of Nano Banana. Absolutely incredible!",
    rating: 5,
    avatar: "/professional-man-portrait.png",
  },
  {
    name: "Emily Watson",
    role: "Marketing Director",
    content:
      "The batch processing feature saves us hours every week. Our team can now create campaign visuals in minutes instead of days.",
    rating: 5,
    avatar: "/confident-businesswoman.png",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4 text-balance">
            What Users Say
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Join thousands of satisfied creators using Nano Banana
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
