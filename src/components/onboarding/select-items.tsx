import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectItems({items, placeholder} : { items : string[] ; placeholder: string}) {
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          { items.map((item, index) => (
            <SelectItem value="apple" key={index}>{item}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
