"use client"

import * as React from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "./data.json"

export default function AdminPage() {
  return (
    <div className="flex flex-1 flex-col pb-20">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <SectionCards />
        <div className="grid gap-6 px-4 lg:grid-cols-1 lg:px-6 @5xl/main:grid-cols-1">
          <ChartAreaInteractive />
        </div>
        <div className="mt-4">
          <DataTable data={data} />
        </div>
      </div>
    </div>
  )
}
