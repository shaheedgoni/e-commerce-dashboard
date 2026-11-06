"use client";

import Badge from "@/components/ui/badge";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { formatDateTime, formatNaira } from "@/lib/format";
import { channelMap, orderStateMap } from "@/lib/statusMap";
// import { Skeleton, EmptyState, ErrorState } from "@/components/ui/state";
import { useEffect, useState } from "react";
import Pagination from "@/components/ui/pagination";
import { orderProps } from "@/types/orderTypes";
import { GetOrders } from "@/lib/services/order";

//   {
//     id: "1",
//     number: "SH-1042",
//     customer: { id: "c1", name: "Ada Obi", email: "ada@example.com" },
//     channel: "web",
//     state: "paid",
//     itemCount: 3,
//     totalMinor: 4550000,
//     placedAt: "2026-10-27T10:15:00.000Z",
//     paidAt: "2026-10-27T10:16:00.000Z",
//   },
//   {
//     id: "2",
//     number: "SH-1041",
//     customer: null, // POS sale, so there's no customer
//     channel: "pos",
//     state: "delivered",
//     itemCount: 1,
//     totalMinor: 1500000,
//     placedAt: "2026-10-27T09:02:00.000Z",
//     paidAt: "2026-10-27T09:02:00.000Z",
//   },
//   {
//     id: "3",
//     number: "SH-1040",
//     customer: { id: "c2", name: "Tunde Bello", email: "tunde@example.com" },
//     channel: "web",
//     state: "pending_payment",
//     itemCount: 2,
//     totalMinor: 2800000,
//     placedAt: "2026-10-26T18:40:00.000Z",
//     paidAt: null, // not paid yet
//   },
// ];

export default function OrdersPage() {
  const [orders, setOrders] = useState<orderProps[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      const data = await GetOrders(page);
      setOrders(data.data);
      setTotal(data.meta.total);
    }

    load();
  }, [page]);

  // if (status === "loading") {
  //   return (
  //     <div className="bg-surface border border-line rounded-xl p-5 flex flex-col gap-4">
  //       {[1, 2, 3, 4, 5].map((e) => (
  //         <div key={e} className="flex gap-6">
  //           <Skeleton className="h-4 w-20" />
  //           <Skeleton className="h-4 w-32" />
  //           <Skeleton className="h-4 w-16" />
  //           <Skeleton className="h-4 flex-1" />
  //         </div>
  //       ))}
  //     </div>
  //   );
  // }

  // if (status === "error") {
  //   return (
  //     <div className="bg-surface border border-line rounded-xl">
  //       <ErrorState
  //         message="We couldn't load the orders."
  //         requestId="req_8f2a91"
  //         onReentry={() => alert("Retry clicked")}
  //       />
  //     </div>
  //   );
  // }

  // if (status === "empty") {
  //   return (
  //     <div className="bg-surface border border-line rounded-xl">
  //       <EmptyState
  //         title="No orders yet"
  //         message="New orders will show up here."
  //       />
  //     </div>
  //   );
  // }

  return (
    <Table
      footer={
        <Pagination
          page={page}
          limit={20}
          total={total}
          onPageChange={setPage}
        />
      }
    >
      <thead>
        <tr>
          <Th>Order</Th>
          <Th>Customer</Th>
          <Th>Channel</Th>
          <Th>State</Th>
          <Th className="text-right">Items</Th>
          <Th className="text-right">Total</Th>
          <Th>Placed</Th>
          <Th>Paid</Th>
        </tr>
      </thead>

      <tbody>
        {orders.length === 0 && (
          <tr>
            <td colSpan={8} className="py-10 text-center text-ink-muted">
              No orders yet
            </td>
          </tr>
        )}

        {orders.map((order) => (
          <Tr key={order.id}>
            <Td className="font-medium">{order.number}</Td>
            <Td>{order.customer ? order.customer.name : "Walk-in"}</Td>
            <Td>
              <Badge variant={channelMap[order.channel].variant}>
                {channelMap[order.channel].label}
              </Badge>
            </Td>
            <Td>
              <Badge variant={orderStateMap[order.state].variant}>
                {orderStateMap[order.state].label}
              </Badge>
            </Td>
            <Td className="text-right tabular-nums">{order.itemCount}</Td>
            <Td className="text-right tabular-nums">
              {formatNaira(order.totalMinor)}
            </Td>
            <Td className="text-ink-secondary">
              {formatDateTime(order.placedAt)}
            </Td>
            <Td className="text-ink-secondary">
              {order.paidAt ? formatDateTime(order.paidAt) : "—"}
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
