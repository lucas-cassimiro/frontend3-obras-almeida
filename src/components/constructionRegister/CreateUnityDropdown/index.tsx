import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

export default function CreateUnipDropdown({title, children}:any){
    return(
        <Accordion  type="single" collapsible>
        <AccordionItem className="overscroll-contain overflow-y-auto" value="item-1">
            <AccordionTrigger className="text-center">{title}</AccordionTrigger>
            <AccordionContent>
                {children}
            </AccordionContent>
        </AccordionItem>
        </Accordion>
    )
}