"use client"

import ResumeList from "./ResumeList"
import { experiencesData } from "@/libs/data"

export default function Experience() {
  return (
    <ResumeList
      id="experience"
      label="Experience"
      rows={experiencesData.map((item) => ({
        title: item.title,
        description: item.description,
        meta: item.location,
        date: item.date,
        href: item.href,
      }))}
    />
  )
}
