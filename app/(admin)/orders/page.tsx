"use client";

import Badge from "@/components/ui/badge";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { formatDateTime, formatNaira } from "@/lib/format";
import { channelMap, orderStateMap } from "@/lib/statusMap";
import { Skeleton, EmptyState, ErrorState } from "@/components/ui/state";
import { useEffect, useState } from "react";
import Pagination from "@/components/ui/pagination";
import { orderProps } from "@/types/orderTypes";
import { GetOrders } from "@/lib/services/order";
import SearchInput from "@/components/ui/search-input";
import Select from "@/components/ui/select";
import DateInput from "@/components/ui/date-input";

export default function OrdersPage() {
  const [orders, setOrders] = useState<orderProps[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [channel, setChannel] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await GetOrders(page, search, state, channel, from, to);
        setError(false);
        setOrders(data.data);
        setTotal(data.meta.total);
      } catch {
        setError(true);
      }
      setLoading(false);
    }

    load();
  }, [page, search, state, channel, from, to]);

  const filters = (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <SearchInput
          placeholder="Order number or customer email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="w-48">
        <Select
          label="State"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="pending_payment">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </div>

      <div className="w-40">
        <Select
          label="Channel"
          value={channel}
          onChange={(e) => {
            setChannel(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="web">Web</option>
          <option value="pos">POS</option>
        </Select>
      </div>

      <div className="w-44">
        <DateInput
          label="From"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="w-44">
        <DateInput
          label="To"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setPage(1);
          }}
        />
      </div>
    </div>
  );

  let content;

  if (loading) {
    content = (
      <div className="bg-surface border border-line rounded-xl p-5 flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((e) => (
          <div key={e} className="flex gap-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    );
  } else if (error) {
    content = (
      <div className="bg-surface border border-line rounded-xl">
        <ErrorState
          message="We couldn't load the orders."
          requestId="req_8f2a91"
          onReentry={() => window.location.reload()}
        />
      </div>
    );
  } else if (total === 0) {
    content = (
      <div className="bg-surface border border-line rounded-xl">
        <EmptyState
          title="No orders yet"
          message="New orders will show up here."
        />
      </div>
    );
  } else {
    content = (
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

  return (
    <div className="flex flex-col gap-4">
      {filters}
      {content}
    </div>
  );
}
