import type React from "react"
export const ChartTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-lg font-semibold">{children}</div>
}

export const ChartLegend = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-4">{children}</div>
}

export const ChartTooltip = () => {
  return null
}

export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const Chart = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

