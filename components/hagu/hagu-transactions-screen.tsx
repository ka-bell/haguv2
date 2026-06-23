"use client"

import { ArrowDownToLine } from "lucide-react"
import Image from "next/image"

type TransactionStatus = "pending" | "completed"

type Transaction = {
  id: string
  label: string
  date: string
  status: string
  amount: string
  statusType: TransactionStatus
  avatar?: string
  payout?: boolean
}

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    label: "Luca M. · Dinner",
    date: "Fri 6 Jun",
    status: "Pending",
    amount: "+€95",
    statusType: "pending",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "2",
    label: "Emma K. · Cuddling",
    date: "Sat 7 Jun",
    status: "Pending",
    amount: "+€60",
    statusType: "pending",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "3",
    label: "Tom B. · Event",
    date: "Sun 8 Jun",
    status: "Pending",
    amount: "+€130",
    statusType: "pending",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "4",
    label: "Payout to ING ****4821",
    date: "1 Jun",
    status: "Completed",
    amount: "€960",
    statusType: "completed",
    payout: true,
  },
]

export function HaguTransactionsScreen() {
  return (
    <div className="space-y-5 pb-4">
      <h1 className="text-[26px] font-semibold tracking-[-0.5px] text-[#1A1A1E]">Earnings</h1>

      <div className="relative overflow-hidden rounded-[24px] bg-[#1A1A1E] p-6">
        <div className="absolute -right-5 -top-5 size-[100px] rounded-full bg-[rgba(91,191,181,0.12)]" />
        <p className="text-xs font-medium uppercase tracking-[0.5px] text-white/50">Available balance</p>
        <p className="mt-1 text-[40px] font-semibold tracking-[-1.5px] text-white">€ 285,00</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="flex h-10 flex-1 items-center justify-center rounded-full bg-white/10 text-[13px] font-medium text-white transition active:opacity-80"
          >
            Withdraw
          </button>
          <button
            type="button"
            className="flex h-10 flex-1 items-center justify-center rounded-full bg-[#5BBFB5] text-[13px] font-medium text-white transition active:opacity-80"
          >
            Auto payout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="This month" value="€1.240" hint="+18% vs last month" hintClassName="text-[#5BBFB5]" />
        <StatCard label="Pending" value="€285" hint="Clears in 2 days" hintClassName="text-[#D4900A]" />
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.5px] text-[#1A1A1E]">Recent</h2>
        <div className="mt-3 divide-y divide-black/[0.05]">
          {TRANSACTIONS.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  hintClassName,
}: {
  label: string
  value: string
  hint: string
  hintClassName: string
}) {
  return (
    <div className="rounded-[20px] border border-black/[0.06] bg-white p-4 shadow-[0px_2px_8px_rgba(26,26,30,0.04)]">
      <p className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#8A8A96]">{label}</p>
      <p className="mt-1 text-[22px] font-semibold tracking-[-0.5px] text-[#1A1A1E]">{value}</p>
      <p className={`mt-1 text-[11px] ${hintClassName}`}>{hint}</p>
    </div>
  )
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const amountColor = tx.statusType === "completed" ? "text-[#3DA89E]" : "text-[#D4900A]"

  return (
    <div className="flex items-center gap-3 py-3.5">
      {tx.payout ? (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[20px] bg-[#EAF7F5] text-[#5BBFB5]">
          <ArrowDownToLine className="size-[18px]" />
        </div>
      ) : (
        <div className="relative size-10 shrink-0 overflow-hidden rounded-[20px]">
          <Image src={tx.avatar!} alt="" fill className="object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#1A1A1E]">{tx.label}</p>
        <p className="text-xs text-[#8A8A96]">
          {tx.date} · {tx.status}
        </p>
      </div>
      <p className={`shrink-0 text-[15px] font-semibold ${amountColor}`}>{tx.amount}</p>
    </div>
  )
}
