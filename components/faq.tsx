import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Nano Banana?",
    answer:
      "Nano Banana is an advanced AI-powered image editing tool that allows you to transform any image using simple text prompts. Our model delivers consistent character editing and scene preservation that surpasses other AI editors.",
  },
  {
    question: "How does the image upload work?",
    answer:
      "Simply click the upload area in the editor, select your image (up to 50MB), and then enter your text prompt describing how you want to transform the image. Our AI will process it in seconds.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We support all common image formats including JPG, PNG, WebP, and GIF. Maximum file size is 50MB per image.",
  },
  {
    question: "Can I edit multiple images at once?",
    answer:
      "Yes! Our batch processing feature allows you to upload and edit multiple images simultaneously, saving you valuable time on large projects.",
  },
  {
    question: "How is Nano Banana different from other AI editors?",
    answer:
      "Nano Banana excels at maintaining character consistency across edits and preserving scene integrity. Our advanced model outperforms competitors like Flux Kontext in both quality and speed.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! New users get free credits to try out all features. Sign up now to start creating amazing AI-edited images.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">Everything you need to know about Nano Banana</p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
