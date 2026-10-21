"use client"

import ResumeList from "./ResumeList"
import { educationData } from "@/libs/data"

export default function Education() {
  return (
    <ResumeList
      id="education"
      label="Education"
      rows={educationData.map((item) => ({
        title: item.title,
        description: item.description ?? item.fields.join(" · "),
        meta: item.institution,
        date: item.date,
      }))}
    />
  )
}
