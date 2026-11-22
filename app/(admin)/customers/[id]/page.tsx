"use client";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import axios from "axios";
import {
  EmptyState,
  ErrorState,
  NotFoundState,
  Skeleton,
} from "@/components/ui/state";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { formatDate, formatNaira, getInitials } from "@/lib/format";
import { GetCustomer } from "@/lib/services/customer";
import { channelMap, orderStateMap } from "@/lib/statusMap";
import { TitleContext } from "@/lib/titleContext";
import { customerDetailProps } from "@/types/customerTypes";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [customer, setCustomer] = useState<customerDetailProps | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    async function load() {
      try {
        const data = await GetCustomer(id);
        setCustomer(data);
        setTitle(`${data.firstName} ${data.lastName}`);
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          (error.response.status === 404 || error.response.status === 400)
        ) {
          setTitle("");
          setNotFound(true);
        } else {
          setLoadError(true);
        }
      }
    }
    load();
  }, [id, setTitle]);

  if (notFound) {
    return (
      <div className="bg-surface border border-line rounded-xl">
        <NotFoundState
          message="This customer doesn't exist"
          backLabel="Back to Customers"
          onBack={() => router.push("/customers")}
        />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-surface border border-line rounded-xl">
        <ErrorState
          message="We couldn't load this customer."
          onReentry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!customer) {
    return <Skeleton className="h-8 w-64" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-6">
        <Card className="col-span-2 p-5 flex items-center gap-4">
          <span className="size-14 rounded-full bg-stone-200 text-ink-secondary font-semibold flex items-center justify-center">
            {getInitials(customer.firstName, customer.lastName)}
          </span>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-ink">
                {customer.firstName} {customer.lastName}
              </h2>
              <Badge variant={customer.isActive ? "success" : "neutral"}>
                {customer.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex gap-8 mt-2 text-sm">
              <div>
                <p className="text-xs text-ink-secondary">Email</p>
                <p className="text-ink">{customer.email}</p>
              </div>
              <div>
                <p className="text-xs text-ink-secondary">Phone</p>
                <p className="text-ink">{customer.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-ink-secondary">Joined</p>
                <p className="text-ink">{formatDate(customer.createdAt)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-ink-secondary">Orders</p>
          <p className="text-3xl font-semibold text-ink mt-2 tabular-nums">
            {customer.orderCount}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-ink-secondary">Total spent</p>
          <p className="text-3xl font-semibold text-ink mt-2 tabular-nums">
            {formatNaira(customer.totalSpentMinor)}
          </p>
        </Card>
      </div>

      <div>
        <h3 className="font-semibold text-ink mb-3">Saved addresses</h3>

        {customer.addresses.length === 0 ? (
          <p className="text-sm text-ink-secondary">No saved addresses.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {customer.addresses.map((address, index) => (
              <div
                key={address.id}
                className={`bg-surface border rounded-xl p-5 ${address.isDefault ? "border-accent/30" : "border-line"}`}
              >
                {address.isDefault ? (
                  <Badge variant="accent">Default</Badge>
                ) : (
                  <p className="text-xs text-ink-secondary">
                    Address {index + 1}
                  </p>
                )}

                <div className="text-sm text-ink-secondary leading-6 mt-3">
                  <p>{address.fullName}</p>
                  <p>{address.line1}</p>
                  {address.line2 ? <p>{address.line2}</p> : null}
                  <p>
                    {address.city}, {address.state}
                  </p>
                  <p>{address.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-ink mb-3">Recent orders</h3>

        {customer.recentOrders.length === 0 ? (
          <div className="bg-surface border border-line rounded-xl">
            <EmptyState
              title="No orders yet"
              message="This customer hasn't placed an order."
            />
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>State</Th>
                <Th>Channel</Th>
                <Th className="text-right">Items</Th>
                <Th className="text-right">Total</Th>
                <Th>Date</Th>
              </tr>
            </thead>

            <tbody>
              {customer.recentOrders.map((order) => (
                <Tr key={order.id}>
                  <Td className="font-medium">
                    <Link
                      href={`/orders/${order.id}`}
                      className="hover:text-accent hover:underline"
                    >
                      {order.number || "-"}
                    </Link>
                  </Td>
                  <Td>
                    <Badge variant={orderStateMap[order.state].variant}>
                      {orderStateMap[order.state].label}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge variant={channelMap[order.channel].variant}>
                      {channelMap[order.channel].label}
                    </Badge>
                  </Td>
                  <Td className="text-right tabular-nums">{order.itemCount}</Td>
                  <Td className="text-right tabular-nums">
                    {formatNaira(order.totalMinor)}
                  </Td>
                  <Td className="text-ink-secondary">
                    {order.placedAt ? formatDate(order.placedAt) : "-"}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
