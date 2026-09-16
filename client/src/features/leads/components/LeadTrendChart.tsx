import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDate } from "@/lib/format";
import type { LeadTrendPoint } from "@/features/crm/types/dashboard";

function shortDate(iso: string): string {
  return formatDate(`${iso}T00:00:00`).split(" ").slice(0, 2).join(" ");
}

export function LeadTrendChart({ data }: { data: LeadTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="leadTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FD8002" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#FD8002" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#E2E8F0" />
        <XAxis
          dataKey="date"
          tickFormatter={shortDate}
          tick={{ fontSize: 11, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
          interval={2}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={28} />
        <Tooltip
          labelFormatter={(label) => shortDate(String(label))}
          contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }}
        />
        <Area type="monotone" dataKey="count" stroke="#FD8002" strokeWidth={2} fill="url(#leadTrendFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
