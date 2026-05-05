"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StateStatsBarChartProps = {
  data: Array<{
    state: string;
    members: number;
  }>;
};

export default function StateStatsBarChart({ data }: StateStatsBarChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-black/60">No state data available yet.</p>;
  }

  return (
    <div className="h-full overflow-hidden rounded-[8px] border border-black/8 bg-[#f8faf8] p-3 sm:p-4">
      <div className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 28, left: 8, bottom: 8 }} barSize={20}>
            <CartesianGrid horizontal={false} strokeDasharray="2 6" stroke="#d7ddd8" />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: "#5c5c5c", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="state"
              width={116}
              tick={{ fill: "#1f1f1f", fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 14px 28px -18px rgba(0,0,0,0.35)",
                background: "#ffffff",
              }}
              labelStyle={{ color: "#121212", fontWeight: 700 }}
              itemStyle={{ color: "#2e2e2e", fontSize: 12 }}
              cursor={{ fill: "rgba(10,127,63,0.08)" }}
              formatter={(value: number) => [value.toLocaleString(), "Members"]}
            />
            <Bar dataKey="members" name="Members" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => {
                const opacity = 0.98 - index * 0.045;
                return <Cell key={`${entry.state}-${index}`} fill={`rgba(10,127,63,${Math.max(opacity, 0.56)})`} />;
              })}
              <LabelList
                dataKey="members"
                position="right"
                offset={8}
                formatter={(value: number) => value.toLocaleString()}
                style={{ fill: "#121212", fontSize: 11, fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
